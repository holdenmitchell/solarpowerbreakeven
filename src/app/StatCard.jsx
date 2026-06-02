import React from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function StatCard({stat, statIdx}) {
  return (
    <div
      className={classNames(
        'flex items-baseline flex-wrap justify-between gap-y-1 gap-x-4 rounded-xl border border-gray-900/10 bg-white px-4 py-5 shadow-sm sm:px-6'
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
      <dd className="w-full flex-none text-2xl font-medium leading-8 tracking-tight text-gray-900">
        {stat.value}
      </dd>
    </div>
  );
}

export default StatCard