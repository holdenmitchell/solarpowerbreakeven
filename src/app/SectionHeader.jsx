import React from 'react'

function SectionHeader({text}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-6 text-gray-900 lg:mx-0 lg:max-w-none border-b pb-4">
        {text}
      </h2>
    </div>
  );
}

export default SectionHeader