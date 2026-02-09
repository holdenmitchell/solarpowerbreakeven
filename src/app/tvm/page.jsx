'use client';

import React, { useState } from 'react';
import Header from '../Header';
import SectionHeader from '../SectionHeader';
import SectionBody from '../SectionBody';
import StatCard from '../StatCard';
import InputControls from './InputControls';
import TVMChart from './TVMChart';
import {
  calculateScenarioA,
  calculateScenarioB,
  getTrailingDailySavingsRate,
} from './tvmUtils';

const SYSTEM_COST = 19568;
const YEARS = 25;

export default function TVMPage() {
  const [annualReturn, setAnnualReturn] = useState(7);
  const [capGainsTax, setCapGainsTax] = useState(19.75);
  const [energyInflation, setEnergyInflation] = useState(3.5);

  const dailySavingsRate = getTrailingDailySavingsRate();

  const scenarioA = calculateScenarioA(
    SYSTEM_COST,
    annualReturn / 100,
    capGainsTax / 100,
    YEARS
  );

  const scenarioB = calculateScenarioB(
    dailySavingsRate,
    annualReturn / 100,
    capGainsTax / 100,
    energyInflation / 100,
    YEARS
  );

  const finalA = scenarioA[scenarioA.length - 1];
  const finalB = scenarioB[scenarioB.length - 1];
  const advantage = finalB.afterTax - finalA.afterTax;
  const winner = advantage >= 0 ? 'Solar + Reinvest' : 'Brokerage Only';

  const totalTaxFreeSavings = finalB.totalContributions;

  const stats = [
    {
      name: 'Brokerage Only (After-Tax)',
      value: `$${Math.round(finalA.afterTax).toLocaleString()}`,
      change: '',
      changeType: 'negative',
      displayChange: false,
    },
    {
      name: 'Solar + Reinvest (After-Tax)',
      value: `$${Math.round(finalB.afterTax).toLocaleString()}`,
      change: '',
      changeType: 'positive',
      displayChange: false,
    },
    {
      name: `Advantage (${winner})`,
      value: `$${Math.round(Math.abs(advantage)).toLocaleString()}`,
      change: '',
      changeType: advantage >= 0 ? 'positive' : 'negative',
      displayChange: false,
    },
    {
      name: 'Total Tax-Free Savings',
      value: `$${Math.round(totalTaxFreeSavings).toLocaleString()}`,
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
            <SectionHeader text="Assumptions" />
            <SectionBody>
              <InputControls
                annualReturn={annualReturn}
                setAnnualReturn={setAnnualReturn}
                capGainsTax={capGainsTax}
                setCapGainsTax={setCapGainsTax}
                energyInflation={energyInflation}
                setEnergyInflation={setEnergyInflation}
              />
            </SectionBody>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionHeader text="25-Year Comparison" />
            <SectionBody>
              <TVMChart scenarioA={scenarioA} scenarioB={scenarioB} />
            </SectionBody>
          </div>
        </div>

        <div className="space-y-8 py-8 xl:space-y-20">
          <div>
            <SectionHeader text="How It Works" />
            <SectionBody>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mt-4">
                <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ color: '#FF5201' }}>
                    Scenario A: Brokerage Only
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Instead of buying solar panels, invest the ${SYSTEM_COST.toLocaleString()} system cost into a brokerage account.
                    The lump sum grows at the selected annual market return over 25 years. When you sell,
                    capital gains tax applies to the growth (total value minus original investment).
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ color: '#72BB63' }}>
                    Scenario B: Solar + Reinvest Savings
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Buy solar panels and invest the monthly electricity savings into a brokerage account.
                    Savings are tax-free (they&apos;re reduced expenses, not income) and grow with energy inflation.
                    Each month&apos;s contribution compounds over time. Capital gains tax only applies to
                    the investment growth above your total contributions.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-blue-50 shadow-sm ring-1 ring-blue-200 p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Key Insight</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Solar savings are effectively tax-free income — you&apos;re spending less on electricity rather than
                  earning taxable investment returns. This means more of your solar savings flow directly into
                  wealth accumulation. The brokerage-only scenario faces capital gains tax on all growth,
                  while the solar scenario only pays tax on brokerage gains above the contributed savings.
                </p>
              </div>
            </SectionBody>
          </div>
        </div>
      </main>
    </>
  );
}
