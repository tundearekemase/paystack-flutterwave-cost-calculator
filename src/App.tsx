import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import GlobalDashboard from './components/GlobalDashboard';
import PaymentCalculator from './components/PaymentCalculator';
import CloudCalculator from './components/CloudCalculator';
import WhatsAppCalculator from './components/WhatsAppCalculator';
import { formatNGNBase, formatUSDBase } from './utils/formatters';
import { InputGroup } from './components/ui/InputGroup';

export default function App() {
  const [displayCurrency, setDisplayCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [usdToNgnRate, setUsdToNgnRate] = useState(1500);

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
            <span className="text-xl font-bold tracking-tight hidden sm:block">Levytate</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
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

          <PaymentCalculator formatterNGN={formatterNGN} />
          
          <CloudCalculator formatterUSD={formatterUSD} />

          <WhatsAppCalculator formatterUSD={formatterUSD} />

        </div>
      </main>
    </div>
  );
}
