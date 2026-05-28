// src/hooks/useWalletConnection.jsx
import { useState, useEffect } from 'react';

export const useWalletConnection = () => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);

  // Check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            const balanceHex = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest']
            });
            const balanceInEth = parseInt(balanceHex, 16) / 1e18;
            setBalance(balanceInEth.toFixed(4));
          }
        } catch (err) {
          console.log('Check connection error:', err);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    console.log('Connect button clicked');
    setIsConnecting(true);
    setError(null);
    
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        console.log('No ethereum object found');
        throw new Error('Please install MetaMask');
      }
      
      console.log('Ethereum object found, requesting accounts...');
      
      // This MUST be called directly from the click handler
      // No async delays before this call
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      console.log('Accounts received:', accounts);
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        const balanceInEth = parseInt(balanceHex, 16) / 1e18;
        setBalance(balanceInEth.toFixed(4));
        
        console.log('Connected successfully!');
      } else {
        throw new Error('No accounts found');
      }
      
    } catch (err) {
      console.error('Connection error full details:', err);
      
      if (err.code === 4001) {
        setError('Connection rejected. Please approve the request in MetaMask.');
      } else if (err.code === -32002) {
        setError('MetaMask popup already open. Please check your browser for the MetaMask window.');
      } else {
        setError(`Connection failed: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    account,
    isConnected,
    isConnecting,
    error,
    balance,
    connectWallet,
    disconnectWallet: () => {
      setAccount(null);
      setIsConnected(false);
      setBalance(null);
    }
  };
};