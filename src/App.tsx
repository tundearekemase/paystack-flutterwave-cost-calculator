import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, Info, Settings2, CreditCard, Wallet, Receipt, ToggleLeft, ToggleRight } from 'lucide-react';
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
    paystackPercentage: 1.5,
    paystackCap: 2000,
    paystackFlatThreshold: 2500,
    paystackFlatAmount: 100,
    flutterwavePercentage: 2.0,
    flutterwaveCap: 2000,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [feeBearer, setFeeBearer] = useState<'merchant' | 'customer'>('merchant');

  const updateInput = (key: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value || 0 }));
  };

  // Calculations
  const totalMonthlyTxns = inputs.users * inputs.txnsPerWeek * inputs.weeksPerMonth;

  // --- Paystack ---
  const paystackDecimalRate = inputs.paystackPercentage / 100;
  const paystackFlatFee = inputs.price >= inputs.paystackFlatThreshold ? inputs.paystackFlatAmount : 0;

  let paystackProcessingFee: number;
  let paystackChargeAmount: number;
  let paystackFeeAdded: number;

  if (feeBearer === 'merchant') {
    // Merchant absorbs: fee is taken from the sale price
    const calculatedFee = inputs.price * paystackDecimalRate + paystackFlatFee;
    paystackProcessingFee = Math.min(calculatedFee, inputs.paystackCap);
    paystackChargeAmount = inputs.price;
    paystackFeeAdded = 0;
  } else {
    // Customer pays: calculate what to charge so merchant receives exactly inputs.price
    // Formula: chargeAmount = (price + flatFee) / (1 - rate)
    // Then cap the fee at inputs.paystackCap
    const uncappedCharge = (inputs.price + paystackFlatFee) / (1 - paystackDecimalRate);
    const uncappedFee = uncappedCharge - inputs.price;

    if (uncappedFee > inputs.paystackCap) {
      // Fee would exceed cap, so charge = price + cap
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

  // --- Flutterwave ---
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

                  {/* Fee Bearer Toggle */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">Who pays the fees?</label>
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                      <button
                        onClick={() => setFeeBearer('merchant')}
                        className={`flex-1 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                          feeBearer === 'merchant'
                            ? 'bg-gray-900 text-white shadow-inner'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Merchant absorbs
                      </button>
                      <button
                        onClick={() => setFeeBearer('customer')}
                        className={`flex-1 px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l border-gray-300 ${
                          feeBearer === 'customer'
                            ? 'bg-gray-900 text-white shadow-inner'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Customer pays
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      {feeBearer === 'merchant' 
                        ? 'Transaction fees are deducted from your sale amount.' 
                        : 'Transaction fees are added to the customer\'s checkout total.'}
                    </p>
                  </div>
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
                    <p className="text-sm text-gray-500 font-medium">
                      {feeBearer === 'merchant' ? 'What you\'ll pay each month' : 'Total fees charged to customers monthly'}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatNGN(paystackMonthlyCost)}</p>
                  </div>
                </div>
                <div className="p-6 flex-1 bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost per sale breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Processing ({inputs.paystackPercentage}% + flat)</span>
                      <span className="font-medium">{formatNGN(paystackProcessingFee)}</span>
                    </div>
                    {paystackFlatFee > 0 && (
                      <div className="flex justify-between text-gray-400 text-xs pl-3">
                        <span>Includes ₦{inputs.paystackFlatAmount} flat fee (sale ≥ {formatNGN(inputs.paystackFlatThreshold)})</span>
                      </div>
                    )}
                    {paystackProcessingFee >= inputs.paystackCap && (
                      <div className="flex justify-between text-gray-400 text-xs pl-3">
                        <span>Capped at {formatNGN(inputs.paystackCap)}</span>
                      </div>
                    )}
                    <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
                      <span>Fee per sale</span>
                      <span>{formatNGN(paystackTotalPerTxn)}</span>
                    </div>
                    {feeBearer === 'customer' && (
                      <div className="pt-2 space-y-2">
                        <div className="flex justify-between text-sky-700">
                          <span className="font-medium">Customer is charged</span>
                          <span className="font-bold">{formatNGN(paystackChargeAmount)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-xs">
                          <span>Fee added to checkout</span>
                          <span>+{formatNGN(paystackFeeAdded)}</span>
                        </div>
                        <div className="flex justify-between text-green-700 text-xs">
                          <span>You receive</span>
                          <span className="font-medium">{formatNGN(inputs.price)}</span>
                        </div>
                      </div>
                    )}
                    {feeBearer === 'merchant' && (
                      <div className="pt-2">
                        <div className="flex justify-between text-green-700 text-xs">
                          <span>You receive per sale</span>
                          <span className="font-medium">{formatNGN(inputs.price - paystackTotalPerTxn)}</span>
                        </div>
                      </div>
                    )}
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
                    <p className="text-sm text-gray-500 font-medium">
                      {feeBearer === 'merchant' ? 'What you\'ll pay each month' : 'Total fees charged to customers monthly'}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatNGN(flutterwaveMonthlyCost)}</p>
                  </div>
                </div>
                <div className="p-6 flex-1 bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost per sale breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Processing ({inputs.flutterwavePercentage}%)</span>
                      <span className="font-medium">{formatNGN(flutterwaveProcessingFee)}</span>
                    </div>
                    {flutterwaveProcessingFee >= inputs.flutterwaveCap && (
                      <div className="flex justify-between text-gray-400 text-xs pl-3">
                        <span>Capped at {formatNGN(inputs.flutterwaveCap)}</span>
                      </div>
                    )}
                    <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
                      <span>Fee per sale</span>
                      <span>{formatNGN(flutterwaveTotalPerTxn)}</span>
                    </div>
                    {feeBearer === 'customer' && (
                      <div className="pt-2 space-y-2">
                        <div className="flex justify-between text-orange-700">
                          <span className="font-medium">Customer is charged</span>
                          <span className="font-bold">{formatNGN(flutterwaveChargeAmount)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-xs">
                          <span>Fee added to checkout</span>
                          <span>+{formatNGN(flutterwaveFeeAdded)}</span>
                        </div>
                        <div className="flex justify-between text-green-700 text-xs">
                          <span>You receive</span>
                          <span className="font-medium">{formatNGN(inputs.price)}</span>
                        </div>
                      </div>
                    )}
                    {feeBearer === 'merchant' && (
                      <div className="pt-2">
                        <div className="flex justify-between text-green-700 text-xs">
                          <span>You receive per sale</span>
                          <span className="font-medium">{formatNGN(inputs.price - flutterwaveTotalPerTxn)}</span>
                        </div>
                      </div>
                    )}
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
                  <div className="text-gray-500 mb-1">// 2. Fee Model: {feeBearer === 'merchant' ? 'Merchant Absorbs' : 'Customer Pays'}</div>
                  {feeBearer === 'merchant' ? (
                    <div className="text-gray-400">Fees are subtracted from your sale amount of {formatNGN(inputs.price)}.</div>
                  ) : (
                    <div className="text-gray-400">
                      Fees are added to the checkout total using: <span className="text-green-400">(Price + Flat) / (1 - Rate)</span>
                      <div className="text-gray-500 mt-1">This ensures you receive exactly {formatNGN(inputs.price)} after the gateway deducts its fee.</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                  <div className="space-y-2">
                    <div className="text-sky-400 font-semibold mb-2">Paystack Math</div>
                    {feeBearer === 'merchant' ? (
                      <>
                        <div className="whitespace-nowrap">
                          <span className="text-gray-400">Processing:</span> Min({formatNGN(inputs.price)} × {inputs.paystackPercentage}% + {formatNGN(paystackFlatFee)}, {formatNGN(inputs.paystackCap)})
                          <div className="text-white">→ {formatNGN(paystackProcessingFee)}</div>
                        </div>
                        <div className="pt-2 whitespace-nowrap">
                          <span className="text-gray-400">You receive:</span> {formatNGN(inputs.price)} − {formatNGN(paystackProcessingFee)}
                          <div className="text-white font-bold">→ {formatNGN(inputs.price - paystackProcessingFee)}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="whitespace-nowrap">
                          <span className="text-gray-400">Charge:</span> ({formatNGN(inputs.price)} + {formatNGN(paystackFlatFee)}) / (1 − {paystackDecimalRate})
                          <div className="text-white">→ {formatNGN(paystackChargeAmount)}</div>
                        </div>
                        <div className="whitespace-nowrap">
                          <span className="text-gray-400">Fee:</span> {formatNGN(paystackChargeAmount)} − {formatNGN(inputs.price)}
                          <div className="text-white">→ {formatNGN(paystackProcessingFee)}</div>
                        </div>
                        {paystackProcessingFee >= inputs.paystackCap && (
                          <div className="text-yellow-400 text-xs">⚠ Fee capped at {formatNGN(inputs.paystackCap)}</div>
                        )}
                        <div className="pt-2 whitespace-nowrap">
                          <span className="text-gray-400">You receive:</span>
                          <div className="text-green-400 font-bold">→ {formatNGN(inputs.price)} ✓</div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-orange-400 font-semibold mb-2">Flutterwave Math</div>
                    {feeBearer === 'merchant' ? (
                      <>
                        <div className="whitespace-nowrap">
                          <span className="text-gray-400">Processing:</span> Min({formatNGN(inputs.price)} × {inputs.flutterwavePercentage}%, {formatNGN(inputs.flutterwaveCap)})
                          <div className="text-white">→ {formatNGN(flutterwaveProcessingFee)}</div>
                        </div>
                        <div className="pt-2 whitespace-nowrap">
                          <span className="text-gray-400">You receive:</span> {formatNGN(inputs.price)} − {formatNGN(flutterwaveProcessingFee)}
                          <div className="text-white font-bold">→ {formatNGN(inputs.price - flutterwaveProcessingFee)}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="whitespace-nowrap">
                          <span className="text-gray-400">Charge:</span> {formatNGN(inputs.price)} / (1 − {flutterwaveDecimalRate})
                          <div className="text-white">→ {formatNGN(flutterwaveChargeAmount)}</div>
                        </div>
                        <div className="whitespace-nowrap">
                          <span className="text-gray-400">Fee:</span> {formatNGN(flutterwaveChargeAmount)} − {formatNGN(inputs.price)}
                          <div className="text-white">→ {formatNGN(flutterwaveProcessingFee)}</div>
                        </div>
                        {flutterwaveProcessingFee >= inputs.flutterwaveCap && (
                          <div className="text-yellow-400 text-xs">⚠ Fee capped at {formatNGN(inputs.flutterwaveCap)}</div>
                        )}
                        <div className="pt-2 whitespace-nowrap">
                          <span className="text-gray-400">You receive:</span>
                          <div className="text-green-400 font-bold">→ {formatNGN(inputs.price)} ✓</div>
                        </div>
                      </>
                    )}
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
