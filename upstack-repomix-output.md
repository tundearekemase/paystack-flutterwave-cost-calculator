This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/
  components/
    ui/
      Checkbox.tsx
      InputGroup.tsx
      SliderInput.tsx
      Switch.tsx
    CloudCalculator.tsx
    GlobalDashboard.tsx
    PaymentCalculator.tsx
    PayoutCalculator.tsx
    WhatsAppCalculator.tsx
  store/
    useGlobalStore.ts
  utils/
    constants.ts
    formatters.ts
  App.tsx
  index.css
  main.tsx
.env.example
.repomixignore
index.html
metadata.json
package.json
tsconfig.json
vite.config.ts
```

# Files

## File: src/components/ui/Switch.tsx
```typescript
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
```

## File: src/components/ui/Checkbox.tsx
```typescript
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
```

## File: src/components/ui/InputGroup.tsx
```typescript
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
```

## File: src/components/ui/SliderInput.tsx
```typescript
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
```

## File: src/components/PayoutCalculator.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { SliderInput } from './ui/SliderInput';
import { formatNum } from '../utils/formatters';
import { Switch } from './ui/Switch';

export default function PayoutCalculator({ onCostChange }: any) {
  const [enabled, setEnabled] = useState(true);
  const [gatewayProvider, setGatewayProvider] = useState<'paystack' | 'flutterwave'>('paystack');
  const [country, setCountry] = useState<'NG' | 'GH' | 'KE' | 'ZA' | 'INTL'>('NG');
  const [destination, setDestination] = useState<'bank' | 'mobile'>('bank');
  const [intlRegion, setIntlRegion] = useState<'USA' | 'UK' | 'SEPA'>('USA');
  
  const [transferAmount, setTransferAmount] = useState(50000);
  const [numberOfPayouts, setNumberOfPayouts] = useState(100);

  // Adjust default amounts when country changes
  useEffect(() => {
    if (country === 'NG') setTransferAmount(50000);
    else if (country === 'GH') setTransferAmount(1000);
    else if (country === 'KE') setTransferAmount(5000);
    else if (country === 'ZA') setTransferAmount(1000);
    else if (country === 'INTL') setTransferAmount(500);
  }, [country]);

  // calculations
  let fee = 0;
  let taxes = 0;
  let currencyStr = 'NGN';
  let isSupported = true;

  switch (country) {
    case 'NG':
      currencyStr = '₦';
      if (transferAmount <= 5000) fee = 10;
      else if (transferAmount <= 50000) fee = 25;
      else fee = 50;

      if (transferAmount >= 10000) taxes = 50;
      break;

    case 'GH':
      currencyStr = 'GH₵';
      if (gatewayProvider === 'paystack') {
        fee = destination === 'mobile' ? 1 : 8;
      } else {
        fee = destination === 'mobile' ? (transferAmount * 0.015) : 10;
      }
      break;

    case 'KE':
      currencyStr = 'KES';
      if (gatewayProvider === 'paystack') {
        if (transferAmount <= 1500) fee = 20;
        else if (transferAmount <= 20000) fee = 40;
        else fee = 60;
      } else {
        fee = 100;
      }
      break;

    case 'ZA':
      currencyStr = 'R';
      if (gatewayProvider === 'paystack') fee = 3;
      else fee = 10;
      break;

    case 'INTL':
      if (gatewayProvider === 'paystack') {
        isSupported = false;
      } else {
        if (intlRegion === 'USA') { fee = 40; currencyStr = '$'; }
        else if (intlRegion === 'UK') { fee = 35; currencyStr = '£'; }
        else { fee = 35; currencyStr = '€'; }
      }
      break;
  }

  const totalPerTransfer = fee + taxes;
  const totalMonthlyCost = totalPerTransfer * numberOfPayouts;
  const totalAmountSentMonthly = transferAmount * numberOfPayouts;
  const totalDeductedMonthly = totalAmountSentMonthly + totalMonthlyCost;

  React.useEffect(() => {
    if (onCostChange) onCostChange(enabled ? totalMonthlyCost : 0, country);
  }, [totalMonthlyCost, country, enabled, onCostChange]);

  let maxAmount = 1000000;
  let stepAmount = 100;
  if(country === 'INTL') { maxAmount = 10000; stepAmount = 10; }
  else if (country === 'ZA') { maxAmount = 50000; stepAmount = 50; }
  else if (country === 'GH') { maxAmount = 50000; stepAmount = 50; }
  else if (country === 'KE') { maxAmount = 300000; stepAmount = 100; }

  return (
    <div className={`bg-white rounded-2xl border ${enabled ? 'border-gray-200' : 'border-gray-100'} shadow-sm overflow-hidden flex flex-col min-h-0 transition-all duration-300`}>
      <div className={`p-5 border-b border-gray-100 flex items-center justify-between transition-colors duration-300 ${enabled ? 'bg-gray-50/50' : 'bg-gray-50/20'}`}>
        <h2 className={`text-lg font-bold tracking-tight flex items-center gap-2 transition-colors duration-300 ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>
          <Send className={`w-5 h-5 transition-colors duration-300 ${enabled ? 'text-indigo-600' : 'text-gray-400'}`} /> Transfers & Payouts
        </h2>
        <Switch checked={enabled} onChange={setEnabled} />
      </div>

      <div className={`flex flex-col grow transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
        <div className="p-5 space-y-6 flex-grow">
          <div className="flex rounded-lg bg-gray-100 p-1 w-full border border-gray-200/50 shadow-inner">
          <button 
            onClick={() => setGatewayProvider('paystack')} 
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${gatewayProvider === 'paystack' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Paystack
          </button>
          <button 
            onClick={() => setGatewayProvider('flutterwave')} 
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${gatewayProvider === 'flutterwave' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Flutterwave
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Region / Country</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'NG', label: 'Nigeria' },
                { id: 'GH', label: 'Ghana' },
                { id: 'KE', label: 'Kenya' },
                { id: 'ZA', label: 'South Africa' },
                { id: 'INTL', label: 'International' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setCountry(c.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${country === c.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {country === 'GH' && (
            <div className="flex rounded bg-gray-100 p-1 border border-gray-200 shadow-inner">
              <button onClick={() => setDestination('bank')} className={`flex-1 py-1 text-xs font-semibold rounded ${destination === 'bank' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Bank Account</button>
              <button onClick={() => setDestination('mobile')} className={`flex-1 py-1 text-xs font-semibold rounded ${destination === 'mobile' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Mobile Money</button>
            </div>
          )}

          {country === 'INTL' && (
             <div className="flex rounded bg-gray-100 p-1 border border-gray-200 shadow-inner">
               <button onClick={() => setIntlRegion('USA')} className={`flex-1 py-1 text-xs font-semibold rounded ${intlRegion === 'USA' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>USA (USD)</button>
               <button onClick={() => setIntlRegion('UK')} className={`flex-1 py-1 text-xs font-semibold rounded ${intlRegion === 'UK' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>UK (GBP)</button>
               <button onClick={() => setIntlRegion('SEPA')} className={`flex-1 py-1 text-xs font-semibold rounded ${intlRegion === 'SEPA' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>SEPA (EUR)</button>
             </div>
          )}

          <div className="pt-2 border-t border-gray-100 space-y-3">
             <SliderInput 
               label={`Amount per Payout`}
               disabled={false} 
               value={transferAmount} 
               onChange={setTransferAmount} 
               min={stepAmount} max={maxAmount} step={stepAmount}
             />
             <div className="text-right text-xs font-bold text-gray-800 -mt-2 mb-2">{currencyStr}{formatNum(transferAmount)}</div>
             
             <SliderInput 
               label="Monthly Payouts (Volume)" 
               disabled={false} 
               value={numberOfPayouts} 
               onChange={setNumberOfPayouts} 
               min={1} max={10000} step={1}
             />
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50/50 space-y-3 mt-auto">
        {!isSupported ? (
           <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium text-center shadow-sm">
             International transfers are not supported by Paystack currently. Switch to Flutterwave.
           </div>
        ) : (
           <div className="bg-white rounded-xl shadow-md shadow-gray-100 border border-gray-200 overflow-hidden">
             <div className="p-4 bg-white flex justify-between items-center border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">Monthly Fee Cost</h3>
                  <p className="text-xs text-gray-500">Fees + Taxes</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 tracking-tight">{currencyStr}{formatNum(totalMonthlyCost)}</p>
             </div>
             <div className="p-4 bg-gray-50/50 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Gateway Fee per Txn:</span><span className="font-semibold">{currencyStr}{formatNum(fee)}</span></div>
                {taxes > 0 && <div className="flex justify-between"><span className="text-gray-500">Stamp Duty / Taxes:</span><span className="font-semibold">{currencyStr}{formatNum(taxes)}</span></div>}
                <div className="flex justify-between text-gray-900 font-semibold"><span className="">Total Fee per Txn:</span><span className="">{currencyStr}{formatNum(totalPerTransfer)}</span></div>
                
                <div className="pt-2 mt-2 border-t border-gray-200">
                   <div className="flex justify-between text-indigo-700 font-bold text-xs">
                     <span>Gross Ded. from Balance:</span>
                     <span>{currencyStr}{formatNum(totalDeductedMonthly)}</span>
                   </div>
                </div>
             </div>
           </div>
        )}
      </div>
      </div>
    </div>
  );
}
```

## File: src/store/useGlobalStore.ts
```typescript
import { create } from 'zustand';

interface GlobalState {
  monthlyActiveUsers: number;
  transactionsPerUserMonthly: number;
  averageCartValue: number;
  whatsappMessagesPerTransaction: {
    freeReplies: number;
    utilityTemplates: number;
    marketingTemplates: number;
    authenticationTemplates: number;
  };
  databaseReadsWritesPerTransaction: {
    reads: number;
    writes: number;
  };
  networkEgressMBPerTransaction: number;
  
  // Actions
  setMonthlyActiveUsers: (val: number) => void;
  setTransactionsPerUserMonthly: (val: number) => void;
  setAverageCartValue: (val: number) => void;
  setNetworkEgressMB: (val: number) => void;
  setWhatsappMessages: (key: keyof GlobalState['whatsappMessagesPerTransaction'], val: number) => void;
  setDatabaseOperations: (key: keyof GlobalState['databaseReadsWritesPerTransaction'], val: number) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  monthlyActiveUsers: 1000,
  transactionsPerUserMonthly: 12,
  averageCartValue: 10000,
  whatsappMessagesPerTransaction: {
    freeReplies: 1,
    utilityTemplates: 2,
    marketingTemplates: 0,
    authenticationTemplates: 1,
  },
  databaseReadsWritesPerTransaction: {
    reads: 10,
    writes: 2,
  },
  networkEgressMBPerTransaction: 1.5,

  setMonthlyActiveUsers: (val) => set({ monthlyActiveUsers: val }),
  setTransactionsPerUserMonthly: (val) => set({ transactionsPerUserMonthly: val }),
  setAverageCartValue: (val) => set({ averageCartValue: val }),
  setNetworkEgressMB: (val) => set({ networkEgressMBPerTransaction: val }),
  setWhatsappMessages: (key, val) => 
    set((state) => ({
      whatsappMessagesPerTransaction: {
        ...state.whatsappMessagesPerTransaction,
        [key]: val,
      },
    })),
  setDatabaseOperations: (key, val) => 
    set((state) => ({
      databaseReadsWritesPerTransaction: {
        ...state.databaseReadsWritesPerTransaction,
        [key]: val,
      },
    })),
}));
```

## File: src/utils/constants.ts
```typescript
// GCP Constants
export const GCP = {
  CR_FREE_REQS: 2000000,
  CR_PRICE_PER_M_REQS: 0.40,
  CR_FREE_VCPU_SEC: 180000,
  CR_PRICE_VCPU_SEC: 0.000024,
  CR_FREE_MEM_SEC: 360000,
  CR_PRICE_MEM_SEC: 0.0000025,
  FREE_EGRESS_GIB: 1,
  PRICE_EGRESS_GIB: 0.12,
  CR_IDLE_PRICE_VCPU_SEC: 0.0000025,
  CR_IDLE_PRICE_MEM_SEC: 0.0000025
};

// ECS Fargate Constants (2026)
export const AWS = {
  FARGATE_VCPU_RATE: 0.04048,
  FARGATE_MEM_RATE: 0.004445,
  EGRESS_FREE_GB: 100,
  EGRESS_RATE: 0.08,
  NAT_GATEWAY_FLAT: 32.40,
  NAT_GATEWAY_DATA: 0.045,
  ECS_DEPLOY_TOTAL: 2.00,
  CLOUDWATCH_RATE: 0.50,
};

// Firestore Constants
export const FS = {
  PRICE_PER_100K_READS: 0.036,
  PRICE_PER_100K_WRITES: 0.108,
  PRICE_STORAGE_GIB: 0.15,
  ENT_PRICE_READS_MILLION: 0.05,
  ENT_PRICE_WRITES_MILLION: 0.26,
  ENT_PRICE_STORAGE_GIB: 0.15,
};

// WhatsApp Constants
export const WA_RATES: Record<string, { name: string, marketing: number, utility: number, authentication: number }> = {
  'NGA': { name: 'Nigeria', marketing: 0.0510, utility: 0.0250, authentication: 0.0300 },
  'GHA': { name: 'Ghana', marketing: 0.0460, utility: 0.0230, authentication: 0.0300 },
  'SEN': { name: 'Senegal', marketing: 0.0550, utility: 0.0280, authentication: 0.0300 },
  'CIV': { name: 'Ivory Coast', marketing: 0.0530, utility: 0.0270, authentication: 0.0300 },
  'OWA': { name: 'Other W.A.', marketing: 0.0550, utility: 0.0280, authentication: 0.0300 },
};
```

## File: src/utils/formatters.ts
```typescript
export const buildFormat = (val: number, currency: 'NGN' | 'USD') => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: currency === 'USD' && val > 0 && val < 0.01 ? 4 : 2,
  }).format(val);
};

export const formatNGNBase = (ngnAmount: number, currency: 'NGN' | 'USD', rate: number) => {
  const val = currency === 'USD' ? ngnAmount / rate : ngnAmount;
  return buildFormat(val, currency);
};

export const formatUSDBase = (usdAmount: number, currency: 'NGN' | 'USD', rate: number) => {
  const val = currency === 'NGN' ? usdAmount * rate : usdAmount;
  return buildFormat(val, currency);
};

export const formatNum = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};
```

## File: src/main.tsx
```typescript
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## File: .env.example
```
# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"
```

## File: metadata.json
```json
{
  "name": "Levytate Payment Calculator",
  "description": "A dynamic calculator comparing marketplace payment processing fees between Paystack and Flutterwave.",
  "requestFramePermissions": []
}
```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

## File: vite.config.ts
```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
```

## File: src/components/GlobalDashboard.tsx
```typescript
import React, { useState } from 'react';
import { Settings2, Database, MessageCircle, X } from 'lucide-react';
import { useGlobalStore } from '../store/useGlobalStore';

function CompactInput({ value, onChange }: any) {
  return (
    <input 
      type="number" 
      value={value === 0 ? '' : value} 
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-16 px-1 py-0.5 text-right font-medium text-gray-900 bg-transparent border-b border-dashed border-gray-400 focus:border-gray-900 focus:outline-none hover:border-gray-900 hide-arrows transition-colors"
    />
  );
}

function AdvancedMultipliers() {
  const globalStore = useGlobalStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        title="Advanced Traffic Multipliers"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Traffic Multipliers</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1 border-b pb-1">
                   <Database className="w-3 h-3" /> Cloud & Data
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600"><span className="text-gray-500">DB Reads</span><CompactInput value={globalStore.databaseReadsWritesPerTransaction.reads} onChange={(v: number) => globalStore.setDatabaseOperations('reads', v)} /></div>
                <div className="flex justify-between items-center text-xs text-gray-600"><span className="text-gray-500">DB Writes</span><CompactInput value={globalStore.databaseReadsWritesPerTransaction.writes} onChange={(v: number) => globalStore.setDatabaseOperations('writes', v)} /></div>
                <div className="flex justify-between items-center text-xs text-gray-600"><span className="text-gray-500">Egress MB</span><CompactInput value={globalStore.networkEgressMBPerTransaction} onChange={globalStore.setNetworkEgressMB} /></div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1 border-b pb-1">
                   <MessageCircle className="w-3 h-3" /> WhatsApp
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600"><span className="text-gray-500">Utility</span><CompactInput value={globalStore.whatsappMessagesPerTransaction.utilityTemplates} onChange={(v: number) => globalStore.setWhatsappMessages('utilityTemplates', v)} /></div>
                <div className="flex justify-between items-center text-xs text-gray-600"><span className="text-gray-500">Marketing</span><CompactInput value={globalStore.whatsappMessagesPerTransaction.marketingTemplates} onChange={(v: number) => globalStore.setWhatsappMessages('marketingTemplates', v)} /></div>
                <div className="flex justify-between items-center text-xs text-gray-600"><span className="text-gray-500">Auth</span><CompactInput value={globalStore.whatsappMessagesPerTransaction.authenticationTemplates} onChange={(v: number) => globalStore.setWhatsappMessages('authenticationTemplates', v)} /></div>
                <div className="flex justify-between items-center text-xs text-gray-600"><span className="text-gray-500">Free Replies</span><CompactInput value={globalStore.whatsappMessagesPerTransaction.freeReplies} onChange={(v: number) => globalStore.setWhatsappMessages('freeReplies', v)} /></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function GlobalDashboard({ children }: any) {
  const globalStore = useGlobalStore();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm overflow-visible flex items-center justify-between p-3 px-5 mb-6 col-span-full sticky top-[72px] z-20">
      <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-8">
        <h2 className="text-base font-bold text-gray-900 tracking-tight whitespace-nowrap">Global Assumptions</h2>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <span className="mr-2">Monthly Active Users:</span>
            <CompactInput value={globalStore.monthlyActiveUsers} onChange={globalStore.setMonthlyActiveUsers} />
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="mr-2">Txns per User/Month:</span>
            <CompactInput value={globalStore.transactionsPerUserMonthly} onChange={globalStore.setTransactionsPerUserMonthly} />
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="mr-2">Average Cart Value:</span>
            <CompactInput value={globalStore.averageCartValue} onChange={globalStore.setAverageCartValue} />
            <span className="ml-1 text-gray-400">₦</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {children}
        <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1"></div>
        <AdvancedMultipliers />
      </div>
    </div>
  );
}
```

## File: src/index.css
```css
@import "tailwindcss";

@theme {
  --color-secondary: #000;
}

@layer utilities {
  .hide-arrows::-webkit-outer-spin-button,
  .hide-arrows::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .hide-arrows {
    -moz-appearance: textfield;
  }
}
```

## File: index.html
```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Levytate</title>
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

</html>
```

## File: package.json
```json
{
  "name": "react-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "vite": "^6.2.0",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

## File: src/components/CloudCalculator.tsx
```typescript
import React, { useState } from 'react';
import { Settings2, Cloud, Database, AlertCircle, Zap, ToggleRight, ToggleLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalStore } from '../store/useGlobalStore';
import { SliderInput } from './ui/SliderInput';
import { InputGroup } from './ui/InputGroup';
import { Checkbox } from './ui/Checkbox';
import { formatNum } from '../utils/formatters';
import { GCP, AWS, FS } from '../utils/constants';
import { Switch } from './ui/Switch';

export default function CloudCalculator({ formatterUSD, onCostChange }: any) {
  const [enabled, setEnabled] = useState(true);
  const globalStore = useGlobalStore();
  const [useGlobal, setUseGlobal] = useState(true);

  const [showCloudAdvanced, setShowCloudAdvanced] = useState(false);
  const [computeProvider, setComputeProvider] = useState<'gcp' | 'aws'>('gcp');
  const [firestoreEdition, setFirestoreEdition] = useState<'standard' | 'enterprise'>('standard');
  const [awsRequireVpcNat, setAwsRequireVpcNat] = useState(false);
  const [awsAutomatedDeployments, setAwsAutomatedDeployments] = useState(false);

  // Local Overrides
  const [localUsers, setLocalUsers] = useState(1000);
  const [localRequestsPerUserMonth, setLocalRequestsPerUserMonth] = useState(144);
  const [localFirestoreReadsReq, setLocalFirestoreReadsReq] = useState(3);
  const [localFirestoreWritesReq, setLocalFirestoreWritesReq] = useState(1);

  const [inputs, setInputs] = useState({
    backendRequestTimeMs: 300,
    
    // GCP
    cloudRunVcpu: 1,
    cloudRunMemGib: 0.5,
    cloudRunConcurrency: 80,
    minInstances: 0,

    // AWS ECS Fargate
    ecsFargateVcpu: 1,
    ecsFargateMemGb: 2,
    ecsTaskConcurrencyLimit: 100,
    ecsMinTasks: 1,
    awsCloudWatchLogsGb: 10,
    
    // Firestore
    firestoreStorageMb: 1,
    firestoreStandardFreeReadsMo: 1500000,
    firestoreStandardFreeWritesMo: 600000,
    firestoreStandardFreeStorageGib: 1,
    firestoreEnterpriseFreeReadsMillion: 0,
    firestoreEnterpriseFreeWritesMillion: 0,
    firestoreEnterpriseFreeStorageGib: 0,
  });

  const updateInput = (key: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value || 0 }));
  };

  const users = useGlobal ? globalStore.monthlyActiveUsers : localUsers;
  // Compute global requests based on reads+writes per transaction
  const globalReqsPerUser = globalStore.transactionsPerUserMonthly * (globalStore.databaseReadsWritesPerTransaction.reads + globalStore.databaseReadsWritesPerTransaction.writes);
  const requestsPerUserMonth = useGlobal ? globalReqsPerUser : localRequestsPerUserMonth;
  const firestoreReadsReq = useGlobal ? globalStore.databaseReadsWritesPerTransaction.reads : localFirestoreReadsReq;
  const firestoreWritesReq = useGlobal ? globalStore.databaseReadsWritesPerTransaction.writes : localFirestoreWritesReq;
  const totalMonthlyTxns = users * globalStore.transactionsPerUserMonthly;

  // --- TRAFFIC ---
  const totalMonthlyUsers = users;
  const totalMonthlyBackendReqs = totalMonthlyUsers * requestsPerUserMonth;
  const t_sec = inputs.backendRequestTimeMs / 1000;
  // Network Egress based on global MB setting per transaction
  const total_egress_gib = (totalMonthlyTxns * globalStore.networkEgressMBPerTransaction) / 1024;

  // --- GCP CLOUD RUN ---
  const cr_billable_reqs = Math.max(0, totalMonthlyBackendReqs - GCP.CR_FREE_REQS);
  const cr_req_cost = (cr_billable_reqs / 1000000) * GCP.CR_PRICE_PER_M_REQS;

  const cr_total_compute_sec = (totalMonthlyBackendReqs * t_sec) / (inputs.cloudRunConcurrency || 1);

  const cr_billable_vcpu_sec = Math.max(0, (cr_total_compute_sec * inputs.cloudRunVcpu) - GCP.CR_FREE_VCPU_SEC);
  const cr_vcpu_cost = cr_billable_vcpu_sec * GCP.CR_PRICE_VCPU_SEC;

  const cr_billable_mem_sec = Math.max(0, (cr_total_compute_sec * inputs.cloudRunMemGib) - GCP.CR_FREE_MEM_SEC);
  const cr_mem_cost = cr_billable_mem_sec * GCP.CR_PRICE_MEM_SEC;

  const cr_billable_egress = Math.max(0, total_egress_gib - GCP.FREE_EGRESS_GIB);
  const cr_egress_cost = cr_billable_egress * GCP.PRICE_EGRESS_GIB;

  const SECONDS_PER_MONTH = 2592000;
  const cr_idle_vcpu_cost = inputs.minInstances * inputs.cloudRunVcpu * SECONDS_PER_MONTH * GCP.CR_IDLE_PRICE_VCPU_SEC;
  const cr_idle_mem_cost = inputs.minInstances * inputs.cloudRunMemGib * SECONDS_PER_MONTH * GCP.CR_IDLE_PRICE_MEM_SEC;
  const cr_idle_cost = cr_idle_vcpu_cost + cr_idle_mem_cost;

  const total_gcp_compute_cost = cr_req_cost + cr_vcpu_cost + cr_mem_cost + cr_egress_cost + cr_idle_cost;

  // --- AWS ECS FARGATE ---
  const ecsActiveInstanceRate = (inputs.ecsFargateVcpu * AWS.FARGATE_VCPU_RATE) + (inputs.ecsFargateMemGb * AWS.FARGATE_MEM_RATE);
  
  const totalFargateComputeHoursRequired = (totalMonthlyBackendReqs * t_sec) / 3600;
  const ecsTaskConcurrency = inputs.ecsTaskConcurrencyLimit || 1;
  const totalTaskHoursNeeded = totalFargateComputeHoursRequired / ecsTaskConcurrency;
  
  const expectedTaskHours = Math.max(inputs.ecsMinTasks * 720, totalTaskHoursNeeded);
  const awsComputeCost = expectedTaskHours * ecsActiveInstanceRate;
  
  const awsBaselineCost = Math.min(awsComputeCost, inputs.ecsMinTasks * 720 * ecsActiveInstanceRate);
  const awsPeakCost = awsComputeCost - awsBaselineCost;

  const awsBillableEgress = Math.max(0, total_egress_gib - AWS.EGRESS_FREE_GB);
  const awsEgressCost = awsBillableEgress * AWS.EGRESS_RATE;
  
  const awsVpcCost = awsRequireVpcNat ? (AWS.NAT_GATEWAY_FLAT + (total_egress_gib * AWS.NAT_GATEWAY_DATA)) : 0;
  const awsDeployCost = awsAutomatedDeployments ? AWS.ECS_DEPLOY_TOTAL : 0;
  const awsLoggingCost = inputs.awsCloudWatchLogsGb * AWS.CLOUDWATCH_RATE;

  const total_aws_compute_cost = awsComputeCost + awsEgressCost + awsVpcCost + awsDeployCost + awsLoggingCost;
  const compute_subtotal_usd = computeProvider === 'gcp' ? total_gcp_compute_cost : total_aws_compute_cost;

  // --- FIRESTORE ---
  const total_reads = totalMonthlyBackendReqs * firestoreReadsReq;
  const total_writes = totalMonthlyBackendReqs * firestoreWritesReq;
  const total_storage_gib = (totalMonthlyUsers * inputs.firestoreStorageMb) / 1024;

  let fs_reads_cost = 0;
  let fs_writes_cost = 0;
  let fs_storage_cost = 0;

  if (firestoreEdition === 'standard') {
    const fs_billable_reads = Math.max(0, total_reads - inputs.firestoreStandardFreeReadsMo);
    fs_reads_cost = (fs_billable_reads / 100000) * FS.PRICE_PER_100K_READS;

    const fs_billable_writes = Math.max(0, total_writes - inputs.firestoreStandardFreeWritesMo);
    fs_writes_cost = (fs_billable_writes / 100000) * FS.PRICE_PER_100K_WRITES;

    const fs_billable_storage = Math.max(0, total_storage_gib - inputs.firestoreStandardFreeStorageGib);
    fs_storage_cost = fs_billable_storage * FS.PRICE_STORAGE_GIB;
  } else {
    const fs_billable_reads_mil = Math.max(0, (total_reads / 1000000) - inputs.firestoreEnterpriseFreeReadsMillion);
    fs_reads_cost = fs_billable_reads_mil * FS.ENT_PRICE_READS_MILLION;

    const fs_billable_writes_mil = Math.max(0, (total_writes / 1000000) - inputs.firestoreEnterpriseFreeWritesMillion);
    fs_writes_cost = fs_billable_writes_mil * FS.ENT_PRICE_WRITES_MILLION;

    const fs_billable_storage = Math.max(0, total_storage_gib - inputs.firestoreEnterpriseFreeStorageGib);
    fs_storage_cost = fs_billable_storage * FS.ENT_PRICE_STORAGE_GIB;
  }

  const total_firestore_cost_usd = fs_reads_cost + fs_writes_cost + fs_storage_cost;
  const total_backend_cost_usd = compute_subtotal_usd + total_firestore_cost_usd;

  React.useEffect(() => {
    if (onCostChange) onCostChange(enabled ? total_backend_cost_usd : 0);
  }, [total_backend_cost_usd, enabled, onCostChange]);

  return (
    <div className={`bg-white rounded-2xl border ${enabled ? 'border-gray-200' : 'border-gray-100'} shadow-sm flex flex-col min-h-0 transition-all duration-300`}>
      {/* Header */}
      <div className={`p-5 border-b border-gray-100 flex items-center justify-between transition-colors duration-300 ${enabled ? 'bg-gray-50/50' : 'bg-gray-50/20'}`}>
        <h2 className={`text-lg font-bold tracking-tight transition-colors duration-300 ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>Backend Infrastructure</h2>
        <Switch checked={enabled} onChange={setEnabled} />
      </div>

      <div className={`flex flex-col grow transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
        <div className="p-5 space-y-6 flex-grow">
          {/* Cloud Provider Selector */}
        <div className="flex rounded-lg bg-gray-100 p-1 w-full border border-gray-200/50 shadow-inner">
          <button 
            onClick={() => setComputeProvider('gcp')} 
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${computeProvider === 'gcp' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Google Cloud Run
          </button>
          <button 
            onClick={() => setComputeProvider('aws')} 
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${computeProvider === 'aws' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            AWS ECS Fargate
          </button>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center justify-between mt-6 mb-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            Traffic & Resources
          </h3>
          <button 
            onClick={() => setUseGlobal(!useGlobal)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <span>Use Global</span>
            {useGlobal ? <ToggleRight className="w-5 h-5 text-indigo-600" /> : <ToggleLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-1">
          <SliderInput 
            label="Active Customers/Mo" 
            disabled={useGlobal} 
            value={users} 
            onChange={useGlobal ? () => {} : setLocalUsers} 
            min={100} max={100000} step={100}
          />
          <SliderInput 
            label="Requests per User/Month" 
            disabled={useGlobal} 
            value={requestsPerUserMonth} 
            onChange={useGlobal ? () => {} : setLocalRequestsPerUserMonth} 
            min={1} max={1000} step={1}
          />

          <div className="pt-2 text-xs text-gray-700 font-medium">
            Total Monthly Requests: <span className="font-bold">{formatNum(totalMonthlyBackendReqs)}</span>
          </div>

          <div className="pt-2">
             <SliderInput 
                label="Avg Request Duration" 
                value={inputs.backendRequestTimeMs} 
                onChange={(v) => updateInput('backendRequestTimeMs', v)} 
                min={10} max={5000} step={10}
             />
          </div>
        </div>
      </div>

      {/* Advanced Gateway Settings */}
      <div className="border-y border-gray-100 bg-gray-50/50">
        <button onClick={() => setShowCloudAdvanced(!showCloudAdvanced)} className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
          <span className="flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5" /> Backend Options</span>
        </button>
        <AnimatePresence>
          {showCloudAdvanced && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 pt-1 space-y-4">
                 {computeProvider === 'gcp' ? (
                   <div className="space-y-3">
                     <h4 className="text-xs font-bold text-gray-800">Cloud Run Settings</h4>
                     <div className="grid grid-cols-2 gap-3">
                       <InputGroup label="vCPU alloc" value={inputs.cloudRunVcpu} onChange={(v) => updateInput('cloudRunVcpu', v)} step="0.1" />
                       <InputGroup label="Mem (GiB)" value={inputs.cloudRunMemGib} onChange={(v) => updateInput('cloudRunMemGib', v)} step="0.1" />
                       <InputGroup label="Avg Concurrency" value={inputs.cloudRunConcurrency} onChange={(v) => updateInput('cloudRunConcurrency', v)} />
                       <InputGroup label="Min Instances" value={inputs.minInstances} onChange={(v) => updateInput('minInstances', v)} />
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-3">
                     <h4 className="text-xs font-bold text-gray-800">AWS ECS Fargate Settings</h4>
                     <div className="grid grid-cols-2 gap-3">
                       <InputGroup label="vCPU alloc" value={inputs.ecsFargateVcpu} onChange={(v) => updateInput('ecsFargateVcpu', v)} step="0.25" />
                       <InputGroup label="Mem (GB)" value={inputs.ecsFargateMemGb} onChange={(v) => updateInput('ecsFargateMemGb', v)} step="1" />
                       <InputGroup label="Task Concurrency" value={inputs.ecsTaskConcurrencyLimit} onChange={(v) => updateInput('ecsTaskConcurrencyLimit', v)} />
                       <InputGroup label="Min Tasks" value={inputs.ecsMinTasks} onChange={(v) => updateInput('ecsMinTasks', v)} />
                     </div>
                     <Checkbox label="Require VPC & NAT" checked={awsRequireVpcNat} onChange={setAwsRequireVpcNat} />
                   </div>
                )}
                <div className="border-t border-gray-200 pt-3 space-y-3">
                   <h4 className="text-xs font-bold text-gray-800">Firestore Settings</h4>
                   <div className="flex rounded border border-gray-200 overflow-hidden text-xs">
                     <button onClick={() => setFirestoreEdition('standard')} className={`flex-1 py-1 ${firestoreEdition === 'standard' ? 'bg-gray-800 text-white' : 'bg-white'}`}>Standard</button>
                     <button onClick={() => setFirestoreEdition('enterprise')} className={`flex-1 py-1 ${firestoreEdition === 'enterprise' ? 'bg-gray-800 text-white' : 'bg-white'}`}>Enterprise</button>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <InputGroup label="Reads/Req" disabled={useGlobal} value={firestoreReadsReq} onChange={useGlobal ? () => {} : setLocalFirestoreReadsReq} step="1" />
                     <InputGroup label="Writes/Req" disabled={useGlobal} value={firestoreWritesReq} onChange={useGlobal ? () => {} : setLocalFirestoreWritesReq} step="1" />
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result Cards */}
      <div className="p-4 bg-gray-50/50 space-y-3">
        {computeProvider === 'gcp' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-3 bg-white flex justify-between items-center border-b border-gray-100">
               <div>
                 <p className="text-xs font-bold text-gray-900">Google Cloud Run</p>
                 <p className="text-[10px] text-gray-500">Monthly Compute Cost</p>
               </div>
               <p className="text-lg font-bold text-gray-900">{formatterUSD(total_gcp_compute_cost)}</p>
            </div>
            <div className="p-3 space-y-1 text-xs">
               <div className="flex justify-between"><span className="text-gray-500">Processing:</span><span className="font-semibold">{formatterUSD(cr_req_cost + cr_vcpu_cost + cr_mem_cost + cr_idle_cost)}</span></div>
               <div className="flex justify-between"><span className="text-gray-500">Networking:</span><span className="font-semibold">{formatterUSD(cr_egress_cost)}</span></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-3 bg-white flex justify-between items-center border-b border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-900">AWS ECS Fargate</p>
                  <p className="text-[10px] text-gray-500">Monthly Compute Cost</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatterUSD(total_aws_compute_cost)}</p>
             </div>
             <div className="p-3 space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Processing:</span><span className="font-semibold">{formatterUSD(awsComputeCost)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Networking:</span><span className="font-semibold">{formatterUSD(awsEgressCost + awsVpcCost)}</span></div>
             </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-3 bg-white flex justify-between items-center border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-900">Firestore <span className="text-[10px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded ml-1">{firestoreEdition}</span></p>
                <p className="text-[10px] text-gray-500">Monthly DB Cost</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatterUSD(total_firestore_cost_usd)}</p>
           </div>
           <div className="p-3 space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Reads:</span><span className="font-semibold">{formatterUSD(fs_reads_cost)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Writes:</span><span className="font-semibold">{formatterUSD(fs_writes_cost)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Storage:</span><span className="font-semibold">{formatterUSD(fs_storage_cost)}</span></div>
           </div>
        </div>

        <div className="bg-gray-900 rounded-xl overflow-hidden p-4 flex items-center justify-between shadow-md relative">
          <div className="relative z-10">
            <h3 className="text-gray-400 font-medium text-xs mb-1">Total Estimated Infra Bill</h3>
            <div className="text-2xl font-bold text-white tracking-tight">{formatterUSD(total_backend_cost_usd)} <span className="text-gray-500 text-sm font-medium">/mo</span></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center relative z-10">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
```

## File: src/components/PaymentCalculator.tsx
```typescript
import React, { useState } from 'react';
import { Settings2, CreditCard, Wallet, ToggleRight, ToggleLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalStore } from '../store/useGlobalStore';
import { SliderInput } from './ui/SliderInput';
import { InputGroup } from './ui/InputGroup';
import { Switch } from './ui/Switch';

export default function PaymentCalculator({ formatterNGN, onCostChange }: any) {
  const [enabled, setEnabled] = useState(true);
  const globalStore = useGlobalStore();
  const [useGlobal, setUseGlobal] = useState(true);

  const [feeBearer, setFeeBearer] = useState<'merchant' | 'customer'>('merchant');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [gatewayProvider, setGatewayProvider] = useState<'paystack' | 'flutterwave'>('paystack');

  // Local Overrides
  const [localPrice, setLocalPrice] = useState(10000);
  const [localUsers, setLocalUsers] = useState(1000);
  const [localTxnsPerMonth, setLocalTxnsPerMonth] = useState(12);

  const [inputs, setInputs] = useState({
    paystackPercentage: 1.5,
    paystackCap: 2000,
    paystackFlatThreshold: 2500,
    paystackFlatAmount: 100,
    flutterwavePercentage: 2.0,
    flutterwaveCap: 2000,
  });

  const updateInput = (key: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value || 0 }));
  };

  const users = useGlobal ? globalStore.monthlyActiveUsers : localUsers;
  const price = useGlobal ? globalStore.averageCartValue : localPrice;
  const txnsPerMonth = useGlobal ? globalStore.transactionsPerUserMonthly : localTxnsPerMonth;

  // --- FINTECH CALCULATIONS ---
  const totalMonthlyTxns = users * txnsPerMonth;

  // Paystack
  const paystackDecimalRate = inputs.paystackPercentage / 100;
  const paystackFlatFee = price >= inputs.paystackFlatThreshold ? inputs.paystackFlatAmount : 0;

  let paystackProcessingFee: number;

  if (feeBearer === 'merchant') {
    const calculatedFee = price * paystackDecimalRate + paystackFlatFee;
    paystackProcessingFee = Math.min(calculatedFee, inputs.paystackCap);
  } else {
    const uncappedCharge = (price + paystackFlatFee) / (1 - paystackDecimalRate);
    const uncappedFee = uncappedCharge - price;
    if (uncappedFee > inputs.paystackCap) {
      paystackProcessingFee = inputs.paystackCap;
    } else {
      paystackProcessingFee = Math.round(uncappedFee * 100) / 100;
    }
  }
  const paystackTotalPerTxn = paystackProcessingFee;
  const paystackMonthlyCost = paystackTotalPerTxn * totalMonthlyTxns;

  // Flutterwave
  const flutterwaveDecimalRate = inputs.flutterwavePercentage / 100;

  let flutterwaveProcessingFee: number;

  if (feeBearer === 'merchant') {
    const calculatedFee = price * flutterwaveDecimalRate;
    flutterwaveProcessingFee = Math.min(calculatedFee, inputs.flutterwaveCap);
  } else {
    const uncappedCharge = price / (1 - flutterwaveDecimalRate);
    const uncappedFee = uncappedCharge - price;

    if (uncappedFee > inputs.flutterwaveCap) {
      flutterwaveProcessingFee = inputs.flutterwaveCap;
    } else {
      flutterwaveProcessingFee = Math.round(uncappedFee * 100) / 100;
    }
  }
  const flutterwaveTotalPerTxn = flutterwaveProcessingFee;
  const flutterwaveMonthlyCost = flutterwaveTotalPerTxn * totalMonthlyTxns;
  const currentCost = gatewayProvider === 'paystack' ? paystackMonthlyCost : flutterwaveMonthlyCost;
  React.useEffect(() => {
    if (onCostChange) onCostChange(enabled ? currentCost : 0);
  }, [currentCost, enabled, onCostChange]);

  return (
    <div className={`bg-white rounded-2xl border ${enabled ? 'border-gray-200' : 'border-gray-100'} shadow-sm overflow-hidden flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className={`p-5 border-b border-gray-100 flex items-center justify-between transition-colors duration-300 ${enabled ? 'bg-gray-50/50' : 'bg-gray-50/20'}`}>
        <h2 className={`text-lg font-bold tracking-tight transition-colors duration-300 ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>Payment Gateway</h2>
        <Switch checked={enabled} onChange={setEnabled} />
      </div>

      <div className={`flex flex-col grow transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
        <div className="p-5 space-y-6">
        {/* Gateway Selector */}
        <div className="flex rounded-lg bg-gray-100 p-1 w-full border border-gray-200/50 shadow-inner">
          <button 
            onClick={() => setGatewayProvider('paystack')} 
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${gatewayProvider === 'paystack' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Paystack
          </button>
          <button 
            onClick={() => setGatewayProvider('flutterwave')} 
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${gatewayProvider === 'flutterwave' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Flutterwave
          </button>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center justify-between mt-6 mb-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            Sales & Economics
          </h3>
          <button 
            onClick={() => setUseGlobal(!useGlobal)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <span>Use Global</span>
            {useGlobal ? <ToggleRight className="w-5 h-5 text-indigo-600" /> : <ToggleLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-1">
          <SliderInput 
            label="Amount per Sale" 
            disabled={useGlobal} 
            value={price} 
            onChange={useGlobal ? () => {} : setLocalPrice} 
            min={100} max={100000} step={100}
          />
          <SliderInput 
            label="Active Customers" 
            disabled={useGlobal} 
            value={users} 
            onChange={useGlobal ? () => {} : setLocalUsers} 
            min={100} max={100000} step={100}
          />
          <SliderInput 
            label="Sales per customer/month" 
            disabled={useGlobal} 
            value={txnsPerMonth} 
            onChange={useGlobal ? () => {} : setLocalTxnsPerMonth} 
            min={1} max={100} step={1}
          />

          <div className="flex flex-col space-y-1.5 pt-3">
            <label className="text-xs font-semibold text-gray-600">Who pays the fees?</label>
            <div className="flex rounded-md border border-gray-200 overflow-hidden shadow-sm">
              <button 
                onClick={() => setFeeBearer('merchant')} 
                className={`flex-1 px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${feeBearer === 'merchant' ? 'bg-gray-800 text-white shadow-inner' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                Merchant
              </button>
              <button 
                onClick={() => setFeeBearer('customer')} 
                className={`flex-1 px-3 py-1.5 text-xs font-semibold transition-all duration-200 border-l border-gray-200 ${feeBearer === 'customer' ? 'bg-gray-800 text-white shadow-inner' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
              >
                Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Gateway Settings */}
      <div className="border-y border-gray-100 bg-gray-50/50">
        <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
          <span className="flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5" /> Gateway Settings</span>
        </button>
        <AnimatePresence>
          {showAdvanced && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 pt-1 space-y-3">
                 {gatewayProvider === 'paystack' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <InputGroup label="Fee %" value={inputs.paystackPercentage} onChange={(v) => updateInput('paystackPercentage', v)} suffix="%" step="0.1" />
                      <InputGroup label="Max Cap" value={inputs.paystackCap} onChange={(v) => updateInput('paystackCap', v)} prefix="₦" />
                      <InputGroup label="Flat Min" value={inputs.paystackFlatThreshold} onChange={(v) => updateInput('paystackFlatThreshold', v)} prefix="₦" />
                      <InputGroup label="Flat Fee" value={inputs.paystackFlatAmount} onChange={(v) => updateInput('paystackFlatAmount', v)} prefix="₦" />
                    </div>
                 ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <InputGroup label="Fee %" value={inputs.flutterwavePercentage} onChange={(v) => updateInput('flutterwavePercentage', v)} suffix="%" step="0.1" />
                      <InputGroup label="Max Cap" value={inputs.flutterwaveCap} onChange={(v) => updateInput('flutterwaveCap', v)} prefix="₦" />
                    </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result Card */}
      <div className="p-4 bg-white grow flex flex-col justify-end">
        {gatewayProvider === 'paystack' ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-md shadow-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-0.5">Paystack</h3>
              <p className="text-xs text-gray-500 mb-2">Cost per month</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterNGN(paystackMonthlyCost)}</p>
            </div>
            <div className="p-4 bg-gray-50/50">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Processing ({inputs.paystackPercentage}% + flat):</span>
                  <span className="font-semibold">{formatterNGN(paystackProcessingFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Fee per sale:</span>
                  <span>{formatterNGN(paystackTotalPerTxn)}</span>
                </div>
                {feeBearer === 'merchant' && (
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="flex justify-between text-gray-900 font-semibold text-xs">
                      <span>You receive per sale:</span>
                      <span className="">{formatterNGN(price - paystackTotalPerTxn)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-md shadow-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-0.5">Flutterwave</h3>
              <p className="text-xs text-gray-500 mb-2">Cost per month</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterNGN(flutterwaveMonthlyCost)}</p>
            </div>
            <div className="p-4 bg-gray-50/50">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Processing ({inputs.flutterwavePercentage}%):</span>
                  <span className="font-semibold">{formatterNGN(flutterwaveProcessingFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Fee per sale:</span>
                  <span>{formatterNGN(flutterwaveTotalPerTxn)}</span>
                </div>
                {feeBearer === 'merchant' && (
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="flex justify-between text-gray-900 font-semibold text-xs">
                      <span>You receive per sale:</span>
                      <span className="">{formatterNGN(price - flutterwaveTotalPerTxn)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      </div>
    </div>
  );
}
```

## File: src/components/WhatsAppCalculator.tsx
```typescript
import React, { useState } from 'react';
import { MessageCircle, ToggleRight, ToggleLeft } from 'lucide-react';
import { useGlobalStore } from '../store/useGlobalStore';
import { SliderInput } from './ui/SliderInput';
import { formatNum } from '../utils/formatters';
import { WA_RATES } from '../utils/constants';
import { Switch } from './ui/Switch';

export default function WhatsAppCalculator({ formatterUSD, onCostChange }: any) {
  const [enabled, setEnabled] = useState(true);
  const globalStore = useGlobalStore();
  const [useGlobal, setUseGlobal] = useState(true);

  const [waTargetCountry, setWaTargetCountry] = useState('NGA');

  const [localUsers, setLocalUsers] = useState(1000);
  const [localWaMarketingMsgs, setLocalWaMarketingMsgs] = useState(2);
  const [localWaUtilityMsgs, setLocalWaUtilityMsgs] = useState(10);
  const [localWaAuthMsgs, setLocalWaAuthMsgs] = useState(1);
  const [localWaUserRequests, setLocalWaUserRequests] = useState(5);

  const [inputs, setInputs] = useState({
    waUtilityInsideWindowPercent: 80,
  });

  const updateInput = (key: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value || 0 }));
  };

  const users = useGlobal ? globalStore.monthlyActiveUsers : localUsers;
  
  // Convert messages per transaction to per user/month: global * txnsPerMonth
  const waMarketingMsgs = useGlobal ? (globalStore.whatsappMessagesPerTransaction.marketingTemplates * globalStore.transactionsPerUserMonthly) : localWaMarketingMsgs;
  const waUtilityMsgs = useGlobal ? (globalStore.whatsappMessagesPerTransaction.utilityTemplates * globalStore.transactionsPerUserMonthly) : localWaUtilityMsgs;
  const waAuthMsgs = useGlobal ? (globalStore.whatsappMessagesPerTransaction.authenticationTemplates * globalStore.transactionsPerUserMonthly) : localWaAuthMsgs;
  const waUserRequests = useGlobal ? (globalStore.whatsappMessagesPerTransaction.freeReplies * globalStore.transactionsPerUserMonthly) : localWaUserRequests;

  // --- CALCULATIONS ---
  const currentWaRate = WA_RATES[waTargetCountry];
  
  // Marketing
  const totalMarketingMessages = users * waMarketingMsgs;
  const waMarketingCostUsd = totalMarketingMessages * currentWaRate.marketing;
  
  // Authentication
  const totalAuthMessages = users * waAuthMsgs;
  const waAuthCostUsd = totalAuthMessages * currentWaRate.authentication;

  // Service
  const totalServiceRequests = users * waUserRequests;
  const waServiceCostUsd = 0; // User-initiated replies within 24h are free

  // Utility
  const totalUtilityMessages = users * waUtilityMsgs;
  const freeUtilityMessages = totalUtilityMessages * (inputs.waUtilityInsideWindowPercent / 100);
  const chargeableUtilityMessages = Math.max(0, totalUtilityMessages - freeUtilityMessages);

  let waUtilityCostUsd = 0;
  let remainingChargeable = chargeableUtilityMessages;
  
  if (remainingChargeable > 0) {
    const tier1 = Math.min(100000, remainingChargeable);
    waUtilityCostUsd += tier1 * currentWaRate.utility;
    remainingChargeable -= tier1;
  }
  if (remainingChargeable > 0) {
    const tier2 = Math.min(400000, remainingChargeable);
    waUtilityCostUsd += tier2 * (currentWaRate.utility * 0.95);
    remainingChargeable -= tier2;
  }
  if (remainingChargeable > 0) {
    waUtilityCostUsd += remainingChargeable * (currentWaRate.utility * 0.90);
  }

  const totalWaCostUsd = waMarketingCostUsd + waAuthCostUsd + waServiceCostUsd + waUtilityCostUsd;

  React.useEffect(() => {
    if (onCostChange) onCostChange(enabled ? totalWaCostUsd : 0);
  }, [totalWaCostUsd, enabled, onCostChange]);

  return (
    <div className={`bg-white rounded-2xl border ${enabled ? 'border-gray-200' : 'border-gray-100'} shadow-sm flex flex-col min-h-0 transition-all duration-300`}>
      {/* Header */}
      <div className={`p-5 border-b border-gray-100 flex items-center justify-between transition-colors duration-300 ${enabled ? 'bg-gray-50/50' : 'bg-gray-50/20'}`}>
        <h2 className={`text-lg font-bold tracking-tight transition-colors duration-300 ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>WhatsApp API</h2>
        <Switch checked={enabled} onChange={setEnabled} />
      </div>

      <div className={`flex flex-col grow transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
        <div className="p-5 space-y-6 flex-grow">
        
        {/* Sync Controls */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            Messaging Volumes
          </h3>
          <button 
            onClick={() => setUseGlobal(!useGlobal)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <span>Use Global</span>
            {useGlobal ? <ToggleRight className="w-5 h-5 text-indigo-600" /> : <ToggleLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Target Country */}
        <div className="flex flex-col mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1">Target Country</label>
          <select 
            value={waTargetCountry}
            onChange={(e) => setWaTargetCountry(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
          >
            {Object.entries(WA_RATES).map(([code, data]) => (
              <option key={code} value={code}>{data.name}</option>
            ))}
          </select>
        </div>

        {/* Sliders */}
        <div className="space-y-1">
          <SliderInput 
            label="Active Customers/Mo" 
            disabled={useGlobal} 
            value={users} 
            onChange={useGlobal ? () => {} : setLocalUsers} 
            min={100} max={100000} step={100}
          />
          <SliderInput 
            label="User Requests (Inbound/mo)" 
            disabled={useGlobal} 
            value={waUserRequests} 
            onChange={useGlobal ? () => {} : setLocalWaUserRequests} 
            min={0} max={100} step={1}
          />
          <SliderInput 
            label="Marketing Msgs per User" 
            disabled={useGlobal} 
            value={waMarketingMsgs} 
            onChange={useGlobal ? () => {} : setLocalWaMarketingMsgs} 
            min={0} max={50} step={1}
          />
          <SliderInput 
            label="Utility Msgs per User" 
            disabled={useGlobal} 
            value={waUtilityMsgs} 
            onChange={useGlobal ? () => {} : setLocalWaUtilityMsgs} 
            min={0} max={150} step={1}
          />
          <SliderInput 
            label="Auth Msgs per User" 
            disabled={useGlobal} 
            value={waAuthMsgs} 
            onChange={useGlobal ? () => {} : setLocalWaAuthMsgs} 
            min={0} max={50} step={1}
          />
          <SliderInput 
            label="% Utility inside 24h Window" 
            value={inputs.waUtilityInsideWindowPercent} 
            onChange={(v) => updateInput('waUtilityInsideWindowPercent', v)} 
            min={0} max={100} step={5}
          />
        </div>
      </div>

      {/* Result Cards */}
      <div className="p-4 bg-gray-50/50 space-y-3 border-t border-gray-100">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-3 bg-white flex justify-between items-center border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-900">Marketing</p>
                <p className="text-[10px] text-gray-500">Monthly Cost</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatterUSD(waMarketingCostUsd)}</p>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-3 bg-white flex justify-between items-center border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-900">Auth</p>
                <p className="text-[10px] text-gray-500">Monthly Cost</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatterUSD(waAuthCostUsd)}</p>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-2">
           <div className="p-3 bg-white flex justify-between items-center border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-900">Utility</p>
                <p className="text-[10px] text-gray-500">Monthly Cost</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatterUSD(waUtilityCostUsd)}</p>
           </div>
        </div>

        <div className="bg-gray-900 rounded-xl overflow-hidden p-4 flex items-center justify-between shadow-md relative">
          <div className="relative z-10">
            <h3 className="text-gray-400 font-medium text-xs mb-1">Total WhatsApp Bill</h3>
            <div className="text-2xl font-bold text-white tracking-tight">{formatterUSD(totalWaCostUsd)} <span className="text-gray-500 text-sm font-medium">/mo</span></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center relative z-10">
            <MessageCircle className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
```

## File: .repomixignore
```
# Ignore everything
/*

# Allow essential source code and configurations
!/src/
!/package.json
!/index.html
!/metadata.json
!/vite.config.ts
!/tsconfig.json
!/.repomixignore

# Keep .env.example (but ignore actual .env files)
!/.env.example

# Files inside src/ that should still be ignored (if any, like large assets)
# (Add if needed)

# Standard ignores (backstage, mostly redundant now but good practice)
/node_modules/
/docs/
/.git/
/dist/
/build/
/.DS_Store
package-lock.json
yarn.lock
pnpm-lock.yaml
```

## File: src/App.tsx
```typescript
import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import GlobalDashboard from './components/GlobalDashboard';
import PaymentCalculator from './components/PaymentCalculator';
import CloudCalculator from './components/CloudCalculator';
import WhatsAppCalculator from './components/WhatsAppCalculator';
import PayoutCalculator from './components/PayoutCalculator';
import { formatNGNBase, formatUSDBase } from './utils/formatters';
import { InputGroup } from './components/ui/InputGroup';

export default function App() {
  const [displayCurrency, setDisplayCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [usdToNgnRate, setUsdToNgnRate] = useState(1500);

  const [costs, setCosts] = useState({
    paymentNGN: 0,
    cloudUSD: 0,
    whatsappUSD: 0,
    payoutNative: 0,
    payoutCountry: 'NG',
  });

  const getPayoutCostInNGN = (val: number, country: string, usdRate: number) => {
    switch (country) {
      case 'NG': return val;
      case 'GH': return val * 105;
      case 'KE': return val * 11;
      case 'ZA': return val * 80;
      case 'INTL': return val * usdRate;
      default: return val;
    }
  };

  const totalMonthlyNGN = costs.paymentNGN +
    (costs.cloudUSD * usdToNgnRate) +
    (costs.whatsappUSD * usdToNgnRate) +
    getPayoutCostInNGN(costs.payoutNative, costs.payoutCountry, usdToNgnRate);

  const formatterNGN = (amount: number) => formatNGNBase(amount, displayCurrency, usdToNgnRate);
  const formatterUSD = (amount: number) => formatUSDBase(amount, displayCurrency, usdToNgnRate);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-sans selection:bg-gray-200 pb-16">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">Levytate UpStack</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Small inline Input for Exchange Rate implicitly handled */}
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-gray-500 font-medium">USD to NGN:</span>
              <input
                type="number"
                value={usdToNgnRate || ''}
                onChange={(e) => setUsdToNgnRate(parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 text-right font-medium text-xs text-gray-900 border border-gray-200 rounded focus:border-gray-900 focus:outline-none hide-arrows transition-colors"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 items-start">

          <GlobalDashboard>
            <div className="flex bg-gray-100/80 p-0.5 rounded-lg border border-gray-200 shadow-sm">
              <button
                onClick={() => setDisplayCurrency('NGN')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${displayCurrency === 'NGN' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                NGN
              </button>
              <button
                onClick={() => setDisplayCurrency('USD')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${displayCurrency === 'USD' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                USD
              </button>
            </div>
          </GlobalDashboard>

          <PaymentCalculator
            formatterNGN={formatterNGN}
            onCostChange={(cost: number) => setCosts(prev => ({ ...prev, paymentNGN: cost || 0 }))}
          />

          <PayoutCalculator
            onCostChange={(cost: number, country: string) => setCosts(prev => ({ ...prev, payoutNative: cost || 0, payoutCountry: country }))}
          />

          <CloudCalculator
            formatterUSD={formatterUSD}
            onCostChange={(cost: number) => setCosts(prev => ({ ...prev, cloudUSD: cost || 0 }))}
          />

          <WhatsAppCalculator
            formatterUSD={formatterUSD}
            onCostChange={(cost: number) => setCosts(prev => ({ ...prev, whatsappUSD: cost || 0 }))}
          />

        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 text-white shadow-[0_-10px_30px_rgba(0,0,0,0.15)] z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl items-center justify-center shadow-inner">
              <Calculator className="w-5 h-5 text-indigo-300" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-gray-200">Total Estimated Monthly Cost</h3>
              <p className="text-xs text-gray-400">Aggregated sum of all platform charges</p>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 text-center sm:text-right">
            <div className="text-2xl font-black text-white tracking-tight">{formatterNGN(totalMonthlyNGN)} <span className="text-gray-400 text-sm font-medium">/mo</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
```
