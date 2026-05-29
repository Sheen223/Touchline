import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61";
const RPC_URL = "https://rpc.xlayer.tech";

export const getRealTransactionHistory = async (walletAddress) => {
  if (!walletAddress) return [];
  
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ["event AIAgentSet(address indexed agent)", "event UpsetProbabilityUpdated(bytes32 indexed poolId, uint8 oldProb, uint8 newProb)"],
      provider
    );
    
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = currentBlock - 5000;
    const transactions = [];
    
    // Get AI Agent Set events
    try {
      const agentEvents = await contract.queryFilter('AIAgentSet', fromBlock, currentBlock);
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
      console.log("No AI Agent events");
    }
    
    // Get Upset Probability Updated events
    try {
      const probEvents = await contract.queryFilter('UpsetProbabilityUpdated', fromBlock, currentBlock);
      for (const event of probEvents) {
        const block = await provider.getBlock(event.blockNumber);
        transactions.push({
          hash: event.transactionHash,
          type: 'probability_update',
          description: `Probability updated: ${event.args.oldProb}% → ${event.args.newProb}%`,
          timestamp: block?.timestamp,
          blockNumber: event.blockNumber,
          status: 'confirmed'
        });
      }
    } catch (err) {
      console.log("No Probability events");
    }
    
    transactions.sort((a, b) => b.blockNumber - a.blockNumber);
    return transactions;
    
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
};