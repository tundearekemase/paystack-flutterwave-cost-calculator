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
