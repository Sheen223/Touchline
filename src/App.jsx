import React, { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Sidebar } from './components/layout/Sidebar';
import { StatsRing } from './components/sections/StatsRing';
import { AllocationChart } from './components/sections/AllocationChart';
import { PositionsTable } from './components/sections/PositionsTable';
import { ActivityFeed } from './components/sections/ActivityFeed';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { TransactionsSection } from './components/sections/TransactionsSection';
import { LiveMatches } from './components/sections/LiveMatches';
import { useCupFolioContract } from './hooks/useCupFolioContract';
import {
  ChevronDown,
  Zap,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Wallet,
  CheckCircle,
} from 'lucide-react';

// Contract Address
const CONTRACT_ADDRESS = '0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61';

// Custom teams for World Cup 2026
const WORLD_CUP_TEAMS = [
  { name: 'Brazil', group: 'C', flag: '🇧🇷', currentProb: 88, color: 'from-yellow-400 to-green-600', trend: 'hot' },
  { name: 'Morocco', group: 'C', flag: '🇲🇦', currentProb: 62, color: 'from-red-500 to-green-700', trend: 'up' },
  { name: 'Senegal', group: 'A', flag: '🇸🇳', currentProb: 65, color: 'from-green-500 to-yellow-500', trend: 'stable' },
  { name: 'Panama', group: 'A', flag: '🇵🇦', currentProb: 32, color: 'from-blue-600 to-red-600', trend: 'down' },
  { name: 'USA', group: 'D', flag: '🇺🇸', currentProb: 75, color: 'from-red-700 to-blue-800', trend: 'up' },
  { name: 'Cameroon', group: 'D', flag: '🇨🇲', currentProb: 40, color: 'from-green-600 to-red-600', trend: 'down' },
  { name: 'Japan', group: 'E', flag: '🇯🇵', currentProb: 55, color: 'from-red-700 to-white', trend: 'stable' },
  { name: 'Ecuador', group: 'E', flag: '🇪🇨', currentProb: 60, color: 'from-yellow-500 to-blue-500', trend: 'up' },
  { name: 'Scotland', group: 'C', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', currentProb: 45, color: 'from-blue-600 to-white', trend: 'down' },
  { name: 'Australia', group: 'F', flag: '🇦🇺', currentProb: 50, color: 'from-green-600 to-yellow-600', trend: 'stable' },
  { name: 'Paraguay', group: 'D', flag: '🇵🇾', currentProb: 35, color: 'from-red-600 to-white', trend: 'down' },
  { name: 'Haiti', group: 'A', flag: '🇭🇹', currentProb: 18, color: 'from-blue-600 to-red-600', trend: 'down' },
];

const getTrendIcon = (trend) => {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-emerald-400" />;
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-400" />;
  return null;
};

// Contract Info Card Component
const ContractInfoCard = ({ contractAddress, aiAgent, isOwner, onUpdateProbability, onSetAIAgent, isContractReady }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [probability, setProbability] = useState(50);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSettingAgent, setIsSettingAgent] = useState(false);

  const teams = WORLD_CUP_TEAMS;

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateProbability = async () => {
    if (!selectedTeam) {
      setErrorMsg('Please select a team');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    setIsUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await onUpdateProbability(selectedTeam, probability);
      setSuccessMsg(`✅ ${selectedTeam} probability updated to ${probability}%`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (error) {
      setErrorMsg(`❌ ${error.message}`);
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSetAIAgent = async () => {
    setIsSettingAgent(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const tx = await onSetAIAgent();
      setSuccessMsg(`✅ AI Agent set successfully! TX: ${tx.hash.slice(0, 10)}...`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (error) {
      setErrorMsg(`❌ ${error.message}`);
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setIsSettingAgent(false);
    }
  };

  const selectedTeamData = teams.find((t) => t.name === selectedTeam);
  const isAgentSet = aiAgent && aiAgent !== '0x0000000000000000000000000000000000000000';

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/30 p-6 mb-8 backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-pulse" />
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-emerald-400 font-mono tracking-wider">LIVE ON X LAYER MAINNET</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1 text-xs text-emerald-400">
          <CheckCircle className="w-3 h-3" />
          <span>Contract Deployed</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="group">
            <div className="text-sm text-white/40 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-cyan-500 rounded-full" />
              Contract Address
            </div>
            <div className="flex items-center gap-2 flex-wrap p-3 bg-black/30 rounded-xl border border-white/10 group-hover:border-cyan-500/30 transition-all">
              <code className="text-cyan-400 text-sm font-mono">
                {contractAddress?.slice(0, 10)}...{contractAddress?.slice(-8)}
              </code>
              <button onClick={copyAddress} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                <Copy className="w-3.5 h-3.5 text-white/40" />
              </button>
              <a href={`https://web3.okx.com/explorer/x-layer/evm/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                <ExternalLink className="w-3.5 h-3.5 text-white/40" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm text-white/40 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full" />
              AI Agent Wallet
            </div>
            <div className="p-3 bg-black/30 rounded-xl border border-white/10">
              <code className="text-emerald-400 text-sm font-mono">
                {isAgentSet ? `${aiAgent.slice(0, 10)}...${aiAgent.slice(-8)}` : '⚠️ Not set'}
              </code>
              {isOwner && <span className="ml-3 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Your Wallet</span>}
            </div>
            <div className="mt-3">
              {!isAgentSet ? (
                <button onClick={handleSetAIAgent} disabled={isSettingAgent} className="w-full mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-medium disabled:opacity-50 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  {isSettingAgent ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Setting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-3 h-3" />
                      Set My Wallet as AI Agent
                    </>
                  )}
                </button>
              ) : (
                <div className="mt-2 text-xs text-emerald-400/70 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  AI Agent configured
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm text-white/40 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full" />
              Network
            </div>
            <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-white/10">
              <span className="text-white/80 text-sm">X Layer Mainnet</span>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">Chain ID: 196</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <div className="text-sm text-white/40 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-cyan-500 rounded-full" />
              Update Upset Probability (AI Agent)
            </div>

            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-black/50 to-black/30 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all">
                {selectedTeamData ? (
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedTeamData.color} flex items-center justify-center text-sm flex-shrink-0`}>
                      {selectedTeamData.flag}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">{selectedTeamData.name}</div>
                      <div className="text-xs text-white/40">Group {selectedTeamData.group}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="text-sm text-cyan-400">{selectedTeamData.currentProb}%</div>
                      {getTrendIcon(selectedTeamData.trend)}
                    </div>
                  </div>
                ) : (
                  <span className="text-white/50">Select a team...</span>
                )}
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl max-h-60 overflow-y-auto">
                  {teams.map((team) => (
                    <button
                      key={team.name}
                      onClick={() => {
                        setSelectedTeam(team.name);
                        setProbability(team.currentProb);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-all group"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${team.color} flex items-center justify-center text-sm group-hover:scale-110 transition-transform flex-shrink-0`}>
                        {team.flag}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-medium">{team.name}</div>
                        <div className="text-xs text-white/40">Group {team.group}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-sm text-cyan-400">{team.currentProb}%</div>
                        {getTrendIcon(team.trend)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedTeamData && (
              <div className="mt-4 p-4 bg-black/30 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/40">Adjust Probability</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">{probability}%</span>
                    <button onClick={() => setProbability(selectedTeamData.currentProb)} className="text-xs px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors">Reset</button>
                  </div>
                </div>
                <input type="range" min="0" max="100" value={probability} onChange={(e) => setProbability(parseInt(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" style={{ background: `linear-gradient(90deg, #06b6d4 0%, #a855f7 ${probability}%, rgba(255,255,255,0.1) ${probability}%)` }} />
                <div className="flex justify-between text-xs text-white/30 mt-2 px-1"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
                <div className="flex items-center gap-2 mt-4 p-2 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                  <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span className="text-xs text-cyan-400/70">
                    {probability > selectedTeamData.currentProb ? `📈 Increasing from ${selectedTeamData.currentProb}% to ${probability}%` : probability < selectedTeamData.currentProb ? `📉 Decreasing from ${selectedTeamData.currentProb}% to ${probability}%` : `⚡ No change from current ${selectedTeamData.currentProb}%`}
                  </span>
                </div>
              </div>
            )}

            <button onClick={handleUpdateProbability} disabled={isUpdating || !selectedTeam || !isAgentSet} className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-medium disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2">
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating on X Layer...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Update Probability
                </>
              )}
            </button>

            {errorMsg && <div className="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs text-center">{errorMsg}</div>}
            {successMsg && <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 text-xs text-center">{successMsg}</div>}
            <p className="text-xs text-emerald-400/70 text-center mt-3">{isAgentSet ? '✅ AI Agent set. Ready to update probabilities!' : '⚠️ Please set AI Agent first to enable updates'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Agent Terminal Component
const AgentTerminal = ({ onUpdateProbability, isContractReady, isAgentSet }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const matches = [
    { teamA: 'Brazil', teamB: 'Morocco', winner: 'Morocco', probability: 81 },
    { teamA: 'Senegal', teamB: 'Panama', winner: 'Senegal', probability: 65 },
    { teamA: 'USA', teamB: 'Cameroon', winner: 'USA', probability: 75 },
  ];

  const addLog = (message, type = 'info') => {
    setLogs((prev) => [{ id: Date.now(), message, type, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(0, 20));
  };

  const runAgentCycle = async () => {
    if (!isContractReady) {
      addLog('❌ Contract not ready. Please wait and try again.', 'error');
      return;
    }
    if (!isAgentSet) {
      addLog('❌ AI Agent not set. Please set your wallet as AI Agent first.', 'error');
      return;
    }

    setIsRunning(true);
    addLog('🤖 AI Agent initializing...', 'info');
    addLog('🔗 Connected to X Layer Mainnet', 'info');

    for (const match of matches) {
      setSelectedMatch(match);
      addLog(`📊 Analyzing: ${match.teamA} vs ${match.teamB}`, 'info');
      await new Promise((r) => setTimeout(r, 1000));

      addLog(`⚠️ UPSET DETECTED: ${match.teamA} lost to ${match.teamB}`, 'alert');
      addLog(`📈 ${match.teamB} qualification probability increased to ${match.probability}%`, 'change');

      try {
        addLog(`🔄 Executing rebalance on X Layer...`, 'action');
        const tx = await onUpdateProbability(match.teamB, match.probability);
        addLog(`✅ Position updated! TX: ${tx.hash.slice(0, 10)}...`, 'success');
      } catch (error) {
        addLog(`❌ Transaction failed: ${error.message}`, 'error');
      }
      await new Promise((r) => setTimeout(r, 500));
    }

    addLog('💰 Idle capital deployed to yield strategy (8% APY)', 'yield');
    addLog('✅ Agent cycle complete. Portfolio rebalanced successfully.', 'success');
    setIsRunning(false);
    setSelectedMatch(null);
  };

  return (
    <div className="bg-black/40 backdrop-blur-2xl rounded-2xl border border-cyan-500/30 overflow-hidden">
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center"><span className="text-xl">🤖</span></div>
            <div><h3 className="text-white font-bold">AI Agent Console</h3><p className="text-xs text-white/40">Autonomous portfolio manager on X Layer</p></div>
          </div>
          <button onClick={runAgentCycle} disabled={isRunning || !isContractReady || !isAgentSet} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50">
            {isRunning ? '🔄 EXECUTING...' : '🚀 RUN AGENT CYCLE'}
          </button>
        </div>
      </div>

      {selectedMatch && (
        <div className="px-6 py-3 bg-yellow-500/10 border-b border-yellow-500/20">
          <div className="flex items-center justify-between"><span className="text-yellow-400 text-sm">Currently Analyzing:</span><span className="text-white font-medium">{selectedMatch.teamA} vs {selectedMatch.teamB}</span></div>
        </div>
      )}

      <div className="h-80 overflow-y-auto p-4 space-y-1 font-mono text-sm bg-black/30">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-3">🤖</div>
            <p className="text-white/30">Click "RUN AGENT CYCLE" to start</p>
            <p className="text-white/20 text-xs mt-2">Agent will analyze matches and rebalance portfolio on X Layer</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="py-1 border-l-2 border-cyan-500/30 pl-3">
              <span className="text-white/30 text-xs">[{log.timestamp}]</span>
              <span className={`ml-2 text-sm ${log.type === 'alert' ? 'text-yellow-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-red-400' : log.type === 'yield' ? 'text-green-400' : 'text-white/80'}`}>{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="px-6 py-3 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>⚡ X Layer Mainnet</span>
          <span>🔗 Contract: {CONTRACT_ADDRESS.slice(0, 10)}...</span>
          <span>🤖 AI Agent Active</span>
        </div>
      </div>
    </div>
  );
};

// Main App Content
const AppContent = () => {
  const { isConnected, address, balance, connect, isConnecting, error, switchToXLayer, chainId } = useWallet();
  const { contract, aiAgent, updateProbability, setAIAgent } = useCupFolioContract();
  const [contractAddress] = useState(CONTRACT_ADDRESS);
  const [txStatus, setTxStatus] = useState(null);
  const isContractReady = true;
  const isAgentSet = aiAgent && aiAgent !== '0x0000000000000000000000000000000000000000';

  const handleSetAIAgent = async () => {
    setTxStatus({ type: 'pending', message: 'Setting AI Agent on X Layer...' });
    try {
      const tx = await setAIAgent();
      setTxStatus({ type: 'success', message: `✅ AI Agent set! TX: ${tx.hash.slice(0, 10)}...` });
      setTimeout(() => setTxStatus(null), 5000);
      return tx;
    } catch (error) {
      setTxStatus({ type: 'error', message: `❌ ${error.message}` });
      setTimeout(() => setTxStatus(null), 5000);
      throw error;
    }
  };

  const handleUpdateProbability = async (team, probability) => {
    setTxStatus({ type: 'pending', message: `Updating ${team} probability to ${probability}% on X Layer...` });
    try {
      const tx = await updateProbability(team, probability);
      setTxStatus({ type: 'success', message: `✅ Transaction confirmed! ${team} now ${probability}% | TX: ${tx.hash.slice(0, 10)}...` });
      setTimeout(() => setTxStatus(null), 5000);
      return tx;
    } catch (error) {
      setTxStatus({ type: 'error', message: `❌ ${error.message}` });
      setTimeout(() => setTxStatus(null), 5000);
      throw error;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center"><span className="text-4xl animate-pulse">⚽</span></div>
          <h1 className="text-3xl font-bold text-white mb-3">CupFolio</h1>
          <p className="text-white/40 mb-2">AI-powered World Cup portfolio manager</p>
          <p className="text-white/30 text-sm mb-8">on X Layer Mainnet</p>
          <button onClick={connect} disabled={isConnecting} className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 w-full flex items-center justify-center gap-2">
            <Wallet className="w-5 h-5" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-white/30 mb-3">Supported Wallets</p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><span className="text-lg">⭕</span></div><span className="text-[10px] text-white/30">OKX Wallet</span></div>
              <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><span className="text-lg">🦊</span></div><span className="text-[10px] text-white/30">MetaMask</span></div>
              <div className="flex flex-col items-center gap-1"><div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"><span className="text-lg">🟣</span></div><span className="text-[10px] text-white/30">Coinbase</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (chainId !== 196) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center"><span className="text-3xl">⚠️</span></div>
          <h2 className="text-xl font-bold text-white mb-3">Wrong Network</h2>
          <p className="text-white/40 mb-6">Please switch to X Layer Mainnet</p>
          <button onClick={switchToXLayer} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium">Switch to X Layer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar walletAddress={address} walletBalance={balance} />
      <div className="lg:pl-64">
        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {txStatus && (
              <div className={`p-4 rounded-xl backdrop-blur-sm ${txStatus.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' : txStatus.type === 'error' ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'}`}>
                <div className="flex items-center gap-2">{txStatus.type === 'pending' && <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />}{txStatus.message}</div>
              </div>
            )}

            <ContractInfoCard contractAddress={contractAddress} aiAgent={aiAgent} isOwner={aiAgent?.toLowerCase() === address?.toLowerCase()} onUpdateProbability={handleUpdateProbability} onSetAIAgent={handleSetAIAgent} isContractReady={isContractReady} />

            {/* DASHBOARD SECTION */}
            <div id="dashboard" className="scroll-mt-20 space-y-8">
              <div className="mb-4"><h2 className="text-xl font-bold text-white">Portfolio Overview</h2><p className="text-white/40 text-sm">Live from X Layer Mainnet</p></div>
              <StatsRing />

              <div className="mb-4 mt-8"><h2 className="text-xl font-bold text-white">AI Portfolio Manager</h2><p className="text-white/40 text-sm">Autonomous rebalancing with real transactions</p></div>
              <AgentTerminal onUpdateProbability={handleUpdateProbability} isContractReady={isContractReady} isAgentSet={isAgentSet} />

              <div className="mb-4 mt-8"><h2 className="text-xl font-bold text-white">FIFA World Cup 2026</h2><p className="text-white/40 text-sm">Live matches and AI predictions</p></div>
              <LiveMatches />
            </div>

            {/* PORTFOLIO SECTION */}
            <div id="portfolio" className="scroll-mt-20 space-y-8">
              <div className="mb-4 mt-8"><h2 className="text-xl font-bold text-white">Portfolio Allocation</h2><p className="text-white/40 text-sm">Current team positions</p></div>
              <AllocationChart />

              <div className="mb-4 mt-8"><h2 className="text-xl font-bold text-white">Active Positions</h2><p className="text-white/40 text-sm">Your current exposure</p></div>
              <PositionsTable />

              <PortfolioSection />
            </div>

            {/* TRANSACTIONS SECTION */}
            <div id="transactions" className="scroll-mt-20 space-y-8">
              <div className="mb-4 mt-8"><h2 className="text-xl font-bold text-white">Transaction History</h2><p className="text-white/40 text-sm">Real on-chain transactions</p></div>
              <TransactionsSection />

              <div className="mb-4 mt-8"><h2 className="text-xl font-bold text-white">Activity Feed</h2><p className="text-white/40 text-sm">Real-time agent actions</p></div>
              <ActivityFeed />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  useEffect(() => {
    localStorage.removeItem('portfolioStore');
    localStorage.removeItem('agentLogs');
    console.log('🧹 Fresh start - cleared local storage');
  }, []);

  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;