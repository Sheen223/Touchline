// src/hooks/useCupFolioContract.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61";
const XLAYER_RPC = "https://rpc.xlayer.tech";

const CONTRACT_ABI = [
  "function aiAgent() view returns (address)",
  "function setAIAgent(address _aiAgent) external",
  "function registerPool(bytes32 poolId, address poolAddress, string memory teamA, string memory teamB, uint32 groupId) external returns (bool)",
  "function updateUpsetProbability(address poolAddress, uint8 probability) external returns (uint24)",
  "function getUpsetProbability(address poolAddress) view returns (uint8)",
];

const teamPoolMap = {
  'Brazil': { address: '0x0000000000000000000000000000000000000001', groupId: 3, teamA: 'Brazil', teamB: 'Opponent' },
  'Morocco': { address: '0x0000000000000000000000000000000000000002', groupId: 3, teamA: 'Morocco', teamB: 'Opponent' },
  'Senegal': { address: '0x0000000000000000000000000000000000000003', groupId: 1, teamA: 'Senegal', teamB: 'Opponent' },
  'Panama': { address: '0x0000000000000000000000000000000000000004', groupId: 1, teamA: 'Panama', teamB: 'Opponent' },
  'USA': { address: '0x0000000000000000000000000000000000000005', groupId: 4, teamA: 'USA', teamB: 'Opponent' },
  'Cameroon': { address: '0x0000000000000000000000000000000000000006', groupId: 4, teamA: 'Cameroon', teamB: 'Opponent' },
  'Japan': { address: '0x0000000000000000000000000000000000000007', groupId: 5, teamA: 'Japan', teamB: 'Opponent' },
  'Ecuador': { address: '0x0000000000000000000000000000000000000008', groupId: 5, teamA: 'Ecuador', teamB: 'Opponent' },
  'Scotland': { address: '0x0000000000000000000000000000000000000009', groupId: 3, teamA: 'Scotland', teamB: 'Opponent' },
  'Australia': { address: '0x0000000000000000000000000000000000000010', groupId: 6, teamA: 'Australia', teamB: 'Opponent' },
  'Paraguay': { address: '0x0000000000000000000000000000000000000011', groupId: 4, teamA: 'Paraguay', teamB: 'Opponent' },
  'Haiti': { address: '0x0000000000000000000000000000000000000012', groupId: 1, teamA: 'Haiti', teamB: 'Opponent' },
};

// Track which pools have been registered
const registeredPools = new Set();

export const useCupFolioContract = () => {
  const [contract, setContract] = useState(null);
  const [aiAgent, setAiAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize contract
  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(XLAYER_RPC);
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        setContract(contractInstance);
        
        try {
          const agent = await contractInstance.aiAgent();
          setAiAgent(agent);
          console.log("AI Agent:", agent);
        } catch (err) {
          console.log("Could not fetch AI agent");
        }
      } catch (err) {
        console.error("Init error:", err);
      }
    };
    init();
  }, []);

  // Register a pool before updating
  const registerPool = async (team) => {
    const walletProvider = window.okxwallet || window.ethereum;
    if (!walletProvider) {
      throw new Error("No wallet detected");
    }
    
    const teamData = teamPoolMap[team];
    if (!teamData) {
      throw new Error(`Unknown team: ${team}`);
    }
    
    // Check if already registered
    if (registeredPools.has(team)) {
      console.log(`Pool for ${team} already registered`);
      return true;
    }
    
    try {
      const accounts = await walletProvider.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }
      
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const poolId = ethers.id(`${team}_pool`);
      
      console.log(`Registering pool for ${team}...`);
      const tx = await contractWithSigner.registerPool(
        poolId,
        teamData.address,
        teamData.teamA,
        teamData.teamB,
        teamData.groupId
      );
      await tx.wait();
      
      registeredPools.add(team);
      console.log(`✅ Pool for ${team} registered successfully`);
      return true;
    } catch (err) {
      console.error(`Failed to register pool for ${team}:`, err);
      throw new Error(`Failed to register pool: ${err.message}`);
    }
  };

  const setAIAgent = async () => {
    const walletProvider = window.okxwallet || window.ethereum;
    if (!walletProvider) {
      throw new Error("No wallet detected");
    }
    
    try {
      const accounts = await walletProvider.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }
      
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      setIsLoading(true);
      const tx = await contractWithSigner.setAIAgent(accounts[0]);
      await tx.wait();
      
      setAiAgent(accounts[0]);
      return { hash: tx.hash };
    } catch (err) {
      console.error("Set AI Agent error:", err);
      throw new Error(err.message || "Failed to set AI agent");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProbability = async (team, probability) => {
    const walletProvider = window.okxwallet || window.ethereum;
    if (!walletProvider) {
      throw new Error("No wallet detected");
    }
    
    try {
      // First, ensure the pool is registered
      await registerPool(team);
      
      const accounts = await walletProvider.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        const newAccounts = await walletProvider.request({ method: 'eth_requestAccounts' });
        if (!newAccounts || newAccounts.length === 0) {
          throw new Error("Please approve wallet connection");
        }
      }
      
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const teamData = teamPoolMap[team];
      if (!teamData) {
        throw new Error(`Unknown team: ${team}`);
      }
      
      setIsLoading(true);
      console.log(`Updating ${team} probability to ${probability}%...`);
      const tx = await contractWithSigner.updateUpsetProbability(teamData.address, probability);
      const receipt = await tx.wait();
      
      console.log(`✅ ${team} probability updated!`);
      return { hash: tx.hash, block: receipt.blockNumber };
    } catch (err) {
      console.error("Update error:", err);
      if (err.code === 4001) {
        throw new Error("Transaction rejected. Please approve in your wallet.");
      }
      throw new Error(err.message || "Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    contract,
    aiAgent,
    isLoading,
    error,
    setAIAgent,
    updateProbability,
    registerPool,
  };
};