import { ethers } from "ethers";
import { Touchline_HOOK_ADDRESS, Touchline_HOOK_ABI } from "../config/contract";

export const getContract = (signerOrProvider) => {
  return new ethers.Contract(Touchline_HOOK_ADDRESS, Touchline_HOOK_ABI, signerOrProvider);
};

// Get upset probability for a pool
export const getUpsetProbability = async (provider, poolAddress) => {
  try {
    const contract = getContract(provider);
    const probability = await contract.getUpsetProbability(poolAddress);
    return probability;
  } catch (error) {
    console.error("Error getting upset probability:", error);
    return 0;
  }
};

// Update upset probability (only AI agent can call)
export const updateUpsetProbability = async (signer, poolAddress, probability) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.updateUpsetProbability(poolAddress, probability);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error updating upset probability:", error);
    throw error;
  }
};

// Get AI agent address
export const getAIAgent = async (provider) => {
  try {
    const contract = getContract(provider);
    const agent = await contract.aiAgent();
    return agent;
  } catch (error) {
    console.error("Error getting AI agent:", error);
    return null;
  }
};

// Register a new pool (for World Cup matches)
export const registerPool = async (signer, poolId, poolAddress, teamA, teamB, groupId) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.registerPool(poolId, poolAddress, teamA, teamB, groupId);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error registering pool:", error);
    throw error;
  }
};