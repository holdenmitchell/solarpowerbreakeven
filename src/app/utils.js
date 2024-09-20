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
  cost
) {
  // Parse dates to calculate the number of days that have passed
  const purchase = purchaseDate;
  const current = currentDate;

  // Calculate the number of days since the purchase
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysPassed = Math.floor((current - purchase) / msPerDay);

  // Calculate the number of years passed since the purchase
  const yearsPassed = daysPassed / 365;

  // Adjust daily savings rate for 3% annual inflation
  const inflationRate = 0.03;
  const adjustedDailySavingsRate =
    (savedToDate / daysPassed) * Math.pow(1 + inflationRate, yearsPassed);

  // Calculate the projected number of days until breakeven
  const projectedDaysToBreakeven =
    (cost - savedToDate) / adjustedDailySavingsRate;

  // Calculate the total number of days from purchase to breakeven
  const totalDaysToBreakeven = Math.floor(
    projectedDaysToBreakeven + daysPassed
  );

  // Convert the total number of days to years and days
  const projectedYears = Math.floor(totalDaysToBreakeven / 365);
  const projectedDays = totalDaysToBreakeven % 365;

  return {
    projectedYears,
    projectedDays,
  };
}

export function projectedSavingsIn25Years(purchaseDate, savedToDate, cost) {
  // Define the number of years for projection
  const yearsToProject = 25;

  // Calculate the daily savings rate based on the saved amount to date and the time since purchase
  const currentDate = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysPassed = Math.floor((currentDate - purchaseDate) / msPerDay);
  const dailySavingsRate = savedToDate / daysPassed;

  // Define the annual inflation rate for savings
  const inflationRate = 0.03;

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