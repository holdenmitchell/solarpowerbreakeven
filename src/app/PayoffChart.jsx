import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { postSolar } from './data';
import { calculateEvElecCost } from './utils';

function PayoffChart({ actualCost }) {
  const parseDate = (dateString) => new Date(dateString).getTime();

  const sortByDate = (data) => {
    return data.sort((a, b) => parseDate(a.start) - parseDate(b.start));
  };

  const sortedData = sortByDate(postSolar);

  let cumElectric = 0;
  let cumGas = 0;
  const electricData = [];
  const gasData = [];

  sortedData.forEach((entry) => {
    const x = parseDate(entry.start);
    cumElectric += parseFloat(entry.saved);
    cumGas += parseFloat(entry.gasSaved || 0) - calculateEvElecCost(entry);
    electricData.push({ x, y: cumElectric });
    gasData.push({ x, y: cumGas });
  });

  const options = {
    chart: {
      zoomType: 'x',
      type: 'areaspline',
    },
    title: {
      text: 'Cumulative Savings Over Time',
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
        text: 'Total Savings (USD)',
      },
      labels: {
        formatter: function () {
          return `$${this.value.toLocaleString()}`;
        },
      },
      plotLines: [
        {
          value: actualCost,
          color: '#EF4444',
          dashStyle: 'Dash',
          width: 2,
          label: {
            text: `Breakeven: $${actualCost.toLocaleString()}`,
            align: 'right',
            style: { color: '#EF4444', fontWeight: 'bold' },
          },
          zIndex: 5,
        },
      ],
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        let electric = 0;
        let gas = 0;

        this.points.forEach((point) => {
          if (point.series.name === 'Electric Savings') {
            electric = point.y;
          }
          if (point.series.name === 'EV Gas Savings') {
            gas = point.y;
          }
        });

        const total = electric + gas;

        return `
      <div class="p-2">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <td class="font-semibold text-gray-700 text-center" colspan="2">${Highcharts.dateFormat('%b %Y', this.x)}</td>
            </tr>
          </thead>
          <tbody class="text-left mt-2">
            <tr>
              <th style="color: #72BB63" class="font-semibold">Electric Savings</th>
              <td style="color: #72BB63" class="pl-4">$${electric.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <th style="color: #3B82F6" class="font-semibold">EV Gas Savings</th>
              <td style="color: #3B82F6" class="pl-4">$${gas.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
            <tr class="border-t border-gray-200">
              <th class="font-semibold text-gray-700">Total Saved</th>
              <td class="pl-4 font-semibold text-gray-700">$${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
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
        stacking: 'normal',
        fillOpacity: 0.4,
        marker: { enabled: false },
      },
    },
    series: [
      {
        name: 'EV Gas Savings',
        data: gasData,
        color: '#3B82F6',
      },
      {
        name: 'Electric Savings',
        data: electricData,
        color: '#72BB63',
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
