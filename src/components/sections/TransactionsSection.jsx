// src/components/sections/TransactionsSection.jsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ExternalLink, RefreshCw, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getRealTransactionHistory } from '../../services/transactionService';

export const TransactionsSection = () => {
  const { address } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    if (!address) {
      setTransactions([]);
      return;
    }
    
    setIsLoading(true);
    try {
      // Fetch REAL transactions from the blockchain
      const realTxs = await getRealTransactionHistory(address);
      setTransactions(realTxs);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [address]);

  const refresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Pending';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'ai_agent_set':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'probability_update':
        return <Clock className="w-4 h-4 text-cyan-400" />;
      case 'pool_registered':
        return <CheckCircle className="w-4 h-4 text-purple-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  if (!address) {
    return (
      <div className="bg-black/40 rounded-2xl border border-white/10 p-8 text-center">
        <p className="text-white/40">Connect wallet to view transactions</p>
      </div>
    );
  }

  if (isLoading && transactions.length === 0) {
    return (
      <div className="bg-black/40 rounded-2xl border border-white/10 p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-1/3 mx-auto" />
          <div className="space-y-2">
            <div className="h-16 bg-white/10 rounded" />
            <div className="h-16 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white">Transaction History</h2>
          <p className="text-white/40 text-sm mt-1">Real on-chain transactions from your wallet</p>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-white/60 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Transaction List */}
      <div className="divide-y divide-white/5">
        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <span className="text-2xl">📭</span>
            </div>
            <p className="text-white/40">No transactions yet</p>
            <p className="text-white/20 text-sm mt-1">Complete a transaction to see it here</p>
            <p className="text-white/10 text-xs mt-3">Set AI Agent or update probability to create your first transaction</p>
          </div>
        ) : (
          transactions.map((tx, idx) => (
            <div key={idx} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(tx.type)}
                  <div>
                    <p className="text-white font-medium">{tx.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <code className="text-xs text-white/40 font-mono">
                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                      </code>
                      <span className="text-xs text-white/30">{formatTime(tx.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    confirmed
                  </span>
                  <a 
                    href={`https://web3.okx.com/explorer/x-layer/evm/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer */}
      {transactions.length > 0 && (
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-xs text-white/30">
            <span>Total: {transactions.length} transactions</span>
            <span>Network: X Layer Mainnet</span>
          </div>
        </div>
      )}
    </div>
  );
};