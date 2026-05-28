import React, { useState } from 'react';
import { X, TrendingUp, Shield, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const strategies = [
  {
    id: 'Balanced',
    name: 'Balanced',
    description: '60% favorites · 30% mid-tier · 10% underdogs',
    icon: TrendingUp,
    risk: 'Moderate',
    expectedReturn: '15-25%',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'Aggressive',
    name: 'Aggressive',
    description: '40% favorites · 40% mid-tier · 20% underdogs',
    icon: Zap,
    risk: 'High',
    expectedReturn: '25-40%',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'Conservative',
    name: 'Conservative',
    description: '80% favorites · 15% mid-tier · 5% underdogs',
    icon: Shield,
    risk: 'Low',
    expectedReturn: '8-15%',
    color: 'from-green-500 to-emerald-500'
  }
];

export const DepositModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(500);
  const [selectedStrategy, setSelectedStrategy] = useState('Balanced');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep(3);
    setTimeout(() => {
      setStep(1);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Deposit to CupFolio</h2>
            <p className="text-sm text-white/40 mt-1">Start your World Cup portfolio</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Amount (USDC)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-8 py-3 text-white text-lg focus:outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Strategy Selection */}
              <div>
                <label className="block text-sm text-white/60 mb-3">Select Strategy</label>
                <div className="space-y-3">
                  {strategies.map((strat) => (
                    <button
                      key={strat.id}
                      onClick={() => setSelectedStrategy(strat.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        selectedStrategy === strat.id
                          ? `bg-gradient-to-r ${strat.color} border-transparent`
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <strat.icon className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-white">{strat.name}</div>
                        <div className="text-xs text-white/50">{strat.description}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          strat.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                          strat.risk === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {strat.risk}
                        </div>
                        <div className="text-[10px] text-white/40 mt-1">{strat.expectedReturn} ROI</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Confirmation */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Confirm Deposit</h3>
                  <p className="text-sm text-white/40 mt-1">Review your deposit details</p>
                </div>
              </div>

              {/* Details */}
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/40">Amount</span>
                  <span className="text-white font-medium">${amount} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Strategy</span>
                  <span className="text-cyan-400">{selectedStrategy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Network</span>
                  <span className="text-white/80">X Layer</span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between">
                  <span className="text-white/40">Est. Gas Fee</span>
                  <span className="text-white/60">~$0.01</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 font-medium hover:bg-white/10 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDeposit}
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Confirm Deposit'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Deposit Successful!</h3>
                <p className="text-white/40 mt-2">Your portfolio is now active</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-white/40">Transaction Hash</p>
                <p className="text-sm text-cyan-400 font-mono">0x7a8f...3e9c</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-center text-xs text-white/30">
            Demo Mode • Simulated transactions on X Layer testnet
          </p>
        </div>
      </div>
    </div>
  );
};