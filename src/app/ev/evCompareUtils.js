import { postSolar, evData } from '../data';
import { getEvChargingBreakdown, getGasPrice } from '../utils';

// Everything the projection depends on, in one place. Rendered on the page so
// the numbers are auditable rather than buried in the math.
export const ASSUMPTIONS = {
  // Measured from our own data
  milesPerKwh: evData.milesPerKwh, // 2.7
  superchargerRate: evData.superchargerRatePerKwh, // $0.40/kWh
  oldVehicleMpg: evData.oldVehicleMpg, // 22 — only used to back gas prices out of gasSaved

  // Forward-looking
  gasInflation: evData.gasInflation, // 3%/yr
  elecInflation: 0.035, // 3.5%/yr, same rate the solar payoff model uses
  maintenanceInflation: 0.025, // 2.5%/yr general inflation
  retailElecRate: 0.168, // $/kWh, current effective PSO retail rate

  // Surplus solar the EV soaks up. Basis: the pre-EV year (Aug 2024 - Jul 2025)
  // spilled 1,600 kWh across 6 net-export months. Under PSO's monthly netting
  // that energy earned almost nothing; the EV now absorbs it.
  freeSolarKwhPerYear: 1600,
  solarDegradation: 0.005, // 0.5%/yr panel degradation applied to the pool

  // Supercharging as a share of total EV energy. Mar-Jul 2026 actual was 1.6%
  // (26 of 1,611 kWh); the 23% lifetime figure is skewed by two road trips.
  superchargeShare: 0.02,

  horizonMiles: 200000,
  stepMiles: 5000,
};

const PROJECTION_STEP = 250; // miles per simulation increment

/** EV months, oldest first. */
export function getEvMonths() {
  return postSolar.filter((e) => e.gasSaved).slice().reverse();
}

/**
 * Cumulative measured cost by odometer reading.
 *
 * The EV9 side is what we actually paid (grid charging + supercharging). The
 * comparison side is the same miles in the same months at the same real gas
 * prices, recomputed at the comparison vehicle's mpg — NOT the stored gasSaved,
 * which is only valid against the 22 mpg baseline it was built with.
 */
export function getMeasuredSeries(mpg) {
  const acc = {
    miles: 0,
    days: 0,
    ev9Fuel: 0,
    compFuel: 0,
    freeKwh: 0,
    gridKwh: 0,
    superchargedKwh: 0,
    gridCost: 0,
    superchargeCost: 0,
  };
  const points = [{ ...acc, label: 'Start' }];

  for (const entry of getEvMonths()) {
    const miles = parseFloat(entry.evMiles || 0);
    const b = getEvChargingBreakdown(
      entry,
      ASSUMPTIONS.milesPerKwh,
      ASSUMPTIONS.superchargerRate
    );
    const superchargeCost = parseFloat(entry.supercharging || 0);

    acc.miles += miles;
    acc.days += parseInt(entry.days, 10);
    acc.gridCost += b.gridCost;
    acc.superchargeCost += superchargeCost;
    acc.ev9Fuel += b.gridCost + superchargeCost;
    acc.compFuel += (miles / mpg) * getGasPrice(entry, ASSUMPTIONS.oldVehicleMpg);
    acc.freeKwh += b.freeSolarKwh;
    acc.gridKwh += b.chargeableKwh;
    acc.superchargedKwh += b.superchargedKwh;

    points.push({ ...acc, label: `${entry.month} ${entry.year}` });
  }

  return points;
}

/** Cumulative scheduled maintenance through `miles`, inflated to when each service falls due. */
export function maintenanceTotal(vehicle, miles, annualMiles) {
  return vehicle.maintenance.reduce((sum, item) => {
    const occurrences = Math.floor(miles / item.intervalMiles);
    let total = 0;
    for (let i = 1; i <= occurrences; i++) {
      const atMiles = i * item.intervalMiles;
      const year = atMiles / annualMiles;
      total += item.cost * Math.pow(1 + ASSUMPTIONS.maintenanceInflation, year);
    }
    return sum + total;
  }, 0);
}

/** Services falling due in (fromMiles, toMiles]. */
export function servicesDue(vehicle, fromMiles, toMiles) {
  return vehicle.maintenance
    .filter(
      (item) =>
        Math.floor(toMiles / item.intervalMiles) >
        Math.floor(fromMiles / item.intervalMiles)
    )
    .map((item) => item.label);
}

/**
 * Build the full comparison: measured actuals, then a forward projection to the
 * horizon, sampled every stepMiles.
 */
export function buildComparison(comparisonVehicle, ev9) {
  const mpg = comparisonVehicle.mpg;
  const measured = getMeasuredSeries(mpg);
  const end = measured[measured.length - 1];

  const annualMiles = (end.miles * 365) / end.days;
  const measuredYears = end.days / 365;

  const months = getEvMonths();
  const latestGasPrice = getGasPrice(
    months[months.length - 1],
    ASSUMPTIONS.oldVehicleMpg
  );

  // --- fuel/energy curve, built in a single forward pass ---
  // Measured miles come straight from the bills; beyond that we simulate once
  // at PROJECTION_STEP granularity and interpolate lookups against the result.
  const projectedCurve = [{ miles: end.miles, ev9: end.ev9Fuel, comp: end.compFuel }];
  {
    let ev9 = end.ev9Fuel;
    let comp = end.compFuel;
    let projected = 0;
    let year = -1;
    let freeSolarRemaining = 0;
    const totalProjected = ASSUMPTIONS.horizonMiles - end.miles;

    while (projected < totalProjected) {
      // Snap steps to round mileage boundaries. Maintenance lands in lumps at
      // exact odometer figures (a 50,000-mile tire rotation can flip the sign),
      // so the grid has to sample those points or the crossover reads late.
      const currentMiles = end.miles + projected;
      const nextBoundary =
        Math.floor(currentMiles / PROJECTION_STEP + 1) * PROJECTION_STEP;
      const step = Math.min(
        nextBoundary - currentMiles,
        totalProjected - projected
      );
      const yearIdx = Math.floor(projected / annualMiles);
      const age = measuredYears + yearIdx;

      // Fresh surplus-solar pool at the start of each projected year
      if (yearIdx !== year) {
        year = yearIdx;
        freeSolarRemaining =
          ASSUMPTIONS.freeSolarKwhPerYear *
          Math.pow(1 - ASSUMPTIONS.solarDegradation, age);
      }

      const elecFactor = Math.pow(1 + ASSUMPTIONS.elecInflation, age);
      const gasFactor = Math.pow(1 + ASSUMPTIONS.gasInflation, age);

      // Supercharged share comes off the top; the rest is charged at home.
      // Free solar covers home charging until the annual pool runs out —
      // cutting supercharging moves those kWh to home, it doesn't delete them.
      const kwh = step / ASSUMPTIONS.milesPerKwh;
      const superchargedKwh = kwh * ASSUMPTIONS.superchargeShare;
      const homeKwh = kwh - superchargedKwh;
      const freeKwh = Math.min(homeKwh, freeSolarRemaining);
      freeSolarRemaining -= freeKwh;
      const gridKwh = homeKwh - freeKwh;

      ev9 +=
        superchargedKwh * ASSUMPTIONS.superchargerRate * elecFactor +
        gridKwh * ASSUMPTIONS.retailElecRate * elecFactor;
      comp += (step / mpg) * latestGasPrice * gasFactor;

      projected += step;
      projectedCurve.push({ miles: end.miles + projected, ev9, comp });
    }
  }

  const interpolate = (points, targetMiles, pick) => {
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      if (targetMiles <= cur.miles) {
        const span = cur.miles - prev.miles;
        const f = span > 0 ? (targetMiles - prev.miles) / span : 0;
        const a = pick(prev);
        const b = pick(cur);
        return { ev9: a.ev9 + (b.ev9 - a.ev9) * f, comp: a.comp + (b.comp - a.comp) * f };
      }
    }
    const last = points[points.length - 1];
    return pick(last);
  };

  const fuelAt = (targetMiles) => {
    if (targetMiles <= end.miles) {
      const v = interpolate(measured, targetMiles, (p) => ({
        ev9: p.ev9Fuel,
        comp: p.compFuel,
      }));
      return { ...v, measured: true };
    }
    const v = interpolate(projectedCurve, targetMiles, (p) => ({
      ev9: p.ev9,
      comp: p.comp,
    }));
    return { ...v, measured: false };
  };

  const totalAt = (targetMiles) => {
    const fuel = fuelAt(targetMiles);
    const ev9Maint = maintenanceTotal(ev9, targetMiles, annualMiles);
    const compMaint = maintenanceTotal(comparisonVehicle, targetMiles, annualMiles);
    return {
      miles: targetMiles,
      years: targetMiles / annualMiles,
      isMeasured: fuel.measured,
      ev9Fuel: fuel.ev9,
      compFuel: fuel.comp,
      ev9Maint,
      compMaint,
      ev9Op: fuel.ev9 + ev9Maint,
      compOp: fuel.comp + compMaint,
      ev9Total: fuel.ev9 + ev9Maint + ev9.purchasePrice,
      compTotal: fuel.comp + compMaint + comparisonVehicle.purchasePrice,
    };
  };

  // --- sampled rows ---
  const rows = [];
  for (
    let miles = ASSUMPTIONS.stepMiles;
    miles <= ASSUMPTIONS.horizonMiles;
    miles += ASSUMPTIONS.stepMiles
  ) {
    const row = totalAt(miles);
    row.opDiff = row.compOp - row.ev9Op; // positive = EV9 cheaper to run
    row.totalDiff = row.compTotal - row.ev9Total; // positive = EV9 ahead overall
    row.ev9Services = servicesDue(ev9, miles - ASSUMPTIONS.stepMiles, miles);
    row.compServices = servicesDue(
      comparisonVehicle,
      miles - ASSUMPTIONS.stepMiles,
      miles
    );
    rows.push(row);
  }

  // --- crossover: where the EV9 goes ahead and stays ahead ---
  // Maintenance lands in lumps (a $1,400 tire set moves the line), so a naive
  // "first point ahead" can flip back. Walk the curve and take the last point
  // where the EV9 is still behind.
  let crossover = null;
  let lastBehindIdx = -1;
  for (let i = 0; i < projectedCurve.length; i++) {
    const point = projectedCurve[i];
    const ev9Total =
      point.ev9 + maintenanceTotal(ev9, point.miles, annualMiles) + ev9.purchasePrice;
    const compTotal =
      point.comp +
      maintenanceTotal(comparisonVehicle, point.miles, annualMiles) +
      comparisonVehicle.purchasePrice;
    if (ev9Total > compTotal) lastBehindIdx = i;
  }
  if (lastBehindIdx === -1) {
    crossover = end.miles; // already ahead by the time measured data runs out
  } else if (lastBehindIdx < projectedCurve.length - 1) {
    crossover = projectedCurve[lastBehindIdx + 1].miles;
  }

  return {
    measured,
    end,
    annualMiles,
    measuredYears,
    latestGasPrice,
    rows,
    crossover,
    totalAt,
    at100k: totalAt(100000),
    at200k: totalAt(200000),
  };
}
