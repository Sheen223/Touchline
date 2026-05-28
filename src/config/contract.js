// src/config/contract.js
export const CUPFOLIO_HOOK_ADDRESS = "0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61";

export const CUPFOLIO_HOOK_ABI = [
  "function aiAgent() view returns (address)",
  "function setAIAgent(address _aiAgent) external",
  "function updateUpsetProbability(address poolAddress, uint8 probability) external returns (uint24)",
  "function getUpsetProbability(address poolAddress) view returns (uint8)",
  "function getDynamicFee(address poolAddress) view returns (uint24)",
  "event AIAgentSet(address indexed agent)",
  "event UpsetProbabilityUpdated(bytes32 indexed poolId, uint8 oldProb, uint8 newProb)"
];