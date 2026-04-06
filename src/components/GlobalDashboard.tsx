import React from 'react';
import { Settings, Users, ShoppingCart, Activity, MessageCircle, Database } from 'lucide-react';
import { useGlobalStore } from '../store/useGlobalStore';

function Slider({ label, value, min, max, step = 1, onChange, icon: Icon, unit = '' }: any) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center text-sm font-medium">
        <label className="flex items-center gap-2 text-gray-700">
          <Icon className="w-4 h-4 text-gray-500" /> {label}
        </label>
        <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md font-mono text-xs">
          {new Intl.NumberFormat('en-US').format(value)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
      />
    </div>
  );
}

function CompactInput({ label, value, onChange, unit = '' }: any) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-gray-500">{label}</span>
      <div className="flex items-center">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-16 px-1.5 py-0.5 text-right border border-gray-300 rounded focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 shadow-sm mr-1"
        />
        {unit && <span className="text-gray-500 w-4">{unit}</span>}
      </div>
    </div>
  );
}

export default function GlobalDashboard() {
  const globalStore = useGlobalStore();

  return (
    <div className="bg-white rounded-2xl border border-indigo-200 shadow-md overflow-hidden relative mb-8">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Global Assumptions Simulator</h2>
            <p className="text-sm text-gray-500">Adjust the core business metrics. These will cascade down to all calculators below.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Core Growth Metrics */}
          <div className="space-y-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
              <Users className="w-4 h-4 text-blue-500" /> Scale & Growth
            </h3>
            <Slider 
              label="Monthly Active Users" 
              value={globalStore.monthlyActiveUsers} 
              min={100} max={100000} step={100} 
              onChange={globalStore.setMonthlyActiveUsers} 
              icon={Users} 
            />
          </div>

          {/* Commerce Metrics */}
          <div className="space-y-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
              <ShoppingCart className="w-4 h-4 text-emerald-500" /> Commerce
            </h3>
            <Slider 
              label="Txns per User / Month" 
              value={globalStore.transactionsPerUserMonthly} 
              min={1} max={100} 
              onChange={globalStore.setTransactionsPerUserMonthly} 
              icon={Activity} 
              unit="txn"
            />
            <Slider 
              label="Average Cart Value" 
              value={globalStore.averageCartValue} 
              min={1000} max={100000} step={1000}
              onChange={globalStore.setAverageCartValue} 
              icon={ShoppingCart} 
              unit="₦"
            />
          </div>

          {/* Traffic Coefficients */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2 mb-3">
              <Activity className="w-4 h-4 text-purple-500" /> Traffic Multipliers <span className="font-normal text-xs text-gray-400">(per txn)</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
                   <Database className="w-3 h-3" /> Cloud & Data
                </div>
                <CompactInput label="DB Reads" value={globalStore.databaseReadsWritesPerTransaction.reads} onChange={(v: number) => globalStore.setDatabaseOperations('reads', v)} />
                <CompactInput label="DB Writes" value={globalStore.databaseReadsWritesPerTransaction.writes} onChange={(v: number) => globalStore.setDatabaseOperations('writes', v)} />
                <CompactInput label="Egress MB" value={globalStore.networkEgressMBPerTransaction} onChange={globalStore.setNetworkEgressMB} unit="MB" />
              </div>
              
              <div className="border-l border-gray-200 pl-4 space-y-2 text-xs">
                <div className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
                   <MessageCircle className="w-3 h-3" /> WhatsApp
                </div>
                <CompactInput label="Utility" value={globalStore.whatsappMessagesPerTransaction.utilityTemplates} onChange={(v: number) => globalStore.setWhatsappMessages('utilityTemplates', v)} />
                <CompactInput label="Marketing" value={globalStore.whatsappMessagesPerTransaction.marketingTemplates} onChange={(v: number) => globalStore.setWhatsappMessages('marketingTemplates', v)} />
                <CompactInput label="Auth" value={globalStore.whatsappMessagesPerTransaction.authenticationTemplates} onChange={(v: number) => globalStore.setWhatsappMessages('authenticationTemplates', v)} />
                <CompactInput label="Free Replies" value={globalStore.whatsappMessagesPerTransaction.freeReplies} onChange={(v: number) => globalStore.setWhatsappMessages('freeReplies', v)} />
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}
