// src/components/sections/TransactionsSection.jsx
import React, { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '../../context/WalletContext';
import { ExternalLink, RefreshCw, CheckCircle, Link as LinkIcon } from 'lucide-react';

const NETWORK = 'https://api.devnet.solana.com';

export const TransactionsSection = ({ refreshTrigger }) => {
  const { address } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [txCount, setTxCount] = useState(0);

  const fetchTransactions = async () => {
    if (!address) {
      setTransactions([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const connection = new Connection(NETWORK, 'confirmed');
      const pubKey = new PublicKey(address);
      
      const signatures = await connection.getSignaturesForAddress(pubKey, { limit: 20 });
      
      const txs = signatures.map(sig => ({
        hash: sig.signature,
        status: sig.err ? 'failed' : 'success',
        timestamp: sig.blockTime,
        method: sig.memo ? `Memo: ${sig.memo}` : 'Solana Transaction'
      }));
      
      setTransactions(txs);
      setTxCount(txs.length);
    } catch (error) {
      console.error("Failed to fetch from Solana:", error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [address, refreshTrigger]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const shortenHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  if (!address) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <p className="text-gray-500 font-medium">Connect wallet to view transactions</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="space-y-2">
            <div className="h-16 bg-gray-100 rounded" />
            <div className="h-16 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length > 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Transaction History</h2>
            <p className="text-gray-500 font-medium text-sm mt-1">
              Recent transactions on Solana Devnet
            </p>
          </div>
          <button
            onClick={fetchTransactions}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
          {transactions.map((tx, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <CheckCircle className={`w-4 h-4 flex-shrink-0 ${tx.status === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                  <div className="min-w-0">
                    <p className="text-gray-900 font-semibold text-sm break-all">
                      {tx.method}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <code className="text-xs text-gray-500 font-mono font-medium">
                        {shortenHash(tx.hash)}
                      </code>
                      <span className="text-xs text-gray-400 font-medium">{formatTime(tx.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${tx.status === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                    {tx.status}
                  </span>
                  <a 
                    href={`https://explorer.solana.com/tx/${tx.hash}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 p-1.5 rounded-md border border-gray-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Transaction History</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">
            0 recent transactions on Solana Devnet
          </p>
        </div>
        <button
          onClick={fetchTransactions}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
          <LinkIcon className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium mb-2">No recent transactions found on Devnet.</p>
        <a 
          href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all mt-4"
        >
          View Wallet on Solana Explorer
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};