import React from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function StatCard({stat, statIdx}) {
  return (
    <div
      className={classNames(
        statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
        'flex items-baseline flex-wrap justify-between gap-y-2 gap-x-4 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8'
      )}
    >
      <dt className="text-sm font-medium leading-6 text-gray-500">
        {stat.name}
      </dt>
      <dd
        className={classNames(
          stat.changeType === 'negative' ? 'text-gray-600' : 'text-green-700',
          'text-xs font-medium'
        )}
      >
        {stat.displayChange && stat.changeType === 'positive' && '-'}
        {stat.change}
      </dd>
      <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
        {stat.value}
      </dd>
    </div>
  );
}

export default StatCard