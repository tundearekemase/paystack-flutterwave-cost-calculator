import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGlobalStore } from '../../store/useGlobalStore';
import { buildFormat } from '../../utils/formatters';

export default function UnitEconomicsChart() {
  const store = useGlobalStore();

  const formatValue = (val: number) => {
    const finalVal = store.displayCurrency === 'USD' ? val / store.usdToNgnRate : val;
    return buildFormat(finalVal, store.displayCurrency);
  };

  const totalMonthlyTxns = store.monthlyActiveUsers * store.transactionsPerUserMonthly;
  if (!totalMonthlyTxns) return null;

  // Fraction out costs per txn
  const paymentPerTxn = store.costs.paymentNGN / totalMonthlyTxns;
  const cloudPerTxn = (store.costs.cloudUSD * store.usdToNgnRate) / totalMonthlyTxns;
  const whatsappPerTxn = (store.costs.whatsappUSD * store.usdToNgnRate) / totalMonthlyTxns;

  let previousEnd = store.averageCartValue;
  
  // Custom waterfall logic (Recharts doesn't have native waterfall, so we use ComposedChart with stacked bars, but simplest is just mapping them as positive vs negative in a standard bar chart or simulating)
  // Actually, easiest mock waterfall: an array of objects.
  
  const netRevenue = store.averageCartValue - paymentPerTxn - cloudPerTxn - whatsappPerTxn;

  const data = [
    { name: 'Cart Value', value: store.averageCartValue, fill: '#10B981' },
    { name: 'Payment Fee', value: paymentPerTxn, fill: '#EF4444' },
    { name: 'Compute Cost', value: cloudPerTxn, fill: '#EF4444' },
    { name: 'WhatsApp', value: whatsappPerTxn, fill: '#EF4444' },
    { name: 'Net Revenue', value: netRevenue, fill: '#4F46E5' },
  ];

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{fontSize: 10}} />
            <YAxis tick={{fontSize: 10}} tickFormatter={(v) => formatValue(v)} width={80} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip 
              formatter={(value: number) => formatValue(value)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
