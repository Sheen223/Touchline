import React, { useState } from 'react';
import { X, TrendingUp, Shield, Zap, CheckCircle } from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';

const strategies = [
  {
    id: 'Balanced',
    name: 'Balanced',
    description: '60% favorites, 30% mid-tier, 10% underdogs',
    icon: TrendingUp,
    risk: 'Moderate',
    color: 'from-blue-500 to-cyan-500',
    expectedReturn: '15-25%'
  },
  {
    id: 'Aggressive',
    name: 'Aggressive',
    description: '40% favorites, 40% mid-tier, 20% underdogs',
    icon: Zap,
    risk: 'High',
    color: 'from-purple-500 to-pink-500',
    expectedReturn: '25-40%'
  },
  {
    id: 'Conservative',
    name: 'Conservative',
    description: '80% favorites, 15% mid-tier, 5% underdogs',
    icon: Shield,
    risk: 'Low',
    color: 'from-green-500 to-emerald-500',
    expectedReturn: '8-15%'
  }
];

export const DepositModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(500);
  const [selectedStrategy, setSelectedStrategy] = useState('Balanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { deposit } = usePortfolioStore();

  const handleDeposit = async () => {
    setIsProcessing(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create initial portfolio positions based on strategy
    const initialPositions = {
      Balanced: [
        { team: 'Brazil', group: 'C', value: amount * 0.22, probability: 0.88 },
        { team: 'Morocco', group: 'C', value: amount * 0.11, probability: 0.62 },
        { team: 'Scotland', group: 'C', value: amount * 0.08, probability: 0.45 },
        { team: 'USA', group: 'D', value: amount * 0.05, probability: 0.75 }
      ],
      Aggressive: [
        { team: 'Brazil', group: 'C', value: amount * 0.15, probability: 0.88 },
        { team: 'Morocco', group: 'C', value: amount * 0.15, probability: 0.62 },
        { team: 'Scotland', group: 'C', value: amount * 0.12, probability: 0.45 },
        { team: 'USA', group: 'D', value: amount * 0.08, probability: 0.75 }
      ],
      Conservative: [
        { team: 'Brazil', group: 'C', value: amount * 0.35, probability: 0.88 },
        { team: 'Morocco', group: 'C', value: amount * 0.08, probability: 0.62 },
        { team: 'USA', group: 'D', value: amount * 0.12, probability: 0.75 }
      ]
    };
    
    const positions = initialPositions[selectedStrategy];
    const allocations = {};
    positions.forEach(p => { allocations[p.team] = p.value; });
    
    deposit(amount, selectedStrategy, positions, allocations);
    setIsProcessing(false);
    setIsComplete(true);
    
    setTimeout(() => {
      setIsComplete(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-neon-cyan/30 rounded-2xl p-8 max-w-md w-full mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        {!isComplete ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Deposit to Touchline</h2>
            <p className="text-gray-400 text-sm mb-6">Start your World Cup portfolio journey</p>
            
            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Amount (USDC)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-8 py-3 text-white text-lg focus:outline-none focus:border-neon-cyan"
                  placeholder="500"
                />
              </div>
            </div>
            
            {/* Strategy Selection */}
            <div className="mb-8">
              <label className="block text-sm text-gray-400 mb-3">Select Strategy</label>
              <div className="space-y-3">
                {strategies.map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setSelectedStrategy(strat.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      selectedStrategy === strat.id
                        ? `bg-gradient-to-r ${strat.color} border-transparent`
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <strat.icon className="w-5 h-5" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{strat.name}</div>
                      <div className="text-xs opacity-80">{strat.description}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        strat.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                        strat.risk === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {strat.risk} Risk
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">{strat.expectedReturn} ROI</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Deposit Button */}
            <button
              onClick={handleDeposit}
              disabled={isProcessing}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                isProcessing
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-neon-cyan to-neon-purple hover:shadow-lg'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing on Solana...
                </span>
              ) : (
                `Deposit $${amount} USDC`
              )}
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-neon-green" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Deposit Successful!</h3>
            <p className="text-gray-400">Your portfolio is now active</p>
          </div>
        )}
        
        <p className="text-xs text-gray-500 text-center mt-4">
          Demo Mode • Simulated transactions on Solana
        </p>
      </div>
    </div>
  );
};