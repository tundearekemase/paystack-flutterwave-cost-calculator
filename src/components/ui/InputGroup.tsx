import React from 'react';

export function InputGroup({ 
  label, 
  value, 
  onChange, 
  type = "number", 
  step = "1", 
  prefix = "", 
  suffix = "",
  disabled = false
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  type?: string; 
  step?: string; 
  prefix?: string; 
  suffix?: string; 
  disabled?: boolean;
}) {
  return (
    <div className={`flex flex-col space-y-1.5 min-w-0 ${disabled ? 'opacity-60' : ''}`}>
      <label className="text-sm font-medium text-gray-700 truncate">{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-gray-500 text-sm font-medium">{prefix}</span>}
        <input
          type={type}
          step={step}
          disabled={disabled}
          value={value === 0 ? '' : value}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') {
              onChange(0);
            } else {
              onChange(parseFloat(val));
            }
          }}
          className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && <span className="absolute right-3 text-gray-500 text-sm font-medium">{suffix}</span>}
      </div>
    </div>
  );
}
