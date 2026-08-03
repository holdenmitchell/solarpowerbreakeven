import React from 'react';
import Header from '../Header';
import SectionHeader from '../SectionHeader';
import SectionBody from '../SectionBody';
import StatCard from '../StatCard';
import ComparisonColumns from './ComparisonColumns';
import MileageTable from './MileageTable';
import { EV9, DEFAULT_COMPARISON } from './vehicles';
import { buildComparison, ASSUMPTIONS } from './evCompareUtils';

export const metadata = {
  title: 'EV vs. Hybrid Cost Comparison — Kia EV9 vs. Toyota Sienna Hybrid',
  description:
    'A real-data cost comparison between a Kia EV9 charged largely on home solar and a 2026 Toyota Sienna Hybrid XLE. Actual miles, actual gas prices, actual charging costs, plus scheduled maintenance, compared every 5,000 miles to 200,000.',
  alternates: { canonical: '/ev' },
};

const money = (n) => `$${Math.round(Math.abs(n)).toLocaleString()}`;

function MaintenanceSchedule({ vehicle, accent }) {
  return (
    <div className="rounded-lg bg-gray-50 p-6 shadow-sm ring-1 ring-gray-900/5">
      <h3 className="mb-1 text-lg font-semibold" style={{ color: accent }}>
        {vehicle.year} {vehicle.name}
      </h3>
      <p className="mb-4 text-xs text-gray-500">{vehicle.trim}</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="pb-2 font-medium">Service</th>
            <th className="pb-2 text-right font-medium">Interval</th>
            <th className="pb-2 text-right font-medium">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {vehicle.maintenance.map((item) => (
            <tr key={item.label}>
              <td className="py-2 pr-2 text-gray-700">
                {item.label}
                {item.note && (
                  <span className="block text-xs text-gray-400">{item.note}</span>
                )}
              </td>
              <td className="py-2 text-right tabular-nums text-gray-500">
                {(item.intervalMiles / 1000).toLocaleString()}k mi
              </td>
              <td className="py-2 text-right tabular-nums text-gray-700">
                ${item.cost}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EvPage() {
  const comparison = DEFAULT_COMPARISON;
  const data = buildComparison(comparison, EV9);
  const { end, at100k, at200k, crossover, annualMiles, latestGasPrice } = data;

  const fuelSavedToDate = end.compFuel - end.ev9Fuel;
  const priceGap = EV9.purchasePrice - comparison.purchasePrice;

  const stats = [
    {
      name: 'Breakeven Mileage',
      value:
        crossover === null
          ? 'Beyond 200k'
          : `${Math.round(crossover).toLocaleString()} mi`,
      change: '',
      changeType: 'positive',
      displayChange: false,
    },
    {
      name: 'Fuel Saved To Date',
      value: money(fuelSavedToDate),
      change: '',
      changeType: fuelSavedToDate >= 0 ? 'positive' : 'negative',
      displayChange: false,
    },
    {
      name: 'Operating Advantage @ 100k',
      value: money(at100k.compOp - at100k.ev9Op),
      change: '',
      changeType: 'positive',
      displayChange: false,
    },
    {
      name: 'Total Advantage @ 200k',
      value: money(at200k.compTotal - at200k.ev9Total),
      change: '',
      changeType: 'positive',
      displayChange: false,
    },
  ];

  return (
    <>
      <Header />

      <main>
        <div className="relative isolate overflow-hidden pt-32">
          <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              EV9 vs. Sienna Hybrid — Real Cost Comparison
            </h1>
            <p className="mt-3 text-base leading-7 text-gray-600">
              What the Kia EV9 actually costs to run against the obvious
              alternative: a {comparison.year} {comparison.name} {comparison.trim}.
              The fuel and charging side is measured, not modeled — actual miles
              from odometer readings, actual monthly gas prices, and actual
              charging costs drawn from the same electric bills that drive the
              solar payoff on this site. Because the EV soaks up solar that would
              otherwise have been exported for almost nothing, a meaningful share
              of its charging is genuinely free.
            </p>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, statIdx) => (
                <StatCard key={stat.name} stat={stat} statIdx={statIdx} />
              ))}
            </dl>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionHeader text="Side-by-Side Comparison" />
            <SectionBody>
              <ComparisonColumns
                ev9={EV9}
                comparison={comparison}
                data={data}
              />
            </SectionBody>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionHeader text="Cost Every 5,000 Miles" />
            <SectionBody>
              <MileageTable ev9={EV9} comparison={comparison} data={data} />
            </SectionBody>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionHeader text="Scheduled Maintenance" />
            <SectionBody>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                The EV9 skips oil changes, spark plugs, engine air filters, and
                transmission service entirely. It does not skip tires — and at
                roughly {money(EV9.maintenance.find((m) => m.label.startsWith('Tires')).cost)}{' '}
                a set on a heavier vehicle wearing them faster, that single line
                claws back most of what the Sienna spends on oil and filters.
                Costs are typical U.S. independent-shop estimates; unlike the
                fuel figures, they are not measured from our own records.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <MaintenanceSchedule vehicle={EV9} accent="#72BB63" />
                <MaintenanceSchedule vehicle={comparison} accent="#3B82F6" />
              </div>
            </SectionBody>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionHeader text="Assumptions" />
            <SectionBody>
              <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-6 shadow-sm ring-1 ring-gray-900/5">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Measured from our own data
                  </h3>
                  <dl className="space-y-2 text-sm">
                    {[
                      ['Miles driven', `${Math.round(end.miles).toLocaleString()} mi over ${end.days} days`],
                      ['Annual mileage', `${Math.round(annualMiles).toLocaleString()} mi/yr`],
                      ['EV efficiency', `${ASSUMPTIONS.milesPerKwh} mi/kWh`],
                      ['Grid charging paid', money(end.gridCost)],
                      ['Supercharging paid', money(end.superchargeCost)],
                      ['Free solar charging', `${Math.round(end.freeKwh).toLocaleString()} kWh`],
                      ['Latest gas price', `$${latestGasPrice.toFixed(2)}/gal`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="text-gray-500">{k}</dt>
                        <dd className="text-right font-medium text-gray-800">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-lg bg-gray-50 p-6 shadow-sm ring-1 ring-gray-900/5">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    Forward projection
                  </h3>
                  <dl className="space-y-2 text-sm">
                    {[
                      ['Gas inflation', `${(ASSUMPTIONS.gasInflation * 100).toFixed(1)}%/yr`],
                      ['Electricity inflation', `${(ASSUMPTIONS.elecInflation * 100).toFixed(1)}%/yr`],
                      ['Maintenance inflation', `${(ASSUMPTIONS.maintenanceInflation * 100).toFixed(1)}%/yr`],
                      ['Retail electricity', `$${ASSUMPTIONS.retailElecRate.toFixed(3)}/kWh`],
                      ['Supercharger rate', `$${ASSUMPTIONS.superchargerRate.toFixed(2)}/kWh`],
                      ['Supercharging share', `${(ASSUMPTIONS.superchargeShare * 100).toFixed(0)}% of energy`],
                      ['Free solar pool', `${ASSUMPTIONS.freeSolarKwhPerYear.toLocaleString()} kWh/yr`],
                      ['Panel degradation', `${(ASSUMPTIONS.solarDegradation * 100).toFixed(1)}%/yr`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="text-gray-500">{k}</dt>
                        <dd className="text-right font-medium text-gray-800">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-blue-50 p-6 shadow-sm ring-1 ring-blue-200">
                <h3 className="mb-2 text-sm font-semibold text-blue-900">
                  Where the free solar number comes from
                </h3>
                <p className="text-sm leading-relaxed text-blue-800">
                  In the year before the EV arrived, {ASSUMPTIONS.freeSolarKwhPerYear.toLocaleString()} kWh
                  of production spilled out across six net-export months. Under
                  PSO&apos;s monthly netting that surplus earned close to nothing —
                  exports offset imports within a billing month, but anything
                  past that is credited at avoided cost. The EV absorbs it:
                  spilled surplus fell {'≈'}95% once the car arrived. That
                  recovered energy is treated as free charging here, degrading{' '}
                  {(ASSUMPTIONS.solarDegradation * 100).toFixed(1)}% a year with
                  the panels.
                </p>
              </div>

              <div className="mt-6 rounded-lg bg-amber-50 p-6 shadow-sm ring-1 ring-amber-200">
                <h3 className="mb-2 text-sm font-semibold text-amber-900">
                  What this leaves out
                </h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-amber-900">
                  <li>
                    <strong>Depreciation and resale.</strong> Excluded entirely.
                    Three-row EVs have generally depreciated faster than Toyota
                    hybrids, so including it would likely move the comparison
                    against the EV9.
                  </li>
                  <li>
                    <strong>Insurance and registration.</strong> Not modeled;
                    the EV9 typically insures higher.
                  </li>
                  <li>
                    <strong>Battery replacement.</strong> Not modeled. The
                    EV9&apos;s battery warranty ends at 100,000 miles, so rows
                    beyond that carry real risk the Sienna doesn&apos;t.
                  </li>
                  <li>
                    <strong>The 200k horizon is speculative.</strong> At{' '}
                    {Math.round(annualMiles).toLocaleString()} mi/yr that is
                    roughly {(200000 / annualMiles).toFixed(0)} years out. Treat
                    the far rows as direction, not forecast.
                  </li>
                  <li>
                    <strong>The gas price dominates.</strong> Fuel is the
                    largest single line, so the whole comparison swings with it.
                    The projection starts from the most recent observed price of
                    ${latestGasPrice.toFixed(2)}/gal.
                  </li>
                </ul>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-gray-600">
                One note on the purchase side: the EV9 was bought for{' '}
                {money(EV9.purchasePrice)} against{' '}
                {money(comparison.purchasePrice)} for the Sienna XLE, a{' '}
                {money(priceGap)} premium the running costs have to earn back.
                The EV9 figure is what was actually paid; the Sienna figure is
                an expected starting price, set a little above its{' '}
                $46,615 MSRP to reflect what a popular minivan tends to
                transact at.
              </p>
            </SectionBody>
          </div>
        </div>
      </main>
    </>
  );
}
