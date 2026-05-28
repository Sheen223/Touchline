import { create } from 'zustand';

export const usePortfolioStore = create((set, get) => ({
  // State
  totalValue: 500,
  initialDeposit: 500,
  currentValue: 524.50,
  profitLoss: 24.50,
  yieldEarned: 4.50,
  isActive: true,
  strategy: 'Balanced',
  agentStatus: 'idle',
  rebalanceHistory: [],
  
  positions: [
    { team: 'Brazil', group: 'C', value: 110, probability: 0.71 },
    { team: 'Morocco', group: 'C', value: 150, probability: 0.81 },
    { team: 'Scotland', group: 'C', value: 100, probability: 0.68 },
    { team: 'USA', group: 'D', value: 80, probability: 0.75 },
    { team: 'Australia', group: 'E', value: 84.50, probability: 0.65 }
  ],
  
  allocations: {
    'Brazil': 110,
    'Morocco': 150,
    'Scotland': 100,
    'USA': 80,
    'Australia': 84.50
  },
  
  // Actions
  deposit: (amount, strategy, positions, allocations) => set({
    totalValue: amount,
    initialDeposit: amount,
    currentValue: amount,
    isActive: true,
    strategy: strategy,
    positions: positions,
    allocations: allocations,
    agentStatus: 'ready'
  }),
  
  updatePortfolio: (newValue, yieldAmount) => set((state) => ({
    currentValue: newValue,
    profitLoss: newValue - state.initialDeposit,
    yieldEarned: state.yieldEarned + yieldAmount
  })),
  
  updatePositions: (positions) => set({ positions }),
  
  updateAllocations: (allocations) => set({ allocations }),
  
  setAgentStatus: (status) => set({ agentStatus: status }),
  
  addRebalanceAction: (action) => set((state) => ({
    rebalanceHistory: [action, ...state.rebalanceHistory].slice(0, 20)
  })),
  
  reset: () => set({
    totalValue: 0,
    initialDeposit: 0,
    currentValue: 0,
    profitLoss: 0,
    yieldEarned: 0,
    isActive: false,
    strategy: 'Balanced',
    positions: [],
    allocations: {},
    agentStatus: 'idle',
    rebalanceHistory: []
  })
}));