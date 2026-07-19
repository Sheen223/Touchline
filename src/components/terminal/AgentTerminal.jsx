// src/components/terminal/AgentTerminal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, RefreshCw, ChevronRight, Cpu, Activity, Braces, Circle } from 'lucide-react';

// Individual Log Line with Typing Effect
const LogLine = ({ log, index }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= log.message.length) {
        setDisplayText(log.message.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [log.message]);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group"
    >
      <div className="flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors font-mono text-xs">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-cyan-400">$</span>
          <span className="text-white/30">{log.timestamp}</span>
        </div>
        <div className="flex-1">
          <span className={`
            ${log.type === 'alert' ? 'text-yellow-400' : ''}
            ${log.type === 'trade' ? 'text-cyan-400' : ''}
            ${log.type === 'success' ? 'text-emerald-400' : ''}
            ${log.type === 'change' ? 'text-purple-400' : ''}
            ${log.type === 'info' ? 'text-white/70' : ''}
          `}>
            {displayText}
            {isTyping && (
              <span className="inline-block w-2 h-3 bg-cyan-400 ml-0.5 animate-pulse" />
            )}
          </span>
        </div>
        {log.amount && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-xs font-mono px-1.5 py-0.5 rounded ${
              log.amount.startsWith('+') 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {log.amount}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

// Probability Bar Component
const ProbabilityBar = ({ label, value, previousValue, color }) => {
  const [displayValue, setDisplayValue] = useState(previousValue);
  
  useEffect(() => {
    if (value !== previousValue) {
      const duration = 500;
      const steps = 20;
      const increment = (value - previousValue) / steps;
      let current = previousValue;
      let step = 0;
      
      const interval = setInterval(() => {
        if (step < steps) {
          current += increment;
          setDisplayValue(Math.round(current));
          step++;
        } else {
          setDisplayValue(value);
          clearInterval(interval);
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }
  }, [value, previousValue]);
  
  const change = value - previousValue;
  const isPositive = change > 0;
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white/50">{label}</span>
        <div className="flex items-center gap-2">
          <motion.span 
            className="text-xs font-mono text-white font-medium"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
          >
            {displayValue}%
          </motion.span>
          {change !== 0 && (
            <span className={`text-[10px] ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? `+${change}` : change}%
            </span>
          )}
        </div>
      </div>
      <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className={`absolute inset-y-0 left-0 rounded-full ${color}`}
          initial={{ width: `${previousValue}%` }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Main Agent Terminal
export const AgentTerminal = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [probabilities, setProbabilities] = useState({
    brazil: { current: 88, previous: 88 },
    morocco: { current: 62, previous: 62 },
    scotland: { current: 45, previous: 45 }
  });
  const logsEndRef = useRef(null);
  
  const addLog = (message, type = 'info', amount = null) => {
    setLogs(prev => [{
      id: Date.now(),
      message,
      type,
      amount,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 25));
  };
  
  const updateProbability = (team, newValue) => {
    setProbabilities(prev => ({
      ...prev,
      [team]: {
        current: newValue,
        previous: prev[team].current
      }
    }));
  };
  
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);
  
  const runAgentCycle = async () => {
    setIsRunning(true);
    addLog('Initializing neural network analysis...', 'info');
    
    await new Promise(r => setTimeout(r, 600));
    addLog('Fetching match results from Solana oracle...', 'info');
    
    await new Promise(r => setTimeout(r, 800));
    addLog('⚠️ Brazil 1 - 2 Morocco [SHOCK UPSET DETECTED]', 'alert');
    
    await new Promise(r => setTimeout(r, 300));
    updateProbability('brazil', 71);
    addLog('Brazil qualification probability: 88% → 71%', 'change', '-17%');
    
    await new Promise(r => setTimeout(r, 400));
    updateProbability('morocco', 81);
    addLog('Morocco qualification probability: 62% → 81%', 'change', '+19%');
    
    await new Promise(r => setTimeout(r, 400));
    updateProbability('scotland', 68);
    addLog('Scotland qualification probability: 45% → 68%', 'change', '+23%');
    
    await new Promise(r => setTimeout(r, 800));
    addLog('🔄 Executing portfolio rebalance on Solana...', 'action');
    addLog('  • SELL $60 Brazil YES position', 'trade', '-$60');
    addLog('  • BUY $40 Morocco YES position', 'trade', '+$40');
    addLog('  • BUY $20 Scotland YES position', 'trade', '+$20');
    
    await new Promise(r => setTimeout(r, 600));
    addLog('✅ Rebalance complete. Transaction finalised', 'success');
    addLog('💰 Idle capital deployed to yield strategy (8% APY)', 'info');
    
    setIsRunning(false);
  };
  
  return (
    <div className="relative">
      {/* Terminal Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-20 blur-xl" />
      
      <div className="relative bg-gradient-to-br from-gray-950/95 to-black/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <Circle className="w-3 h-3 fill-red-500/80 text-red-500/80" />
              <Circle className="w-3 h-3 fill-yellow-500/80 text-yellow-500/80" />
              <Circle className="w-3 h-3 fill-green-500/80 text-green-500/80" />
            </div>
            <div className="flex items-center gap-2 ml-3">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-white/40 font-mono tracking-wide">agent@Touchline:~/console</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-[10px] text-white/40 font-mono tracking-wide">
              {isRunning ? 'PROCESSING' : 'STANDBY'}
            </span>
          </div>
        </div>
        
        {/* Probability Panel */}
        <div className="border-b border-white/10 px-5 py-4 bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-white/40 font-mono tracking-wide">LIVE QUALIFICATION PROBABILITIES</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <ProbabilityBar 
              label="Brazil" 
              value={probabilities.brazil.current} 
              previousValue={probabilities.brazil.previous}
              color="bg-gradient-to-r from-cyan-500 to-blue-500"
            />
            <ProbabilityBar 
              label="Morocco" 
              value={probabilities.morocco.current} 
              previousValue={probabilities.morocco.previous}
              color="bg-gradient-to-r from-emerald-500 to-cyan-500"
            />
            <ProbabilityBar 
              label="Scotland" 
              value={probabilities.scotland.current} 
              previousValue={probabilities.scotland.previous}
              color="bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>
        
        {/* Logs Area */}
        <div className="h-80 overflow-y-auto p-3 font-mono bg-black/30">
          <AnimatePresence>
            {logs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <Braces className="w-10 h-10 text-white/10 mb-3" />
                <p className="text-white/20 text-xs font-mono">No active processes</p>
                <p className="text-white/10 text-[10px] font-mono mt-1">Click 'RUN AGENT CYCLE' to start</p>
              </motion.div>
            ) : (
              logs.map((log, idx) => (
                <LogLine key={log.id} log={log} index={idx} />
              ))
            )}
            <div ref={logsEndRef} />
          </AnimatePresence>
        </div>
        
        {/* Terminal Footer */}
        <div className="border-t border-white/10 px-5 py-3 bg-white/5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-[10px] text-white/30 font-mono">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Solana: connected
              </span>
              <span>Gas: 1.2 Gwei</span>
              <span>Block: 61,124,668</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runAgentCycle}
              disabled={isRunning}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all
                ${isRunning 
                  ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
                }
              `}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  EXECUTING...
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  RUN AGENT CYCLE
                </>
              )}
            </motion.button>
          </div>
        </div>
        
      </div>
    </div>
  );
};