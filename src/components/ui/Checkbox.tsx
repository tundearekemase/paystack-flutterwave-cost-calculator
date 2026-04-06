import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

export function Checkbox({ label, checked, onChange, tooltip }: { label: string, checked: boolean, onChange: (val: boolean) => void, tooltip?: string }) {
  return (
    <div className="flex flex-col mb-1 mt-1">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onChange(!checked)}
      >
        {checked ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      {tooltip && <p className="text-xs text-gray-500 mt-1 ml-7">{tooltip}</p>}
    </div>
  );
}
