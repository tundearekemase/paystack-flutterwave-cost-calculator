import React, { useState } from 'react';
import { Settings2, Cloud, Database, AlertCircle, Zap, ToggleRight, ToggleLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalStore } from '../store/useGlobalStore';
import { SliderInput } from './ui/SliderInput';
import { InputGroup } from './ui/InputGroup';
import { Checkbox } from './ui/Checkbox';
import { formatNum } from '../utils/formatters';
import { GCP, AWS, FS } from '../utils/constants';

export default function CloudCalculator({ formatterUSD, onCostChange }: any) {
  const globalStore = useGlobalStore();
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

  // --- TRAFFIC ---
  const totalMonthlyUsers = users;
  const totalMonthlyBackendReqs = totalMonthlyUsers * requestsPerUserMonth;
  const t_sec = inputs.backendRequestTimeMs / 1000;
  // Network Egress based on global MB setting per transaction
  const total_egress_gib = (totalMonthlyTxns * globalStore.networkEgressMBPerTransaction) / 1024;

  // --- GCP CLOUD RUN ---
  const cr_billable_reqs = Math.max(0, totalMonthlyBackendReqs - GCP.CR_FREE_REQS);
  const cr_req_cost = (cr_billable_reqs / 1000000) * GCP.CR_PRICE_PER_M_REQS;

  const cr_total_compute_sec = (totalMonthlyBackendReqs * t_sec) / (inputs.cloudRunConcurrency || 1);

  const cr_billable_vcpu_sec = Math.max(0, (cr_total_compute_sec * inputs.cloudRunVcpu) - GCP.CR_FREE_VCPU_SEC);
  const cr_vcpu_cost = cr_billable_vcpu_sec * GCP.CR_PRICE_VCPU_SEC;

  const cr_billable_mem_sec = Math.max(0, (cr_total_compute_sec * inputs.cloudRunMemGib) - GCP.CR_FREE_MEM_SEC);
  const cr_mem_cost = cr_billable_mem_sec * GCP.CR_PRICE_MEM_SEC;

  const cr_billable_egress = Math.max(0, total_egress_gib - GCP.FREE_EGRESS_GIB);
  const cr_egress_cost = cr_billable_egress * GCP.PRICE_EGRESS_GIB;

  const SECONDS_PER_MONTH = 2592000;
  const cr_idle_vcpu_cost = inputs.minInstances * inputs.cloudRunVcpu * SECONDS_PER_MONTH * GCP.CR_IDLE_PRICE_VCPU_SEC;
  const cr_idle_mem_cost = inputs.minInstances * inputs.cloudRunMemGib * SECONDS_PER_MONTH * GCP.CR_IDLE_PRICE_MEM_SEC;
  const cr_idle_cost = cr_idle_vcpu_cost + cr_idle_mem_cost;

  const total_gcp_compute_cost = cr_req_cost + cr_vcpu_cost + cr_mem_cost + cr_egress_cost + cr_idle_cost;

  // --- AWS ECS FARGATE ---
  const ecsActiveInstanceRate = (inputs.ecsFargateVcpu * AWS.FARGATE_VCPU_RATE) + (inputs.ecsFargateMemGb * AWS.FARGATE_MEM_RATE);
  
  const totalFargateComputeHoursRequired = (totalMonthlyBackendReqs * t_sec) / 3600;
  const ecsTaskConcurrency = inputs.ecsTaskConcurrencyLimit || 1;
  const totalTaskHoursNeeded = totalFargateComputeHoursRequired / ecsTaskConcurrency;
  
  const expectedTaskHours = Math.max(inputs.ecsMinTasks * 720, totalTaskHoursNeeded);
  const awsComputeCost = expectedTaskHours * ecsActiveInstanceRate;
  
  const awsBaselineCost = Math.min(awsComputeCost, inputs.ecsMinTasks * 720 * ecsActiveInstanceRate);
  const awsPeakCost = awsComputeCost - awsBaselineCost;

  const awsBillableEgress = Math.max(0, total_egress_gib - AWS.EGRESS_FREE_GB);
  const awsEgressCost = awsBillableEgress * AWS.EGRESS_RATE;
  
  const awsVpcCost = awsRequireVpcNat ? (AWS.NAT_GATEWAY_FLAT + (total_egress_gib * AWS.NAT_GATEWAY_DATA)) : 0;
  const awsDeployCost = awsAutomatedDeployments ? AWS.ECS_DEPLOY_TOTAL : 0;
  const awsLoggingCost = inputs.awsCloudWatchLogsGb * AWS.CLOUDWATCH_RATE;

  const total_aws_compute_cost = awsComputeCost + awsEgressCost + awsVpcCost + awsDeployCost + awsLoggingCost;
  const compute_subtotal_usd = computeProvider === 'gcp' ? total_gcp_compute_cost : total_aws_compute_cost;

  // --- FIRESTORE ---
  const total_reads = totalMonthlyBackendReqs * firestoreReadsReq;
  const total_writes = totalMonthlyBackendReqs * firestoreWritesReq;
  const total_storage_gib = (totalMonthlyUsers * inputs.firestoreStorageMb) / 1024;

  let fs_reads_cost = 0;
  let fs_writes_cost = 0;
  let fs_storage_cost = 0;

  if (firestoreEdition === 'standard') {
    const fs_billable_reads = Math.max(0, total_reads - inputs.firestoreStandardFreeReadsMo);
    fs_reads_cost = (fs_billable_reads / 100000) * FS.PRICE_PER_100K_READS;

    const fs_billable_writes = Math.max(0, total_writes - inputs.firestoreStandardFreeWritesMo);
    fs_writes_cost = (fs_billable_writes / 100000) * FS.PRICE_PER_100K_WRITES;

    const fs_billable_storage = Math.max(0, total_storage_gib - inputs.firestoreStandardFreeStorageGib);
    fs_storage_cost = fs_billable_storage * FS.PRICE_STORAGE_GIB;
  } else {
    const fs_billable_reads_mil = Math.max(0, (total_reads / 1000000) - inputs.firestoreEnterpriseFreeReadsMillion);
    fs_reads_cost = fs_billable_reads_mil * FS.ENT_PRICE_READS_MILLION;

    const fs_billable_writes_mil = Math.max(0, (total_writes / 1000000) - inputs.firestoreEnterpriseFreeWritesMillion);
    fs_writes_cost = fs_billable_writes_mil * FS.ENT_PRICE_WRITES_MILLION;

    const fs_billable_storage = Math.max(0, total_storage_gib - inputs.firestoreEnterpriseFreeStorageGib);
    fs_storage_cost = fs_billable_storage * FS.ENT_PRICE_STORAGE_GIB;
  }

  const total_firestore_cost_usd = fs_reads_cost + fs_writes_cost + fs_storage_cost;
  const total_backend_cost_usd = compute_subtotal_usd + total_firestore_cost_usd;

  React.useEffect(() => {
    if (onCostChange) onCostChange(total_backend_cost_usd);
  }, [total_backend_cost_usd, onCostChange]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-0">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">Backend Infrastructure</h2>
      </div>

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
  );
}
