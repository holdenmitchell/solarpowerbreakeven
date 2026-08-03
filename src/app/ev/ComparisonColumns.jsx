import React from 'react';
import VehicleImage from './VehicleImage';

const money = (n) => `$${Math.abs(Math.round(n)).toLocaleString()}`;
const perMile = (n) => `$${Math.abs(n).toFixed(3)}/mi`;

/**
 * Difference cell. `value` is (comparison − EV9), so positive means the EV9 is
 * ahead — except for purchase price, where paying less is better, hence invert.
 */
function Diff({ value, invert = false, format = money }) {
  const favorsEv9 = invert ? value < 0 : value > 0;

  return (
    <span className={favorsEv9 ? 'text-green-700' : 'text-gray-500'}>
      <span className="font-semibold">
        {favorsEv9 ? '−' : '+'}
        {format(value)}
      </span>
      <span className="ml-1.5 text-xs font-normal text-gray-400">
        {favorsEv9 ? 'EV9' : 'Sienna'}
      </span>
    </span>
  );
}

function VehicleCard({ vehicle, badge, badgeColor }) {
  return (
    <div>
      <VehicleImage vehicle={vehicle} />
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <h3 className="text-lg font-semibold leading-tight text-gray-900">
          {vehicle.year} {vehicle.name}
        </h3>
        <span
          className="rounded px-2 py-0.5 text-xs font-medium text-white"
          style={{ backgroundColor: badgeColor }}
        >
          {badge}
        </span>
      </div>
      <p className="text-sm text-gray-500">{vehicle.trim}</p>
      <dl className="mt-3 space-y-1">
        {vehicle.specs.map((spec) => (
          <div key={spec.label} className="flex justify-between gap-2 text-xs">
            <dt className="text-gray-500">{spec.label}</dt>
            <dd className="text-right font-medium text-gray-700">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ComparisonColumns({ ev9, comparison, data }) {
  const { end, at100k, at200k, crossover, annualMiles } = data;

  const priceGap = ev9.purchasePrice - comparison.purchasePrice;
  const toDate = data.totalAt(end.miles);

  const rows = [
    {
      label: 'Purchase price',
      note: `${ev9.purchaseNote} vs. ${comparison.purchaseNote}`,
      ev9: money(ev9.purchasePrice),
      comp: money(comparison.purchasePrice),
      diff: <Diff value={priceGap} invert />,
    },
    {
      label: 'Fuel / energy to date',
      note: `Measured over ${Math.round(end.miles).toLocaleString()} actual miles using the same real monthly gas prices, recomputed at the Sienna's ${comparison.mpg} mpg.`,
      ev9: money(end.ev9Fuel),
      comp: money(end.compFuel),
      diff: <Diff value={end.compFuel - end.ev9Fuel} />,
    },
    {
      label: 'Maintenance to date',
      ev9: money(toDate.ev9Maint),
      comp: money(toDate.compMaint),
      diff: <Diff value={toDate.compMaint - toDate.ev9Maint} />,
    },
    {
      label: 'Operating cost per mile',
      ev9: perMile(toDate.ev9Op / end.miles),
      comp: perMile(toDate.compOp / end.miles),
      diff: (
        <Diff
          value={toDate.compOp / end.miles - toDate.ev9Op / end.miles}
          format={perMile}
        />
      ),
    },
    {
      label: 'Operating cost @ 100k mi',
      ev9: money(at100k.ev9Op),
      comp: money(at100k.compOp),
      diff: <Diff value={at100k.compOp - at100k.ev9Op} />,
    },
    {
      label: 'Operating cost @ 200k mi',
      ev9: money(at200k.ev9Op),
      comp: money(at200k.compOp),
      diff: <Diff value={at200k.compOp - at200k.ev9Op} />,
    },
    {
      label: 'Total cost of ownership @ 200k mi',
      note: 'Purchase price + fuel/energy + scheduled maintenance. Excludes depreciation, insurance, and registration.',
      ev9: money(at200k.ev9Total),
      comp: money(at200k.compTotal),
      diff: <Diff value={at200k.compTotal - at200k.ev9Total} />,
      highlight: true,
    },
    {
      label: 'Breakeven mileage',
      note:
        crossover === null
          ? 'The EV9 does not overcome its purchase premium within 200,000 miles.'
          : `Where cheaper running costs overcome the EV9's ${money(priceGap)} purchase premium — roughly ${(crossover / annualMiles).toFixed(1)} years at ${Math.round(annualMiles).toLocaleString()} mi/yr.`,
      ev9:
        crossover === null
          ? 'Never within 200k'
          : `${Math.round(crossover).toLocaleString()} mi`,
      comp: '—',
      diff: (
        <span className="text-xs text-gray-400">
          {crossover === null
            ? 'Sienna stays ahead'
            : `${(crossover / annualMiles).toFixed(1)} yrs`}
        </span>
      ),
      highlight: true,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-900/10 bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-6 px-4 py-5 sm:grid-cols-3 sm:px-6">
        <VehicleCard vehicle={ev9} badge="Owned" badgeColor="#72BB63" />
        <VehicleCard vehicle={comparison} badge="Alternative" badgeColor="#3B82F6" />
        <div className="flex flex-col justify-end">
          <h3 className="text-lg font-semibold text-gray-900">Difference</h3>
          <p className="mt-1 text-sm text-gray-500">Green favors the EV9.</p>
          <p className="mt-3 text-xs text-gray-400">
            {Math.round(end.miles).toLocaleString()} miles measured over {end.days}{' '}
            days — {Math.round(annualMiles).toLocaleString()} mi/yr.
          </p>
        </div>
      </div>

      <dl>
        {rows.map((row) => (
          <div
            key={row.label}
            className={`border-t border-gray-200 px-4 py-3 sm:px-6 ${
              row.highlight ? 'bg-green-50' : ''
            }`}
          >
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-4">
              <dt className="text-sm font-medium text-gray-500">{row.label}</dt>
              <dd className="text-sm font-medium text-gray-900">
                <span className="mr-2 text-xs uppercase tracking-wide text-gray-400 sm:hidden">
                  {ev9.shortName}
                </span>
                {row.ev9}
              </dd>
              <dd className="text-sm font-medium text-gray-900">
                <span className="mr-2 text-xs uppercase tracking-wide text-gray-400 sm:hidden">
                  {comparison.shortName}
                </span>
                {row.comp}
              </dd>
              <dd className="text-sm">{row.diff}</dd>
            </div>
            {row.note && (
              <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
                {row.note}
              </p>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}

export default ComparisonColumns;
