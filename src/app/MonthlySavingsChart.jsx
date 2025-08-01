import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { postSolar } from './data';

function MonthlySavingsChart() {
  const parseDate = (dateString) => new Date(dateString).getTime();

  const sortByDate = (data) => {
    return data.sort((a, b) => parseDate(a.start) - parseDate(b.start));
  };

  const sortedData = sortByDate(postSolar);

  const monthlySavingsData = sortedData.map((entry, index) => ({
    x: index,
    y: parseFloat(entry.saved),
    name: `${entry.month} ${entry.year}`,
    month: entry.month,
    year: entry.year,
    bill: parseFloat(entry.bill),
    price: parseFloat(entry.price),
  }));

  const options = {
    chart: {
      type: 'column',
      zoomType: 'x',
    },
    title: {
      text: 'Monthly Solar Savings',
      align: 'left',
    },
    xAxis: {
      type: 'category',
      categories: monthlySavingsData.map(data => data.name),
      title: {
        text: 'Month',
      },
      labels: {
        rotation: -45,
        style: {
          fontSize: '12px'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Savings (USD)',
      },
      labels: {
        formatter: function () {
          return `$${this.value.toLocaleString()}`;
        },
      },
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        const point = this.point;
        return `
          <div class="p-2">
            <table class="table-auto w-full">
              <thead>
                <tr>
                  <td class="font-semibold text-gray-700 text-center" colspan="2">${point.month} ${point.year}</td>
                </tr>
              </thead>
              <tbody class="text-left mt-2">
                <tr>
                  <th class="font-semibold text-gray-700">Cost without Solar</th>
                  <td class="pl-4">$${point.price.toFixed(2)}</td>
                </tr>
                <tr>
                  <th class="font-semibold text-gray-700">Cost with Solar</th>
                  <td class="pl-4">$${point.bill.toFixed(2)}</td>
                </tr>
                <tr class="border-t border-gray-200">
                  <th class="font-semibold text-gray-700">Amount Saved</th>
                  <td class="pl-4 text-green-600 font-semibold">$${point.y.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      },
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        color: '#72BB63',
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: 'Monthly Savings',
        data: monthlySavingsData,
      },
    ],
  };

  return (
    <div className="shadow-md rounded-md border-gray-200 p-4 bg-white">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default MonthlySavingsChart;