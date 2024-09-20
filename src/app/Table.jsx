import React from 'react';
import { preSolar, postSolar } from './data';

function Table() {
  const parseDate = (dateString) => new Date(dateString).getTime();
  // Function to sort the data by date (start field)
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
                    Saved
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <>
                  {sortByDate(postSolar).map((transaction) => (
                    <tr key={`${transaction.date}`}>
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
                    </tr>
                  ))}
                  <tr className="border-t border-b border-gray-200">
                    <th
                      colSpan={6}
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
