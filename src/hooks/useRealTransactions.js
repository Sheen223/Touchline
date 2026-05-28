// src/hooks/useRealTransactions.js
import { useState, useEffect } from 'react';
import { getRealTransactionHistory } from '../services/transactionService';

export const useRealTransactions = (walletAddress) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) {
        setTransactions([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const txs = await getRealTransactionHistory(walletAddress);
        setTransactions(txs);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError(err.message);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchTransactions, 30000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  return { transactions, isLoading, error };
};