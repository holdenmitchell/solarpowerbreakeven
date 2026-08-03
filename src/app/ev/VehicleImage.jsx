'use client';

import React, { useState } from 'react';

/**
 * Vehicle photo with a graceful fallback.
 *
 * Uses a plain <img> rather than next/image: the files live in /public but
 * aren't committed, so the fallback has to handle a 404 at runtime.
 * Drop photos at the paths in vehicles.js to replace the placeholder.
 */
function VehicleImage({ vehicle }) {
  const [failed, setFailed] = useState(false);

  if (failed || !vehicle.image) {
    return (
      <div
        className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50"
        aria-label={`${vehicle.year} ${vehicle.name}`}
      >
        <div className="px-4 text-center">
          <div className="text-sm font-semibold text-gray-700">
            {vehicle.year} {vehicle.name}
          </div>
          <div className="mt-1 text-xs text-gray-400">{vehicle.trim}</div>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={vehicle.image}
      alt={`${vehicle.year} ${vehicle.name} ${vehicle.trim}`}
      className="h-40 w-full rounded-lg object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default VehicleImage;
