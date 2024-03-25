import React from 'react';

function SectionBody({ children }) {
  return (
    <div className="mt-6 overflow-hidden border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}

export default SectionBody;
