import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Receipt, Settings2, CreditCard, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalStore } from '../store/useGlobalStore';
import { InputGroup } from './ui/InputGroup';
import { formatNGNBase, buildFormat } from '../utils/formatters';

export default function PaymentCalculator({ displayCurrency, usdToNgnRate, formatterNGN }: any) {
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
  let paystackChargeAmount: number;

  if (feeBearer === 'merchant') {
    const calculatedFee = price * paystackDecimalRate + paystackFlatFee;
    paystackProcessingFee = Math.min(calculatedFee, inputs.paystackCap);
    paystackChargeAmount = price;
  } else {
    const uncappedCharge = (price + paystackFlatFee) / (1 - paystackDecimalRate);
    const uncappedFee = uncappedCharge - price;
    if (uncappedFee > inputs.paystackCap) {
      paystackProcessingFee = inputs.paystackCap;
      paystackChargeAmount = price + inputs.paystackCap;
    } else {
      paystackProcessingFee = Math.round(uncappedFee * 100) / 100;
      paystackChargeAmount = Math.round(uncappedCharge * 100) / 100;
    }
  }
  const paystackTotalPerTxn = paystackProcessingFee;
  const paystackMonthlyCost = paystackTotalPerTxn * totalMonthlyTxns;

  // Flutterwave
  const flutterwaveDecimalRate = inputs.flutterwavePercentage / 100;

  let flutterwaveProcessingFee: number;
  let flutterwaveChargeAmount: number;

  if (feeBearer === 'merchant') {
    const calculatedFee = price * flutterwaveDecimalRate;
    flutterwaveProcessingFee = Math.min(calculatedFee, inputs.flutterwaveCap);
    flutterwaveChargeAmount = price;
  } else {
    const uncappedCharge = price / (1 - flutterwaveDecimalRate);
    const uncappedFee = uncappedCharge - price;

    if (uncappedFee > inputs.flutterwaveCap) {
      flutterwaveProcessingFee = inputs.flutterwaveCap;
      flutterwaveChargeAmount = price + inputs.flutterwaveCap;
    } else {
      flutterwaveProcessingFee = Math.round(uncappedFee * 100) / 100;
      flutterwaveChargeAmount = Math.round(uncappedCharge * 100) / 100;
    }
  }
  const flutterwaveTotalPerTxn = flutterwaveProcessingFee;
  const flutterwaveMonthlyCost = flutterwaveTotalPerTxn * totalMonthlyTxns;

  return (
    <section>
      <div className="mb-6 max-w-2xl flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Payment Gateway Cost</h1>
          <p className="text-gray-500 text-lg">Calculate your monthly gateway fees based on sales volume.</p>
        </div>
      </div>

      <div className="flex flex-col space-y-3 max-w-sm mb-6">
        <label className="text-sm font-semibold text-gray-900">Payment Gateway</label>
        <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm p-1 bg-gray-100 gap-1 w-fit">
          <button onClick={() => setGatewayProvider('paystack')} className={`px-5 py-2 text-sm font-medium rounded transition-all duration-200 ${gatewayProvider === 'paystack' ? 'bg-white text-sky-700 shadow-sm font-bold border border-sky-100' : 'text-gray-600 hover:text-gray-800'}`}>Paystack</button>
          <button onClick={() => setGatewayProvider('flutterwave')} className={`px-5 py-2 text-sm font-medium rounded transition-all duration-200 ${gatewayProvider === 'flutterwave' ? 'bg-white text-orange-600 shadow-sm font-bold border border-orange-100' : 'text-gray-600 hover:text-gray-800'}`}>Flutterwave</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-gray-400" /> Sales & Economics
                </h2>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="useGlobalPg" checked={useGlobal} onChange={e => setUseGlobal(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"/>
                  <label htmlFor="useGlobalPg" className="text-xs font-medium text-gray-600">Use Global</label>
                </div>
              </div>
              
              <div className="space-y-4">
                <InputGroup label="Amount per Sale" disabled={useGlobal} value={price} onChange={setLocalPrice} prefix="₦" />
                <InputGroup label="Active Customers" disabled={useGlobal} value={users} onChange={setLocalUsers} />
                <InputGroup label="Sales per customer / month" disabled={useGlobal} value={txnsPerMonth} onChange={setLocalTxnsPerMonth} />

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
                          <span className="font-medium">{formatterNGN(price - paystackTotalPerTxn)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
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
                          <span className="font-medium">{formatterNGN(price - flutterwaveTotalPerTxn)}</span>
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
  );
}
