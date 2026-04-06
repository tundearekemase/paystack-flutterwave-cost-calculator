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
