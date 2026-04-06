


Here is the complete review and the newly engineered solution. 

### 1. GenAI / LLM Removed
I have fully removed all LLM (GenAI) token calculations from the architecture. If you are using standard keyword mapping or basic NLP on your backend, your compute costs will just fall under standard server execution time.

### 2. Location & Geocoding Strategy Confirmed
**Yes, you can do this for free.** WhatsApp natively supports sending a "Location Pin." When a user sends this, the Meta API forwards a payload containing exact `latitude` and `longitude` coordinates to your backend. 
Because you already have coordinates, you **do not** need to pay for Google Maps Geocoding API. You simply run a geospatial query in your database (e.g., Firestore GeoQueries or PostgreSQL PostGIS) to calculate the distance between the user's coordinates and the sellers' coordinates. The only cost is the standard database read/compute cost, which is functionally free at early scales.

### 3. The Massive 2026 WhatsApp Pricing Shift
You are in luck. Between November 2024 and July 2025, Meta overhauled WhatsApp Cloud API pricing. 
* **Service Conversations (User-initiated) are now 100% FREE and unlimited.**
* **Utility templates sent within 24 hours of the user's last message are FREE.**
Because "Gbam" is a user-initiated marketplace (the user messages "Hi" to start), your primary conversational flow costs **absolutely nothing** in WhatsApp API fees. You only pay if you send a Marketing broadcast, or a Utility template (like a delayed delivery update) *after* 24 hours have passed.

---

### The New "Top-Down" Architecture Code

I have completely rewritten `src/App.tsx`. The new dashboard is split into two logical halves:
1. **Unit Economics (The life of 1 transaction):** You input the seller's price, add your markup, calculate the payment gateway fee, and see your exact profit margin per sale.
2. **Macro Scale Simulator:** You multiply that transaction by your target monthly volume. It calculates the total revenue, then subtracts your Monthly Cloud Infrastructure pool (factoring in your free tiers) and your WhatsApp bulk messaging costs to reveal your True Net Profit.

Replace your entire `src/App.tsx` file with the code below:

```tsx
```tsx
import React, { useState } from 'react';
import { 
  Calculator, 
  MapPin,
  Info, 
  CreditCard, 
  Wallet, 
  Receipt, 
  Server, 
  Cloud, 
  MessageCircle, 
  Globe, 
  AlertCircle, 
  CheckSquare, 
  Square,
  TrendingUp,
  BarChart3,
  Store,
  DollarSign,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Formatters ---
const formatCurrency = (val: number, currency: 'NGN' | 'USD') => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: currency === 'USD' && val > 0 && val < 0.01 ? 4 : 2,
  }).format(val);
};

const formatNum = (num: number) => new Intl.NumberFormat('en-US').format(num);

// --- Constants ---
const GCP = {
  FREE_REQS: 2000000,
  PRICE_PER_M_REQS: 0.40,
  FREE_VCPU_SEC: 180000,
  PRICE_VCPU_SEC: 0.000024,
  FREE_MEM_SEC: 360000,
  PRICE_MEM_SEC: 0.0000025,
};

const FS = {
  FREE_READS_MO: 1500000, // 50k daily
  FREE_WRITES_MO: 600000,  // 20k daily
  PRICE_PER_100K_READS: 0.03,
  PRICE_PER_100K_WRITES: 0.09,
};

// WhatsApp 2026 Native Rates (Nigeria/Africa Proxy via USD)
// Service & Utility (in 24h) are FREE. Marketing/Utility (outside) are charged.
const WA_RATES = {
  marketing: 0.0510,
  utility: 0.0069
};

// --- Checkbox Component ---
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

// --- Input Component ---
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

export default function App() {
  const[displayCurrency, setDisplayCurrency] = useState<'NGN' | 'USD'>('NGN');
  
  const [inputs, setInputs] = useState({
    // Global
    usdToNgnRate: 1500,

    // Product & Margin
    productCost: 10000,
    markupType: 'percentage' as 'percentage' | 'flat',
    markupValue: 5,
    
    // Gateway Settings
    gatewayProvider: 'paystack' as 'paystack' | 'flutterwave',
    paystackPercentage: 1.5,
    paystackFlatAmount: 100,
    paystackFlatThreshold: 2500,
    paystackCap: 2000,
    flutterwavePercentage: 1.4,
    flutterwaveCap: 2000,
    
    // WhatsApp Comms (Per Txn)
    waMarketingMsgs: 0,
    waUtilityOutside24h: 0,
    
    // Monthly Macro Settings
    monthlyTxns: 5000,
    
    // Infrastructure (Per Txn Pool)
    dbReadsPerTxn: 15,
    dbWritesPerTxn: 4,
    computeTimeMsPerTxn: 400,
  });

  const updateInput = (key: keyof typeof inputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const getConvertedVal = (usdVal: number) => {
    return displayCurrency === 'NGN' ? usdVal * inputs.usdToNgnRate : usdVal;
  };
  const getConvertedNgn = (ngnVal: number) => {
    return displayCurrency === 'USD' ? ngnVal / inputs.usdToNgnRate : ngnVal;
  };

  // --- 1. UNIT ECONOMICS (PER TRANSACTION) ---
  const baseCost = inputs.productCost;
  const markupAmount = inputs.markupType === 'percentage' 
    ? baseCost * ((inputs.markupValue as number) / 100) 
    : (inputs.markupValue as number);
    
  const sellingPrice = baseCost + markupAmount;

  let gatewayFee = 0;
  if (inputs.gatewayProvider === 'paystack') {
    const calculatedFee = (sellingPrice * (inputs.paystackPercentage / 100)) + 
                          (sellingPrice >= inputs.paystackFlatThreshold ? inputs.paystackFlatAmount : 0);
    gatewayFee = Math.min(calculatedFee, inputs.paystackCap);
  } else {
    const calculatedFee = sellingPrice * (inputs.flutterwavePercentage / 100);
    gatewayFee = Math.min(calculatedFee, inputs.flutterwaveCap);
  }

  // Base Gross Profit per transaction (before Server/WhatsApp fees)
  const gbamUnitGrossProfit = sellingPrice - baseCost - gatewayFee;

  // WhatsApp Unit Cost (Marketing and delayed utility)
  const waUnitCostUSD = (inputs.waMarketingMsgs * WA_RATES.marketing) + (inputs.waUtilityOutside24h * WA_RATES.utility);
  const waUnitCostNGN = waUnitCostUSD * inputs.usdToNgnRate;

  const gbamUnitNetProfit = gbamUnitGrossProfit - waUnitCostNGN;

  // --- 2. MACRO SCALE SIMULATOR (MONTHLY) ---
  const totalTxns = inputs.monthlyTxns as number;
  const totalMacroRevenue = gbamUnitGrossProfit * totalTxns;
  const totalMacroWaCostNGN = waUnitCostNGN * totalTxns;

  // Database Cost
  const totalReads = totalTxns * inputs.dbReadsPerTxn;
  const totalWrites = totalTxns * inputs.dbWritesPerTxn;
  
  const billableReads = Math.max(0, totalReads - FS.FREE_READS_MO);
  const billableWrites = Math.max(0, totalWrites - FS.FREE_WRITES_MO);
  const dbReadsCostUSD = (billableReads / 100000) * FS.PRICE_PER_100K_READS;
  const dbWritesCostUSD = (billableWrites / 100000) * FS.PRICE_PER_100K_WRITES;

  // Compute Cost
  const avgReqsPerTxn = 5;
  const totalReqs = totalTxns * avgReqsPerTxn;
  const billableReqs = Math.max(0, totalReqs - GCP.FREE_REQS);
  const crReqCostUSD = (billableReqs / 1000000) * GCP.PRICE_PER_M_REQS;

  const totalVcpuSec = totalReqs * (inputs.computeTimeMsPerTxn / 1000);
  const billableVcpuSec = Math.max(0, totalVcpuSec - GCP.FREE_VCPU_SEC);
  const crVcpuCostUSD = billableVcpuSec * GCP.PRICE_VCPU_SEC;

  const totalMemSec = totalVcpuSec * 0.5; // Fixed 0.5GB ram allocation assumption
  const billableMemSec = Math.max(0, totalMemSec - GCP.FREE_MEM_SEC);
  const crMemCostUSD = billableMemSec * GCP.PRICE_MEM_SEC;

  const totalInfraCostUSD = dbReadsCostUSD + dbWritesCostUSD + crReqCostUSD + crVcpuCostUSD + crMemCostUSD;
  const totalInfraCostNGN = totalInfraCostUSD * inputs.usdToNgnRate;

  // The Grand Total
  const finalMonthlyNetProfitNGN = totalMacroRevenue - totalMacroWaCostNGN - totalInfraCostNGN;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-gray-200 pb-16">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight hidden sm:block">Gbam Unit Economics</span>
          </div>
          
          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button 
                  onClick={() => setDisplayCurrency('NGN')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${displayCurrency === 'NGN' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  NGN
                </button>
                <button 
                  onClick={() => setDisplayCurrency('USD')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${displayCurrency === 'USD' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  USD
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-10">
        
        {/* --- GLOBAL SETTINGS --- */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-6 items-center">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 w-full md:w-auto">
            <Settings2 className="w-4 h-4" /> Global Env
          </h2>
          <div className="w-48">
            <InputGroup label="Exchange Rate (USD to NGN)" value={inputs.usdToNgnRate} onChange={(v) => updateInput('usdToNgnRate', v)} prefix="₦" step="10" />
          </div>
        </section>

        {/* --- SECTION 1: UNIT ECONOMICS --- */}
        <section>
          <div className="mb-6 max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
              Transaction Lifecycle (Unit Cost)
            </h1>
            <p className="text-gray-500 text-lg">
              Calculate exactly what it costs to process a single user purchase from WhatsApp message to Checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Store className="w-5 h-5 text-emerald-500" />
                      Product Pricing & Markup
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <InputGroup label="Seller's Original Product Price" value={inputs.productCost} onChange={(v) => updateInput('productCost', v)} prefix="₦" />
                    
                    <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
                      <label className="text-sm font-medium text-gray-700">Gbam Markup Strategy</label>
                      <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm p-1 bg-gray-50 gap-1">
                        <button
                          onClick={() => updateInput('markupType', 'percentage')}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-all duration-200 ${inputs.markupType === 'percentage' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                          Percentage (%)
                        </button>
                        <button
                          onClick={() => updateInput('markupType', 'flat')}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-all duration-200 ${inputs.markupType === 'flat' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                          Flat Fee (₦)
                        </button>
                      </div>
                    </div>
                    
                    <InputGroup 
                      label={inputs.markupType === 'percentage' ? "Markup Percentage" : "Flat Markup Amount"} 
                      value={inputs.markupValue as number} 
                      onChange={(v) => updateInput('markupValue', v)} 
                      suffix={inputs.markupType === 'percentage' ? '%' : undefined}
                      prefix={inputs.markupType === 'flat' ? '₦' : undefined}
                      step={inputs.markupType === 'percentage' ? '0.1' : '10'}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      Payment Gateway Cost
                    </h2>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm p-1 bg-gray-50 gap-1">
                      <button
                        onClick={() => updateInput('gatewayProvider', 'paystack')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-all duration-200 ${inputs.gatewayProvider === 'paystack' ? 'bg-white text-blue-700 shadow-sm font-bold border border-blue-100' : 'text-gray-600 hover:text-gray-800'}`}
                      >
                        Paystack
                      </button>
                      <button
                        onClick={() => updateInput('gatewayProvider', 'flutterwave')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-all duration-200 ${inputs.gatewayProvider === 'flutterwave' ? 'bg-white text-orange-600 shadow-sm font-bold border border-orange-100' : 'text-gray-600 hover:text-gray-800'}`}
                      >
                        Flutterwave
                      </button>
                    </div>
                  </div>
                  
                  {inputs.gatewayProvider === 'paystack' && (
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <div>Percentage: <b>{inputs.paystackPercentage}%</b></div>
                      <div>Flat: <b>₦{inputs.paystackFlatAmount}</b> (&gt;₦{inputs.paystackFlatThreshold})</div>
                    </div>
                  )}
                  {inputs.gatewayProvider === 'flutterwave' && (
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 bg-orange-50 p-3 rounded-lg border border-orange-100">
                      <div>Percentage: <b>{inputs.flutterwavePercentage}%</b></div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="lg:col-span-7 flex flex-col justify-center gap-6">
              
              {/* Unit Economics Receipt Card */}
              <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col relative text-gray-300">
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Receipt className="w-5 h-5 text-gray-400" /> Single Sale Receipt</h2>
                  </div>
                  
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seller's Base Product</span>
                      <span>{formatCurrency(getConvertedNgn(baseCost), displayCurrency)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>Gbam Markup Addition</span>
                      <span>+ {formatCurrency(getConvertedNgn(markupAmount as number), displayCurrency)}</span>
                    </div>
                    <div className="pt-2 border-t border-dashed border-gray-700 flex justify-between text-lg text-white font-semibold">
                      <span>Price Displayed to Customer</span>
                      <span>{formatCurrency(getConvertedNgn(sellingPrice), displayCurrency)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 font-mono text-sm space-y-3">
                  <div className="text-gray-500 text-xs uppercase mb-2">// Gateway Payout Deductions</div>
                  <div className="flex justify-between text-red-400">
                    <span>Gateway Processing Fee</span>
                    <span>- {formatCurrency(getConvertedNgn(gatewayFee), displayCurrency)}</span>
                  </div>
                  <div className="flex justify-between text-yellow-400">
                    <span>Remittance to Seller</span>
                    <span>- {formatCurrency(getConvertedNgn(baseCost), displayCurrency)}</span>
                  </div>
                  <div className="pt-3 border-t border-dashed border-gray-700 flex items-center justify-between">
                    <span className="text-gray-200 font-semibold">Gross Profit per Transaction</span>
                    <span className="text-2xl text-white font-bold tracking-tight">
                      {formatCurrency(getConvertedNgn(gbamUnitGrossProfit), displayCurrency)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <div className="h-px bg-gray-200" />

        {/* --- SECTION 2: COMMUNICATION & LOCATION COSTS --- */}
        <section>
          <div className="mb-6 max-w-2xl">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
              Conversational Overheads
            </h1>
            <p className="text-gray-500">
              Calculate WhatsApp fees and mapping infrastructure based on Meta's 2026 free-tier models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                WhatsApp Outbound Costs (Per Sale)
              </h2>
              <div className="space-y-4">
                <InputGroup label="Marketing Casts (e.g Promo Blasts)" value={inputs.waMarketingMsgs as number} onChange={(v) => updateInput('waMarketingMsgs', v)} />
                <InputGroup label="Delayed Utility (Outside 24h Window)" value={inputs.waUtilityOutside24h as number} onChange={(v) => updateInput('waUtilityOutside24h', v)} />
                
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-800">
                  <b>The 2026 Advantage:</b> Since the buyer initiates the chat, the <b>Service Window</b> opens. Any standard replies and utility updates sent within 24 hours are <b>100% Free</b>. 
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  Geocoding & Location
                </h2>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm text-indigo-800 space-y-2">
                  <p><b>Status: Computationally Free.</b></p>
                  <p>Because users send location pins natively through WhatsApp, the exact coordinates are forwarded to your backend. We rely strictly on Database GeoQueries to match nearby sellers.</p>
                  <p>No Google Maps / AWS Location API integration is billed.</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm">Comms Cost per Transaction:</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(getConvertedNgn(waUnitCostNGN), displayCurrency)}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-gray-200" />

        {/* --- SECTION 3: MACRO SCALE (THE BIG PICTURE) --- */}
        <section>
          <div className="mb-6 max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
              Macro Scale Simulator
            </h1>
            <p className="text-gray-500 text-lg">
              Project your total monthly revenue against Google Cloud Database and Server costs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-500" />
                  Monthly Volume & Server
                </h2>
                <div className="space-y-4">
                  <InputGroup label="Target Successful Monthly Sales" value={inputs.monthlyTxns as number} onChange={(v) => updateInput('monthlyTxns', v)} />
                  
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">Backend Ops per transaction</h3>
                    <InputGroup label="Firestore DB Reads" value={inputs.dbReadsPerTxn as number} onChange={(v) => updateInput('dbReadsPerTxn', v)} />
                    <InputGroup label="Firestore DB Writes" value={inputs.dbWritesPerTxn as number} onChange={(v) => updateInput('dbWritesPerTxn', v)} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900 mb-4">
                  <Server className="w-4 h-4 text-blue-500" /> Server Free Tiers Claimed
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">DB Reads</span>
                    <span className="text-gray-900 font-medium">1,500,000 / mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">DB Writes</span>
                    <span className="text-gray-900 font-medium">600,000 / mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Compute Reqs</span>
                    <span className="text-gray-900 font-medium">2,000,000 / mo</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-8 space-y-6">
              
              {/* Macro Cost Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Gateway Fees Handed Over</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(getConvertedNgn(gatewayFee * totalTxns), displayCurrency)}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Meta WhatsApp Bill</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(getConvertedNgn(totalMacroWaCostNGN), displayCurrency)}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:col-span-2 relative border-blue-200">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                          <Cloud className="w-4 h-4 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Total Infra Bill (GCP + Firebase)</h2>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">Monthly Cloud Expenses</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(getConvertedVal(totalInfraCostUSD), displayCurrency)}</p>
                  </div>
                  <div className="p-6 bg-white text-sm">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                      <span className="text-gray-500">Database Engine</span>
                      <span className="font-medium text-gray-900">{formatCurrency(getConvertedVal(dbReadsCostUSD + dbWritesCostUSD), displayCurrency)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Compute Engine (Cloud Run)</span>
                      <span className="font-medium text-gray-900">{formatCurrency(getConvertedVal(crReqCostUSD + crVcpuCostUSD + crMemCostUSD), displayCurrency)}</span>
                    </div>
                    {totalInfraCostUSD === 0 && (
                      <div className="mt-4 bg-emerald-50 text-emerald-700 text-xs p-2 rounded flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" /> Your volume is 100% covered by Google Cloud Free Tiers!
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Huge Final Profit Block */}
              <div className="bg-gray-900 rounded-2xl shadow-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
                <h3 className="text-gray-400 font-medium text-lg mb-2">Estimated Gbam Net Profit</h3>
                <div className="text-5xl font-black text-white tracking-tight mb-6">
                  {formatCurrency(getConvertedNgn(finalMonthlyNetProfitNGN), displayCurrency)}
                  <span className="text-gray-500 text-xl font-medium ml-2">/ month</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-800">
                  <div>
                    <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Gross Margin</div>
                    <div className="text-gray-200 font-semibold">{formatCurrency(getConvertedNgn(totalMacroRevenue), displayCurrency)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">WhatsApp Bill</div>
                    <div className="text-red-400 font-semibold">- {formatCurrency(getConvertedNgn(totalMacroWaCostNGN), displayCurrency)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Infra Bill</div>
                    <div className="text-red-400 font-semibold">- {formatCurrency(getConvertedNgn(totalInfraCostNGN), displayCurrency)}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
```