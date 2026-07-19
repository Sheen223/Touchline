import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, TrendingUp, Shield, Zap, CheckCircle, ArrowRight, 
  ArrowLeft, Wallet, Sparkles, AlertCircle, ExternalLink 
} from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';

const strategies = [
  {
    id: 'Balanced',
    name: 'Balanced',
    description: '60% favorites · 30% mid-tier · 10% underdogs',
    icon: TrendingUp,
    risk: 'Moderate',
    expectedReturn: '15-25%',
    color: 'from-cyan-500 to-blue-500',
    bgGradient: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30'
  },
  {
    id: 'Aggressive',
    name: 'Aggressive',
    description: '40% favorites · 40% mid-tier · 20% underdogs',
    icon: Zap,
    risk: 'High',
    expectedReturn: '25-40%',
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'Conservative',
    name: 'Conservative',
    description: '80% favorites · 15% mid-tier · 5% underdogs',
    icon: Shield,
    risk: 'Low',
    expectedReturn: '8-15%',
    color: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30'
  }
];

// Step Indicator Component
const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div key={idx} className="flex items-center">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              idx + 1 === currentStep
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
                : idx + 1 < currentStep
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/5 text-white/30 border border-white/10'
            }`}
          >
            {idx + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : idx + 1}
          </motion.div>
          {idx < totalSteps - 1 && (
            <div className={`w-12 h-px mx-1 transition-all ${
              idx + 1 < currentStep ? 'bg-emerald-500/50' : 'bg-white/10'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

// Amount Input Step
const AmountStep = ({ amount, setAmount, onNext }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const presets = [100, 500, 1000, 5000];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">How much would you like to deposit?</h3>
        <p className="text-sm text-white/40">Enter an amount to start your World Cup portfolio</p>
      </div>
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-cyan-400">$</div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-2xl text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors"
          placeholder="500"
          autoFocus
        />
      </div>
      
      <div className="flex gap-3">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset)}
            className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            ${preset}
          </button>
        ))}
      </div>
      
      <div className="bg-cyan-500/5 rounded-xl p-4 border border-cyan-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5" />
          <div className="text-xs text-white/40">
            <p>Your deposit will be deployed to:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Qualification position markets across 12 groups</li>
              <li>Yield-generating protocols during idle periods</li>
              <li>AI-managed rebalancing as matches progress</li>
            </ul>
          </div>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

// Strategy Selection Step
const StrategyStep = ({ selectedStrategy, setSelectedStrategy, onNext, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">Choose your strategy</h3>
        <p className="text-sm text-white/40">Select a risk profile that matches your goals</p>
      </div>
      
      <div className="space-y-3">
        {strategies.map((strat) => (
          <motion.button
            key={strat.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedStrategy(strat.id)}
            className={`w-full p-4 rounded-xl border transition-all text-left ${
              selectedStrategy === strat.id
                ? `bg-gradient-to-r ${strat.bgGradient} ${strat.borderColor} border-2`
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${strat.color} flex items-center justify-center`}>
                <strat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{strat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    strat.risk === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
                    strat.risk === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {strat.risk} Risk
                  </span>
                </div>
                <p className="text-xs text-white/40 mt-1">{strat.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Expected ROI</div>
                <div className="text-lg font-semibold text-white">{strat.expectedReturn}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2"
        >
          Review
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Confirmation Step
const ConfirmationStep = ({ amount, strategy, onConfirm, onBack, isProcessing }) => {
  const selectedStrategy = strategies.find(s => s.id === strategy);
  const estimatedGas = 0.01;
  const totalCost = amount + estimatedGas;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">Confirm Deposit</h3>
        <p className="text-sm text-white/40">Review your deposit details before confirming</p>
      </div>
      
      <div className="bg-white/5 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <span className="text-white/40">Amount</span>
          <span className="text-2xl font-bold text-white">${amount.toFixed(2)} USDC</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${selectedStrategy.color} flex items-center justify-center`}>
              <selectedStrategy.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white text-sm">{selectedStrategy.name} Strategy</div>
              <div className="text-xs text-white/30">{selectedStrategy.description}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/40">Risk Level</div>
            <div className={`text-sm ${
              selectedStrategy.risk === 'Low' ? 'text-emerald-400' :
              selectedStrategy.risk === 'Moderate' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {selectedStrategy.risk}
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <div className="text-[11px] text-white/40">
              Estimated network fee: ${estimatedGas.toFixed(2)} USDC
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={isProcessing}
          className={`flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Confirm Deposit
              <ExternalLink className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// Success Step
const SuccessStep = ({ amount, strategy, txHash }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-4"
    >
      <div className="relative">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <motion.div
          className="absolute -inset-1 rounded-full bg-emerald-500/20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">Deposit Successful!</h3>
        <p className="text-white/40">
          ${amount.toFixed(2)} USDC has been deposited to your portfolio
        </p>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Transaction Hash</span>
          <span className="text-cyan-400 font-mono text-xs">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Strategy</span>
          <span className="text-white">{strategy}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Network</span>
          <span className="text-white">Solana</span>
        </div>
      </div>
      
      <button
        onClick={() => window.location.reload()}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold"
      >
        Go to Dashboard
      </button>
    </motion.div>
  );
};

// Main DepositFlow Component
export const DepositFlow = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(500);
  const [selectedStrategy, setSelectedStrategy] = useState('Balanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');
  const { deposit } = usePortfolioStore();
  
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  
  const handleConfirm = async () => {
    setIsProcessing(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate transaction hash
    const generatedTxHash = '0x' + Array.from({ length: 64 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
    setTxHash(generatedTxHash);
    
    // Deposit USDC to balance, but do not fake portfolio positions
    deposit(amount, selectedStrategy, [], {});
    
    
    setIsProcessing(false);
    setStep(4);
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-br from-gray-950 to-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Deposit to Touchline</h2>
                <p className="text-xs text-white/40">Start your World Cup portfolio</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {step < 4 && <StepIndicator currentStep={step} totalSteps={3} />}
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <AmountStep
                  amount={amount}
                  setAmount={setAmount}
                  onNext={handleNext}
                />
              )}
              {step === 2 && (
                <StrategyStep
                  selectedStrategy={selectedStrategy}
                  setSelectedStrategy={setSelectedStrategy}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 3 && (
                <ConfirmationStep
                  amount={amount}
                  strategy={selectedStrategy}
                  onConfirm={handleConfirm}
                  onBack={handleBack}
                  isProcessing={isProcessing}
                />
              )}
              {step === 4 && (
                <SuccessStep
                  amount={amount}
                  strategy={selectedStrategy}
                  txHash={txHash}
                />
              )}
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <p className="text-center text-[10px] text-white/30 font-mono">
              Demo Mode • Simulated transactions on Solana testnet
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};