import { create } from 'zustand';

interface GlobalState {
  monthlyActiveUsers: number;
  transactionsPerUserMonthly: number;
  averageCartValue: number;
  whatsappMessagesPerTransaction: {
    freeReplies: number;
    utilityTemplates: number;
    marketingTemplates: number;
    authenticationTemplates: number;
  };
  databaseReadsWritesPerTransaction: {
    reads: number;
    writes: number;
  };
  networkEgressMBPerTransaction: number;

  displayCurrency: 'NGN' | 'USD';
  usdToNgnRate: number;
  costs: {
    paymentNGN: number;
    cloudUSD: number;
    whatsappUSD: number;
    payoutNative: number;
    payoutCountry: string;
  };
  
  // Actions
  setMonthlyActiveUsers: (val: number) => void;
  setTransactionsPerUserMonthly: (val: number) => void;
  setAverageCartValue: (val: number) => void;
  setNetworkEgressMB: (val: number) => void;
  setWhatsappMessages: (key: keyof GlobalState['whatsappMessagesPerTransaction'], val: number) => void;
  setDatabaseOperations: (key: keyof GlobalState['databaseReadsWritesPerTransaction'], val: number) => void;
  setDisplayCurrency: (val: 'NGN' | 'USD') => void;
  setUsdToNgnRate: (val: number) => void;
  setCosts: (key: keyof GlobalState['costs'], val: any) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  monthlyActiveUsers: 1000,
  transactionsPerUserMonthly: 12,
  averageCartValue: 10000,
  whatsappMessagesPerTransaction: {
    freeReplies: 1,
    utilityTemplates: 2,
    marketingTemplates: 0,
    authenticationTemplates: 1,
  },
  databaseReadsWritesPerTransaction: {
    reads: 10,
    writes: 2,
  },
  networkEgressMBPerTransaction: 1.5,

  displayCurrency: 'NGN',
  usdToNgnRate: 1500,
  costs: {
    paymentNGN: 0,
    cloudUSD: 0,
    whatsappUSD: 0,
    payoutNative: 0,
    payoutCountry: 'NG',
  },

  setMonthlyActiveUsers: (val) => set({ monthlyActiveUsers: val }),
  setTransactionsPerUserMonthly: (val) => set({ transactionsPerUserMonthly: val }),
  setAverageCartValue: (val) => set({ averageCartValue: val }),
  setNetworkEgressMB: (val) => set({ networkEgressMBPerTransaction: val }),
  setWhatsappMessages: (key, val) => 
    set((state) => ({
      whatsappMessagesPerTransaction: {
        ...state.whatsappMessagesPerTransaction,
        [key]: val,
      },
    })),
  setDatabaseOperations: (key, val) => 
    set((state) => ({
      databaseReadsWritesPerTransaction: {
        ...state.databaseReadsWritesPerTransaction,
        [key]: val,
      },
    })),
  setDisplayCurrency: (val) => set({ displayCurrency: val }),
  setUsdToNgnRate: (val) => set({ usdToNgnRate: val }),
  setCosts: (key, val) => 
    set((state) => ({
      costs: {
        ...state.costs,
        [key]: val,
      },
    })),
}));
