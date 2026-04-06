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
/.git/
/dist/
/build/
/.DS_Store
package-lock.json
yarn.lock
pnpm-lock.yaml
```

## File: src/index.css
```css
@import "tailwindcss";
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

## File: index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Google AI Studio App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## File: metadata.json
```json
{
  "name": "Levytate Payment Calculator",
  "description": "A dynamic calculator comparing marketplace payment processing fees between Paystack and Flutterwave.",
  "requestFramePermissions": []
}
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
    "lucide-react": "^0.546.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "vite": "^6.2.0",
    "express": "^4.21.2",
    "dotenv": "^17.2.3",
    "motion": "^12.23.24"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "@types/express": "^4.17.21"
  }
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

## File: src/App.tsx
```typescript
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, Info, Settings2, CreditCard, Wallet, Receipt, Server, Database, Cloud, Activity, Globe, Zap, AlertCircle, CheckSquare, Square, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const buildFormat = (val: number, currency: 'NGN' | 'USD') => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: currency === 'USD' && val > 0 && val < 0.01 ? 4 : 2,
  }).format(val);
};

const formatNGNBase = (ngnAmount: number, currency: 'NGN' | 'USD', rate: number) => {
  const val = currency === 'USD' ? ngnAmount / rate : ngnAmount;
  return buildFormat(val, currency);
};

const formatUSDBase = (usdAmount: number, currency: 'NGN' | 'USD', rate: number) => {
  const val = currency === 'NGN' ? usdAmount * rate : usdAmount;
  return buildFormat(val, currency);
};

const formatNum = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// GCP Constants
const GCP = {
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

// AWS Constants
const AWS = {
  VCPU_RATE: 0.064,
  MEM_RATE: 0.007,
  EGRESS_FREE_GB: 100,
  EGRESS_RATE: 0.09,
  NAT_GATEWAY_FLAT: 32.40,
  NAT_GATEWAY_DATA: 0.045,
  APP_RUNNER_DEPLOY_TOTAL: 2.00, // $1 flat + $1 avg build mins
  CLOUDWATCH_RATE: 0.50,
};

// Firestore Constants
const FS = {
  PRICE_PER_100K_READS: 0.03,
  PRICE_PER_100K_WRITES: 0.09,
  PRICE_STORAGE_GIB: 0.15,
  ENT_PRICE_READS_MILLION: 0.05,
  ENT_PRICE_WRITES_MILLION: 0.26,
  ENT_PRICE_STORAGE_GIB: 0.15,
};

// WhatsApp Constants
const WA_RATES: Record<string, { name: string, marketing: number, utility: number }> = {
  'NGA': { name: 'Nigeria', marketing: 0.0510, utility: 0.0250 },
  'GHA': { name: 'Ghana', marketing: 0.0460, utility: 0.0230 },
  'SEN': { name: 'Senegal', marketing: 0.0550, utility: 0.0280 },
  'CIV': { name: 'Ivory Coast', marketing: 0.0530, utility: 0.0270 },
  'OWA': { name: 'Other W.A.', marketing: 0.0550, utility: 0.0280 },
};

function Checkbox({ label, checked, onChange, tooltip }: { label: string, checked: boolean, onChange: (val: boolean) => void, tooltip?: string }) {
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

export default function App() {
  const [displayCurrency, setDisplayCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [feeBearer, setFeeBearer] = useState<'merchant' | 'customer'>('merchant');
  
  // Section UI Toggles
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showCloudAdvanced, setShowCloudAdvanced] = useState(false);
  
  // Architecture Toggles
  const [gatewayProvider, setGatewayProvider] = useState<'paystack' | 'flutterwave'>('paystack');
  const [computeProvider, setComputeProvider] = useState<'gcp' | 'aws'>('gcp');
  const [firestoreEdition, setFirestoreEdition] = useState<'standard' | 'enterprise'>('standard');
  const [awsRequireVpcNat, setAwsRequireVpcNat] = useState(false);
  const [awsAutomatedDeployments, setAwsAutomatedDeployments] = useState(false);
  const [waTargetCountry, setWaTargetCountry] = useState('NGA');

  const [inputs, setInputs] = useState({
    // Economy
    usdToNgnRate: 1500,

    // FinTech Inputs
    price: 10000,
    users: 1000,
    txnsPerWeek: 3,
    weeksPerMonth: 4.33,
    paystackPercentage: 1.5,
    paystackCap: 2000,
    paystackFlatThreshold: 2500,
    paystackFlatAmount: 100,
    flutterwavePercentage: 2.0,
    flutterwaveCap: 2000,
    
    // Shared Cloud Infrastructure Inputs
    requestsPerUserMonth: 100,
    backendRequestTimeMs: 300,
    backendEgressKb: 10,
    
    // GCP Cloud Run specific
    cloudRunVcpu: 1,
    cloudRunMemGib: 0.5,
    cloudRunConcurrency: 80,
    minInstances: 0,

    // AWS App Runner specific
    awsAppRunnerVcpu: 1,
    awsAppRunnerMemGb: 2,
    awsAppRunnerConcurrencyLimit: 100,
    awsAppRunnerMinInstances: 1,
    peakTrafficPercentage: 80,
    peakHoursPerDay: 4,
    awsCloudWatchLogsGb: 10,
    
    // Firestore specific
    firestoreReadsReq: 3,
    firestoreWritesReq: 1,
    firestoreStorageMb: 1,
    
    // WhatsApp specific
    waUserRequests: 5,
    waMarketingMsgs: 2,
    waUtilityMsgs: 10,
    waUtilityInsideWindowPercent: 80,
    
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

  // --- FINTECH CALCULATIONS ---
  const totalMonthlyTxns = inputs.users * inputs.txnsPerWeek * inputs.weeksPerMonth;

  // Paystack
  const paystackDecimalRate = inputs.paystackPercentage / 100;
  const paystackFlatFee = inputs.price >= inputs.paystackFlatThreshold ? inputs.paystackFlatAmount : 0;

  let paystackProcessingFee: number;
  let paystackChargeAmount: number;
  let paystackFeeAdded: number;

  if (feeBearer === 'merchant') {
    const calculatedFee = inputs.price * paystackDecimalRate + paystackFlatFee;
    paystackProcessingFee = Math.min(calculatedFee, inputs.paystackCap);
    paystackChargeAmount = inputs.price;
    paystackFeeAdded = 0;
  } else {
    const uncappedCharge = (inputs.price + paystackFlatFee) / (1 - paystackDecimalRate);
    const uncappedFee = uncappedCharge - inputs.price;
    if (uncappedFee > inputs.paystackCap) {
      paystackProcessingFee = inputs.paystackCap;
      paystackChargeAmount = inputs.price + inputs.paystackCap;
    } else {
      paystackProcessingFee = Math.round(uncappedFee * 100) / 100;
      paystackChargeAmount = Math.round(uncappedCharge * 100) / 100;
    }
    paystackFeeAdded = paystackChargeAmount - inputs.price;
  }
  const paystackTotalPerTxn = paystackProcessingFee;
  const paystackMonthlyCost = paystackTotalPerTxn * totalMonthlyTxns;

  // Flutterwave
  const flutterwaveDecimalRate = inputs.flutterwavePercentage / 100;

  let flutterwaveProcessingFee: number;
  let flutterwaveChargeAmount: number;
  let flutterwaveFeeAdded: number;

  if (feeBearer === 'merchant') {
    const calculatedFee = inputs.price * flutterwaveDecimalRate;
    flutterwaveProcessingFee = Math.min(calculatedFee, inputs.flutterwaveCap);
    flutterwaveChargeAmount = inputs.price;
    flutterwaveFeeAdded = 0;
  } else {
    const uncappedCharge = inputs.price / (1 - flutterwaveDecimalRate);
    const uncappedFee = uncappedCharge - inputs.price;

    if (uncappedFee > inputs.flutterwaveCap) {
      flutterwaveProcessingFee = inputs.flutterwaveCap;
      flutterwaveChargeAmount = inputs.price + inputs.flutterwaveCap;
    } else {
      flutterwaveProcessingFee = Math.round(uncappedFee * 100) / 100;
      flutterwaveChargeAmount = Math.round(uncappedCharge * 100) / 100;
    }
    flutterwaveFeeAdded = flutterwaveChargeAmount - inputs.price;
  }
  const flutterwaveTotalPerTxn = flutterwaveProcessingFee;
  const flutterwaveMonthlyCost = flutterwaveTotalPerTxn * totalMonthlyTxns;

  // --- SHARED BACKEND TRAFFIC CALCULATIONS ---
  const totalMonthlyUsers = inputs.users;
  const totalMonthlyBackendReqs = totalMonthlyUsers * inputs.requestsPerUserMonth;
  const t_sec = inputs.backendRequestTimeMs / 1000;
  const total_egress_gib = (totalMonthlyBackendReqs * inputs.backendEgressKb) / (1024 * 1024);

  // --- GCP CLOUD RUN CALCULATIONS ---
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

  // --- AWS APP RUNNER CALCULATIONS ---
  const activeInstanceRate = (inputs.awsAppRunnerVcpu * AWS.VCPU_RATE) + (inputs.awsAppRunnerMemGb * AWS.MEM_RATE);
  const provisionedInstanceRate = inputs.awsAppRunnerMemGb * AWS.MEM_RATE;

  const safePeakTrafficRatio = Math.min(100, Math.max(0, inputs.peakTrafficPercentage)) / 100;
  const safePeakHours = Math.min(24, Math.max(0, inputs.peakHoursPerDay));
  
  const peakHoursPerMonth = safePeakHours * 30;
  const offPeakHoursPerMonth = (24 - safePeakHours) * 30;

  let peakRps = 0;
  let offPeakRps = 0;
  
  if (peakHoursPerMonth > 0) {
    peakRps = (totalMonthlyBackendReqs * safePeakTrafficRatio) / (peakHoursPerMonth * 3600);
  }
  if (offPeakHoursPerMonth > 0) {
    offPeakRps = (totalMonthlyBackendReqs * (1 - safePeakTrafficRatio)) / (offPeakHoursPerMonth * 3600);
  }

  const peakConcurrency = peakRps * t_sec;
  const offPeakConcurrency = offPeakRps * t_sec;

  const peakInstancesNeeded = Math.max(inputs.awsAppRunnerMinInstances, Math.ceil(peakConcurrency / inputs.awsAppRunnerConcurrencyLimit));
  const offPeakInstancesNeeded = Math.max(inputs.awsAppRunnerMinInstances, Math.ceil(offPeakConcurrency / inputs.awsAppRunnerConcurrencyLimit));

  // Baseline 24/7 idle memory
  const awsBaselineCost = inputs.awsAppRunnerMinInstances * 720 * provisionedInstanceRate;

  // Active compute cost minus the provisioned memory we already paid for
  const awsPeakCost = Math.max(0, (peakInstancesNeeded * peakHoursPerMonth * activeInstanceRate) - (inputs.awsAppRunnerMinInstances * peakHoursPerMonth * provisionedInstanceRate));
  const awsOffPeakCost = Math.max(0, (offPeakInstancesNeeded * offPeakHoursPerMonth * activeInstanceRate) - (inputs.awsAppRunnerMinInstances * offPeakHoursPerMonth * provisionedInstanceRate));

  const awsComputeCost = awsBaselineCost + awsPeakCost + awsOffPeakCost;

  // AWS Hidden Costs
  const awsBillableEgress = Math.max(0, total_egress_gib - AWS.EGRESS_FREE_GB);
  const awsEgressCost = awsBillableEgress * AWS.EGRESS_RATE;
  
  const awsVpcCost = awsRequireVpcNat ? (AWS.NAT_GATEWAY_FLAT + (total_egress_gib * AWS.NAT_GATEWAY_DATA)) : 0;
  const awsDeployCost = awsAutomatedDeployments ? AWS.APP_RUNNER_DEPLOY_TOTAL : 0;
  const awsLoggingCost = inputs.awsCloudWatchLogsGb * AWS.CLOUDWATCH_RATE;

  const total_aws_compute_cost = awsComputeCost + awsEgressCost + awsVpcCost + awsDeployCost + awsLoggingCost;

  // Set the unified variable mapping for the global total
  const compute_subtotal_usd = computeProvider === 'gcp' ? total_gcp_compute_cost : total_aws_compute_cost;

  // --- FIRESTORE CALCULATIONS ---
  const total_reads = totalMonthlyBackendReqs * inputs.firestoreReadsReq;
  const total_writes = totalMonthlyBackendReqs * inputs.firestoreWritesReq;
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
    const total_read_millions = total_reads / 1000000;
    const fs_billable_reads_mil = Math.max(0, total_read_millions - inputs.firestoreEnterpriseFreeReadsMillion);
    fs_reads_cost = fs_billable_reads_mil * FS.ENT_PRICE_READS_MILLION;

    const total_write_millions = total_writes / 1000000;
    const fs_billable_writes_mil = Math.max(0, total_write_millions - inputs.firestoreEnterpriseFreeWritesMillion);
    fs_writes_cost = fs_billable_writes_mil * FS.ENT_PRICE_WRITES_MILLION;

    const fs_billable_storage = Math.max(0, total_storage_gib - inputs.firestoreEnterpriseFreeStorageGib);
    fs_storage_cost = fs_billable_storage * FS.ENT_PRICE_STORAGE_GIB;
  }

  const total_firestore_cost_usd = fs_reads_cost + fs_writes_cost + fs_storage_cost;
  const total_backend_cost_usd = compute_subtotal_usd + total_firestore_cost_usd;

  // --- WHATSAPP CLOUD API CALCULATIONS ---
  const currentWaRate = WA_RATES[waTargetCountry];
  
  // Marketing
  const totalMarketingMessages = inputs.users * inputs.waMarketingMsgs;
  const waMarketingCostUsd = totalMarketingMessages * currentWaRate.marketing;

  // Service
  const totalServiceRequests = inputs.users * inputs.waUserRequests;
  const waServiceCostUsd = 0; // User-initiated replies within 24h are free

  // Utility
  const totalUtilityMessages = inputs.users * inputs.waUtilityMsgs;
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

  const totalWaCostUsd = waMarketingCostUsd + waServiceCostUsd + waUtilityCostUsd;

  const formatterNGN = (amount: number) => formatNGNBase(amount, displayCurrency, inputs.usdToNgnRate);
  const formatterUSD = (amount: number) => formatUSDBase(amount, displayCurrency, inputs.usdToNgnRate);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-gray-200 pb-16">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight hidden sm:block">Levytate</span>
          </div>
          
          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setDisplayCurrency('NGN')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${displayCurrency === 'NGN' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  NGN
                </button>
                <button 
                  onClick={() => setDisplayCurrency('USD')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${displayCurrency === 'USD' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  USD
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16">
        
        {/* --- PART 1: FINTECH --- */}
        <section>
          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
              Payment Gateway Cost
            </h1>
            <p className="text-gray-500 text-lg">
              Calculate your monthly gateway fees based on sales volume.
            </p>
          </div>

          {/* Gateway Toggle */}
          <div className="flex flex-col space-y-3 max-w-sm mb-6">
            <label className="text-sm font-semibold text-gray-900">Payment Gateway</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm p-1 bg-gray-100 gap-1 w-fit">
              <button
                onClick={() => setGatewayProvider('paystack')}
                className={`px-5 py-2 text-sm font-medium rounded transition-all duration-200 ${gatewayProvider === 'paystack' ? 'bg-white text-sky-700 shadow-sm font-bold border border-sky-100' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Paystack
              </button>
              <button
                onClick={() => setGatewayProvider('flutterwave')}
                className={`px-5 py-2 text-sm font-medium rounded transition-all duration-200 ${gatewayProvider === 'flutterwave' ? 'bg-white text-orange-600 shadow-sm font-bold border border-orange-100' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Flutterwave
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-gray-400" />
                      Sales & Economics
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <InputGroup label="Exchange Rate (USD to NGN)" value={inputs.usdToNgnRate} onChange={(v) => updateInput('usdToNgnRate', v)} prefix="₦" step="10" />
                    <div className="pt-2 border-t border-gray-100">
                      <InputGroup label="Amount per Sale" value={inputs.price} onChange={(v) => updateInput('price', v)} prefix="₦" />
                    </div>
                    <InputGroup label="Number of Customers" value={inputs.users} onChange={(v) => updateInput('users', v)} />
                    <InputGroup label="Sales per customer each week" value={inputs.txnsPerWeek} onChange={(v) => updateInput('txnsPerWeek', v)} />

                    <div className="flex flex-col space-y-2 pt-2">
                      <label className="text-sm font-medium text-gray-700">Who pays the fees?</label>
                      <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                        <button onClick={() => setFeeBearer('merchant')} className={`flex-1 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${feeBearer === 'merchant' ? 'bg-gray-900 text-white shadow-inner' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Merchant</button>
                        <button onClick={() => setFeeBearer('customer')} className={`flex-1 px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l border-gray-300 ${feeBearer === 'customer' ? 'bg-gray-900 text-white shadow-inner' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Customer</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 bg-gray-50">
                  <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <span className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> Gateway Advanced Settings</span>
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-6 pb-6 space-y-6 pt-2">
                          <InputGroup label="Weeks in a month" value={inputs.weeksPerMonth} onChange={(v) => updateInput('weeksPerMonth', v)} step="0.01" />
                          {gatewayProvider === 'paystack' ? (
                            <div className="space-y-4">
                              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Paystack Fees</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Percentage" value={inputs.paystackPercentage} onChange={(v) => updateInput('paystackPercentage', v)} suffix="%" step="0.1" />
                                <InputGroup label="Max Cap" value={inputs.paystackCap} onChange={(v) => updateInput('paystackCap', v)} prefix="₦" />
                                <InputGroup label="Flat Threshold" value={inputs.paystackFlatThreshold} onChange={(v) => updateInput('paystackFlatThreshold', v)} prefix="₦" />
                                <InputGroup label="Flat Fee" value={inputs.paystackFlatAmount} onChange={(v) => updateInput('paystackFlatAmount', v)} prefix="₦" />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Flutterwave Fees</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Percentage" value={inputs.flutterwavePercentage} onChange={(v) => updateInput('flutterwavePercentage', v)} suffix="%" step="0.1" />
                                <InputGroup label="Max Cap" value={inputs.flutterwaveCap} onChange={(v) => updateInput('flutterwaveCap', v)} prefix="₦" />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex justify-center lg:justify-start">
              <div className="w-full max-w-sm">
                {gatewayProvider === 'paystack' ? (
                  /* Paystack Card */
                  <div className="bg-white rounded-2xl border border-sky-200 shadow-sm overflow-hidden flex flex-col relative">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-sky-50/80 to-white">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded bg-sky-100 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-sky-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Paystack</h2>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Cost per month</p>
                      <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterNGN(paystackMonthlyCost)}</p>
                    </div>
                    <div className="p-6 flex-1 bg-gray-50/50">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost per sale breakdown</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Processing ({inputs.paystackPercentage}% + flat)</span>
                          <span className="font-medium">{formatterNGN(paystackProcessingFee)}</span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
                          <span>Fee per sale</span>
                          <span>{formatterNGN(paystackTotalPerTxn)}</span>
                        </div>
                        {feeBearer === 'merchant' && (
                          <div className="pt-2">
                            <div className="flex justify-between text-green-700 text-xs">
                              <span>You receive per sale</span>
                              <span className="font-medium">{formatterNGN(inputs.price - paystackTotalPerTxn)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Flutterwave Card */
                  <div className="bg-white rounded-2xl border border-orange-200 shadow-sm overflow-hidden flex flex-col relative">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-orange-50/80 to-white">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-orange-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Flutterwave</h2>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Cost per month</p>
                      <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterNGN(flutterwaveMonthlyCost)}</p>
                    </div>
                    <div className="p-6 flex-1 bg-gray-50/50">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost per sale breakdown</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Processing ({inputs.flutterwavePercentage}%)</span>
                          <span className="font-medium">{formatterNGN(flutterwaveProcessingFee)}</span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
                          <span>Fee per sale</span>
                          <span>{formatterNGN(flutterwaveTotalPerTxn)}</span>
                        </div>
                        {feeBearer === 'merchant' && (
                          <div className="pt-2">
                            <div className="flex justify-between text-green-700 text-xs">
                              <span>You receive per sale</span>
                              <span className="font-medium">{formatterNGN(inputs.price - flutterwaveTotalPerTxn)}</span>
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
        </section>

        <div className="h-px bg-gray-200" />

        {/* --- PART 2: BACKEND CLOUD INFRASTRUCTURE --- */}
        <section>
          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
              Backend Infrastructure Cost
            </h1>
            <p className="text-gray-500 text-lg">
              Estimate your monthly cloud backend billing and database operations based on your user growth.
            </p>
          </div>

          {/* Compute Toggle */}
          <div className="flex flex-col space-y-3 max-w-sm mb-6">
            <label className="text-sm font-semibold text-gray-900">Compute Backend Engine</label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm p-1 bg-gray-100 gap-1 w-fit">
              <button
                onClick={() => setComputeProvider('gcp')}
                className={`px-5 py-2 text-sm font-medium rounded transition-all duration-200 ${computeProvider === 'gcp' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-gray-600 hover:text-gray-800'}`}
              >
                Google Cloud Run
              </button>
              <button
                onClick={() => setComputeProvider('aws')}
                className={`px-5 py-2 text-sm font-medium rounded transition-all duration-200 ${computeProvider === 'aws' ? 'bg-white text-amber-600 shadow-sm font-bold border border-amber-100' : 'text-gray-600 hover:text-gray-800'}`}
              >
                AWS App Runner
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              
              {/* Traffic Base Inputs */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-gray-400" />
                    Traffic & Resources
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Customers</span>
                      <span className="font-semibold text-gray-900">{formatNum(inputs.users)}</span>
                    </div>

                    <InputGroup label="Requests per User/Month" value={inputs.requestsPerUserMonth} onChange={(v) => updateInput('requestsPerUserMonth', v)} />
                    
                    <div className="pt-2 pb-2">
                      <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-500" />
                        <div>Total Monthly DB Requests:<br/><span className="font-semibold text-lg">{formatNum(totalMonthlyBackendReqs)}</span></div>
                      </div>
                    </div>
                    
                    <InputGroup label="Avg Request Duration" value={inputs.backendRequestTimeMs} onChange={(v) => updateInput('backendRequestTimeMs', v)} suffix="ms" />
                    <InputGroup label="Avg Egress Payload" value={inputs.backendEgressKb} onChange={(v) => updateInput('backendEgressKb', v)} suffix="KB" />
                  </div>
                </div>

                <div className="border-t border-gray-200 bg-gray-50">
                  <button onClick={() => setShowCloudAdvanced(!showCloudAdvanced)} className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    <span className="flex items-center gap-2">
                      <Server className="w-4 h-4" /> 
                      {computeProvider === 'gcp' ? 'GCP' : 'AWS'} Infra Settings
                    </span>
                    {showCloudAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {showCloudAdvanced && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-6 pb-6 space-y-6 pt-2">
                          
                          {/* DYNAMIC SECTION: GCP VS AWS */}
                          {computeProvider === 'gcp' ? (
                            <div className="space-y-4">
                              <h3 className="text-sm font-semibold text-blue-800 border-b border-blue-100 pb-2 flex items-center gap-2"><Cloud className="w-4 h-4 text-blue-500" /> Cloud Run Instance</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="vCPU alloc." value={inputs.cloudRunVcpu} onChange={(v) => updateInput('cloudRunVcpu', v)} step="0.1" />
                                <InputGroup label="Memory (GiB)" value={inputs.cloudRunMemGib} onChange={(v) => updateInput('cloudRunMemGib', v)} step="0.1" />
                                <div className="col-span-2">
                                  <InputGroup label="Avg Concurrent Requests (C_eff)" value={inputs.cloudRunConcurrency} onChange={(v) => updateInput('cloudRunConcurrency', v)} />
                                  <p className="text-xs text-gray-500 mt-1 pb-2">Higher concurrency shares CPU time massively.</p>
                                </div>
                                <div className="col-span-2 border-t border-gray-100 pt-3">
                                  <InputGroup label="Min Instances (Always On)" value={inputs.minInstances} onChange={(v) => updateInput('minInstances', v)} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-amber-800 border-b border-amber-100 pb-2 flex items-center gap-2"><Cloud className="w-4 h-4 text-amber-500" /> App Runner Modeling</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <InputGroup label="vCPU alloc." value={inputs.awsAppRunnerVcpu} onChange={(v) => updateInput('awsAppRunnerVcpu', v)} step="0.25" />
                                  <InputGroup label="Memory (GB)" value={inputs.awsAppRunnerMemGb} onChange={(v) => updateInput('awsAppRunnerMemGb', v)} step="1" />
                                  <div className="col-span-2">
                                    <InputGroup label="Concurrency Limit (C_max)" value={inputs.awsAppRunnerConcurrencyLimit} onChange={(v) => updateInput('awsAppRunnerConcurrencyLimit', v)} />
                                    <p className="text-xs text-gray-500 mt-1 pb-1">Triggers scaling. Little's law calculates instances needed.</p>
                                  </div>
                                  <div className="col-span-2 border-t border-gray-100 pt-3">
                                    <div className="flex justify-between items-end gap-4 pb-2">
                                      <div className="flex-1"><InputGroup label="Traffic Peak %" value={inputs.peakTrafficPercentage} onChange={(v) => updateInput('peakTrafficPercentage', v)} suffix="%" /></div>
                                      <div className="flex-1"><InputGroup label="Peak Hrs/Day" value={inputs.peakHoursPerDay} onChange={(v) => updateInput('peakHoursPerDay', v)} /></div>
                                    </div>
                                    <div className="bg-gray-100 p-2 rounded text-xs text-gray-600 block mt-1">
                                      Calculates RPS independently to reflect real concurrency surges.
                                    </div>
                                  </div>
                                  <div className="col-span-2 border-t border-gray-100 pt-3">
                                    <InputGroup label="Min Instances (Provisioned)" value={inputs.awsAppRunnerMinInstances} onChange={(v) => updateInput('awsAppRunnerMinInstances', v)} />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-amber-800 border-b border-amber-100 pb-2 flex items-center gap-2"><Settings2 className="w-4 h-4 text-amber-500" /> Missing Toggles & Hidden Costs</h3>
                                <div>
                                  <Checkbox label="Requires VPC Connector & NAT" checked={awsRequireVpcNat} onChange={setAwsRequireVpcNat} tooltip="Mandatory for Private RDS/DB connection while maintaining internet access. Incurs NAT hourly + processing." />
                                  <Checkbox label="Enable Automatic Deployments" checked={awsAutomatedDeployments} onChange={setAwsAutomatedDeployments} tooltip="Source code deployments via Github add a flat $1.00 + simulated 200 build mins." />
                                  <div className="pt-3">
                                    <InputGroup label="CloudWatch Log Size Ingestion" value={inputs.awsCloudWatchLogsGb} onChange={(v) => updateInput('awsCloudWatchLogsGb', v)} suffix="GB" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          

                          <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 flex items-center gap-2"><Database className="w-4 h-4 text-gray-500" /> Firestore Database Tuning</h3>
                            
                            <div className="flex flex-col space-y-2 mb-3">
                              <label className="text-sm text-gray-700 font-medium">Firestore Edition</label>
                              <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                                <button onClick={() => setFirestoreEdition('standard')} className={`flex-1 px-3 py-2 text-xs font-medium transition-all duration-200 ${firestoreEdition === 'standard' ? 'bg-gray-900 text-white shadow-inner' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Standard</button>
                                <button onClick={() => setFirestoreEdition('enterprise')} className={`flex-1 px-3 py-2 text-xs font-medium transition-all duration-200 border-l border-gray-300 ${firestoreEdition === 'enterprise' ? 'bg-gray-900 text-white shadow-inner' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Enterprise</button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <InputGroup label="Reads/Req" value={inputs.firestoreReadsReq} onChange={(v) => updateInput('firestoreReadsReq', v)} step="1" />
                              <InputGroup label="Writes/Req" value={inputs.firestoreWritesReq} onChange={(v) => updateInput('firestoreWritesReq', v)} step="1" />
                              <div className="col-span-2">
                                <InputGroup label="Storage per User (MB)" value={inputs.firestoreStorageMb} onChange={(v) => updateInput('firestoreStorageMb', v)} step="0.1" />
                              </div>
                            </div>

                            {firestoreEdition === 'enterprise' && (
                              <div className="pt-2 pb-2 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                                <h4 className="text-xs font-medium text-indigo-800 mb-3">Enterprise Free Tiers (Millions)</h4>
                                <div className="grid grid-cols-3 gap-2">
                                  <InputGroup label="Reads (mils)" value={inputs.firestoreEnterpriseFreeReadsMillion} onChange={(v) => updateInput('firestoreEnterpriseFreeReadsMillion', v)} />
                                  <InputGroup label="Writes (mils)" value={inputs.firestoreEnterpriseFreeWritesMillion} onChange={(v) => updateInput('firestoreEnterpriseFreeWritesMillion', v)} />
                                  <InputGroup label="Storage GiB" value={inputs.firestoreEnterpriseFreeStorageGib} onChange={(v) => updateInput('firestoreEnterpriseFreeStorageGib', v)} />
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Compute Context Card (GCP vs AWS) */}
                {computeProvider === 'gcp' ? (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                          <Cloud className="w-4 h-4 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Google Cloud Run</h2>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Monthly Compute Cost</p>
                      <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterUSD(total_gcp_compute_cost)}</p>
                    </div>
                    <div className="p-6 flex-1 bg-gray-50/50">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost breakdown</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">HTTP Requests</span>
                          <span className="font-medium">{formatterUSD(cr_req_cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">vCPU Time</span>
                          <span className="font-medium">{formatterUSD(cr_vcpu_cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Memory Time</span>
                          <span className="font-medium">{formatterUSD(cr_mem_cost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Networking (Egress)</span>
                          <span className="font-medium">{formatterUSD(cr_egress_cost)}</span>
                        </div>
                        {cr_idle_cost > 0 && (
                          <div className="flex justify-between text-yellow-700 bg-yellow-100/50 -mx-2 px-2 py-1 rounded">
                            <span>Idle Penalty ({inputs.minInstances} min inst)</span>
                            <span className="font-medium">{formatterUSD(cr_idle_cost)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative border-amber-200">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-amber-50/80 to-white">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center">
                          <Cloud className="w-4 h-4 text-amber-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">AWS App Runner</h2>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Monthly Compute Cost</p>
                      <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterUSD(total_aws_compute_cost)}</p>
                    </div>
                    <div className="p-6 flex-1 bg-gray-50/50">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost breakdown</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-500 text-xs pb-1 mb-2 border-b border-gray-100">
                          <span>Peak: {peakInstancesNeeded} inst | Off-Peak: {offPeakInstancesNeeded} inst</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Baseline Provisioned ({inputs.awsAppRunnerMinInstances} min)</span>
                          <span className="font-medium">{formatterUSD(awsBaselineCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Active Peak Hours Compute</span>
                          <span className="font-medium">{formatterUSD(awsPeakCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Active Off-Peak Compute</span>
                          <span className="font-medium">{formatterUSD(awsOffPeakCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Networking (Egress)</span>
                          <span className="font-medium">{formatterUSD(awsEgressCost)}</span>
                        </div>
                        {awsRequireVpcNat && (
                          <div className="flex justify-between text-red-700 bg-red-100/50 -mx-2 px-2 py-1 rounded">
                            <span>VPC + NAT Gateway</span>
                            <span className="font-medium">{formatterUSD(awsVpcCost)}</span>
                          </div>
                        )}
                        {awsAutomatedDeployments && (
                          <div className="flex justify-between text-indigo-700 text-xs">
                            <span>Automatic Builds ($1 + $1 mins)</span>
                            <span className="font-medium">{formatterUSD(awsDeployCost)}</span>
                          </div>
                        )}
                        {awsLoggingCost > 0 && (
                          <div className="flex justify-between text-gray-400 text-xs">
                            <span>CloudWatch Logs</span>
                            <span className="font-medium">{formatterUSD(awsLoggingCost)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Firestore Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-orange-50/50 to-white">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
                        <Database className="w-4 h-4 text-orange-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Firestore 
                        <span className="text-xs font-medium bg-white border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full ml-2 capitalize shadow-sm">
                          {firestoreEdition}
                        </span>
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Monthly DB Cost</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterUSD(total_firestore_cost_usd)}</p>
                  </div>
                  <div className="p-6 flex-1 bg-gray-50/50">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost breakdown</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between group">
                        <span className="text-gray-500 transition-colors">Reads ({formatNum(total_reads)})</span>
                        <span className="font-medium">{formatterUSD(fs_reads_cost)}</span>
                      </div>
                      <div className="flex justify-between group">
                        <span className="text-gray-500 transition-colors">Writes ({formatNum(total_writes)})</span>
                        <span className="font-medium">{formatterUSD(fs_writes_cost)}</span>
                      </div>
                      <div className="flex justify-between group">
                        <span className="text-gray-500 transition-colors">Storage ({total_storage_gib.toFixed(2)} GiB)</span>
                        <span className="font-medium">{formatterUSD(fs_storage_cost)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Total Backend Bill */}
              <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-gray-800 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="text-gray-400 font-medium text-lg mb-1">Total Estimated Infra Bill</h3>
                  <div className="text-4xl font-bold text-white tracking-tight">{formatterUSD(total_backend_cost_usd)} <span className="text-gray-500 text-lg font-medium">/ month</span></div>
                </div>
                <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg">
                  <Zap className="w-7 h-7 text-yellow-400" />
                </div>
              </div>
              
              {computeProvider === 'aws' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 flex gap-3">
                  <AlertCircle className="w-6 h-6 flex-shrink-0 text-yellow-600" />
                  <div>
                    <span className="font-semibold block mb-1">AWS Multi-Region Network Warning:</span>
                    If App Runner and Firestore span different cloud providers (AWS to GCP), <b>ALL database traffic crosses the internet</b>. Free networking is voided and both AWS NAT outbound and GCP Egress fees apply fully. The exact payload size must be rigorously included in your Egress settings.
                  </div>
                </div>
              )}
              {computeProvider === 'gcp' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 flex gap-3">
                  <Activity className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-semibold block mb-1">Synergy Network Status:</span>
                    Collocating Google Cloud Run and Firestore (e.g. us-central1) provides zero-cost internal networking. Ensure both services share the exact same deployment region.
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        <div className="h-px bg-gray-200" />

        {/* --- WHATSAPP CLOUD API --- */}
        <section>
          <div className="mb-8 max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
              WhatsApp Cloud API Cost
            </h1>
            <p className="text-gray-500 text-lg">
              Estimate Meta's 2026 per-message billing rates based on your traffic routing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 space-y-5">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-500" />
                    Messaging Volumes
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1.5 min-w-0">
                      <label className="text-sm font-medium text-gray-700 truncate">Target Country</label>
                      <select 
                        value={waTargetCountry}
                        onChange={(e) => setWaTargetCountry(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                      >
                        {Object.entries(WA_RATES).map(([code, data]) => (
                          <option key={code} value={code}>{data.name}</option>
                        ))}
                      </select>
                    </div>

                    <InputGroup label="User Requests (Inbound/mo)" value={inputs.waUserRequests} onChange={(v) => updateInput('waUserRequests', v)} />
                    <InputGroup label="Marketing Msgs per User" value={inputs.waMarketingMsgs} onChange={(v) => updateInput('waMarketingMsgs', v)} />
                    <InputGroup label="Utility Msgs per User" value={inputs.waUtilityMsgs} onChange={(v) => updateInput('waUtilityMsgs', v)} />
                    
                    <div className="pt-2">
                       <InputGroup label="% Utility inside 24h Window" value={inputs.waUtilityInsideWindowPercent} onChange={(v) => updateInput('waUtilityInsideWindowPercent', v)} suffix="%" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800 flex gap-3">
                <AlertCircle className="w-6 h-6 flex-shrink-0 text-orange-600" />
                <div>
                  <span className="font-semibold block mb-1">Auth-International Trap:</span>
                  Sending OTP/Authentication templates from a foreign business number carries massive surcharges. Read Meta's Auth-International guidelines.
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Marketing Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-emerald-50/50 to-white">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Marketing</h2>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Monthly Cost</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterUSD(waMarketingCostUsd)}</p>
                  </div>
                  <div className="p-6 flex-1 bg-gray-50/50">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost breakdown</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Volume</span>
                        <span className="font-medium">{formatNum(totalMarketingMessages)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Rate ({currentWaRate.name})</span>
                        <span className="font-medium">${currentWaRate.marketing.toFixed(4)}/msg</span>
                      </div>
                      <div className="mt-3 text-xs text-gray-400 border-t border-gray-100 pt-3">
                        Volume discounts do not apply to Marketing.
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Utility Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-teal-50/50 to-white">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded bg-teal-100 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-teal-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Utility</h2>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Monthly Cost</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterUSD(waUtilityCostUsd)}</p>
                  </div>
                  <div className="p-6 flex-1 bg-gray-50/50">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost breakdown</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Chargeable Msgs</span>
                        <span className="font-medium">{formatNum(Math.round(chargeableUtilityMessages))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Free/Windowed Msgs</span>
                        <span className="font-medium text-emerald-600">{formatNum(Math.round(freeUtilityMessages))}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-100 pt-3 mt-3">
                        <span className="text-gray-500">Service Replies</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 flex items-center justify-between gap-6">
                <div>
                  <h3 className="text-gray-400 font-medium text-lg mb-1">Total WhatsApp Bill</h3>
                  <div className="text-4xl font-bold text-white tracking-tight">{formatterUSD(totalWaCostUsd)} <span className="text-gray-500 text-lg font-medium">/ month</span></div>
                </div>
                <div className="w-14 h-14 rounded-full bg-emerald-900/50 border border-emerald-800 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-emerald-400" />
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* --- PART 3: TRANSPARENCY SECTION --- */}
        <div className="bg-[#0A0A0A] rounded-2xl shadow-xl overflow-hidden text-gray-300">
          <div className="p-4 border-b border-gray-800 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            <h3 className="font-medium text-white">Math & Mechanics</h3>
          </div>
          <div className="p-6 font-mono text-sm space-y-8 overflow-x-auto">
            
            <div className="space-y-4">
              <h4 className="text-white font-semibold flex items-center gap-2 border-b border-gray-800 pb-2"><Calculator className="w-4 h-4 text-emerald-400" /> Financial Mechanics</h4>
              <div>
                <div className="text-gray-500 mb-1">// Total Sales Volume</div>
                <div className="flex items-center gap-2 whitespace-nowrap text-gray-400">
                  <span className="text-blue-400">Total Sales</span> = 
                  <span>{formatNum(inputs.users)} users</span> × 
                  <span>{inputs.txnsPerWeek} txns/week</span> × 
                  <span>{inputs.weeksPerMonth} wks</span>
                </div>
                <div className="text-white mt-1">→ {formatNum(Math.round(totalMonthlyTxns))} total sales this month</div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <h4 className="text-white font-semibold flex items-center gap-2 border-b border-gray-800 pb-2"><Activity className="w-4 h-4 text-purple-400" /> Compute Processing Equations</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {computeProvider === 'gcp' ? (
                  <div>
                    <div className="text-gray-500 mb-1">// Cloud Run Compute Array</div>
                    <div className="whitespace-nowrap text-gray-400">
                      <span className="text-blue-400">Total Requests</span> = {formatNum(inputs.users)} × {inputs.requestsPerUserMonth}
                      <div className="text-white">→ {formatNum(totalMonthlyBackendReqs)} total traffic array</div>
                    </div>
                    <div className="whitespace-nowrap text-gray-400 mt-3">
                      <span className="text-blue-400">Compute Time</span> = ({formatNum(totalMonthlyBackendReqs)} × {(inputs.backendRequestTimeMs/1000).toFixed(3)}s) / {inputs.cloudRunConcurrency} (C_eff)
                      <div className="text-white">→ {formatNum(Math.round(cr_total_compute_sec))} shared CPU seconds billed</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-gray-500 mb-1">// AWS App Runner Little's Law Array</div>
                    <div className="whitespace-nowrap text-gray-400">
                      <span className="text-amber-400">Peak RPS</span> = ({formatNum(totalMonthlyBackendReqs)} reqs × {inputs.peakTrafficPercentage}%) / ({formatNum(peakHoursPerMonth)} hrs × 3600s)
                      <div className="text-white mt-1">→ Concurrency = {peakRps.toFixed(2)} RPS × {(inputs.backendRequestTimeMs/1000).toFixed(3)}s = {peakConcurrency.toFixed(2)} active reqs</div>
                      <div className="text-amber-300 mt-1">→ Scaling needed = Ceil({peakConcurrency.toFixed(2)} / {inputs.awsAppRunnerConcurrencyLimit} C_max) = {peakInstancesNeeded} instances.</div>
                    </div>
                    <div className="whitespace-nowrap text-gray-400 mt-3">
                      <span className="text-amber-400">Active Math Penalty</span> = ({peakInstancesNeeded} inst × Rate) - Baseline Provisioned Cost.
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-gray-500 mb-1">// DB Read/Write Matrix ({firestoreEdition})</div>
                  <div className="whitespace-nowrap text-gray-400">
                    <span className="text-orange-400">Reads</span> = {formatNum(totalMonthlyBackendReqs)} × {inputs.firestoreReadsReq}
                    <div className="text-white">→ {formatNum(total_reads)} DB queries</div>
                  </div>
                  <div className="whitespace-nowrap text-gray-400 mt-3">
                    <span className="text-orange-400">Writes</span> = {formatNum(totalMonthlyBackendReqs)} × {inputs.firestoreWritesReq}
                    <div className="text-white">→ {formatNum(total_writes)} DB commits</div>
                  </div>
                  {firestoreEdition === 'enterprise' && (
                    <div className="mt-2 text-indigo-400 italic text-xs">Using Enterprise tranche-based pricing methodology logic per 1M documents.</div>
                  )}
                </div>
              </div>

              {computeProvider === 'gcp' && inputs.minInstances > 0 && (
                <div className="mt-4 bg-red-900/10 border border-red-900 p-3 rounded">
                  <div className="text-red-400 mb-1">// Always-On Penalty Metric (GCP)</div>
                  <div className="text-gray-400 text-xs">
                    Instances ({inputs.minInstances}) × vCPU ({inputs.cloudRunVcpu}) × SEC_PER_MONTH ({formatNum(2592000)}) × IDLE_RATE ({GCP.CR_IDLE_PRICE_VCPU_SEC})
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-800">
              <h4 className="text-white font-semibold flex items-center gap-2 border-b border-gray-800 pb-2"><MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Per-Message Matrix</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="text-gray-500 mb-1">// 2026 Window Algorithm</div>
                  <div className="whitespace-nowrap text-gray-400">
                    <span className="text-emerald-400">Total Utility</span> = {formatNum(inputs.users)} × {inputs.waUtilityMsgs} = {formatNum(totalUtilityMessages)}
                  </div>
                  <div className="whitespace-nowrap text-gray-400 mt-2">
                    <span className="text-emerald-400">Free Volume</span> = {formatNum(totalUtilityMessages)} × {inputs.waUtilityInsideWindowPercent}% 
                    <div className="text-white">→ {formatNum(Math.round(freeUtilityMessages))} msgs voided gracefully (24h Service Window match)</div>
                  </div>
                </div>

                <div>
                  <div className="text-gray-500 mb-1">// Tiered Discount Tracker</div>
                  <div className="whitespace-nowrap text-gray-400 text-xs mt-1">
                    [Tier 1] 0-100k msgs @ ${currentWaRate.utility}
                  </div>
                  <div className="whitespace-nowrap text-gray-400 text-xs">
                    [Tier 2] 100k-500k @ 5% discount
                  </div>
                  <div className="whitespace-nowrap text-gray-400 text-xs">
                    [Tier 3] 500k+ @ 10% discount
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

function InputGroup({ 
  label, 
  value, 
  onChange, 
  type = "number", 
  step = "1", 
  prefix = "", 
  suffix = "" 
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  type?: string; 
  step?: string; 
  prefix?: string; 
  suffix?: string; 
}) {
  return (
    <div className="flex flex-col space-y-1.5 min-w-0">
      <label className="text-sm font-medium text-gray-700 truncate">{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-gray-500 text-sm font-medium">{prefix}</span>}
        <input
          type={type}
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
          className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
        />
        {suffix && <span className="absolute right-3 text-gray-500 text-sm font-medium">{suffix}</span>}
      </div>
    </div>
  );
}
```
