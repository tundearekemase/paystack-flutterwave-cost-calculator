import React, { useState } from 'react';
import { Calculator, Globe, Info } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-gray-200 pb-16">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight hidden sm:block">Levytate</span>
          </div>
          
          <div className="flex items-center space-x-4 ml-auto">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setDisplayCurrency('NGN')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${displayCurrency === 'NGN' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  NGN
                </button>
                <button 
                  onClick={() => setDisplayCurrency('USD')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${displayCurrency === 'USD' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  USD
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
        <GlobalDashboard />
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 max-w-sm">
           <InputGroup label="Exchange Rate (USD to NGN)" value={usdToNgnRate} onChange={setUsdToNgnRate} prefix="₦" step="10" />
        </div>

        <PaymentCalculator 
            formatterNGN={formatterNGN} 
        />
        
        <div className="h-px bg-gray-200" />

        <CloudCalculator 
            formatterUSD={formatterUSD} 
        />

        <div className="h-px bg-gray-200" />

        <WhatsAppCalculator 
            formatterUSD={formatterUSD} 
        />
      </main>
    </div>
  );
}
