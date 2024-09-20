import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { postSolar } from './data'; // Import the data

function PayoffChart({ actualCost }) {
  // Helper function to convert a date string to a timestamp
  const parseDate = (dateString) => new Date(dateString).getTime();

  // Function to sort the data by date (start field)
  const sortByDate = (data) => {
    return data.sort((a, b) => parseDate(a.start) - parseDate(b.start));
  };

  // Function to calculate cumulative sums for the series data
  const calculateCumulativeData = (data, key) => {
    let cumulativeSum = 0;
    return data.map((entry) => {
      cumulativeSum += parseFloat(entry[key]);
      return {
        x: parseDate(entry.start),
        y: cumulativeSum,
      };
    });
  };

  // Sort the postSolar data by date
  const sortedData = sortByDate(postSolar);

  // Calculate cumulative data for 'bill' and 'price' using the sorted data
  const cumulativeWithSolar = calculateCumulativeData(sortedData, 'bill');
  const cumulativeWithoutSolar = calculateCumulativeData(sortedData, 'saved');

  const options = {
    chart: {
      zoomType: 'x',
      type: 'areaspline',
    },
    title: {
      text: 'Cumulative Solar Savings Over Time',
      align: 'left',
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%b %Y',
      },
    },
    yAxis: {
      title: {
        text: 'Cumulative Cost (USD)',
      },
      labels: {
        formatter: function () {
          return `$${this.value.toLocaleString()}`;
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        let costWithSolar = 0;
        let costWithoutSolar = 0;

        // Loop through the points to find the two series (with solar and without solar)
        this.points.forEach((point) => {
          if (point.series.name === 'Cumulative Cost with Solar') {
            costWithSolar = point.y;
          }
          if (point.series.name === 'Cumulative Cost without Solar') {
            costWithoutSolar = point.y;
          }
        });

        // Total cost without solar is the sum of both points
        const totalCostWithoutSolar = costWithSolar + costWithoutSolar;

        // Calculate the savings
        const savings = totalCostWithoutSolar - costWithSolar;

        return `
      <div class="p-2">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <td class="font-semibold text-gray-700 text-center" colspan="2">${Highcharts.dateFormat(
                '%b %Y',
                this.x
              )}</td>
            </tr>
          </thead>
          <tbody class="text-left mt-8">
            <tr>
              <th class="font-semibold text-gray-700">Total Cost without Solar</th>
              <td class="pl-4">$${totalCostWithoutSolar.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="font-semibold text-gray-700">Cumulative Cost with Solar</th>
              <td class="pl-4">$${costWithSolar.toFixed(2)}</td>
            </tr>
            <tr class="border-t border-gray-200">
              <th class="font-semibold text-gray-700">Amount Saved</th>
              <td class="pl-4 text-green-600">$${savings.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
      },
    },

    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.5,
        stacking: 'normal', // Stacks the two series
      },
    },
    series: [
      {
        name: 'Cumulative Cost without Solar',
        data: cumulativeWithoutSolar,
        color: '#FF5201', // Non-solar cost line color
        fillColor: 'rgba(114, 187, 99, 0.1)', // Set fill color with 0.1 opacity
      },
      {
        name: 'Cumulative Cost with Solar',
        data: cumulativeWithSolar,
        color: '#72BB63', // Solar cost line color (user's preferred color)
        fillOpacity: 0,
      },
    ],
  };

  return (
    <div className="shadow-md rounded-md border-gray-200 p-4 bg-white">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default PayoffChart;
