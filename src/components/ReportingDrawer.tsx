import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PieChart, TrendingUp, BarChart2, DollarSign } from 'lucide-react';
import { useGlobalStore } from '../store/useGlobalStore';
import CostBreakdownChart from './charts/CostBreakdownChart';
import ScaleProjectionChart from './charts/ScaleProjectionChart';
import ProviderComparisonChart from './charts/ProviderComparisonChart';
import UnitEconomicsChart from './charts/UnitEconomicsChart';

export default function ReportingDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const store = useGlobalStore();
  const [activeTab, setActiveTab] = useState<'breakdown' | 'projection' | 'comparison' | 'unit'>('breakdown');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-[64px] sm:bottom-[72px] left-0 right-0 h-[50vh] min-h-[400px] bg-white border-t border-gray-200 z-50 shadow-2xl flex flex-col rounded-t-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex gap-2 p-1 bg-gray-200/50 rounded-lg shrink-0 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('breakdown')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'breakdown' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <PieChart className="w-4 h-4" /> <span className="hidden sm:inline">Breakdown</span>
                </button>
                <button
                  onClick={() => setActiveTab('projection')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'projection' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <TrendingUp className="w-4 h-4" /> <span className="hidden sm:inline">Projection</span>
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'comparison' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <BarChart2 className="w-4 h-4" /> <span className="hidden sm:inline">Compare</span>
                </button>
                {/* 
                <button
                  onClick={() => setActiveTab('unit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'unit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <DollarSign className="w-4 h-4" /> <span className="hidden sm:inline">Unit Econ</span>
                </button>
                */}
              </div>

              <div className="flex items-center gap-4 ml-4">
                <div className="flex bg-gray-200/50 p-0.5 rounded-md text-xs font-semibold">
                  <button onClick={() => store.setDisplayCurrency('NGN')} className={`px-2 py-1 rounded transition-colors ${store.displayCurrency === 'NGN' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>NGN</button>
                  <button onClick={() => store.setDisplayCurrency('USD')} className={`px-2 py-1 rounded transition-colors ${store.displayCurrency === 'USD' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>USD</button>
                </div>
                <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 overflow-hidden">
               {activeTab === 'breakdown' && <CostBreakdownChart />}
               {activeTab === 'projection' && <ScaleProjectionChart />}
               {activeTab === 'comparison' && <ProviderComparisonChart />}
               {/* {activeTab === 'unit' && <UnitEconomicsChart />} */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
