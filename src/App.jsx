import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomWalletProvider, useWallet } from './context/WalletContext';
import { MatchProvider } from './context/MatchContext';
import { Logo } from './components/ui/Logo';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { TransactionsPage } from './pages/TransactionsPage';

import { useTouchlineContract } from './hooks/useTouchlineContract';
import { Wallet } from 'lucide-react';

const CONTRACT_ADDRESS = '0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61';

// Main App Content
const AppContent = () => {
  const { isConnected, address, balance, connect, isConnecting, error } = useWallet();
  const { contract, aiAgent, updateProbability, setAIAgent } = useTouchlineContract();
  const [contractAddress] = useState(CONTRACT_ADDRESS);
  const [txStatus, setTxStatus] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const isContractReady = true;
  const isAgentSet = aiAgent && aiAgent !== '0x0000000000000000000000000000000000000000';

  const handleSetAIAgent = async () => {
    setTxStatus({ type: 'pending', message: 'Setting AI Agent on Solana...' });
    try {
      const tx = await setAIAgent();
      setTxStatus({ type: 'success', message: `✅ AI Agent set! TX: ${tx.hash.slice(0, 10)}...` });
      setTimeout(() => setTxStatus(null), 5000);
      setRefreshTrigger(prev => prev + 1);
      return tx;
    } catch (error) {
      setTxStatus({ type: 'error', message: `❌ ${error.message}` });
      setTimeout(() => setTxStatus(null), 5000);
      throw error;
    }
  };

  const handleUpdateProbability = async (team, probability) => {
    setTxStatus({ type: 'pending', message: `Updating ${team} probability to ${probability}% on Solana...` });
    try {
      const tx = await updateProbability(team, probability);
      setTxStatus({ type: 'success', message: `✅ Transaction confirmed! ${team} now ${probability}% | TX: ${tx.hash.slice(0, 10)}...` });
      setTimeout(() => setTxStatus(null), 5000);
      setRefreshTrigger(prev => prev + 1);
      return tx;
    } catch (error) {
      setTxStatus({ type: 'error', message: `❌ ${error.message}` });
      setTimeout(() => setTxStatus(null), 5000);
      throw error;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 max-w-md w-full text-center"
        >
          <motion.div 
            className="w-56 mx-auto mb-10"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            {/* Programmable SVG Logo */}
            <Logo className="w-full h-auto drop-shadow-sm" animated={true} />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Create an Account</h1>
          <p className="text-gray-500 mb-8 text-sm">You are a few moments away from getting started with Touchline.</p>
          
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={connect} 
            disabled={isConnecting} 
            className="w-full py-4 rounded-2xl bg-black text-white font-semibold shadow-xl shadow-black/10 hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Wallet className="w-5 h-5" />
            {isConnecting ? 'Connecting...' : 'Connect Phantom Wallet'}
          </motion.button>
          
          {error && <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">{error}</div>}
          
          <div className="mt-8">
            <p className="text-xs text-gray-500">
              By connecting, you accept Touchline's <span className="text-gray-900 font-medium cursor-pointer underline decoration-gray-300 underline-offset-4">privacy policy</span> and <span className="text-gray-900 font-medium cursor-pointer underline decoration-gray-300 underline-offset-4">terms of service</span>.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar walletAddress={address} walletBalance={balance} />
      <div className="lg:pl-64 flex-1">
        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto w-full">
          {txStatus && (
            <div className={`p-4 rounded-xl mb-6 shadow-sm border ${txStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : txStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
              <div className="flex items-center gap-2">
                {txStatus.type === 'pending' && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                {txStatus.message}
              </div>
            </div>
          )}

          <Routes>
            <Route path="/" element={
              <DashboardPage 
                contractAddress={contractAddress}
                aiAgent={aiAgent}
                isOwner={aiAgent?.toLowerCase() === address?.toLowerCase()}
                handleUpdateProbability={handleUpdateProbability}
                handleSetAIAgent={handleSetAIAgent}
                isContractReady={isContractReady}
                isAgentSet={isAgentSet}
              />
            } />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/transactions" element={<TransactionsPage refreshTrigger={refreshTrigger} />} />
          </Routes>
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
    <BrowserRouter>
      <CustomWalletProvider>
        <MatchProvider>
          <AppContent />
        </MatchProvider>
      </CustomWalletProvider>
    </BrowserRouter>
  );
}

export default App;