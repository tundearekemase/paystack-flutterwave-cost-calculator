// GCP Constants
export const GCP = {
  CR_FREE_REQS: 2000000,
  CR_PRICE_PER_M_REQS: 0.40,
  CR_FREE_VCPU_SEC: 180000,
  CR_PRICE_VCPU_SEC: 0.000024,
  CR_FREE_MEM_SEC: 360000,
  CR_PRICE_MEM_SEC: 0.0000025,
  FREE_EGRESS_GIB: 1,
  PRICE_EGRESS_GIB: 0.12,
  CR_IDLE_PRICE_VCPU_SEC: 0.0000025,
  CR_IDLE_PRICE_MEM_SEC: 0.0000025
};

// ECS Fargate Constants (2026)
export const AWS = {
  FARGATE_VCPU_RATE: 0.04048,
  FARGATE_MEM_RATE: 0.004445,
  EGRESS_FREE_GB: 100,
  EGRESS_RATE: 0.08,
  NAT_GATEWAY_FLAT: 32.40,
  NAT_GATEWAY_DATA: 0.045,
  ECS_DEPLOY_TOTAL: 2.00,
  CLOUDWATCH_RATE: 0.50,
};

// Firestore Constants
export const FS = {
  PRICE_PER_100K_READS: 0.036,
  PRICE_PER_100K_WRITES: 0.108,
  PRICE_STORAGE_GIB: 0.15,
  ENT_PRICE_READS_MILLION: 0.05,
  ENT_PRICE_WRITES_MILLION: 0.26,
  ENT_PRICE_STORAGE_GIB: 0.15,
};

// WhatsApp Constants
export const WA_RATES: Record<string, { name: string, marketing: number, utility: number, authentication: number }> = {
  'NGA': { name: 'Nigeria', marketing: 0.0510, utility: 0.0250, authentication: 0.0300 },
  'GHA': { name: 'Ghana', marketing: 0.0460, utility: 0.0230, authentication: 0.0300 },
  'SEN': { name: 'Senegal', marketing: 0.0550, utility: 0.0280, authentication: 0.0300 },
  'CIV': { name: 'Ivory Coast', marketing: 0.0530, utility: 0.0270, authentication: 0.0300 },
  'OWA': { name: 'Other W.A.', marketing: 0.0550, utility: 0.0280, authentication: 0.0300 },
};
