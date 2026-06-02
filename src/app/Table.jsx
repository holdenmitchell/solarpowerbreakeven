import React from 'react';
import { preSolar, postSolar } from './data';
import { calculateEvElecCost, calculateSolarEvCredit } from './utils';

function Table() {
  const parseDate = (dateString) => new Date(dateString).getTime();
  const sortByDate = (data) => {
    return data.sort((a, b) => parseDate(b.start) - parseDate(a.start));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 mb-4 align-middle sm:px-2 lg:px-4 border rounded">
            <table className="min-w-full divide-y divide-gray-300 ">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-2"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Total Usage (kWh)
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Days
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Cost without Solar (USD)
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Electric Savings
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Solar→EV Charging
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Additional EV Savings
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Total Saved
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <>
                  {(() => {
                    const sorted = sortByDate(postSolar);
                    return sorted.map((transaction, idx) => {
                      const next = sorted[idx + 1];
                      const showEvRow =
                        transaction.gasSaved && (!next || !next.gasSaved);
                      return (
                    <React.Fragment key={`${transaction.year}-${transaction.month}`}>
                    <tr>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        {transaction.end}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        {transaction.usage}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        {transaction.days}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        ${transaction.price}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        $
                        {Math.round(
                          100 *
                            (parseFloat(transaction.price) -
                              parseFloat(transaction.bill))
                        ) / 100}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        {transaction.gasSaved
                          ? (() => {
                              const credit = calculateSolarEvCredit(transaction);
                              const miles = transaction.evMiles || 0;
                              const sc = parseFloat(transaction.supercharging || 0);
                              const totalEvKwh = miles / 2.7;
                              const homeKwh = Math.max(0, totalEvKwh - sc / 0.40);
                              const netEnergy = (transaction.usage || 0) - (transaction.production_dlvd || 0);
                              const chargeableKwh = Math.min(homeKwh, Math.max(0, netEnergy));
                              const freeSolarKwh = homeKwh - chargeableKwh;
                              if (credit === 0) return '$-';
                              return (
                                <span className="relative group cursor-help">
                                  <span className="underline decoration-dotted" style={{ color: '#D97706' }}>
                                    ${credit.toFixed(2)}
                                  </span>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-50">
                                    <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200 p-3 w-64 text-xs">
                                      <div className="font-semibold text-gray-900 border-b border-gray-100 pb-1.5 mb-1.5">
                                        Solar→EV Credit Breakdown
                                      </div>
                                      <div className="space-y-1 text-gray-600">
                                        <div className="flex justify-between">
                                          <span>EV kWh from excess solar</span>
                                          <span className="font-medium text-gray-900">{freeSolarKwh.toFixed(0)} kWh</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Total EV kWh</span>
                                          <span className="font-medium text-gray-900">{totalEvKwh.toFixed(0)} kWh</span>
                                        </div>
                                        <div className="border-t border-gray-100 pt-1.5 mt-1.5 flex justify-between font-semibold">
                                          <span className="text-gray-900">Gas-equiv. value</span>
                                          <span style={{ color: '#D97706' }}>${credit.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </span>
                              );
                            })()
                          : '$-'}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        {transaction.gasSaved
                          ? (() => {
                              const evElec = calculateEvElecCost(transaction);
                              const credit = calculateSolarEvCredit(transaction);
                              const additional = parseFloat(transaction.gasSaved) - evElec - credit;
                              const miles = transaction.evMiles || 0;
                              const gallons = (miles / 22).toFixed(1);
                              const gasAvoided = parseFloat(transaction.gasSaved) + parseFloat(transaction.supercharging || 0);
                              const sc = parseFloat(transaction.supercharging || 0);
                              const homeKwh = Math.max(0, miles / 2.7 - sc / 0.40).toFixed(0);
                              const netEnergy = (transaction.usage || 0) - (transaction.production_dlvd || 0);
                              const chargeableKwh = Math.min(parseFloat(homeKwh), Math.max(0, netEnergy));
                              return (
                                <span className="relative group cursor-help">
                                  <span className="text-blue-600 underline decoration-dotted">
                                    ${additional.toFixed(2)}
                                  </span>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-50">
                                    <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200 p-3 w-64 text-xs">
                                      <div className="font-semibold text-gray-900 border-b border-gray-100 pb-1.5 mb-1.5">
                                        Additional EV Savings Breakdown
                                      </div>
                                      <div className="space-y-1 text-gray-600">
                                        <div className="flex justify-between">
                                          <span>Miles driven</span>
                                          <span className="font-medium text-gray-900">{miles.toFixed(0)} mi</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Gallons avoided</span>
                                          <span className="font-medium text-gray-900">{gallons} gal</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Gas cost avoided</span>
                                          <span className="font-medium text-green-600">${gasAvoided.toFixed(2)}</span>
                                        </div>
                                        {sc > 0 && (
                                          <div className="flex justify-between">
                                            <span>Supercharging</span>
                                            <span className="font-medium text-red-500">-${sc.toFixed(2)}</span>
                                          </div>
                                        )}
                                        <div className="border-t border-gray-100 pt-1.5 mt-1.5">
                                          <div className="flex justify-between">
                                            <span>Home charging</span>
                                            <span className="font-medium text-gray-900">{homeKwh} kWh</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Chargeable to grid</span>
                                            <span className="font-medium text-gray-900">{chargeableKwh} kWh</span>
                                          </div>
                                          {evElec > 0 && (
                                            <div className="flex justify-between">
                                              <span>EV electricity cost</span>
                                              <span className="font-medium text-red-500">-${evElec.toFixed(2)}</span>
                                            </div>
                                          )}
                                          {credit > 0 && (
                                            <div className="flex justify-between">
                                              <span>Reattributed to solar</span>
                                              <span className="font-medium" style={{ color: '#D97706' }}>-${credit.toFixed(2)}</span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="border-t border-gray-100 pt-1.5 mt-1.5 flex justify-between font-semibold">
                                          <span className="text-gray-900">Additional EV savings</span>
                                          <span className="text-blue-600">${additional.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </span>
                              );
                            })()
                          : '$-'}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-2">
                        ${(
                          (parseFloat(transaction.price) - parseFloat(transaction.bill)) +
                          (parseFloat(transaction.gasSaved || 0) - calculateEvElecCost(transaction))
                        ).toFixed(2)}
                      </td>
                    </tr>
                    {showEvRow && (
                      <tr className="border-t border-b border-gray-200">
                        <th
                          colSpan={8}
                          scope="colgroup"
                          className="mx-auto bg-blue-50 py-3 pl-4 pr-3 text-lg text-left font-semibold text-gray-900 sm:pl-3"
                        >
                          <div className="flex justify-center">
                            🚗 ⚡ EV Purchased September 2025 ⚡ 🚗
                          </div>
                        </th>
                      </tr>
                    )}
                    </React.Fragment>
                      );
                    });
                  })()}
                  <tr className="border-t border-b border-gray-200">
                    <th
                      colSpan={8}
                      scope="colgroup"
                      className="mx-auto bg-gray-100 py-3 pl-4 pr-3 text-lg text-left font-semibold text-gray-900 sm:pl-3"
                    >
                      <div className="flex justify-center">
                        ☀️ 🏡 Solar Power Installed August 2023 🏡 ☀️
                      </div>
                    </th>
                  </tr>
                  {preSolar.map((transaction) => (
                    <tr key={`${transaction.date}`}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        {transaction.date}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        {transaction.usage}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        {transaction.days}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        ${transaction.price}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        $-
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        $-
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        $-
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-2">
                        $-
                      </td>
                    </tr>
                  ))}
                </>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
