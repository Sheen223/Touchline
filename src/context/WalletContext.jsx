// src/context/WalletContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Get wallet provider (OKX or MetaMask)
const getWalletProvider = () => {
  if (typeof window === 'undefined') return null;
  
  // OKX Wallet
  if (window.okxwallet) {
    return window.okxwallet;
  }
  
  // MetaMask
  if (window.ethereum) {
    return window.ethereum;
  }
  
  return null;
};

// X Layer Network Configuration
const XLAYER_NETWORK = {
  chainId: '0xc4', // 196 in hex
  chainName: 'X Layer Mainnet',
  nativeCurrency: {
    name: 'OKB',
    symbol: 'OKB',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.xlayer.tech'],
  blockExplorerUrls: ['https://www.okx.com/xlayer/explorer'],
};

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [walletType, setWalletType] = useState(null);

  // Check connection on load
  useEffect(() => {
    const checkConnection = async () => {
      const provider = getWalletProvider();
      if (!provider) return;
      
      try {
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          
          // Detect wallet type
          if (window.okxwallet && provider === window.okxwallet) {
            setWalletType('OKX Wallet');
          } else if (window.ethereum?.isMetaMask) {
            setWalletType('MetaMask');
          }
          
          // Get balance
          const balanceHex = await provider.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          });
          const balanceInOKB = parseInt(balanceHex, 16) / 1e18;
          setBalance(balanceInOKB.toFixed(4));
          
          // Get chain ID
          const chainIdHex = await provider.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainIdHex, 16));
        }
      } catch (err) {
        console.log("Not connected");
      }
    };
    
    checkConnection();
  }, []);

  const switchToXLayer = async () => {
    const provider = getWalletProvider();
    if (!provider) return false;
    
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: XLAYER_NETWORK.chainId }],
      });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [XLAYER_NETWORK],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add network:', addError);
          return false;
        }
      }
      return false;
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    
    const provider = getWalletProvider();
    if (!provider) {
      setError('No wallet detected. Please install OKX Wallet or MetaMask.');
      setIsConnecting(false);
      return;
    }
    
    try {
      // Request account access - this triggers the popup
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        // Detect wallet type
        if (window.okxwallet && provider === window.okxwallet) {
          setWalletType('OKX Wallet');
        } else if (window.ethereum?.isMetaMask) {
          setWalletType('MetaMask');
        }
        
        // Get balance
        const balanceHex = await provider.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        const balanceInOKB = parseInt(balanceHex, 16) / 1e18;
        setBalance(balanceInOKB.toFixed(4));
        
        // Get chain ID
        const chainIdHex = await provider.request({ method: 'eth_chainId' });
        const currentChainId = parseInt(chainIdHex, 16);
        setChainId(currentChainId);
        
        // If not on X Layer, prompt to switch
        if (currentChainId !== 196) {
          const switched = await switchToXLayer();
          if (switched) {
            // Refresh balance after network switch
            const newBalanceHex = await provider.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest']
            });
            const newBalance = parseInt(newBalanceHex, 16) / 1e18;
            setBalance(newBalance.toFixed(4));
            setChainId(196);
          }
        }
      }
    } catch (err) {
      console.error("Connection error:", err);
      if (err.code === 4001) {
        setError("Connection rejected. Please approve the request in your wallet.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress('');
    setBalance('0');
    setError(null);
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        chainId,
        isConnecting,
        error,
        walletType,
        connect,
        disconnect,
        switchToXLayer,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};