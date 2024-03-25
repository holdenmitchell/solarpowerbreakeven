import React from 'react'
import { CalendarDaysIcon, BoltIcon, CurrencyDollarIcon, BanknotesIcon, TagIcon } from '@heroicons/react/20/solid'

function Details({ fullCostOfSystem, actualCost, totalCredits, purchaseDate }) {
  return (
    <div className="lg:col-start-3 lg:row-end-1 mt-8 mb-4">
      <h2 className="sr-only">System Details</h2>

      <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5 border-light">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 py-6">
            <dt className="text-sm font-semibold leading-6 text-gray-400">
              <BoltIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
              Size
            </dt>
            <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
              8.8 kWh
            </dd>
          </div>
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-400">
              <CurrencyDollarIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
              Net Price
            </dt>
            <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
              ${actualCost.toLocaleString()}
            </dd>
          </div>
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-400">
              <TagIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
              Full Price
            </dt>
            <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
              ${fullCostOfSystem.toLocaleString()}
            </dd>
          </div>
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-400">
              <BanknotesIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
              Credits
            </dt>
            <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
              ${totalCredits.toLocaleString()}
            </dd>
          </div>

          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-400">
              <CalendarDaysIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
              Operational
            </dt>
            <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
              <time dateTime="2023-8-8">Aug. 8th, 2023</time>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default Details