import React, { useState } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { useGlobalStore } from '../store/useGlobalStore';
import { InputGroup } from './ui/InputGroup';
import { formatNum } from '../utils/formatters';
import { WA_RATES } from '../utils/constants';

export default function WhatsAppCalculator({ formatterUSD }: any) {
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

  return (
    <section>
      <div className="mb-6 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">WhatsApp Cloud API Cost</h1>
        <p className="text-gray-500 text-lg">Estimate Meta's 2026 per-message billing rates based on your traffic routing.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-500" /> Messaging Volumes
                </h2>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="useGlobalWa" checked={useGlobal} onChange={e => setUseGlobal(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"/>
                  <label htmlFor="useGlobalWa" className="text-xs font-medium text-gray-600">Use Global</label>
                </div>
              </div>
              
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

                <InputGroup label="Active Customers / Mo" disabled={useGlobal} value={users} onChange={setLocalUsers} />
                <InputGroup label="User Requests (Inbound/mo)" disabled={useGlobal} value={waUserRequests} onChange={setLocalWaUserRequests} />
                <InputGroup label="Marketing Msgs per User" disabled={useGlobal} value={waMarketingMsgs} onChange={setLocalWaMarketingMsgs} />
                <InputGroup label="Utility Msgs per User" disabled={useGlobal} value={waUtilityMsgs} onChange={setLocalWaUtilityMsgs} />
                <InputGroup label="Auth Msgs per User" disabled={useGlobal} value={waAuthMsgs} onChange={setLocalWaAuthMsgs} />
                
                <div className="pt-2">
                   <InputGroup label="% Utility inside 24h Window" value={inputs.waUtilityInsideWindowPercent} onChange={(v) => updateInput('waUtilityInsideWindowPercent', v)} suffix="%" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Volume</span><span className="font-medium">{formatNum(totalMarketingMessages)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Rate</span><span className="font-medium">${currentWaRate.marketing.toFixed(4)}/msg</span></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-indigo-50/50 to-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Auth</h2>
                </div>
                <p className="text-sm text-gray-500 font-medium">Monthly Cost</p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterUSD(waAuthCostUsd)}</p>
              </div>
              <div className="p-6 flex-1 bg-gray-50/50">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Volume</span><span className="font-medium">{formatNum(totalAuthMessages)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Rate</span><span className="font-medium">${currentWaRate.authentication.toFixed(4)}/msg</span></div>
                </div>
              </div>
            </div>

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
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Chargeable Msgs</span><span className="font-medium">{formatNum(Math.round(chargeableUtilityMessages))}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Free Msgs</span><span className="font-medium text-emerald-600">{formatNum(Math.round(freeUtilityMessages))}</span></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 flex items-center justify-between gap-6">
            <div>
              <h3 className="text-gray-400 font-medium text-lg mb-1">Total WhatsApp Bill</h3>
              <div className="text-4xl font-bold text-white tracking-tight">{formatterUSD(totalWaCostUsd)} <span className="text-gray-500 text-lg font-medium">/ mo</span></div>
            </div>
            <div className="w-14 h-14 rounded-full bg-emerald-900/50 border border-emerald-800 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-emerald-400" />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
