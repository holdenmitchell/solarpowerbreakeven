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

export function calculatePayoffDays(
  actualCost,
  initialCostPerDay,
  annualInflation
) {
  let accumulatedSavings = 0;
  let days = 0;
  let costPerDay = initialCostPerDay;
  const monthlyInflation = Math.pow(1 + annualInflation, 1 / 12) - 1;

  while (accumulatedSavings < actualCost) {
    if (days % 30 === 0 && days !== 0) {
      costPerDay *= 1 + monthlyInflation;
    }

    accumulatedSavings += costPerDay;
    days++;
  }

  // Convert days to years and days for the final output
  const payoffYears = Math.floor(days / 365);
  const leftoverDays = days % 365;
  return { payoffYears, leftoverDays, days, accumulatedSavings };
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