'use client';
import Header from './Header';
import {
  calculateAverageDailyCost,
  solarPayoffCalculator,
  projectedSavingsIn25Years,
  calculateEvElecCost,
  calculateSolarEvCredit,
} from './utils';
import Table from './Table';
import { preSolar, postSolar, evData } from './data';
import PayoffChart from './PayoffChart';
import MonthlySavingsChart from './MonthlySavingsChart';
import SectionHeader from './SectionHeader';
import StatCard from './StatCard';
import SectionBody from './SectionBody';
import Action from './Action';
import Details from './Details';

export default function Home() {
  const costWithout = postSolar.reduce(
    (acc, transaction) => acc + parseFloat(transaction.price),
    0
  );
  const costWith = postSolar.reduce(
    (acc, transaction) => acc + parseFloat(transaction.bill),
    0
  );
  const electricitySaved = costWithout - costWith;
  const solarEvCredit = postSolar.reduce(
    (acc, t) => acc + calculateSolarEvCredit(t),
    0
  );
  const netEvSavings = postSolar.reduce(
    (acc, t) => acc + parseFloat(t.gasSaved || 0) - calculateEvElecCost(t),
    0
  );
  const additionalEvSavings = netEvSavings - solarEvCredit;
  const saved = electricitySaved + solarEvCredit;

  const fullCostOfSystem = 27940;
  const totalTaxCredit = 8372;
  const totalSolarizeGreenCounty = 0;
  const totalCredits = totalTaxCredit + totalSolarizeGreenCounty;
  const actualCost =
    fullCostOfSystem - totalTaxCredit - totalSolarizeGreenCounty;
  // https://www.solarreviews.com/blog/average-electricity-cost-increase-per-year
  const energyInflation = 0.035; // 3.5% annual inflation

  // Trailing 12-month daily SOLAR savings rate (electricity + solar's share of EV charging value)
  const trailing12 = postSolar.slice(0, 12);
  const trailing12Savings = trailing12.reduce(
    (acc, t) => acc + parseFloat(t.saved) + calculateSolarEvCredit(t),
    0
  );
  const trailing12Days = trailing12.reduce(
    (acc, t) => acc + parseInt(t.days),
    0
  );
  const trailingDailySavings = trailing12Savings / trailing12Days;

  // Days since August 2023
  const purchaseDate = new Date('2023-08-08');
  const currentDate = new Date();

  const { projectedYears, projectedDays, breakevenDate } =
    solarPayoffCalculator(
      purchaseDate,
      currentDate,
      saved,
      actualCost,
      energyInflation,
      trailingDailySavings
    );

  const { totalSavings, annualizedROI } = projectedSavingsIn25Years(
    purchaseDate,
    saved,
    actualCost,
    energyInflation,
    trailingDailySavings
  );
  const timeElaspedMilliseconds = currentDate - purchaseDate;
  const timeElaspedDays = Math.floor(
    timeElaspedMilliseconds / (1000 * 60 * 60 * 24)
  );

  const stats = [
    {
      name: 'Estimated Payoff (Date)',
      value: `${projectedYears} yrs, ${projectedDays} days `,
      change: '',
      changeType: 'negative',
      displayChange: false,
    },
    {
      name: 'Projected Breakeven Date',
      value: `${breakevenDate.toLocaleDateString()}`,
      change: '',
      changeType: 'positive',
      displayChange: false,
    },
    {
      name: 'Saved To Date',
      value: `$${Math.round(saved).toLocaleString()}`,
      change: '',
      changeType: 'negative',
      displayChange: false,
    },
    {
      name: 'Projected Savings (25 yrs)',
      value: `$${Math.round(totalSavings).toLocaleString()}`,
      change: '',
      changeType: 'negative',
      displayChange: true,
    },
    {
      name: 'Projected Annualized ROI (25 yrs)',
      value: `${Math.round(100 * annualizedROI) / 100}%`,
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
          {/* Stats */}
          <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
            <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 lg:px-2 xl:px-0">
              {stats.map((stat, statIdx) => (
                <StatCard key={stat.name} stat={stat} statIdx={statIdx} />
              ))}
            </dl>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Solar Payoff Progress
            </span>
            <span className="text-sm font-medium text-gray-700">
              ${Math.round(saved).toLocaleString()} / ${actualCost.toLocaleString()}
              {' '}({Math.min(100, Math.round((saved / actualCost) * 100))}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden flex">
            <div
              className="h-4 transition-all duration-500"
              style={{
                width: `${Math.min(100, (electricitySaved / actualCost) * 100)}%`,
                backgroundColor: '#72BB63',
              }}
            />
            <div
              className="h-4 transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(100 - (electricitySaved / actualCost) * 100, (solarEvCredit / actualCost) * 100))}%`,
                backgroundColor: '#FBBF24',
              }}
            />
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#72BB63' }} />
              Electric: ${Math.round(electricitySaved).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#FBBF24' }} />
              Solar→EV: ${Math.round(solarEvCredit).toLocaleString()}
            </span>
            <span className="flex items-center gap-1 pl-2 ml-2 border-l border-gray-300">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#3B82F6' }} />
              Additional EV (not in payoff): ${Math.round(additionalEvSavings).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionHeader text="Monthly Solar Savings" />
            <SectionBody>
              <MonthlySavingsChart />
            </SectionBody>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionHeader text="Payoff Chart" />
            <SectionBody>
              {<PayoffChart actualCost={actualCost} />}

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

        {false && (
          <div className="space-y-8 py-8 xl:space-y-20">
            <div>
              <SectionBody>
                <Action />
              </SectionBody>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
