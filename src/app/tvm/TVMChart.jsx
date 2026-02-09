import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function TVMChart({ scenarioA, scenarioB }) {
  const options = {
    chart: {
      type: 'spline',
    },
    title: {
      text: 'Brokerage Only vs. Solar + Reinvest Savings',
      align: 'left',
    },
    xAxis: {
      title: { text: 'Years' },
      tickInterval: 5,
      min: 0,
      max: 25,
    },
    yAxis: {
      title: { text: 'After-Tax Value (USD)' },
      labels: {
        formatter: function () {
          return '$' + this.value.toLocaleString();
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        const year = this.x;
        let brokerageVal = 0;
        let solarVal = 0;

        this.points.forEach((point) => {
          if (point.series.name === 'Brokerage Only') {
            brokerageVal = point.y;
          }
          if (point.series.name === 'Solar + Reinvest') {
            solarVal = point.y;
          }
        });

        const diff = Math.abs(brokerageVal - solarVal);
        const winner = brokerageVal > solarVal ? 'Brokerage Only' : 'Solar + Reinvest';
        const winnerColor = brokerageVal > solarVal ? '#FF5201' : '#72BB63';

        return `
          <div style="padding: 8px; font-family: sans-serif;">
            <div style="font-weight: 600; color: #374151; text-align: center; margin-bottom: 8px;">Year ${year}</div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-weight: 600; color: #FF5201; padding: 2px 8px 2px 0;">Brokerage Only</td>
                <td style="text-align: right; padding: 2px 0;">$${Math.round(brokerageVal).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #72BB63; padding: 2px 8px 2px 0;">Solar + Reinvest</td>
                <td style="text-align: right; padding: 2px 0;">$${Math.round(solarVal).toLocaleString()}</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="font-weight: 600; color: ${winnerColor}; padding: 4px 8px 2px 0;">${winner} leads</td>
                <td style="text-align: right; font-weight: 600; padding: 4px 0 2px 0;">+$${Math.round(diff).toLocaleString()}</td>
              </tr>
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
    series: [
      {
        name: 'Brokerage Only',
        data: scenarioA.map((d) => [d.year, d.afterTax]),
        color: '#FF5201',
      },
      {
        name: 'Solar + Reinvest',
        data: scenarioB.map((d) => [d.year, d.afterTax]),
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

export default TVMChart;
