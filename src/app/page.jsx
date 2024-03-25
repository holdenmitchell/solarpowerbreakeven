'use client';
import Header from './Header';
import {
  calculateAverageDailyCost,
  calculatePayoffDays,
  calculateTotalSavings,
} from './utils';
import Table from './Table';
import { preSolar, postSolar } from './data';
import PayoffChart from './PayoffChart';
import SectionHeader from './SectionHeader';
import StatCard from './StatCard';
import SectionBody from './SectionBody';
import Action from './Action';
import Details from './Details';

export default function Home() {
  const totalCostWithSolar = postSolar.reduce(
    (acc, transaction) => acc + parseFloat(transaction.price),
    0
  );

  const totalCostBeforeSolar = preSolar.reduce(
    (acc, transaction) => acc + parseFloat(transaction.price),
    0
  );

  const totalDaysWithSolar = postSolar.reduce(
    (acc, transaction) => acc + parseInt(transaction.days),
    0
  );

  const totalDaysBeforeSolar = preSolar.reduce(
    (acc, transaction) => acc + parseInt(transaction.days),
    0
  );

  const dailyCostWithSolar = totalCostWithSolar / totalDaysWithSolar;
  const costPerDayBeforeSolar = totalCostBeforeSolar / totalDaysBeforeSolar;
  let dailyCost = costPerDayBeforeSolar - dailyCostWithSolar;
  const fullCostOfSystem = 27940;
  const totalTaxCredit = 8372;
  const totalSolarizeGreenCounty = 3080;
  const totalCredits = totalTaxCredit + totalSolarizeGreenCounty;
  const actualCost =
    fullCostOfSystem - totalTaxCredit - totalSolarizeGreenCounty;
  // https://www.solarreviews.com/blog/average-electricity-cost-increase-per-year
  const energyInflation = 0.0259; // 2.59% annual inflation

  const { payoffYears, leftoverDays, days, accumulatedSavings } =
    calculatePayoffDays(actualCost, dailyCost, energyInflation);

  // Days since August 2023
  const purchaseDate = new Date('2023-08-08');
  const currentDate = new Date();
  const timeElaspedMilliseconds = currentDate - purchaseDate;
  const timeElaspedDays = Math.floor(
    timeElaspedMilliseconds / (1000 * 60 * 60 * 24)
  );

  const averageCostPerDay = calculateAverageDailyCost(
    timeElaspedDays,
    dailyCost,
    energyInflation
  );

  const projectedSavings = calculateTotalSavings(dailyCost, energyInflation);

  const stats = [
    {
      name: 'Estimated Payoff',
      value: `${payoffYears} yrs, ${leftoverDays} days`,
      change: '',
      changeType: 'negative',
      displayChange: false,
    },
    {
      name: 'Avg. $ / Day Since Solar',
      value: `$${dailyCostWithSolar.toFixed(2)}`,
      change: `$${dailyCost.toFixed(2)}`,
      changeType: 'positive',
      displayChange: true,
    },
    {
      name: 'Estimated Amount Saved',
      value: `$${Math.round(
        timeElaspedDays * averageCostPerDay
      ).toLocaleString()}`,
      change: '',
      changeType: 'negative',
      displayChange: true,
    },
    {
      name: 'Projected Savings (25 Yrs)',
      value: `$${Math.round(projectedSavings).toLocaleString()}`,
      change: '',
      changeType: 'negative',
      displayChange: true,
    },
  ];

  return (
    <>
      <Header />

      <main>
        <div className="relative isolate overflow-hidden pt-32">
          {/* Stats */}
          <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
            <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
              {stats.map((stat, statIdx) => (
                <StatCard key={stat.name} stat={stat} statIdx={statIdx} />
              ))}
            </dl>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionHeader text="Payoff Chart" />
            <SectionBody>
              <PayoffChart
                actualCost={actualCost}
                costPerDayStart={dailyCost}
                energyInflation={energyInflation}
                purchaseDate={purchaseDate}
              />

              <h2 className="mx-auto mt-8 max-w-2xl text-2xl font-semibold leading-6 text-gray-900 lg:mx-0 lg:max-w-none border-b pb-4">
                System Details
              </h2>
              <Details
                totalCredits={totalCredits}
                fullCostOfSystem={fullCostOfSystem}
                actualCost={actualCost}
                purchaseDate={purchaseDate}
              />
            </SectionBody>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionHeader text="Monthly Electric Bills Before and After Solar" />

            <SectionBody>
              <Table />
            </SectionBody>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionBody>
              <Action />
            </SectionBody>
          </div>
        </div>
      </main>
    </>
  );
}
