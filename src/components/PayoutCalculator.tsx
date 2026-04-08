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
