export function calculateAverageDailyCost(
  daysSinceStart,
  costPerDayStart,
  annualEnergyInflation
) {
  // Convert annual inflation rate to monthly
  const monthlyEnergyInflation =
    Math.pow(1 + annualEnergyInflation, 1 / 12) - 1;

  let totalinitialCostPerDay = 0;
  let currentinitialCostPerDay = costPerDayStart;
  let daysCounted = 0;

  for (let day = 1; day <= daysSinceStart; day++) {
    // Adjust the initialCostPerDay for inflation at the start of each new month
    if (day % 30 === 1 && day > 1) {
      // Assuming each month has 30 days for simplification
      currentinitialCostPerDay *= 1 + monthlyEnergyInflation;
    }
    totalinitialCostPerDay += currentinitialCostPerDay;
    daysCounted++;
  }

  // Calculate average initialCostPerDay over the period
  const averageinitialCostPerDay = totalinitialCostPerDay / daysCounted;
  return averageinitialCostPerDay;
}
export function solarPayoffCalculator(
  purchaseDate,
  currentDate,
  savedToDate,
  cost,
  energyInflation,
  dailySavingsRate
) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysPassed = Math.floor((currentDate - purchaseDate) / msPerDay);

  if (daysPassed <= 0) {
    return {
      projectedYears: 0,
      projectedDays: 0,
      error: 'Not enough time has passed to calculate savings rate.',
    };
  }

  if (savedToDate >= cost) {
    return {
      projectedYears: 0,
      projectedDays: 0,
      message: 'System has already paid for itself.',
    };
  }

  const baseDailySavings = dailySavingsRate || savedToDate / daysPassed;
  const remainingCost = cost - savedToDate;

  // Calculate breakeven with compounding inflation year-over-year
  let accumulatedSavings = 0;
  let daysToBreakeven = 0;
  let currentYear = 0;

  while (accumulatedSavings < remainingCost) {
    // Apply inflation for each future year
    const inflationMultiplier = Math.pow(1 + energyInflation, currentYear);
    const dailySavingsThisYear = baseDailySavings * inflationMultiplier;

    // Calculate savings for this year (or remaining days needed)
    const daysInYear = 365;
    const savingsNeeded = remainingCost - accumulatedSavings;
    const savingsThisYear = dailySavingsThisYear * daysInYear;

    if (accumulatedSavings + savingsThisYear >= remainingCost) {
      // Breakeven occurs during this year
      const daysNeededThisYear = Math.ceil(savingsNeeded / dailySavingsThisYear);
      daysToBreakeven += daysNeededThisYear;
      break;
    } else {
      // Need to continue into next year
      accumulatedSavings += savingsThisYear;
      daysToBreakeven += daysInYear;
      currentYear++;
    }

    // Safety check to prevent infinite loop
    if (currentYear > 100) {
      return {
        projectedYears: 0,
        projectedDays: 0,
        error: 'Breakeven projection exceeds reasonable timeframe.',
      };
    }
  }

  const totalDaysToBreakeven = daysPassed + daysToBreakeven;
  const projectedYears = Math.floor(totalDaysToBreakeven / 365);
  const projectedDays = totalDaysToBreakeven % 365;
  const breakevenDate = new Date(
    purchaseDate.getTime() + totalDaysToBreakeven * msPerDay
  );

  return {
    projectedYears,
    projectedDays,
    breakevenDate,
  };
}

export function projectedSavingsIn25Years(purchaseDate, savedToDate, cost, energyInflation, dailySavingsRate) {
  // Define the number of years for projection
  const yearsToProject = 25;

  // Use passed daily savings rate (trailing 12-month) or fall back to lifetime average
  if (!dailySavingsRate) {
    const currentDate = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysPassed = Math.floor((currentDate - purchaseDate) / msPerDay);
    dailySavingsRate = savedToDate / daysPassed;
  }

  const inflationRate = energyInflation || 0.035;

  // Initialize the total savings with the amount already saved
  let totalSavings = savedToDate;

  // Project savings for the next 25 years, adjusting annually for inflation
  for (let year = 0; year < yearsToProject; year++) {
    // Adjust the daily savings rate for inflation
    const adjustedDailySavingsRate =
      dailySavingsRate * Math.pow(1 + inflationRate, year);

    // Add the savings for the entire year (365 days)
    totalSavings += adjustedDailySavingsRate * 365;
  }

  // Calculate ROI
  const totalROI = ((totalSavings - cost) / cost) * 100;

  // Calculate annualized ROI using the compound interest formula
  const annualizedROI =
    (Math.pow(totalSavings / cost, 1 / yearsToProject) - 1) * 100;

  return {
    totalSavings,
    totalROI,
    annualizedROI,
  };
}

export function calculateTotalSavings(
  initialCostPerDay,
  annualInflation,
  numberOfYears = 25 // Default to 25 years if no value is provided
) {
  let accumulatedSavings = 0;
  const monthlyEnergyInflation = Math.pow(1 + annualInflation, 1 / 12) - 1;
  const totalDays = numberOfYears * 365;

  let totalinitialCostPerDay = 0;
  let currentinitialCostPerDay = initialCostPerDay;
  let daysCounted = 0;

  for (let day = 1; day <= totalDays; day++) {
    // Adjust the initialCostPerDay for inflation at the start of each new month
    if (day % 30 === 1 && day > 1) {
      currentinitialCostPerDay *= 1 + monthlyEnergyInflation;
    }
    accumulatedSavings += currentinitialCostPerDay;
    daysCounted++;
  }

  // The final amount saved over the specified number of years
  return accumulatedSavings;
}

export function getDatesArray(startDate, endDate) {
  const dateArray = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    // Add one day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateArray;
}

export function calculateReturn(presentValue, futureValue, numberOfDays) {
  // Convert the number of days into years since CAGR is an annual metric
  const years = numberOfDays / 365;

  // Calculate CAGR using the formula
  const roi = (Math.pow(futureValue / presentValue, 1 / years) - 1) * 100;

  return roi; // Return the CAGR, rounded to two decimal places
}

/**
 * Compute evMiles for an entry by finding the previous entry's odometer reading.
 * postSolar is sorted newest-first, so the "previous" month is the next index.
 */
export function getEvMiles(entry, allEntries) {
  if (!entry.odometer) return 0;
  const idx = allEntries.indexOf(entry);
  const prevEntry = allEntries[idx + 1];
  const prevOdometer = prevEntry?.odometer || 0;
  return entry.odometer - prevOdometer;
}

/**
 * Break a month's EV charging into where the energy actually came from:
 * supercharger, grid-drawn home charging, or surplus solar that would
 * otherwise have been exported.
 *
 * Single source of truth for the charging split — calculateEvElecCost and
 * calculateSolarEvCredit both build on this.
 */
export function getEvChargingBreakdown(
  entry,
  milesPerKwh = 2.7,
  superchargerRate = 0.40
) {
  const totalEvKwh = parseFloat(entry.evMiles || 0) / milesPerKwh;
  const superchargedKwh = parseFloat(entry.supercharging || 0) / superchargerRate;
  const homeKwh = Math.max(0, totalEvKwh - superchargedKwh);

  // Net energy: total usage minus solar production
  const netEnergy = (entry.usage || 0) - (entry.production_dlvd || 0);

  // Only the EV kWh that pushed usage above solar production cost anything
  const chargeableKwh = Math.min(homeKwh, Math.max(0, netEnergy));
  const freeSolarKwh = homeKwh - chargeableKwh;

  // Effective electricity rate (what it would cost without solar)
  const rate = parseFloat(entry.price) / (entry.usage || 1);

  return {
    totalEvKwh,
    superchargedKwh,
    homeKwh,
    chargeableKwh,
    freeSolarKwh,
    rate,
    gridCost: chargeableKwh * rate,
  };
}

/**
 * Recover the gas price used for a month's gasSaved figure.
 *
 * gasSaved is stored net of supercharging and computed against oldVehicleMpg,
 * so the price backs out exactly. This lets a comparison against a vehicle with
 * different fuel economy be recomputed from the same real monthly prices —
 * gasSaved itself is only valid for the 22 mpg baseline it was built with.
 */
export function getGasPrice(entry, oldVehicleMpg = 22) {
  const miles = parseFloat(entry.evMiles || 0);
  if (!miles || !entry.gasSaved) return 0;

  const grossGasAvoided =
    parseFloat(entry.gasSaved) + parseFloat(entry.supercharging || 0);

  return (grossGasAvoided * oldVehicleMpg) / miles;
}

/**
 * Calculate the EV home charging electricity cost for a given month.
 * Only counts against savings when home usage exceeds solar production.
 * Caps at net grid consumption (doesn't attribute more than actual grid draw to EV).
 */
export function calculateEvElecCost(entry, milesPerKwh = 2.7, superchargerRate = 0.40) {
  if (!entry.gasSaved) return 0;

  return getEvChargingBreakdown(entry, milesPerKwh, superchargerRate).gridCost;
}

/**
 * Gas-equivalent value of EV miles powered by excess solar.
 * Reattributes that share of gas-savings from the EV bucket to the solar bucket.
 */
export function calculateSolarEvCredit(entry, milesPerKwh = 2.7, superchargerRate = 0.40) {
  if (!entry.gasSaved) return 0;

  const { totalEvKwh, freeSolarKwh } = getEvChargingBreakdown(
    entry,
    milesPerKwh,
    superchargerRate
  );
  if (totalEvKwh === 0) return 0;

  const solarShare = freeSolarKwh / totalEvKwh;
  const grossGasAvoided = parseFloat(entry.gasSaved) + parseFloat(entry.supercharging || 0);

  return solarShare * grossGasAvoided;
}
