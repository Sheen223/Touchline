import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { StatsRing } from '../components/sections/StatsRing';
import { LiveMatches } from '../components/sections/LiveMatches';
import { Terminal, CheckCircle, Wallet, Copy, ExternalLink } from 'lucide-react';
import { useMatchContext } from '../context/MatchContext';

// Agent Wallet Header
const AgentWalletHeader = () => {
  const [agentPubKey, setAgentPubKey] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/agent')
      .then(res => res.json())
      .then(data => setAgentPubKey(data.publicKey))
      .catch(err => console.error("Failed to fetch agent pubkey", err));
  }, []);

  const copyAddress = () => {
    if (!agentPubKey) return;
    navigator.clipboard.writeText(agentPubKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">AI Agent Treasury Wallet</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-600 font-medium">Devnet Connected</span>
          </div>
        </div>
      </div>
      
      {agentPubKey ? (
        <div className="flex items-center gap-2 flex-wrap p-2 bg-gray-50 rounded-xl border border-gray-200">
          <code className="text-gray-900 text-sm font-mono px-2">
            {agentPubKey}
          </code>
          <div className="h-4 w-px bg-gray-300 mx-1" />
          <button onClick={copyAddress} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer">
            {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <a href={`https://explorer.solana.com/address/${agentPubKey}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <div className="text-sm text-gray-500 font-mono bg-gray-50 px-4 py-2 rounded-xl">Loading...</div>
      )}
    </div>
  );
};



// Dark Agent Terminal
const AgentTerminal = () => {
  const { agentEvents } = useMatchContext();
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentEvents]);

  const getColorClass = (log) => {
    if (log.color === 'gray') return 'text-gray-500';
    if (log.color === 'yellow') return 'text-yellow-400';
    if (log.color === 'cyan') return 'text-cyan-400';
    if (log.color === 'green') return 'text-green-400';
    if (log.color === 'red') return 'text-red-400';
    if (log.type === 'allocation') return 'text-green-400';
    if (log.type === 'divestment') return 'text-purple-400';
    return 'text-gray-300';
  };

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-gray-800 shadow-xl overflow-hidden h-[300px] flex flex-col">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between bg-[#111111]">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-green-400" />
          <h3 className="text-white font-semibold">Agent Console</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-500 font-medium tracking-wider">ONLINE</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-2 font-mono text-sm">
        {agentEvents.length === 0 ? (
          <div className="text-gray-600 text-center mt-10">Awaiting stream...</div>
        ) : (
          agentEvents.map((log, idx) => (
            <div key={idx} className="border-l-2 border-gray-700 pl-3">
              <span className="text-gray-500 text-xs">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={`ml-3 ${getColorClass(log)}`}>{log.message}</span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Autonomous World Cup AI Trading System</p>
      </div>

      <AgentWalletHeader />

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Portfolio Summary</h2>
            <p className="text-gray-500 text-sm">Real-time valuation</p>
          </div>
          <StatsRing />
        </div>
        
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Autonomous Core</h2>
            <p className="text-gray-500 text-sm">Live execution logs</p>
          </div>
          <AgentTerminal />
        </div>
      </div>

      <div className="mb-4 mt-8">
        <h2 className="text-xl font-bold text-gray-900">Live TxLine Feed</h2>
        <p className="text-gray-500 text-sm">Matches currently being monitored by the AI Agent</p>
      </div>
      <LiveMatches />
    </motion.div>
  );
};
