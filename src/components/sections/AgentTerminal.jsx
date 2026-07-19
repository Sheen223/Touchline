// src/components/sections/AgentTerminal.jsx
import React, { useState, useEffect, useRef } from 'react';

const LogLine = ({ message, type, timestamp, amount, index }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= message.length) {
        setDisplayText(message.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [message]);
  
  return (
    <div className="flex items-start gap-2 py-1.5 font-mono text-xs border-l-2 border-transparent hover:border-cyan-500/30 pl-2 transition-all">
      <span className="text-white/30 flex-shrink-0">{timestamp}</span>
      <span className={`flex-1 ${
        type === 'alert' ? 'text-yellow-400' :
        type === 'trade' ? 'text-cyan-400' :
        type === 'success' ? 'text-emerald-400' :
        'text-white/60'
      }`}>
        {displayText}
        {isTyping && <span className="inline-block w-2 h-3 bg-cyan-400 ml-0.5 animate-pulse" />}
      </span>
      {amount && (
        <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
          amount.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {amount}
        </span>
      )}
    </div>
  );
};

export const AgentTerminal = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [probabilities, setProbabilities] = useState({
    brazil: 88,
    morocco: 62,
    scotland: 45
  });
  const logsEndRef = useRef(null);
  
  const addLog = (message, type = 'info', amount = null) => {
    setLogs(prev => [{
      id: Date.now(),
      message,
      type,
      amount,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev].slice(0, 20));
  };
  
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);
  
  const runAgentCycle = async () => {
    setIsRunning(true);
    addLog('Initializing analysis...', 'info');
    
    await new Promise(r => setTimeout(r, 600));
    addLog('Match Result: Brazil 1-2 Morocco', 'alert');
    
    await new Promise(r => setTimeout(r, 500));
    setProbabilities(prev => ({ ...prev, brazil: 71 }));
    addLog('Brazil probability: 88% → 71%', 'change', '-17%');
    
    await new Promise(r => setTimeout(r, 500));
    setProbabilities(prev => ({ ...prev, morocco: 81 }));
    addLog('Morocco probability: 62% → 81%', 'change', '+19%');
    
    await new Promise(r => setTimeout(r, 500));
    addLog('Executing rebalance: SELL Brazil, BUY Morocco', 'trade');
    
    await new Promise(r => setTimeout(r, 600));
    addLog('Portfolio rebalanced successfully', 'success');
    
    setIsRunning(false);
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8">
      {/* Section header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
          <span className="text-[11px] text-white/50 font-mono tracking-wider">AI AGENT</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Agent Console</h2>
        <p className="text-white/40 text-sm mt-2">Autonomous portfolio management</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4" />
      </div>
      
      {/* Terminal Card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[10px] text-white/40 font-mono ml-2">agent@Touchline:~/console</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-[10px] text-white/40 font-mono">{isRunning ? 'PROCESSING' : 'READY'}</span>
          </div>
        </div>
        
        {/* Probability bars */}
        <div className="px-5 py-4 border-b border-white/10 bg-white/5">
          <div className="text-[10px] text-white/40 font-mono mb-3">LIVE PROBABILITIES</div>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(probabilities).map(([team, prob]) => (
              <div key={team} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60 capitalize">{team}</span>
                  <span className="text-white font-mono">{prob}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${prob}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Logs area */}
        <div className="h-64 overflow-y-auto p-4 bg-black/30">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <p className="text-white/30 text-sm">No activity yet</p>
              <p className="text-white/20 text-xs mt-1">Click "Run Agent Cycle" to start</p>
            </div>
          ) : (
            logs.map((log, idx) => (
              <LogLine key={log.id} {...log} index={idx} />
            ))
          )}
          <div ref={logsEndRef} />
        </div>
        
        {/* Footer with action button */}
        <div className="px-5 py-3 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] text-white/30 font-mono">
              <span>Solana • connected</span>
              <span>Gas: 1.2 Gwei</span>
            </div>
            <button
              onClick={runAgentCycle}
              disabled={isRunning}
              className={`
                px-5 py-2 rounded-lg text-sm font-medium transition-all
                ${isRunning 
                  ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                }
              `}
            >
              {isRunning ? 'RUNNING...' : 'RUN AGENT CYCLE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};