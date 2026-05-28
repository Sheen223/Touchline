// src/hooks/useCupFolioContract.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CUPFOLIO_HOOK_ADDRESS = "0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61";

const CUPFOLIO_HOOK_ABI = [
  "function aiAgent() view returns (address)",
  "function setAIAgent(address _aiAgent) external",
  "function updateUpsetProbability(address poolAddress, uint8 probability) external returns (uint24)",
  "function getUpsetProbability(address poolAddress) view returns (uint8)",
  "function getDynamicFee(address poolAddress) view returns (uint24)",
];

// Detect available wallet provider
const getWalletProvider = () => {
  if (typeof window === 'undefined') return null;
  
  // OKX Wallet
  if (window.okxwallet) {
    console.log("✅ OKX Wallet detected");
    return window.okxwallet;
  }
  
  // MetaMask or other EIP-1193 wallets
  if (window.ethereum) {
    console.log("✅ EIP-1193 Wallet detected (MetaMask, Coinbase, etc.)");
    return window.ethereum;
  }
  
  return null;
};

export const useCupFolioContract = () => {
  const [contract, setContract] = useState(null);
  const [aiAgent, setAiAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [walletType, setWalletType] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      const provider = getWalletProvider();
      
      if (!provider) {
        setError("No wallet detected. Please install OKX Wallet, MetaMask, or another Web3 wallet.");
        return;
      }
      
      try {
        console.log("🔗 Initializing contract with detected wallet...");
        
        // Request account access (works for all EIP-1193 wallets)
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found. Please unlock your wallet.");
        }
        
        // Detect wallet type for UI
        if (window.okxwallet && provider === window.okxwallet) {
          setWalletType("OKX Wallet");
        } else if (window.ethereum && provider === window.ethereum) {
          // Try to detect if it's MetaMask
          const isMetaMask = window.ethereum.isMetaMask;
          setWalletType(isMetaMask ? "MetaMask" : "Web3 Wallet");
        }
        
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const walletAddress = await signer.getAddress();
        
        console.log(`📡 Connected with: ${walletAddress}`);
        console.log(`🔐 Wallet type: ${walletType || "Web3 Wallet"}`);
        
        const contractInstance = new ethers.Contract(
          CUPFOLIO_HOOK_ADDRESS,
          CUPFOLIO_HOOK_ABI,
          signer
        );
        
        setContract(contractInstance);
        setIsConnected(true);
        setError(null);
        
        // Get AI agent address from contract
        try {
          const agent = await contractInstance.aiAgent();
          setAiAgent(agent);
          console.log("✅ AI Agent:", agent);
        } catch (err) {
          console.log("Could not fetch AI agent:", err.message);
        }
        
        console.log("✅ Contract connected to:", CUPFOLIO_HOOK_ADDRESS);
        
        // Listen for account changes (works for all wallets)
        provider.on('accountsChanged', (newAccounts) => {
          console.log("Account changed:", newAccounts[0]);
          window.location.reload();
        });
        
        // Listen for chain changes
        provider.on('chainChanged', () => {
          console.log("Network changed, reloading...");
          window.location.reload();
        });
        
      } catch (error) {
        console.error("Failed to initialize contract:", error);
        
        if (error.code === 4001) {
          setError("Connection rejected. Please approve the connection request.");
        } else {
          setError(error.message || "Failed to connect wallet");
        }
        setIsConnected(false);
      }
    };
    
    initContract();
    
    // Cleanup listeners
    return () => {
      const provider = getWalletProvider();
      if (provider) {
        provider.removeAllListeners?.();
      }
    };
  }, []);

  const updateProbability = async (poolAddress, probability) => {
    if (!contract) throw new Error("Contract not initialized");
    
    setIsLoading(true);
    try {
      console.log(`📡 Updating probability for ${poolAddress} to ${probability}%...`);
      const tx = await contract.updateUpsetProbability(poolAddress, probability);
      await tx.wait();
      console.log("✅ Probability updated!");
      return true;
    } catch (error) {
      console.error("Error updating probability:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getProbability = async (poolAddress) => {
    if (!contract) return 0;
    try {
      return await contract.getUpsetProbability(poolAddress);
    } catch (error) {
      console.error("Error getting probability:", error);
      return 0;
    }
  };

  const getDynamicFee = async (poolAddress) => {
    if (!contract) return 3000;
    try {
      return await contract.getDynamicFee(poolAddress);
    } catch (error) {
      console.error("Error getting dynamic fee:", error);
      return 3000;
    }
  };

  return {
    contract,
    aiAgent,
    isLoading,
    isConnected,
    error,
    walletType,
    updateProbability,
    getProbability,
    getDynamicFee
  };
};