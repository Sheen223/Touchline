// src/hooks/useCupFolioContract.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61";
const RPC_URL = "https://rpc.xlayer.tech";

const CONTRACT_ABI = [
  "function aiAgent() view returns (address)",
  "function setAIAgent(address _aiAgent) external",
  "function registerPool(bytes32 poolId, address poolAddress, string memory teamA, string memory teamB, uint32 groupId) external returns (bool)",
  "function updateUpsetProbability(address poolAddress, uint8 probability) external returns (uint24)",
  "function getUpsetProbability(address poolAddress) view returns (uint8)",
];

// Team mapping with pool addresses and group info
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

// Track registered pools in memory (resets on page refresh)
const registeredPools = new Set();

export const useCupFolioContract = () => {
  const [contract, setContract] = useState(null);
  const [aiAgent, setAiAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch AI Agent on every page load
  useEffect(() => {
    const fetchAIAgent = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        setContract(contractInstance);
        
        // Fetch current AI Agent from contract
        const agent = await contractInstance.aiAgent();
        setAiAgent(agent);
        console.log("🔍 Current AI Agent from contract:", agent);
        
        // Clear registered pools cache on page load
        registeredPools.clear();
        
      } catch (err) {
        console.error("Failed to fetch AI Agent:", err);
      }
    };
    
    fetchAIAgent();
  }, []);

  // Register a pool for a team (only needs to be done once per team)
  const registerTeamPool = async (team, walletProvider) => {
    const teamData = teamPoolMap[team];
    if (!teamData) {
      throw new Error(`Unknown team: ${team}`);
    }
    
    // Check cache first
    if (registeredPools.has(team)) {
      console.log(`✅ Pool for ${team} already registered (cached)`);
      return true;
    }
    
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const poolId = ethers.id(`${team}_pool_2026`);
      
      console.log(`📝 Registering pool for ${team}...`);
      const tx = await contractWithSigner.registerPool(
        poolId,
        teamData.address,
        teamData.teamA,
        teamData.teamB,
        teamData.groupId
      );
      await tx.wait();
      
      registeredPools.add(team);
      console.log(`✅ Pool for ${team} registered successfully!`);
      return true;
      
    } catch (err) {
      // If pool already registered, add to cache and continue
      if (err.message?.includes("Pool already registered") || err.reason === "Pool already registered") {
        console.log(`⚠️ Pool for ${team} already registered on-chain`);
        registeredPools.add(team);
        return true;
      }
      throw err;
    }
  };

  const updateProbability = async (team, probability) => {
    const walletProvider = window.okxwallet || window.ethereum;
    if (!walletProvider) throw new Error("No wallet detected");
    
    try {
      // First, ensure we have account access
      let accounts = await walletProvider.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        accounts = await walletProvider.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
          throw new Error("Please approve wallet connection");
        }
      }
      
      // Register the pool first (only happens once per team)
      await registerTeamPool(team, walletProvider);
      
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const teamData = teamPoolMap[team];
      if (!teamData) throw new Error(`Unknown team: ${team}`);
      
      setIsLoading(true);
      console.log(`📡 Updating ${team} probability to ${probability}%...`);
      const tx = await contractWithSigner.updateUpsetProbability(teamData.address, probability);
      const receipt = await tx.wait();
      
      console.log(`✅ ${team} probability updated to ${probability}%!`);
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

  const setAIAgent = async () => {
    const walletProvider = window.okxwallet || window.ethereum;
    if (!walletProvider) throw new Error("No wallet detected");
    
    try {
      const accounts = await walletProvider.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) throw new Error("No accounts found");
      
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      setIsLoading(true);
      console.log(`📡 Setting AI Agent to: ${accounts[0]}`);
      const tx = await contractWithSigner.setAIAgent(accounts[0]);
      await tx.wait();
      
      setAiAgent(accounts[0]);
      console.log(`✅ AI Agent set successfully!`);
      
      return { hash: tx.hash };
    } catch (err) {
      console.error("Set AI Agent error:", err);
      if (err.code === 4001) {
        throw new Error("Transaction rejected. Please approve in your wallet.");
      }
      throw new Error(err.message || "Failed to set AI agent");
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
  };
};