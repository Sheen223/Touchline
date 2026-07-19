// src/components/agent/AgentConsole.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, RefreshCw, ChevronRight, Cpu, Activity, Braces } from 'lucide-react';

// Individual log line with typing animation
const LogLine = ({ log, index, isLatest }) => {
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 50 * log.message.length);
    return () => clearTimeout(timer);
  }, [log.message.length]);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group"
    >
      <div className="flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors font-mono text-xs">
        {/* Animated prompt */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-cyan-400">$</span>
          <span className="text-white/30">{log.timestamp}</span>
        </div>
        
        {/* Typing animation content */}
        <div className="flex-1">
          <span className={`
            ${log.type === 'alert' ? 'text-yellow-400' : ''}
            ${log.type === 'trade' ? 'text-cyan-400' : ''}
            ${log.type === 'success' ? 'text-emerald-400' : ''}
            ${log.type === 'info' ? 'text-white/70' : ''}
          `}>
            {isTyping ? (
              <span>
                {log.message.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-3 bg-cyan-400 ml-0.5"
                />
              </span>
            ) : (
              log.message
            )}
          </span>
        </div>
        
        {/* Action badge for trades */}
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

// Main Agent Console
export const AgentConsole = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentProbability, setCurrentProbability] = useState({ brazil: 88, morocco: 62 });
  const logsEndRef = useRef(null);
  
  const addLog = (message, type = 'info', amount = null) => {
    setLogs(prev => [{
      id: Date.now(),
      message,
      type,
      amount,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 30));
  };
  
  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [logs]);
  
  const runAgentCycle = async () => {
    setIsRunning(true);
    addLog('Initializing neural network analysis...', 'info');
    
    await new Promise(r => setTimeout(r, 600));
    addLog('Fetching match results from Solana oracle...', 'info');
    
    await new Promise(r => setTimeout(r, 800));
    addLog('⚠️ Brazil 1 - 2 Morocco [SHOCK UPSET DETECTED]', 'alert');
    
    // Animate probability changes
    setCurrentProbability({ brazil: 88, morocco: 62 });
    await new Promise(r => setTimeout(r, 300));
    setCurrentProbability({ brazil: 71, morocco: 62 });
    await new Promise(r => setTimeout(r, 300));
    setCurrentProbability({ brazil: 71, morocco: 81 });
    
    await new Promise(r => setTimeout(r, 600));
    addLog('📊 Qualification probabilities recalculated:', 'info');
    addLog('  Brazil: 88% → 71% (-17% drop)', 'change', '-$60');
    addLog('  Morocco: 62% → 81% (+19% surge)', 'change', '+$40');
    
    await new Promise(r => setTimeout(r, 800));
    addLog('🔄 Executing portfolio rebalance on Solana...', 'action');
    addLog('  • SELL $60 Brazil YES position', 'trade', '-$60');
    addLog('  • BUY $40 Morocco YES position', 'trade', '+$40');
    addLog('  • BUY $20 Scotland YES position', 'trade', '+$20');
    
    await new Promise(r => setTimeout(r, 600));
    addLog('✅ Rebalance complete. Transaction finalised.', 'success');
    addLog('💰 Idle capital deployed to yield strategy (8% APY)', 'info');
    
    setIsRunning(false);
  };
  
  return (
    <div className="relative">
      {/* Terminal glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-20 blur-xl" />
      
      <div className="relative bg-gradient-to-br from-gray-950/95 to-black/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-white/40 font-mono tracking-wide">agent@Touchline:~/console</span>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-[10px] text-white/40 font-mono">
              {isRunning ? 'PROCESSING' : 'STANDBY'}
            </span>
          </div>
        </div>
        
        {/* Probability Visualization */}
        <div className="border-b border-white/10 px-4 py-3 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] text-white/40 font-mono">LIVE PROBABILITIES</span>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">Brazil:</span>
                <motion.span 
                  className="text-xs font-mono text-white"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {currentProbability.brazil}%
                </motion.span>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    animate={{ width: `${currentProbability.brazil}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">Morocco:</span>
                <motion.span 
                  className="text-xs font-mono text-white"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {currentProbability.morocco}%
                </motion.span>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    animate={{ width: `${currentProbability.morocco}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logs Area */}
        <div className="h-80 overflow-y-auto p-3 font-mono bg-black/50">
          <AnimatePresence>
            {logs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <Braces className="w-8 h-8 text-white/10 mb-3" />
                <p className="text-white/20 text-xs font-mono">No active processes</p>
                <p className="text-white/10 text-[10px] font-mono mt-1">Click 'Run Cycle' to start</p>
              </motion.div>
            ) : (
              logs.map((log, idx) => (
                <LogLine key={log.id} log={log} index={idx} isLatest={idx === 0} />
              ))
            )}
          </AnimatePresence>
          <div ref={logsEndRef} />
        </div>
        
        {/* Terminal Footer with action button */}
        <div className="border-t border-white/10 px-4 py-3 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-white/30 font-mono">
              <span>Solana: connected</span>
              <span>Gas: 1.2 Gwei</span>
              <span>Block: 61,124,668</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runAgentCycle}
              disabled={isRunning}
              className={`
                flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all
                ${isRunning 
                  ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
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