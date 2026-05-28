// src/services/transactionService.js
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61";
const RPC_URL = "https://rpc.xlayer.tech";

const CONTRACT_ABI = [
  "event AIAgentSet(address indexed agent)",
  "event UpsetProbabilityUpdated(bytes32 indexed poolId, uint8 oldProb, uint8 newProb)",
];

export const getRealTransactionHistory = async (walletAddress) => {
  if (!walletAddress) return [];
  
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    // Get current block number
    const currentBlock = await provider.getBlockNumber();
    // Look back further - from block 0 to current
    const fromBlock = 0; // Start from genesis to catch all transactions
    
    const transactions = [];
    
    console.log(`🔍 Fetching transactions from block ${fromBlock} to ${currentBlock}...`);
    
    // Get AI Agent Set events
    try {
      const agentEvents = await contract.queryFilter('AIAgentSet', fromBlock, currentBlock);
      console.log(`Found ${agentEvents.length} AI Agent Set events`);
      
      for (const event of agentEvents) {
        const block = await provider.getBlock(event.blockNumber);
        transactions.push({
          hash: event.transactionHash,
          type: 'ai_agent_set',
          description: `AI Agent set to: ${event.args.agent.slice(0, 10)}...${event.args.agent.slice(-8)}`,
          timestamp: block?.timestamp,
          blockNumber: event.blockNumber,
          status: 'confirmed'
        });
      }
    } catch (err) {
      console.log("Error fetching AI Agent events:", err.message);
    }
    
    // Get Upset Probability Updated events
    try {
      const probabilityEvents = await contract.queryFilter('UpsetProbabilityUpdated', fromBlock, currentBlock);
      console.log(`Found ${probabilityEvents.length} Probability Update events`);
      
      for (const event of probabilityEvents) {
        const block = await provider.getBlock(event.blockNumber);
        transactions.push({
          hash: event.transactionHash,
          type: 'probability_update',
          description: `Upset probability updated: ${event.args.oldProb}% → ${event.args.newProb}%`,
          timestamp: block?.timestamp,
          blockNumber: event.blockNumber,
          status: 'confirmed'
        });
      }
    } catch (err) {
      console.log("Error fetching Probability events:", err.message);
    }
    
    // Sort by block number descending (newest first)
    transactions.sort((a, b) => b.blockNumber - a.blockNumber);
    
    console.log(`✅ Total transactions found: ${transactions.length}`);
    return transactions;
    
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
};