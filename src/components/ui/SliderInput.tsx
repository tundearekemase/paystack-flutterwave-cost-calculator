import React from 'react';

export function SliderInput({ 
  label, 
  value, 
  onChange, 
  min = 0,
  max = 100,
  step = 1,
  disabled = false
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  return (
    <div className={`flex flex-col space-y-2 mb-4 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-center text-sm">
        <label className="text-gray-700 font-medium">{label}</label>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value === 0 ? '' : value}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') {
              onChange(0);
            } else {
              onChange(parseFloat(val));
            }
          }}
          className="w-20 px-2 py-1 text-right text-sm border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 hide-arrows font-mono transition-shadow shadow-sm"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}
