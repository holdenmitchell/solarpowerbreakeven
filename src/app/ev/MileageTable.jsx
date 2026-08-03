import React from 'react';

const money = (n) => `$${Math.round(n).toLocaleString()}`;

const signed = (n) => {
  const rounded = Math.round(n);
  if (rounded === 0) return '$0';
  return `${rounded > 0 ? '+' : '−'}$${Math.abs(rounded).toLocaleString()}`;
};

const th =
  'whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900';
const td = 'whitespace-nowrap px-2 py-2 text-sm text-gray-500';

function MileageTable({ ev9, comparison, data }) {
  const { rows, crossover } = data;

  // The first sampled row at or past the crossover point gets the marker.
  const crossoverRowMiles =
    crossover === null
      ? null
      : rows.find((row) => row.miles >= crossover)?.miles ?? null;

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 mb-4 align-middle sm:px-2 lg:px-4 border rounded">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className={`${th} pl-4 sm:pl-2`}>
                  Miles
                </th>
                <th scope="col" className={th}>
                  Years
                </th>
                <th scope="col" className={th}>
                  {ev9.shortName} Operating
                </th>
                <th scope="col" className={th}>
                  {comparison.shortName} Operating
                </th>
                <th scope="col" className={th}>
                  Operating Diff
                </th>
                <th scope="col" className={th}>
                  {ev9.shortName} Total
                </th>
                <th scope="col" className={th}>
                  {comparison.shortName} Total
                </th>
                <th scope="col" className={th}>
                  Total Diff
                </th>
                <th scope="col" className={th}>
                  Services Due
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rows.map((row) => {
                const isCrossover = row.miles === crossoverRowMiles;
                return (
                  <tr
                    key={row.miles}
                    className={
                      isCrossover
                        ? 'bg-green-50 ring-1 ring-inset ring-green-200'
                        : row.isMeasured
                          ? 'bg-blue-50/40'
                          : undefined
                    }
                  >
                    <td
                      className={`${td} pl-4 font-medium text-gray-900 sm:pl-2`}
                    >
                      {row.miles.toLocaleString()}
                      {row.isMeasured && (
                        <span className="ml-1.5 text-xs font-normal text-blue-500">
                          actual
                        </span>
                      )}
                      {isCrossover && (
                        <span className="ml-1.5 text-xs font-semibold text-green-700">
                          breakeven
                        </span>
                      )}
                    </td>
                    <td className={td}>{row.years.toFixed(1)}</td>
                    <td className={td}>{money(row.ev9Op)}</td>
                    <td className={td}>{money(row.compOp)}</td>
                    <td
                      className={`${td} font-medium ${
                        row.opDiff > 0 ? 'text-green-700' : 'text-gray-500'
                      }`}
                    >
                      {signed(row.opDiff)}
                    </td>
                    <td className={td}>{money(row.ev9Total)}</td>
                    <td className={td}>{money(row.compTotal)}</td>
                    <td
                      className={`${td} font-medium ${
                        row.totalDiff > 0 ? 'text-green-700' : 'text-gray-500'
                      }`}
                    >
                      {signed(row.totalDiff)}
                    </td>
                    <td className="px-2 py-2 text-xs text-gray-500">
                      {row.compServices.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">
                            {comparison.shortName}:
                          </span>{' '}
                          {row.compServices.join(', ')}
                        </div>
                      )}
                      {row.ev9Services.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-700">
                            {ev9.shortName}:
                          </span>{' '}
                          {row.ev9Services.join(', ')}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-blue-50 ring-1 ring-blue-200" />
          Measured from actual bills and odometer readings
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-green-50 ring-1 ring-green-200" />
          Breakeven — where the {ev9.shortName} moves ahead for good
        </span>
        <span>
          Operating = fuel/energy + scheduled maintenance. Total adds the
          purchase price.
        </span>
      </div>
    </div>
  );
}

export default MileageTable;
