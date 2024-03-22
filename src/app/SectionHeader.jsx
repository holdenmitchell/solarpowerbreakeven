import React from 'react'

function SectionHeader({text}) {
  return (
    <h2 className="mx-auto max-w-2xl text-base font-semibold leading-6 text-gray-900 lg:mx-0 lg:max-w-none">
      {text}
    </h2>
  );
}

export default SectionHeader