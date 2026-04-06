import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, Server, Cloud, Database, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalStore } from '../store/useGlobalStore';
import { InputGroup } from './ui/InputGroup';
import { Checkbox } from './ui/Checkbox';
import { formatNum } from '../utils/formatters';
import { GCP, AWS, FS } from '../utils/constants';

export default function CloudCalculator({ formatterUSD }: any) {
  const globalStore = useGlobalStore();
  const [useGlobal, setUseGlobal] = useState(true);

  const [showCloudAdvanced, setShowCloudAdvanced] = useState(false);
  const [computeProvider, setComputeProvider] = useState<'gcp' | 'aws'>('gcp');
  const [firestoreEdition, setFirestoreEdition] = useState<'standard' | 'enterprise'>('standard');
  const [awsRequireVpcNat, setAwsRequireVpcNat] = useState(false);
  const [awsAutomatedDeployments, setAwsAutomatedDeployments] = useState(false);

  // Local Overrides
  const [localUsers, setLocalUsers] = useState(1000);
  const [localRequestsPerUserMonth, setLocalRequestsPerUserMonth] = useState(100);
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

  return (
    <section>
      <div className="mb-6 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">Backend Infrastructure Cost</h1>
        <p className="text-gray-500 text-lg">Estimate your monthly cloud backend billing and database operations based on your user growth.</p>
      </div>

      <div className="flex flex-col space-y-3 max-w-sm mb-6">
        <label className="text-sm font-semibold text-gray-900">Compute Backend Engine</label>
        <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm p-1 bg-gray-100 gap-1 w-fit">
          <button onClick={() => setComputeProvider('gcp')} className={`px-5 py-2 text-sm font-medium rounded transition-all duration-200 ${computeProvider === 'gcp' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-gray-600 hover:text-gray-800'}`}>Google Cloud Run</button>
          <button onClick={() => setComputeProvider('aws')} className={`px-5 py-2 text-sm font-medium rounded transition-all duration-200 ${computeProvider === 'aws' ? 'bg-white text-amber-600 shadow-sm font-bold border border-amber-100' : 'text-gray-600 hover:text-gray-800'}`}>AWS ECS Fargate</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-400" /> Traffic & Resources
                </h2>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="useGlobalCloud" checked={useGlobal} onChange={e => setUseGlobal(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"/>
                  <label htmlFor="useGlobalCloud" className="text-xs font-medium text-gray-600">Use Global</label>
                </div>
              </div>
              
              <div className="space-y-4">
                <InputGroup label="Active Customers / Mo" disabled={useGlobal} value={users} onChange={setLocalUsers} />
                <InputGroup label="Requests per User/Month" disabled={useGlobal} value={requestsPerUserMonth} onChange={setLocalRequestsPerUserMonth} />
                
                <div className="pt-2 pb-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-500" />
                    <div>Total Monthly Requests:<br/><span className="font-semibold text-lg">{formatNum(totalMonthlyBackendReqs)}</span></div>
                  </div>
                </div>
                
                <InputGroup label="Avg Request Duration" value={inputs.backendRequestTimeMs} onChange={(v) => updateInput('backendRequestTimeMs', v)} suffix="ms" />
              </div>
            </div>

            <div className="border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowCloudAdvanced(!showCloudAdvanced)} className="w-full px-6 py-4 flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                <span className="flex items-center gap-2">
                  <Server className="w-4 h-4" /> {computeProvider === 'gcp' ? 'GCP' : 'AWS'} Infra Settings
                </span>
                {showCloudAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <AnimatePresence>
                {showCloudAdvanced && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-6 pb-6 space-y-6 pt-2">
                      {computeProvider === 'gcp' ? (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800 border-b border-blue-100 pb-2 flex items-center gap-2"><Cloud className="w-4 h-4 text-blue-500" /> Cloud Run Instance</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="vCPU alloc." value={inputs.cloudRunVcpu} onChange={(v) => updateInput('cloudRunVcpu', v)} step="0.1" />
                            <InputGroup label="Memory (GiB)" value={inputs.cloudRunMemGib} onChange={(v) => updateInput('cloudRunMemGib', v)} step="0.1" />
                            <div className="col-span-2">
                              <InputGroup label="Avg Concurrent Req" value={inputs.cloudRunConcurrency} onChange={(v) => updateInput('cloudRunConcurrency', v)} />
                            </div>
                            <div className="col-span-2 border-t border-gray-100 pt-3">
                              <InputGroup label="Min Instances (Always On)" value={inputs.minInstances} onChange={(v) => updateInput('minInstances', v)} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-amber-800 border-b border-amber-100 pb-2 flex items-center gap-2"><Cloud className="w-4 h-4 text-amber-500" /> ECS Task (Fargate)</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="vCPU alloc." value={inputs.ecsFargateVcpu} onChange={(v) => updateInput('ecsFargateVcpu', v)} step="0.25" />
                            <InputGroup label="Memory (GB)" value={inputs.ecsFargateMemGb} onChange={(v) => updateInput('ecsFargateMemGb', v)} step="1" />
                            <div className="col-span-2">
                              <InputGroup label="Task Concurrency" value={inputs.ecsTaskConcurrencyLimit} onChange={(v) => updateInput('ecsTaskConcurrencyLimit', v)} />
                            </div>
                            <div className="col-span-2 border-t border-gray-100 pt-3">
                              <InputGroup label="Min Tasks Default" value={inputs.ecsMinTasks} onChange={(v) => updateInput('ecsMinTasks', v)} />
                            </div>
                          </div>
                          <div>
                            <Checkbox label="Require VPC & NAT" checked={awsRequireVpcNat} onChange={setAwsRequireVpcNat} />
                            <Checkbox label="Auto Deployments" checked={awsAutomatedDeployments} onChange={setAwsAutomatedDeployments} />
                            <div className="pt-3">
                              <InputGroup label="CloudWatch Logs Size" value={inputs.awsCloudWatchLogsGb} onChange={(v) => updateInput('awsCloudWatchLogsGb', v)} suffix="GB" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 border-b pb-2 flex items-center gap-2"><Database className="w-4 h-4 text-gray-500" /> Firestore Tuning</h3>
                        
                        <div className="flex flex-col space-y-2 mb-3">
                          <label className="text-sm text-gray-700 font-medium">Firestore Edition</label>
                          <div className="flex rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                            <button onClick={() => setFirestoreEdition('standard')} className={`flex-1 px-3 py-2 text-xs font-medium transition-all duration-200 ${firestoreEdition === 'standard' ? 'bg-gray-900 text-white shadow-inner' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Standard</button>
                            <button onClick={() => setFirestoreEdition('enterprise')} className={`flex-1 px-3 py-2 text-xs font-medium transition-all duration-200 border-l border-gray-300 ${firestoreEdition === 'enterprise' ? 'bg-gray-900 text-white shadow-inner' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Enterprise</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <InputGroup label="Reads/Req" disabled={useGlobal} value={firestoreReadsReq} onChange={setLocalFirestoreReadsReq} step="1" />
                          <InputGroup label="Writes/Req" disabled={useGlobal} value={firestoreWritesReq} onChange={setLocalFirestoreWritesReq} step="1" />
                          <div className="col-span-2">
                            <InputGroup label="Storage per User" value={inputs.firestoreStorageMb} onChange={(v) => updateInput('firestoreStorageMb', v)} step="0.1" suffix="MB" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {computeProvider === 'gcp' ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-blue-50/50 to-white">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                      <Cloud className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Google Cloud Run</h2>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Monthly Compute Cost</p>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterUSD(total_gcp_compute_cost)}</p>
                </div>
                <div className="p-6 flex-1 bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">HTTP Requests</span><span className="font-medium">{formatterUSD(cr_req_cost)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">vCPU Time</span><span className="font-medium">{formatterUSD(cr_vcpu_cost)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Memory Time</span><span className="font-medium">{formatterUSD(cr_mem_cost)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Networking (Egress)</span><span className="font-medium">{formatterUSD(cr_egress_cost)}</span></div>
                    {cr_idle_cost > 0 && (
                      <div className="flex justify-between text-yellow-700 bg-yellow-100/50 -mx-2 px-2 py-1 rounded">
                        <span>Idle Penalty</span><span className="font-medium">{formatterUSD(cr_idle_cost)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative border-amber-200">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-amber-50/80 to-white">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center">
                      <Cloud className="w-4 h-4 text-amber-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">AWS ECS Fargate</h2>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Monthly Compute Cost</p>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterUSD(total_aws_compute_cost)}</p>
                </div>
                <div className="p-6 flex-1 bg-gray-50/50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Baseline Provisioned</span><span className="font-medium">{formatterUSD(awsBaselineCost)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Active Extra Load Computes</span><span className="font-medium">{formatterUSD(awsPeakCost)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Networking (Egress)</span><span className="font-medium">{formatterUSD(awsEgressCost)}</span></div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-orange-50/50 to-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
                    <Database className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Firestore 
                    <span className="text-xs font-medium bg-white border border-orange-200 text-orange-700 px-2 py-0.5 rounded-full ml-2 capitalize shadow-sm">{firestoreEdition}</span>
                  </h2>
                </div>
                <p className="text-sm text-gray-500 font-medium">Monthly DB Cost</p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatterUSD(total_firestore_cost_usd)}</p>
              </div>
              <div className="p-6 flex-1 bg-gray-50/50">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Cost breakdown</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Reads ({formatNum(total_reads)})</span><span className="font-medium">{formatterUSD(fs_reads_cost)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Writes ({formatNum(total_writes)})</span><span className="font-medium">{formatterUSD(fs_writes_cost)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Storage ({total_storage_gib.toFixed(2)} GiB)</span><span className="font-medium">{formatterUSD(fs_storage_cost)}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden p-6 flex items-center justify-between gap-6 relative">
            <div className="relative z-10">
              <h3 className="text-gray-400 font-medium text-lg mb-1">Total Estimated Infra Bill</h3>
              <div className="text-4xl font-bold text-white tracking-tight">{formatterUSD(total_backend_cost_usd)} <span className="text-gray-500 text-lg font-medium">/ mo</span></div>
            </div>
            <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center relative z-10 shadow-lg">
              <Zap className="w-7 h-7 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
