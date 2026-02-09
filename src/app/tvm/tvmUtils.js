import { postSolar } from '../data';

/**
 * Scenario A: Invest the lump sum in a brokerage instead of buying solar.
 * Returns year-by-year data with pre-tax and after-tax values.
 */
export function calculateScenarioA(principal, annualReturn, capGainsTaxRate, years) {
  const data = [];
  for (let year = 0; year <= years; year++) {
    const pretaxValue = principal * Math.pow(1 + annualReturn, year);
    const gains = pretaxValue - principal;
    const afterTax = pretaxValue - gains * capGainsTaxRate;
    data.push({
      year,
      pretaxValue,
      afterTax,
    });
  }
  return data;
}

/**
 * Scenario B: Buy solar and reinvest the monthly savings into a brokerage.
 * Savings grow with energy inflation. Contributions are tax-free (reduced expenses).
 * Returns year-by-year data with pre-tax and after-tax brokerage values.
 */
export function calculateScenarioB(dailySavingsRate, annualReturn, capGainsTaxRate, energyInflation, years) {
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
  const totalMonths = years * 12;

  let brokerageValue = 0;
  let totalContributions = 0;
  const data = [];

  // Year 0: no savings yet
  data.push({
    year: 0,
    pretaxValue: 0,
    afterTax: 0,
    totalContributions: 0,
  });

  for (let month = 1; month <= totalMonths; month++) {
    // Grow existing balance by monthly return
    brokerageValue *= 1 + monthlyReturn;

    // Monthly savings: daily rate * 30, inflation-adjusted
    const monthlySavings = dailySavingsRate * 30 * Math.pow(1 + energyInflation, month / 12);
    brokerageValue += monthlySavings;
    totalContributions += monthlySavings;

    // Record data at end of each year
    if (month % 12 === 0) {
      const year = month / 12;
      const gains = brokerageValue - totalContributions;
      const afterTax = brokerageValue - gains * capGainsTaxRate;
      data.push({
        year,
        pretaxValue: brokerageValue,
        afterTax,
        totalContributions,
      });
    }
  }

  return data;
}

/**
 * Compute the trailing 12-month daily savings rate from actual post-solar data.
 * Mirrors the computation in page.jsx.
 */
export function getTrailingDailySavingsRate() {
  const trailing12 = postSolar.slice(0, 12);
  const totalSaved = trailing12.reduce((acc, t) => acc + parseFloat(t.saved), 0);
  const totalDays = trailing12.reduce((acc, t) => acc + parseInt(t.days), 0);
  return totalSaved / totalDays;
}
