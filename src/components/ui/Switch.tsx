import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, disabled = false }: SwitchProps) {
  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {label && <span className="mr-3 text-sm font-semibold text-gray-700">{label}</span>}
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ease-in-out shadow-inner ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out flex items-center justify-center ${checked ? 'translate-x-4' : ''}`}>
        </div>
      </div>
    </label>
  );
}
