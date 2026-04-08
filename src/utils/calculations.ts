import { GCP, AWS, FS, WA_RATES } from './constants';

export interface PaymentCalcParams {
  gatewayProvider: 'paystack' | 'flutterwave';
  feeBearer: 'merchant' | 'customer';
  price: number;
  users: number;
  txnsPerMonth: number;
  paystackPercentage: number;
  paystackCap: number;
  paystackFlatThreshold: number;
  paystackFlatAmount: number;
  flutterwavePercentage: number;
  flutterwaveCap: number;
}

export function calculatePaymentCost(params: PaymentCalcParams) {
  const {
    gatewayProvider, feeBearer, price, users, txnsPerMonth,
    paystackPercentage, paystackCap, paystackFlatThreshold, paystackFlatAmount,
    flutterwavePercentage, flutterwaveCap
  } = params;

  const totalMonthlyTxns = users * txnsPerMonth;

  // Paystack
  const paystackDecimalRate = paystackPercentage / 100;
  const paystackFlatFee = price >= paystackFlatThreshold ? paystackFlatAmount : 0;
  let paystackProcessingFee: number;

  if (feeBearer === 'merchant') {
    const calculatedFee = price * paystackDecimalRate + paystackFlatFee;
    paystackProcessingFee = Math.min(calculatedFee, paystackCap);
  } else {
    const uncappedCharge = (price + paystackFlatFee) / (1 - paystackDecimalRate);
    const uncappedFee = uncappedCharge - price;
    if (uncappedFee > paystackCap) {
      paystackProcessingFee = paystackCap;
    } else {
      paystackProcessingFee = Math.round(uncappedFee * 100) / 100;
    }
  }
  const paystackMonthlyCost = paystackProcessingFee * totalMonthlyTxns;

  // Flutterwave
  const flutterwaveDecimalRate = flutterwavePercentage / 100;
  let flutterwaveProcessingFee: number;

  if (feeBearer === 'merchant') {
    const calculatedFee = price * flutterwaveDecimalRate;
    flutterwaveProcessingFee = Math.min(calculatedFee, flutterwaveCap);
  } else {
    const uncappedCharge = price / (1 - flutterwaveDecimalRate);
    const uncappedFee = uncappedCharge - price;

    if (uncappedFee > flutterwaveCap) {
      flutterwaveProcessingFee = flutterwaveCap;
    } else {
      flutterwaveProcessingFee = Math.round(uncappedFee * 100) / 100;
    }
  }
  const flutterwaveMonthlyCost = flutterwaveProcessingFee * totalMonthlyTxns;

  return {
    paystackMonthlyCost,
    paystackProcessingFee,
    flutterwaveMonthlyCost,
    flutterwaveProcessingFee,
    totalCost: gatewayProvider === 'paystack' ? paystackMonthlyCost : flutterwaveMonthlyCost
  };
}

export interface CloudCalcParams {
  computeProvider: 'gcp' | 'aws';
  firestoreEdition: 'standard' | 'enterprise';
  awsRequireVpcNat: boolean;
  awsAutomatedDeployments: boolean;
  users: number;
  requestsPerUserMonth: number;
  firestoreReadsReq: number;
  firestoreWritesReq: number;
  totalMonthlyTxns: number;
  networkEgressMBPerTransaction: number;
  backendRequestTimeMs: number;
  cloudRunVcpu: number;
  cloudRunMemGib: number;
  cloudRunConcurrency: number;
  minInstances: number;
  ecsFargateVcpu: number;
  ecsFargateMemGb: number;
  ecsTaskConcurrencyLimit: number;
  ecsMinTasks: number;
  awsCloudWatchLogsGb: number;
  firestoreStorageMb: number;
  firestoreStandardFreeReadsMo: number;
  firestoreStandardFreeWritesMo: number;
  firestoreStandardFreeStorageGib: number;
  firestoreEnterpriseFreeReadsMillion: number;
  firestoreEnterpriseFreeWritesMillion: number;
  firestoreEnterpriseFreeStorageGib: number;
}

export function calculateCloudCost(params: CloudCalcParams) {
  const {
    computeProvider, firestoreEdition, awsRequireVpcNat, awsAutomatedDeployments,
    users, requestsPerUserMonth, firestoreReadsReq, firestoreWritesReq, totalMonthlyTxns, networkEgressMBPerTransaction,
    backendRequestTimeMs, cloudRunVcpu, cloudRunMemGib, cloudRunConcurrency, minInstances,
    ecsFargateVcpu, ecsFargateMemGb, ecsTaskConcurrencyLimit, ecsMinTasks, awsCloudWatchLogsGb,
    firestoreStorageMb, firestoreStandardFreeReadsMo, firestoreStandardFreeWritesMo, firestoreStandardFreeStorageGib,
    firestoreEnterpriseFreeReadsMillion, firestoreEnterpriseFreeWritesMillion, firestoreEnterpriseFreeStorageGib
  } = params;

  const totalMonthlyBackendReqs = users * requestsPerUserMonth;
  const t_sec = backendRequestTimeMs / 1000;
  const total_egress_gib = (totalMonthlyTxns * networkEgressMBPerTransaction) / 1024;

  // --- GCP CLOUD RUN ---
  const cr_billable_reqs = Math.max(0, totalMonthlyBackendReqs - GCP.CR_FREE_REQS);
  const cr_req_cost = (cr_billable_reqs / 1000000) * GCP.CR_PRICE_PER_M_REQS;

  const cr_total_compute_sec = (totalMonthlyBackendReqs * t_sec) / (cloudRunConcurrency || 1);

  const cr_billable_vcpu_sec = Math.max(0, (cr_total_compute_sec * cloudRunVcpu) - GCP.CR_FREE_VCPU_SEC);
  const cr_vcpu_cost = cr_billable_vcpu_sec * GCP.CR_PRICE_VCPU_SEC;

  const cr_billable_mem_sec = Math.max(0, (cr_total_compute_sec * cloudRunMemGib) - GCP.CR_FREE_MEM_SEC);
  const cr_mem_cost = cr_billable_mem_sec * GCP.CR_PRICE_MEM_SEC;

  const cr_billable_egress = Math.max(0, total_egress_gib - GCP.FREE_EGRESS_GIB);
  const cr_egress_cost = cr_billable_egress * GCP.PRICE_EGRESS_GIB;

  const SECONDS_PER_MONTH = 2592000;
  const cr_idle_vcpu_cost = minInstances * cloudRunVcpu * SECONDS_PER_MONTH * GCP.CR_IDLE_PRICE_VCPU_SEC;
  const cr_idle_mem_cost = minInstances * cloudRunMemGib * SECONDS_PER_MONTH * GCP.CR_IDLE_PRICE_MEM_SEC;
  const cr_idle_cost = cr_idle_vcpu_cost + cr_idle_mem_cost;

  const total_gcp_compute_cost = cr_req_cost + cr_vcpu_cost + cr_mem_cost + cr_egress_cost + cr_idle_cost;

  // --- AWS ECS FARGATE ---
  const ecsActiveInstanceRate = (ecsFargateVcpu * AWS.FARGATE_VCPU_RATE) + (ecsFargateMemGb * AWS.FARGATE_MEM_RATE);
  
  const totalFargateComputeHoursRequired = (totalMonthlyBackendReqs * t_sec) / 3600;
  const ecsTaskConcurrency = ecsTaskConcurrencyLimit || 1;
  const totalTaskHoursNeeded = totalFargateComputeHoursRequired / ecsTaskConcurrency;
  
  const expectedTaskHours = Math.max(ecsMinTasks * 720, totalTaskHoursNeeded);
  const awsComputeCost = expectedTaskHours * ecsActiveInstanceRate;
  
  const awsBillableEgress = Math.max(0, total_egress_gib - AWS.EGRESS_FREE_GB);
  const awsEgressCost = awsBillableEgress * AWS.EGRESS_RATE;
  
  const awsVpcCost = awsRequireVpcNat ? (AWS.NAT_GATEWAY_FLAT + (total_egress_gib * AWS.NAT_GATEWAY_DATA)) : 0;
  const awsDeployCost = awsAutomatedDeployments ? AWS.ECS_DEPLOY_TOTAL : 0;
  const awsLoggingCost = awsCloudWatchLogsGb * AWS.CLOUDWATCH_RATE;

  const total_aws_compute_cost = awsComputeCost + awsEgressCost + awsVpcCost + awsDeployCost + awsLoggingCost;
  const compute_subtotal_usd = computeProvider === 'gcp' ? total_gcp_compute_cost : total_aws_compute_cost;

  // --- FIRESTORE ---
  const total_reads = totalMonthlyBackendReqs * firestoreReadsReq;
  const total_writes = totalMonthlyBackendReqs * firestoreWritesReq;
  const total_storage_gib = (users * firestoreStorageMb) / 1024;

  let fs_reads_cost = 0;
  let fs_writes_cost = 0;
  let fs_storage_cost = 0;

  if (firestoreEdition === 'standard') {
    const fs_billable_reads = Math.max(0, total_reads - firestoreStandardFreeReadsMo);
    fs_reads_cost = (fs_billable_reads / 100000) * FS.PRICE_PER_100K_READS;

    const fs_billable_writes = Math.max(0, total_writes - firestoreStandardFreeWritesMo);
    fs_writes_cost = (fs_billable_writes / 100000) * FS.PRICE_PER_100K_WRITES;

    const fs_billable_storage = Math.max(0, total_storage_gib - firestoreStandardFreeStorageGib);
    fs_storage_cost = fs_billable_storage * FS.PRICE_STORAGE_GIB;
  } else {
    const fs_billable_reads_mil = Math.max(0, (total_reads / 1000000) - firestoreEnterpriseFreeReadsMillion);
    fs_reads_cost = fs_billable_reads_mil * FS.ENT_PRICE_READS_MILLION;

    const fs_billable_writes_mil = Math.max(0, (total_writes / 1000000) - firestoreEnterpriseFreeWritesMillion);
    fs_writes_cost = fs_billable_writes_mil * FS.ENT_PRICE_WRITES_MILLION;

    const fs_billable_storage = Math.max(0, total_storage_gib - firestoreEnterpriseFreeStorageGib);
    fs_storage_cost = fs_billable_storage * FS.ENT_PRICE_STORAGE_GIB;
  }

  const total_firestore_cost_usd = fs_reads_cost + fs_writes_cost + fs_storage_cost;
  const totalCost = compute_subtotal_usd + total_firestore_cost_usd;

  return {
    cr_req_cost, cr_vcpu_cost, cr_mem_cost, cr_egress_cost, cr_idle_cost, total_gcp_compute_cost,
    awsComputeCost, awsEgressCost, awsVpcCost, awsDeployCost, awsLoggingCost, total_aws_compute_cost,
    fs_reads_cost, fs_writes_cost, fs_storage_cost, total_firestore_cost_usd,
    totalCost
  };
}

export interface WhatsAppCalcParams {
  waTargetCountry: string;
  users: number;
  waMarketingMsgs: number;
  waUtilityMsgs: number;
  waAuthMsgs: number;
  waUserRequests: number;
  waUtilityInsideWindowPercent: number;
}

export function calculateWhatsAppCost(params: WhatsAppCalcParams) {
  const {
    waTargetCountry, users, waMarketingMsgs, waUtilityMsgs,
    waAuthMsgs, waUserRequests, waUtilityInsideWindowPercent
  } = params;

  const currentWaRate = WA_RATES[waTargetCountry];
  
  const totalMarketingMessages = users * waMarketingMsgs;
  const waMarketingCostUsd = totalMarketingMessages * currentWaRate.marketing;
  
  const totalAuthMessages = users * waAuthMsgs;
  const waAuthCostUsd = totalAuthMessages * currentWaRate.authentication;

  const totalServiceRequests = users * waUserRequests;
  const waServiceCostUsd = 0; 

  const totalUtilityMessages = users * waUtilityMsgs;
  const freeUtilityMessages = totalUtilityMessages * (waUtilityInsideWindowPercent / 100);
  const chargeableUtilityMessages = Math.max(0, totalUtilityMessages - freeUtilityMessages);

  let waUtilityCostUsd = 0;
  let remainingChargeable = chargeableUtilityMessages;
  
  if (remainingChargeable > 0) {
    const tier1 = Math.min(100000, remainingChargeable);
    waUtilityCostUsd += tier1 * currentWaRate.utility;
    remainingChargeable -= tier1;
  }
  if (remainingChargeable > 0) {
    const tier2 = Math.min(400000, remainingChargeable);
    waUtilityCostUsd += tier2 * (currentWaRate.utility * 0.95);
    remainingChargeable -= tier2;
  }
  if (remainingChargeable > 0) {
    waUtilityCostUsd += remainingChargeable * (currentWaRate.utility * 0.90);
  }

  const totalCost = waMarketingCostUsd + waAuthCostUsd + waServiceCostUsd + waUtilityCostUsd;

  return { waMarketingCostUsd, waAuthCostUsd, waServiceCostUsd, waUtilityCostUsd, totalCost };
}


export interface PayoutCalcParams {
  gatewayProvider: 'paystack' | 'flutterwave';
  country: 'NG' | 'GH' | 'KE' | 'ZA' | 'INTL';
  destination: 'bank' | 'mobile';
  intlRegion: 'USA' | 'UK' | 'SEPA';
  transferAmount: number;
  numberOfPayouts: number;
}

export function calculatePayoutCost(params: PayoutCalcParams) {
  const { gatewayProvider, country, destination, intlRegion, transferAmount, numberOfPayouts } = params;

  let fee = 0;
  let taxes = 0;
  let currencyStr = 'NGN';
  let isSupported = true;

  switch (country) {
    case 'NG':
      currencyStr = '₦';
      if (transferAmount <= 5000) fee = 10;
      else if (transferAmount <= 50000) fee = 25;
      else fee = 50;

      if (transferAmount >= 10000) taxes = 50;
      break;

    case 'GH':
      currencyStr = 'GH₵';
      if (gatewayProvider === 'paystack') {
        fee = destination === 'mobile' ? 1 : 8;
      } else {
        fee = destination === 'mobile' ? (transferAmount * 0.015) : 10;
      }
      break;

    case 'KE':
      currencyStr = 'KES';
      if (gatewayProvider === 'paystack') {
        if (transferAmount <= 1500) fee = 20;
        else if (transferAmount <= 20000) fee = 40;
        else fee = 60;
      } else {
        fee = 100;
      }
      break;

    case 'ZA':
      currencyStr = 'R';
      if (gatewayProvider === 'paystack') fee = 3;
      else fee = 10;
      break;

    case 'INTL':
      if (gatewayProvider === 'paystack') {
        isSupported = false;
      } else {
        if (intlRegion === 'USA') { fee = 40; currencyStr = '$'; }
        else if (intlRegion === 'UK') { fee = 35; currencyStr = '£'; }
        else { fee = 35; currencyStr = '€'; }
      }
      break;
  }

  const totalPerTransfer = fee + taxes;
  const totalCost = totalPerTransfer * numberOfPayouts;
  const totalAmountSentMonthly = transferAmount * numberOfPayouts;
  const totalDeductedMonthly = totalAmountSentMonthly + totalCost;

  return { fee, taxes, currencyStr, isSupported, totalPerTransfer, totalCost, totalDeductedMonthly };
}
