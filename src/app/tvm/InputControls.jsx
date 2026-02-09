import React from 'react';

function SliderInput({ label, value, onChange, min, max, step, format }) {
  return (
    <div className="flex-auto px-6 py-4">
      <label className="text-sm font-semibold leading-6 text-gray-500">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-base font-semibold leading-6 text-gray-900 min-w-[4rem] text-right">
          {format(value)}
        </span>
      </div>
    </div>
  );
}

function InputControls({ annualReturn, setAnnualReturn, capGainsTax, setCapGainsTax, energyInflation, setEnergyInflation }) {
  const pctFormat = (v) => `${v.toFixed(2)}%`;

  return (
    <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
      <div className="flex flex-wrap">
        <SliderInput
          label="Annual Market Return"
          value={annualReturn}
          onChange={setAnnualReturn}
          min={0}
          max={15}
          step={0.25}
          format={pctFormat}
        />
        <SliderInput
          label="Capital Gains Tax Rate"
          value={capGainsTax}
          onChange={setCapGainsTax}
          min={0}
          max={40}
          step={0.25}
          format={pctFormat}
        />
        <SliderInput
          label="Energy Inflation Rate"
          value={energyInflation}
          onChange={setEnergyInflation}
          min={0}
          max={10}
          step={0.25}
          format={pctFormat}
        />
      </div>
    </div>
  );
}

export default InputControls;
