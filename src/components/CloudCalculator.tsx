import React, { useState } from 'react';
import { Settings2, Cloud, Database, AlertCircle, Zap, ToggleRight, ToggleLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalStore } from '../store/useGlobalStore';
import { SliderInput } from './ui/SliderInput';
import { InputGroup } from './ui/InputGroup';
import { Checkbox } from './ui/Checkbox';
import { formatNum } from '../utils/formatters';
import { GCP, AWS, FS } from '../utils/constants';
import { Switch } from './ui/Switch';
import { calculateCloudCost } from '../utils/calculations';

export default function CloudCalculator({ formatterUSD }: any) {
  const [enabled, setEnabled] = useState(true);
  const globalStore = useGlobalStore();
  const setCosts = useGlobalStore(state => state.setCosts);
  const [useGlobal, setUseGlobal] = useState(true);

  const [showCloudAdvanced, setShowCloudAdvanced] = useState(false);
  const [computeProvider, setComputeProvider] = useState<'gcp' | 'aws'>('gcp');
  const [firestoreEdition, setFirestoreEdition] = useState<'standard' | 'enterprise'>('standard');
  const [awsRequireVpcNat, setAwsRequireVpcNat] = useState(false);
  const [awsAutomatedDeployments, setAwsAutomatedDeployments] = useState(false);

  // Local Overrides
  const [localUsers, setLocalUsers] = useState(1000);
  const [localRequestsPerUserMonth, setLocalRequestsPerUserMonth] = useState(144);
  const [localFirestoreReadsReq, setLocalFirestoreReadsReq] = useState(3);
  const [localFirestoreWritesReq, setLocalFirestoreWritesReq] = useState(1);

  const [inputs, setInputs] = useState({
    backendRequestTimeMs: 300,
    
    // GCP
    cloudRunVcpu: 1,
    cloudRunMemGib: 0.5,
    cloudRunConcurrency: 80,
    minInstances: 0,

    // AWS ECS Fargate
    ecsFargateVcpu: 1,
    ecsFargateMemGb: 2,
    ecsTaskConcurrencyLimit: 100,
    ecsMinTasks: 1,
    awsCloudWatchLogsGb: 10,
    
    // Firestore
    firestoreStorageMb: 1,
    firestoreStandardFreeReadsMo: 1500000,
    firestoreStandardFreeWritesMo: 600000,
    firestoreStandardFreeStorageGib: 1,
    firestoreEnterpriseFreeReadsMillion: 0,
    firestoreEnterpriseFreeWritesMillion: 0,
    firestoreEnterpriseFreeStorageGib: 0,
  });

  const updateInput = (key: keyof typeof inputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value || 0 }));
  };

  const users = useGlobal ? globalStore.monthlyActiveUsers : localUsers;
  // Compute global requests based on reads+writes per transaction
  const globalReqsPerUser = globalStore.transactionsPerUserMonthly * (globalStore.databaseReadsWritesPerTransaction.reads + globalStore.databaseReadsWritesPerTransaction.writes);
  const requestsPerUserMonth = useGlobal ? globalReqsPerUser : localRequestsPerUserMonth;
  const firestoreReadsReq = useGlobal ? globalStore.databaseReadsWritesPerTransaction.reads : localFirestoreReadsReq;
  const firestoreWritesReq = useGlobal ? globalStore.databaseReadsWritesPerTransaction.writes : localFirestoreWritesReq;
  const totalMonthlyTxns = users * globalStore.transactionsPerUserMonthly;

  const {
    cr_req_cost, cr_vcpu_cost, cr_mem_cost, cr_egress_cost, cr_idle_cost, total_gcp_compute_cost,
    awsComputeCost, awsEgressCost, awsVpcCost, awsDeployCost, awsLoggingCost, total_aws_compute_cost,
    fs_reads_cost, fs_writes_cost, fs_storage_cost, total_firestore_cost_usd,
    totalCost: total_backend_cost_usd
  } = calculateCloudCost({
    computeProvider, firestoreEdition, awsRequireVpcNat, awsAutomatedDeployments,
    users, requestsPerUserMonth, firestoreReadsReq, firestoreWritesReq, totalMonthlyTxns, 
    networkEgressMBPerTransaction: globalStore.networkEgressMBPerTransaction,
    ...inputs
  });
  
  const totalMonthlyBackendReqs = users * requestsPerUserMonth;

  React.useEffect(() => {
    setCosts('cloudUSD', enabled ? total_backend_cost_usd : 0);
  }, [total_backend_cost_usd, enabled, setCosts]);

  return (
    <div className={`bg-white rounded-2xl border ${enabled ? 'border-gray-200' : 'border-gray-100'} shadow-sm flex flex-col min-h-0 transition-all duration-300`}>
      {/* Header */}
      <div className={`p-5 border-b border-gray-100 flex items-center justify-between transition-colors duration-300 ${enabled ? 'bg-gray-50/50' : 'bg-gray-50/20'}`}>
        <h2 className={`text-lg font-bold tracking-tight transition-colors duration-300 ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>Backend Infrastructure</h2>
        <Switch checked={enabled} onChange={setEnabled} />
      </div>

      <div className={`flex flex-col grow transition-all duration-300 ${enabled ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
        <div className="p-5 space-y-6 flex-grow">
          {/* Cloud Provider Selector */}
        <div className="flex rounded-lg bg-gray-100 p-1 w-full border border-gray-200/50 shadow-inner">
          <button 
            onClick={() => setComputeProvider('gcp')} 
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${computeProvider === 'gcp' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Google Cloud Run
          </button>
          <button 
            onClick={() => setComputeProvider('aws')} 
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${computeProvider === 'aws' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            AWS ECS Fargate
          </button>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center justify-between mt-6 mb-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            Traffic & Resources
          </h3>
          <button 
            onClick={() => setUseGlobal(!useGlobal)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <span>Use Global</span>
            {useGlobal ? <ToggleRight className="w-5 h-5 text-indigo-600" /> : <ToggleLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-1">
          <SliderInput 
            label="Active Customers/Mo" 
            disabled={useGlobal} 
            value={users} 
            onChange={useGlobal ? () => {} : setLocalUsers} 
            min={100} max={100000} step={100}
          />
          <SliderInput 
            label="Requests per User/Month" 
            disabled={useGlobal} 
            value={requestsPerUserMonth} 
            onChange={useGlobal ? () => {} : setLocalRequestsPerUserMonth} 
            min={1} max={1000} step={1}
          />

          <div className="pt-2 text-xs text-gray-700 font-medium">
            Total Monthly Requests: <span className="font-bold">{formatNum(totalMonthlyBackendReqs)}</span>
          </div>

          <div className="pt-2">
             <SliderInput 
                label="Avg Request Duration" 
                value={inputs.backendRequestTimeMs} 
                onChange={(v) => updateInput('backendRequestTimeMs', v)} 
                min={10} max={5000} step={10}
             />
          </div>
        </div>
      </div>

      {/* Advanced Gateway Settings */}
      <div className="border-y border-gray-100 bg-gray-50/50">
        <button onClick={() => setShowCloudAdvanced(!showCloudAdvanced)} className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
          <span className="flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5" /> Backend Options</span>
        </button>
        <AnimatePresence>
          {showCloudAdvanced && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 pt-1 space-y-4">
                 {computeProvider === 'gcp' ? (
                   <div className="space-y-3">
                     <h4 className="text-xs font-bold text-gray-800">Cloud Run Settings</h4>
                     <div className="grid grid-cols-2 gap-3">
                       <InputGroup label="vCPU alloc" value={inputs.cloudRunVcpu} onChange={(v) => updateInput('cloudRunVcpu', v)} step="0.1" />
                       <InputGroup label="Mem (GiB)" value={inputs.cloudRunMemGib} onChange={(v) => updateInput('cloudRunMemGib', v)} step="0.1" />
                       <InputGroup label="Avg Concurrency" value={inputs.cloudRunConcurrency} onChange={(v) => updateInput('cloudRunConcurrency', v)} />
                       <InputGroup label="Min Instances" value={inputs.minInstances} onChange={(v) => updateInput('minInstances', v)} />
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-3">
                     <h4 className="text-xs font-bold text-gray-800">AWS ECS Fargate Settings</h4>
                     <div className="grid grid-cols-2 gap-3">
                       <InputGroup label="vCPU alloc" value={inputs.ecsFargateVcpu} onChange={(v) => updateInput('ecsFargateVcpu', v)} step="0.25" />
                       <InputGroup label="Mem (GB)" value={inputs.ecsFargateMemGb} onChange={(v) => updateInput('ecsFargateMemGb', v)} step="1" />
                       <InputGroup label="Task Concurrency" value={inputs.ecsTaskConcurrencyLimit} onChange={(v) => updateInput('ecsTaskConcurrencyLimit', v)} />
                       <InputGroup label="Min Tasks" value={inputs.ecsMinTasks} onChange={(v) => updateInput('ecsMinTasks', v)} />
                     </div>
                     <Checkbox label="Require VPC & NAT" checked={awsRequireVpcNat} onChange={setAwsRequireVpcNat} />
                   </div>
                )}
                <div className="border-t border-gray-200 pt-3 space-y-3">
                   <h4 className="text-xs font-bold text-gray-800">Firestore Settings</h4>
                   <div className="flex rounded border border-gray-200 overflow-hidden text-xs">
                     <button onClick={() => setFirestoreEdition('standard')} className={`flex-1 py-1 ${firestoreEdition === 'standard' ? 'bg-gray-800 text-white' : 'bg-white'}`}>Standard</button>
                     <button onClick={() => setFirestoreEdition('enterprise')} className={`flex-1 py-1 ${firestoreEdition === 'enterprise' ? 'bg-gray-800 text-white' : 'bg-white'}`}>Enterprise</button>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <InputGroup label="Reads/Req" disabled={useGlobal} value={firestoreReadsReq} onChange={useGlobal ? () => {} : setLocalFirestoreReadsReq} step="1" />
                     <InputGroup label="Writes/Req" disabled={useGlobal} value={firestoreWritesReq} onChange={useGlobal ? () => {} : setLocalFirestoreWritesReq} step="1" />
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result Cards */}
      <div className="p-4 bg-gray-50/50 space-y-3">
        {computeProvider === 'gcp' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-3 bg-white flex justify-between items-center border-b border-gray-100">
               <div>
                 <p className="text-xs font-bold text-gray-900">Google Cloud Run</p>
                 <p className="text-[10px] text-gray-500">Monthly Compute Cost</p>
               </div>
               <p className="text-lg font-bold text-gray-900">{formatterUSD(total_gcp_compute_cost)}</p>
            </div>
            <div className="p-3 space-y-1 text-xs">
               <div className="flex justify-between"><span className="text-gray-500">Processing:</span><span className="font-semibold">{formatterUSD(cr_req_cost + cr_vcpu_cost + cr_mem_cost + cr_idle_cost)}</span></div>
               <div className="flex justify-between"><span className="text-gray-500">Networking:</span><span className="font-semibold">{formatterUSD(cr_egress_cost)}</span></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-3 bg-white flex justify-between items-center border-b border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-900">AWS ECS Fargate</p>
                  <p className="text-[10px] text-gray-500">Monthly Compute Cost</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatterUSD(total_aws_compute_cost)}</p>
             </div>
             <div className="p-3 space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Processing:</span><span className="font-semibold">{formatterUSD(awsComputeCost)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Networking:</span><span className="font-semibold">{formatterUSD(awsEgressCost + awsVpcCost)}</span></div>
             </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-3 bg-white flex justify-between items-center border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-900">Firestore <span className="text-[10px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded ml-1">{firestoreEdition}</span></p>
                <p className="text-[10px] text-gray-500">Monthly DB Cost</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatterUSD(total_firestore_cost_usd)}</p>
           </div>
           <div className="p-3 space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Reads:</span><span className="font-semibold">{formatterUSD(fs_reads_cost)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Writes:</span><span className="font-semibold">{formatterUSD(fs_writes_cost)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Storage:</span><span className="font-semibold">{formatterUSD(fs_storage_cost)}</span></div>
           </div>
        </div>

        <div className="bg-gray-900 rounded-xl overflow-hidden p-4 flex items-center justify-between shadow-md relative">
          <div className="relative z-10">
            <h3 className="text-gray-400 font-medium text-xs mb-1">Total Estimated Infra Bill</h3>
            <div className="text-2xl font-bold text-white tracking-tight">{formatterUSD(total_backend_cost_usd)} <span className="text-gray-500 text-sm font-medium">/mo</span></div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center relative z-10">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
