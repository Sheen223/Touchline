// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CupFolioHook {
    address public aiAgent;
    bool public aiAgentSet;
    
    struct PoolConfig {
        uint8 upsetProbability;
        uint24 customFee;
        bool isActive;
        uint256 lastUpdate;
        string teamA;
        string teamB;
        uint32 groupId;
        address poolAddress;
    }
    
    mapping(bytes32 => PoolConfig) public poolConfigs;
    mapping(address => bytes32) public poolIdByAddress;
    
    event PoolRegistered(bytes32 indexed poolId, string teamA, string teamB, uint32 groupId, address poolAddress);
    event UpsetProbabilityUpdated(bytes32 indexed poolId, uint8 oldProb, uint8 newProb);
    event AIAgentSet(address indexed agent);
    
    function setAIAgent(address _aiAgent) external {
        require(!aiAgentSet, "AI agent already set");
        require(_aiAgent != address(0), "Invalid agent address");
        aiAgent = _aiAgent;
        aiAgentSet = true;
        emit AIAgentSet(_aiAgent);
    }
    
    function registerPool(
        bytes32 poolId,
        address poolAddress,
        string calldata teamA,
        string calldata teamB,
        uint32 groupId
    ) external returns (bool) {
        require(msg.sender == aiAgent || !aiAgentSet, "Only AI agent can register pools");
        require(!poolConfigs[poolId].isActive, "Pool already registered");
        
        poolConfigs[poolId] = PoolConfig({
            upsetProbability: 0,
            customFee: 3000,
            isActive: true,
            lastUpdate: block.timestamp,
            teamA: teamA,
            teamB: teamB,
            groupId: groupId,
            poolAddress: poolAddress
        });
        
        poolIdByAddress[poolAddress] = poolId;
        emit PoolRegistered(poolId, teamA, teamB, groupId, poolAddress);
        return true;
    }
    
    function updateUpsetProbability(
        address poolAddress,
        uint8 probability
    ) external returns (uint24) {
        require(msg.sender == aiAgent, "Only AI agent can update");
        require(probability <= 100, "Probability must be between 0-100");
        
        bytes32 poolId = poolIdByAddress[poolAddress];
        require(poolConfigs[poolId].isActive, "Pool not registered");
        
        uint8 oldProb = poolConfigs[poolId].upsetProbability;
        poolConfigs[poolId].upsetProbability = probability;
        poolConfigs[poolId].lastUpdate = block.timestamp;
        
        uint24 newFee = getFeeForProbability(probability);
        poolConfigs[poolId].customFee = newFee;
        
        emit UpsetProbabilityUpdated(poolId, oldProb, probability);
        return newFee;
    }
    
    function getFeeForProbability(uint8 probability) public pure returns (uint24) {
        if (probability >= 50) return 500;
        if (probability >= 30) return 1000;
        if (probability >= 20) return 2000;
        if (probability >= 10) return 2500;
        return 3000;
    }
    
    function getPoolConfig(bytes32 poolId) external view returns (PoolConfig memory) {
        return poolConfigs[poolId];
    }
    
    function getUpsetProbability(address poolAddress) external view returns (uint8) {
        bytes32 poolId = poolIdByAddress[poolAddress];
        return poolConfigs[poolId].upsetProbability;
    }
}