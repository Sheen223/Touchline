// src/context/WalletContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet as useSolanaWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const CustomWalletContext = createContext();

export const useWallet = () => {
  const context = useContext(CustomWalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a CustomWalletProvider');
  }
  return context;
};

export const CustomWalletProvider = ({ children }) => {
  const { publicKey, wallet, disconnect, connecting } = useSolanaWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!publicKey) {
      setBalance('0');
      return;
    }

    const fetchBalance = async () => {
      try {
        const bal = await connection.getBalance(publicKey);
        setBalance((bal / 1e9).toFixed(2));
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    };

    fetchBalance();
    
    // Optional: Subscribe to balance changes
    const subscriptionId = connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance((updatedAccountInfo.lamports / 1e9).toFixed(2));
      },
      'confirmed'
    );

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [publicKey, connection]);

  const connect = () => {
    // Open the official wallet adapter modal
    setVisible(true);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error("Disconnect error", err);
    }
  };

  return (
    <CustomWalletContext.Provider
      value={{
        isConnected: !!publicKey,
        address: publicKey ? publicKey.toString() : '',
        balance,
        isConnecting: connecting,
        error,
        walletType: wallet?.adapter?.name || null,
        connect,
        disconnect: handleDisconnect,
      }}
    >
      {children}
    </CustomWalletContext.Provider>
  );
};