import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, Info, Settings2, CreditCard, Wallet, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const formatNGN = (num: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const formatNum = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export default function App() {
  const [inputs, setInputs] = useState({
    price: 10000,
    users: 1000,
    txnsPerWeek: 3,
    weeksPerMonth: 4.33,
    tier1Max: 5000,
    tier1Fee: 10,
    tier2Max: 50000,
    tier2Fee: 25,
    tier3Fee: 50,
    stampDutyThreshold: 10000,
    stampDutyAmount: 50,
    paystackPercentage: 1.5,
    paystackCap: 2000,
    paystackFlatThreshold: 2500,
    paystackFlatAmount: 100,
    flutterwavePercentage: 2.0,
    flutterwaveCap: 2000,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateInput = (key: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value || 0 }));
  };

  // Calculations
  const totalMonthlyTxns = inputs.users * inputs.txnsPerWeek * inputs.weeksPerMonth;

  const transferFee = inputs.price <= inputs.tier1Max 
    ? inputs.tier1Fee 
    : (inputs.price <= inputs.tier2Max ? inputs.tier2Fee : inputs.tier3Fee);

  const stampDuty = inputs.price >= inputs.stampDutyThreshold ? inputs.stampDutyAmount : 0;

  const paystackPercentageFee = Math.min(inputs.price * (inputs.paystackPercentage / 100), inputs.paystackCap);
  const paystackFlatFee = inputs.price >= inputs.paystackFlatThreshold ? inputs.paystackFlatAmount : 0;
  const paystackTotalPerTxn = paystackPercentageFee + paystackFlatFee + transferFee + stampDuty;
  const paystackMonthlyCost = paystackTotalPerTxn * totalMonthlyTxns;

  const flutterwavePercentageFee = Math.min(inputs.price * (inputs.flutterwavePercentage / 100), inputs.flutterwaveCap);
  const flutterwaveTotalPerTxn = flutterwavePercentageFee + transferFee + stampDuty;
  const flutterwaveMonthlyCost = flutterwaveTotalPerTxn * totalMonthlyTxns;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-gray-200">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Levytate</span>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Payment Cost Comparison
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
            Compare Payment Fees
          </h1>
          <p className="text-gray-500 text-lg">
            See exactly what you'll pay each month with Paystack vs. Flutterwave. No hidden math, just clear numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-gray-400" />
                  Your Sales Details
                </h2>
                
                <div className="space-y-5">
                  <InputGroup 
                    label="Amount per Sale" 
                    value={inputs.price} 
                    onChange={(v) => updateInput('price', v)} 
                    prefix="₦"
                  />
                  <InputGroup 
                    label="Number of Customers" 
                    value={inputs.users} 
                    onChange={(v) => updateInput('users', v)} 
                  />
                  <InputGroup 
                    label="Sales per customer each week" 
                    value={inputs.txnsPerWeek} 
                    onChange={(v) => updateInput('txnsPerWeek', v)} 
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50">
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    Advanced Settings
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-6">
                        <div className="pt-2">
                          <InputGroup 
                            label="Weeks in a month" 
                            value={inputs.weeksPerMonth} 
                            onChange={(v) => updateInput('weeksPerMonth', v)} 
                            step="0.01"
                          />
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Bank Transfer Costs</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Tier 1 Max" value={inputs.tier1Max} onChange={(v) => updateInput('tier1Max', v)} prefix="₦" />
                            <InputGroup label="Tier 1 Fee" value={inputs.tier1Fee} onChange={(v) => updateInput('tier1Fee', v)} prefix="₦" />
                            <InputGroup label="Tier 2 Max" value={inputs.tier2Max} onChange={(v) => updateInput('tier2Max', v)} prefix="₦" />
                            <InputGroup label="Tier 2 Fee" value={inputs.tier2Fee} onChange={(v) => updateInput('tier2Fee', v)} prefix="₦" />
                            <div className="col-span-2">
                              <InputGroup label="Tier 3 Fee (Above Tier 2)" value={inputs.tier3Fee} onChange={(v) => updateInput('tier3Fee', v)} prefix="₦" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Government Stamp Charge</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Applies above" value={inputs.stampDutyThreshold} onChange={(v) => updateInput('stampDutyThreshold', v)} prefix="₦" />
                            <InputGroup label="Charge Amount" value={inputs.stampDutyAmount} onChange={(v) => updateInput('stampDutyAmount', v)} prefix="₦" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Paystack Fees</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Percentage" value={inputs.paystackPercentage} onChange={(v) => updateInput('paystackPercentage', v)} suffix="%" step="0.1" />
                            <InputGroup label="Max Cap" value={inputs.paystackCap} onChange={(v) => updateInput('paystackCap', v)} prefix="₦" />
                            <InputGroup label="Flat Fee above" value={inputs.paystackFlatThreshold} onChange={(v) => updateInput('paystackFlatThreshold', v)} prefix="₦" />
                            <InputGroup label="Flat Fee" value={inputs.paystackFlatAmount} onChange={(v) => updateInput('paystackFlatAmount', v)} prefix="₦" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Flutterwave Fees</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Percentage" value={inputs.flutterwavePercentage} onChange={(v) => updateInput('flutterwavePercentage', v)} suffix="%" step="0.1" />
                            <InputGroup label="Max Cap" value={inputs.flutterwaveCap} onChange={(v) => updateInput('flutterwaveCap', v)} prefix="₦" />
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paystack Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-sky-50/50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-sky-100 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-sky-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Paystack</h2>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">What you'll pay each month</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatNGN(paystackMonthlyCost)}</p>
                  </div>
                </div>
                <div className="p-6 flex-1 bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost per sale breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Processing Fee ({inputs.paystackPercentage}%)</span>
                      <span className="font-medium">{formatNGN(paystackPercentageFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Flat Fee</span>
                      <span className="font-medium">{formatNGN(paystackFlatFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bank Transfer Cost</span>
                      <span className="font-medium">{formatNGN(transferFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Govt Stamp Charge</span>
                      <span className="font-medium">{formatNGN(stampDuty)}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
                      <span>Total per sale</span>
                      <span>{formatNGN(paystackTotalPerTxn)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flutterwave Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-orange-50/50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-orange-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Flutterwave</h2>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">What you'll pay each month</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatNGN(flutterwaveMonthlyCost)}</p>
                  </div>
                </div>
                <div className="p-6 flex-1 bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost per sale breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Processing Fee ({inputs.flutterwavePercentage}%)</span>
                      <span className="font-medium">{formatNGN(flutterwavePercentageFee)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Flat Fee</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bank Transfer Cost</span>
                      <span className="font-medium">{formatNGN(transferFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Govt Stamp Charge</span>
                      <span className="font-medium">{formatNGN(stampDuty)}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
                      <span>Total per sale</span>
                      <span>{formatNGN(flutterwaveTotalPerTxn)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparency Section */}
            <div className="bg-[#0A0A0A] rounded-2xl shadow-xl overflow-hidden text-gray-300">
              <div className="p-4 border-b border-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium text-white">How we calculated this</h3>
              </div>
              <div className="p-6 font-mono text-sm space-y-6 overflow-x-auto">
                
                <div>
                  <div className="text-gray-500 mb-1">// 1. Total Sales per Month</div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-blue-400">Total Sales</span> = 
                    <span>{formatNum(inputs.users)} customers</span> × 
                    <span>{inputs.txnsPerWeek} sales/week</span> × 
                    <span>{inputs.weeksPerMonth} weeks</span>
                  </div>
                  <div className="text-white mt-1">→ {formatNum(Math.round(totalMonthlyTxns))} total sales this month</div>
                </div>

                <div>
                  <div className="text-gray-500 mb-1">// 2. Shared Costs (Applied to both)</div>
                  <div className="space-y-2">
                    <div className="whitespace-nowrap">
                      <span className="text-blue-400">Bank Transfer</span> = 
                      {inputs.price <= inputs.tier1Max ? (
                        <span> {formatNGN(inputs.price)} is ≤ {formatNGN(inputs.tier1Max)}</span>
                      ) : inputs.price <= inputs.tier2Max ? (
                        <span> {formatNGN(inputs.price)} is ≤ {formatNGN(inputs.tier2Max)}</span>
                      ) : (
                        <span> {formatNGN(inputs.price)} is &gt; {formatNGN(inputs.tier2Max)}</span>
                      )}
                      <span className="text-white ml-2">→ {formatNGN(transferFee)}</span>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-blue-400">Govt Stamp</span> = 
                      <span> {formatNGN(inputs.price)} {inputs.price >= inputs.stampDutyThreshold ? '≥' : '<'} {formatNGN(inputs.stampDutyThreshold)}</span>
                      <span className="text-white ml-2">→ {formatNGN(stampDuty)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                  <div className="space-y-2">
                    <div className="text-sky-400 font-semibold mb-2">Paystack Math</div>
                    <div className="whitespace-nowrap">
                      <span className="text-gray-400">Processing:</span> Min({formatNGN(inputs.price)} × {inputs.paystackPercentage}%, {formatNGN(inputs.paystackCap)})
                      <div className="text-white">→ {formatNGN(paystackPercentageFee)}</div>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-gray-400">Flat Fee:</span> {formatNGN(inputs.price)} {inputs.price >= inputs.paystackFlatThreshold ? '≥' : '<'} {formatNGN(inputs.paystackFlatThreshold)}
                      <div className="text-white">→ {formatNGN(paystackFlatFee)}</div>
                    </div>
                    <div className="pt-2 whitespace-nowrap">
                      <span className="text-gray-400">Total per sale:</span> {formatNGN(paystackPercentageFee)} + {formatNGN(paystackFlatFee)} + {formatNGN(transferFee)} + {formatNGN(stampDuty)}
                      <div className="text-white font-bold">→ {formatNGN(paystackTotalPerTxn)}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-orange-400 font-semibold mb-2">Flutterwave Math</div>
                    <div className="whitespace-nowrap">
                      <span className="text-gray-400">Processing:</span> Min({formatNGN(inputs.price)} × {inputs.flutterwavePercentage}%, {formatNGN(inputs.flutterwaveCap)})
                      <div className="text-white">→ {formatNGN(flutterwavePercentageFee)}</div>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-gray-400">Flat Fee:</span> Not applicable
                      <div className="text-white">→ ₦0.00</div>
                    </div>
                    <div className="pt-2 whitespace-nowrap">
                      <span className="text-gray-400">Total per sale:</span> {formatNGN(flutterwavePercentageFee)} + ₦0.00 + {formatNGN(transferFee)} + {formatNGN(stampDuty)}
                      <div className="text-white font-bold">→ {formatNGN(flutterwaveTotalPerTxn)}</div>
                    </div>
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
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
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
