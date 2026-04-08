import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGlobalStore } from '../../store/useGlobalStore';
import { calculateCloudCost, calculateWhatsAppCost, calculatePaymentCost } from '../../utils/calculations';
import { buildFormat } from '../../utils/formatters';

export default function ScaleProjectionChart() {
  const store = useGlobalStore();
  const [multiplier, setMultiplier] = useState(5);

  const formatValue = (val: number) => {
    const finalVal = store.displayCurrency === 'USD' ? val / store.usdToNgnRate : val;
    return buildFormat(finalVal, store.displayCurrency);
  };

  const chartData = [];
  for (let i = 1; i <= multiplier; i++) {
    const activeUsers = store.monthlyActiveUsers * i;
    
    // Simulate Cloud Cost (GCP Standard Profile)
    const { total_gcp_compute_cost, total_firestore_cost_usd } = calculateCloudCost({
      computeProvider: 'gcp', firestoreEdition: 'standard', awsRequireVpcNat: false, awsAutomatedDeployments: false,
      users: activeUsers, requestsPerUserMonth: store.transactionsPerUserMonthly * (store.databaseReadsWritesPerTransaction.reads + store.databaseReadsWritesPerTransaction.writes), 
      firestoreReadsReq: store.databaseReadsWritesPerTransaction.reads, firestoreWritesReq: store.databaseReadsWritesPerTransaction.writes, 
      totalMonthlyTxns: activeUsers * store.transactionsPerUserMonthly,
      networkEgressMBPerTransaction: store.networkEgressMBPerTransaction, 
      backendRequestTimeMs: 300, cloudRunVcpu: 1, cloudRunMemGib: 0.5, cloudRunConcurrency: 80, minInstances: 0,
      ecsFargateVcpu: 1, ecsFargateMemGb: 2, ecsTaskConcurrencyLimit: 100, ecsMinTasks: 1, awsCloudWatchLogsGb: 10,
      firestoreStorageMb: 1, firestoreStandardFreeReadsMo: 1500000, firestoreStandardFreeWritesMo: 600000, firestoreStandardFreeStorageGib: 1,
      firestoreEnterpriseFreeReadsMillion: 0, firestoreEnterpriseFreeWritesMillion: 0, firestoreEnterpriseFreeStorageGib: 0
    });
    
    // Simulate WhatsApp (NGA Standard Profile)
    const { totalCost: waTotal } = calculateWhatsAppCost({
      waTargetCountry: 'NGA', users: activeUsers,
      waMarketingMsgs: store.whatsappMessagesPerTransaction.marketingTemplates * store.transactionsPerUserMonthly,
      waUtilityMsgs: store.whatsappMessagesPerTransaction.utilityTemplates * store.transactionsPerUserMonthly,
      waAuthMsgs: store.whatsappMessagesPerTransaction.authenticationTemplates * store.transactionsPerUserMonthly,
      waUserRequests: store.whatsappMessagesPerTransaction.freeReplies * store.transactionsPerUserMonthly,
      waUtilityInsideWindowPercent: 80
    });

    // Simulate Payments (Paystack Standard Profile)
    const { totalCost: paystackTotal } = calculatePaymentCost({
      gatewayProvider: 'paystack', feeBearer: 'merchant', price: store.averageCartValue, users: activeUsers, txnsPerMonth: store.transactionsPerUserMonthly,
      paystackPercentage: 1.5, paystackCap: 2000, paystackFlatThreshold: 2500, paystackFlatAmount: 100,
      flutterwavePercentage: 2.0, flutterwaveCap: 2000
    });

    const totalNgn = paystackTotal + ((total_gcp_compute_cost + total_firestore_cost_usd + waTotal) * store.usdToNgnRate);
    
    chartData.push({
      users: activeUsers,
      cost: totalNgn
    });
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <label className="text-xs font-semibold text-gray-600">Projection Scale (Up to {multiplier}x current logic)</label>
        <input 
          type="range" 
          min="2" max="10" 
          value={multiplier} 
          onChange={(e) => setMultiplier(parseInt(e.target.value))}
          className="w-32"
        />
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="users" tick={{fontSize: 10}} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
            <YAxis tick={{fontSize: 10}} tickFormatter={(v) => formatValue(v)} width={80} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip 
              formatter={(value: number) => formatValue(value)}
              labelFormatter={(label) => `Users: ${label}`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="cost" stroke="#4F46E5" fillOpacity={1} fill="url(#colorCost)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
