import React, { useState } from 'react';
import { MessageCircle, ToggleRight, ToggleLeft } from 'lucide-react';
import { useGlobalStore } from '../store/useGlobalStore';
import { SliderInput } from './ui/SliderInput';
import { formatNum } from '../utils/formatters';
import { WA_RATES } from '../utils/constants';

export default function WhatsAppCalculator({ formatterUSD, onCostChange }: any) {
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
    if (onCostChange) onCostChange(totalWaCostUsd);
  }, [totalWaCostUsd, onCostChange]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-0">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">WhatsApp API</h2>
      </div>

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
  );
}
