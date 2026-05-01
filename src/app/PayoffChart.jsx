import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { postSolar } from './data';
import { calculateEvElecCost, calculateSolarEvCredit } from './utils';

function PayoffChart({ actualCost }) {
  const parseDate = (dateString) => new Date(dateString).getTime();

  const sortByDate = (data) => {
    return data.sort((a, b) => parseDate(a.start) - parseDate(b.start));
  };

  const sortedData = sortByDate(postSolar);

  let cumElectric = 0;
  let cumSolarEv = 0;
  let cumAdditionalEv = 0;
  const electricData = [];
  const solarEvData = [];
  const additionalEvData = [];

  sortedData.forEach((entry) => {
    const x = parseDate(entry.start);
    const credit = calculateSolarEvCredit(entry);
    const netEv = parseFloat(entry.gasSaved || 0) - calculateEvElecCost(entry);
    cumElectric += parseFloat(entry.saved);
    cumSolarEv += credit;
    cumAdditionalEv += netEv - credit;
    electricData.push({ x, y: cumElectric });
    solarEvData.push({ x, y: cumSolarEv });
    additionalEvData.push({ x, y: cumAdditionalEv });
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
        let solarEv = 0;
        let additionalEv = 0;

        this.points.forEach((point) => {
          if (point.series.name === 'Electric Savings') electric = point.y;
          if (point.series.name === 'Solar→EV Charging') solarEv = point.y;
          if (point.series.name === 'Additional EV Savings') additionalEv = point.y;
        });

        const solarTotal = electric + solarEv;
        const total = solarTotal + additionalEv;
        const fmt = (v) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
              <td style="color: #72BB63" class="pl-4">$${fmt(electric)}</td>
            </tr>
            <tr>
              <th style="color: #D97706" class="font-semibold">Solar→EV Charging</th>
              <td style="color: #D97706" class="pl-4">$${fmt(solarEv)}</td>
            </tr>
            <tr class="border-t border-gray-100">
              <th class="font-semibold text-gray-700">Solar Subtotal (Payoff)</th>
              <td class="pl-4 font-semibold" style="color: #72BB63">$${fmt(solarTotal)}</td>
            </tr>
            <tr>
              <th style="color: #3B82F6" class="font-semibold">Additional EV Savings</th>
              <td style="color: #3B82F6" class="pl-4">$${fmt(additionalEv)}</td>
            </tr>
            <tr class="border-t border-gray-200">
              <th class="font-semibold text-gray-700">Total Saved</th>
              <td class="pl-4 font-semibold text-gray-700">$${fmt(total)}</td>
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
        name: 'Additional EV Savings',
        data: additionalEvData,
        color: '#3B82F6',
      },
      {
        name: 'Solar→EV Charging',
        data: solarEvData,
        color: '#FBBF24',
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
