import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useGlobalStore } from '../../store/useGlobalStore';
import { buildFormat } from '../../utils/formatters';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export default function CostBreakdownChart() {
  const { costs, displayCurrency, usdToNgnRate } = useGlobalStore();

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

  const paymentCost = costs.paymentNGN;
  const cloudCost = costs.cloudUSD * usdToNgnRate;
  const whatsappCost = costs.whatsappUSD * usdToNgnRate;
  const payoutCost = getPayoutCostInNGN(costs.payoutNative, costs.payoutCountry, usdToNgnRate);

  const data = [
    { name: 'Payment Gateway', value: paymentCost },
    { name: 'Backend', value: cloudCost },
    { name: 'WhatsApp API', value: whatsappCost },
    { name: 'Payouts', value: payoutCost },
  ].filter(d => d.value > 0);

  const formatValue = (val: number) => {
    const finalVal = displayCurrency === 'USD' ? val / usdToNgnRate : val;
    return buildFormat(finalVal, displayCurrency);
  };

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-400 font-medium">No costs generated yet.</div>;
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatValue(value)}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
