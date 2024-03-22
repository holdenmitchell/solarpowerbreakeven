import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  calculateAverageDailyCost,
  getDatesArray,
  calculateReturn,
} from './utils';
import { concat } from 'lodash';

function PayoffChart({
  actualCost,
  costPerDayStart,
  energyInflation,
  purchaseDate,
}) {
  const currentDate = new Date();
  const endDate = new Date('2048-08-08');
  const dateRange = getDatesArray(purchaseDate, endDate);

  const data = dateRange.map((date) => {
    const differenceInMilliseconds = date - purchaseDate;
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );
    const averageCost = calculateAverageDailyCost(
      differenceInDays,
      costPerDayStart,
      energyInflation
    );

    return {
      x: date.getTime(),
      y: Math.round(differenceInDays * averageCost),
    };
  });

  const startToNow = data.filter((d) => d.x <= currentDate.getTime());
  const nowToEnd = data.filter((d) => d.x >= currentDate.getTime());

  const options = {
    chart: {
      zoomType: 'x',
    },
    title: {
      text: '',
      align: 'left',
    },
    subtitle: {
      text: '',
      align: 'left',
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%b %Y',
      },
    },
    yAxis: {
      title: {
        text: 'Quantity',
      },
      plotLines: [
        {
          dashStyle: 'dash',
          color: '#072232',
          width: 2,
          value: actualCost,
          label: {
            text: 'Break-even point',
            style: {
              color: '#606060',
            },
          },
        },
      ],
    },
    tooltip: {
      useHTML: true,
      formatter: function () {
        const point = this.point;
        const costOfSystem = -actualCost;
        const savedOnElectricity = point.y;
        const netSavings = savedOnElectricity + costOfSystem;
        const purchaseDate = new Date('2023-08-08').getTime();
        const currentDate = new Date(point.x);
        const timeDiff = currentDate - purchaseDate;
        const daysDiff = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to years
        const annualROI = calculateReturn(
          Math.abs(costOfSystem),
          savedOnElectricity,
          daysDiff
        );
        const yearsDiff = daysDiff / 365;
        const yrsSincePurchase = Math.floor(yearsDiff);
        const daysSincePurchase = Math.floor(daysDiff % 365);

        return `<table>
                        <tr><td class='text-lg'>${yrsSincePurchase} yrs ${daysSincePurchase} days Since Purchase</td></tr>
                        <tr><td>Cost of System:</td><td>$${costOfSystem.toLocaleString()}</td></tr>
                        <tr><td>Saved on Electricity:</td><td>$${savedOnElectricity.toLocaleString()}</td></tr>
                        <tr><td>Net:</td><td>$${netSavings.toLocaleString()}</td></tr>
                        <tr><td>Annual ROI:</td><td>${annualROI.toFixed(
                          2
                        )}%</td></tr>
                    </table>`;
      },
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0.5,
      },
    },
    series: [
      {
        name: 'Total Saved',
        data: startToNow.map((d) => [d.x, d.y]),
        color: '#072232',
        type: 'area',
      },
      {
        name: 'Projected Savings',
        data: concat(
          startToNow.map((d) => [null, null]),
          nowToEnd.map((d) => [d.x, d.y])
        ),
        color: '#FFD700',
        type: 'line',
      },
    ],
  };

  return (
    <div className="shadow-sm rounded-md border-gray-200 p-2 bg-white">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default PayoffChart;
