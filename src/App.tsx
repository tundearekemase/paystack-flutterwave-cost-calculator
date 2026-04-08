import React, { useState } from 'react';
import { Calculator, BarChart2 } from 'lucide-react';
import GlobalDashboard from './components/GlobalDashboard';
import PaymentCalculator from './components/PaymentCalculator';
import CloudCalculator from './components/CloudCalculator';
import WhatsAppCalculator from './components/WhatsAppCalculator';
import PayoutCalculator from './components/PayoutCalculator';
import { formatNGNBase, formatUSDBase } from './utils/formatters';
import { InputGroup } from './components/ui/InputGroup';
import { useGlobalStore } from './store/useGlobalStore';
import ReportingDrawer from './components/ReportingDrawer';

export default function App() {
  const displayCurrency = useGlobalStore(state => state.displayCurrency);
  const setDisplayCurrency = useGlobalStore(state => state.setDisplayCurrency);
  const usdToNgnRate = useGlobalStore(state => state.usdToNgnRate);
  const setUsdToNgnRate = useGlobalStore(state => state.setUsdToNgnRate);
  const costs = useGlobalStore(state => state.costs);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);



  const getPayoutCostInNGN = (val: number, country: string, usdRate: number) => {
    switch (country) {
      case 'NG': return val;
      case 'GH': return val * 105;
      case 'KE': return val * 11;
      case 'ZA': return val * 80;
      case 'INTL': return val * usdRate;
      default: return val;
    }
  };

  const totalMonthlyNGN = costs.paymentNGN +
    (costs.cloudUSD * usdToNgnRate) +
    (costs.whatsappUSD * usdToNgnRate) +
    getPayoutCostInNGN(costs.payoutNative, costs.payoutCountry, usdToNgnRate);

  const formatterNGN = (amount: number) => formatNGNBase(amount, displayCurrency, usdToNgnRate);
  const formatterUSD = (amount: number) => formatUSDBase(amount, displayCurrency, usdToNgnRate);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-gray-900 font-sans selection:bg-gray-200 pb-16">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">Levytate UpStack</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Small inline Input for Exchange Rate implicitly handled */}
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-gray-500 font-medium">USD to NGN:</span>
              <input
                type="number"
                value={usdToNgnRate || ''}
                onChange={(e) => setUsdToNgnRate(parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 text-right font-medium text-xs text-gray-900 border border-gray-200 rounded focus:border-gray-900 focus:outline-none hide-arrows transition-colors"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 items-start">

          <GlobalDashboard>
            <div className="flex bg-gray-100/80 p-0.5 rounded-lg border border-gray-200 shadow-sm">
              <button
                onClick={() => setDisplayCurrency('NGN')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${displayCurrency === 'NGN' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                NGN
              </button>
              <button
                onClick={() => setDisplayCurrency('USD')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${displayCurrency === 'USD' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                USD
              </button>
            </div>
          </GlobalDashboard>

          <PaymentCalculator
            formatterNGN={formatterNGN}
          />

          <PayoutCalculator />

          <CloudCalculator
            formatterUSD={formatterUSD}
          />

          <WhatsAppCalculator
            formatterUSD={formatterUSD}
          />

        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 text-white shadow-[0_-10px_30px_rgba(0,0,0,0.15)] z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDrawerOpen(!isDrawerOpen)} 
              className={`flex w-10 h-10 ${isDrawerOpen ? 'bg-indigo-500/40' : 'bg-indigo-500/20'} hover:bg-indigo-500/40 border border-indigo-500/30 rounded-xl items-center justify-center shadow-inner transition-colors`}
            >
              <BarChart2 className="w-5 h-5 text-indigo-300" />
            </button>
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-gray-200">Total Estimated Monthly Cost</h3>
              <p className="text-xs text-gray-400">Aggregated sum of all platform charges</p>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 text-center sm:text-right">
            <div className="text-2xl font-black text-white tracking-tight">{formatterNGN(totalMonthlyNGN)} <span className="text-gray-400 text-sm font-medium">/mo</span></div>
          </div>
        </div>
      </div>
      <ReportingDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
