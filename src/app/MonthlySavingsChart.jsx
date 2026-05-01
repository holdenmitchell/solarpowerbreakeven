import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { postSolar } from './data';
import { calculateEvElecCost, calculateSolarEvCredit } from './utils';

function MonthlySavingsChart() {
  const parseDate = (dateString) => new Date(dateString).getTime();

  const sortByDate = (data) => {
    return data.sort((a, b) => parseDate(a.start) - parseDate(b.start));
  };

  const sortedData = sortByDate(postSolar);

  const categories = sortedData.map((entry) => `${entry.month} ${entry.year}`);

  const electricSavingsData = sortedData.map((entry) => ({
    y: parseFloat(entry.saved),
    bill: parseFloat(entry.bill),
    price: parseFloat(entry.price),
  }));

  const solarEvCreditData = sortedData.map((entry) => ({
    y: calculateSolarEvCredit(entry),
  }));

  const additionalEvData = sortedData.map((entry) => {
    const netEv = parseFloat(entry.gasSaved || 0) - calculateEvElecCost(entry);
    return {
      y: netEv - calculateSolarEvCredit(entry),
      evElecCost: calculateEvElecCost(entry),
    };
  });

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
      categories,
      title: {
        text: 'Month',
      },
      labels: {
        rotation: -45,
        style: {
          fontSize: '12px',
        },
      },
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
      stackLabels: {
        enabled: true,
        formatter: function () {
          return `$${this.total.toFixed(0)}`;
        },
        style: {
          fontWeight: 'bold',
          color: '#374151',
          fontSize: '11px',
        },
      },
    },
    tooltip: {
      useHTML: true,
      shared: true,
      formatter: function () {
        const electricPoint = this.points.find(
          (p) => p.series.name === 'Electric Savings'
        );
        const solarEvPoint = this.points.find(
          (p) => p.series.name === 'Solar→EV Charging'
        );
        const additionalEvPoint = this.points.find(
          (p) => p.series.name === 'Additional EV Savings'
        );
        const electric = electricPoint ? electricPoint.y : 0;
        const solarEv = solarEvPoint ? solarEvPoint.y : 0;
        const additionalEv = additionalEvPoint ? additionalEvPoint.y : 0;
        const solarTotal = electric + solarEv;
        const total = electric + solarEv + additionalEv;
        const price = electricPoint?.point?.price || 0;
        const bill = electricPoint?.point?.bill || 0;

        let html = `
          <div class="p-2">
            <table class="table-auto w-full">
              <thead>
                <tr>
                  <td class="font-semibold text-gray-700 text-center" colspan="2">${this.x}</td>
                </tr>
              </thead>
              <tbody class="text-left mt-2">`;
        if (price) {
          html += `
                <tr>
                  <th class="font-semibold text-gray-700">Cost without Solar</th>
                  <td class="pl-4">$${price.toFixed(2)}</td>
                </tr>
                <tr>
                  <th class="font-semibold text-gray-700">Cost with Solar</th>
                  <td class="pl-4">$${bill.toFixed(2)}</td>
                </tr>`;
        }
        html += `
                <tr>
                  <th class="font-semibold text-gray-700">Electric Savings</th>
                  <td class="pl-4" style="color:#72BB63">$${electric.toFixed(2)}</td>
                </tr>`;
        if (solarEv > 0) {
          html += `
                <tr>
                  <th class="font-semibold text-gray-700">Solar→EV Charging</th>
                  <td class="pl-4" style="color:#D97706">$${solarEv.toFixed(2)}</td>
                </tr>`;
        }
        html += `
                <tr class="border-t border-gray-100">
                  <th class="font-semibold text-gray-700">Solar Subtotal</th>
                  <td class="pl-4 font-semibold" style="color:#72BB63">$${solarTotal.toFixed(2)}</td>
                </tr>`;
        const evElecCost = additionalEvPoint?.point?.evElecCost || 0;
        if (additionalEv !== 0 || evElecCost > 0) {
          html += `
                <tr>
                  <th class="font-semibold text-gray-700">Additional EV Savings</th>
                  <td class="pl-4 text-blue-600">$${additionalEv.toFixed(2)}</td>
                </tr>`;
          if (evElecCost > 0) {
            html += `
                <tr>
                  <th class="font-semibold text-gray-500 text-xs">  (incl. -$${evElecCost.toFixed(2)} home charging)</th>
                  <td></td>
                </tr>`;
          }
        }
        html += `
                <tr class="border-t border-gray-200">
                  <th class="font-semibold text-gray-700">Total Saved</th>
                  <td class="pl-4 text-green-600 font-semibold">$${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
        return html;
      },
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        borderWidth: 0,
        dataLabels: {
          enabled: false,
        },
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
        data: solarEvCreditData,
        color: '#FBBF24',
      },
      {
        name: 'Electric Savings',
        data: electricSavingsData,
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

export default MonthlySavingsChart;
