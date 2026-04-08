import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGlobalStore } from '../../store/useGlobalStore';
import { calculateCloudCost, calculatePaymentCost } from '../../utils/calculations';
import { buildFormat } from '../../utils/formatters';

export default function ProviderComparisonChart() {
  const store = useGlobalStore();
  const [category, setCategory] = useState<'payments' | 'compute'>('payments');

  const formatValue = (val: number) => {
    const finalVal = store.displayCurrency === 'USD' ? val / store.usdToNgnRate : val;
    return buildFormat(finalVal, store.displayCurrency);
  };

  let chartData = [];

  if (category === 'payments') {
    const { paystackMonthlyCost, flutterwaveMonthlyCost } = calculatePaymentCost({
      gatewayProvider: 'paystack', feeBearer: 'merchant', price: store.averageCartValue, users: store.monthlyActiveUsers, txnsPerMonth: store.transactionsPerUserMonthly,
      paystackPercentage: 1.5, paystackCap: 2000, paystackFlatThreshold: 2500, paystackFlatAmount: 100,
      flutterwavePercentage: 2.0, flutterwaveCap: 2000
    });
    chartData = [
      { name: 'Paystack', Cost: paystackMonthlyCost },
      { name: 'Flutterwave', Cost: flutterwaveMonthlyCost }
    ];
  } else {
    // Both compute
    const baseParams: any = {
      firestoreEdition: 'standard', awsRequireVpcNat: false, awsAutomatedDeployments: false,
      users: store.monthlyActiveUsers, requestsPerUserMonth: store.transactionsPerUserMonthly * (store.databaseReadsWritesPerTransaction.reads + store.databaseReadsWritesPerTransaction.writes),
      firestoreReadsReq: store.databaseReadsWritesPerTransaction.reads, firestoreWritesReq: store.databaseReadsWritesPerTransaction.writes, 
      totalMonthlyTxns: store.monthlyActiveUsers * store.transactionsPerUserMonthly,
      networkEgressMBPerTransaction: store.networkEgressMBPerTransaction, 
      backendRequestTimeMs: 300, cloudRunVcpu: 1, cloudRunMemGib: 0.5, cloudRunConcurrency: 80, minInstances: 0,
      ecsFargateVcpu: 1, ecsFargateMemGb: 2, ecsTaskConcurrencyLimit: 100, ecsMinTasks: 1, awsCloudWatchLogsGb: 10,
      firestoreStorageMb: 1, firestoreStandardFreeReadsMo: 1500000, firestoreStandardFreeWritesMo: 600000, firestoreStandardFreeStorageGib: 1,
      firestoreEnterpriseFreeReadsMillion: 0, firestoreEnterpriseFreeWritesMillion: 0, firestoreEnterpriseFreeStorageGib: 0
    };

    const gcp = calculateCloudCost({ ...baseParams, computeProvider: 'gcp' });
    const aws = calculateCloudCost({ ...baseParams, computeProvider: 'aws' });
    
    chartData = [
      { name: 'Google Cloud Run', Cost: gcp.total_gcp_compute_cost * store.usdToNgnRate },
      { name: 'AWS ECS Fargate', Cost: aws.total_aws_compute_cost * store.usdToNgnRate }
    ];
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-center mb-4">
        <div className="flex rounded-lg bg-gray-100 p-1 border border-gray-200/50 shadow-inner">
          <button 
            onClick={() => setCategory('payments')} 
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${category === 'payments' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Payments
          </button>
          <button 
            onClick={() => setCategory('compute')} 
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${category === 'compute' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Compute
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 10}} tickFormatter={(v) => formatValue(v)} width={80} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip 
              formatter={(value: number) => formatValue(value)}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="Cost" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
