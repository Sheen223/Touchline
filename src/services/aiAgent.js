import { usePortfolioStore } from '../store/portfolioStore';

// Mock probability engine
const calculateProbabilities = (results) => {
  // Simulate AI probability calculations
  return {
    Brazil: results?.brazilWon ? 0.71 : 0.88,
    Morocco: results?.moroccoWon ? 0.81 : 0.62,
    Scotland: results?.scotlandWon ? 0.68 : 0.45,
    Haiti: results?.haitiWon ? 0.15 : 0.09,
    USA: 0.75,
    Paraguay: 0.35, 
    Australia: 0.55,
    Turkiye: 0.48
  };
};

// Calculate new portfolio weights based on updated probabilities
const calculateNewWeights = (probabilities, strategy) => {
  const weights = {};
  
  // Different allocation based on strategy
  const strategyMultipliers = {
    Balanced: { favorite: 1.0, mid: 1.0, underdog: 1.0 },
    Aggressive: { favorite: 0.8, mid: 1.2, underdog: 1.5 },
    Conservative: { favorite: 1.3, mid: 0.8, underdog: 0.5 }
  };
  
  const multiplier = strategyMultipliers[strategy];
  
  for (const [team, prob] of Object.entries(probabilities)) {
    let weight = prob;
    if (prob > 0.7) weight *= multiplier.favorite;
    else if (prob > 0.4) weight *= multiplier.mid;
    else weight *= multiplier.underdog;
    weights[team] = weight;
  }
  
  // Normalize to sum to 1
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  for (const team in weights) {
    weights[team] = weights[team] / total;
  }
  
  return weights;
};

// Calculate rebalance actions
const calculateRebalance = (currentPositions, newWeights, totalValue) => {
  const actions = [];
  
  for (const [team, targetWeight] of Object.entries(newWeights)) {
    const targetValue = totalValue * targetWeight;
    const currentValue = currentPositions[team] || 0;
    const difference = targetValue - currentValue;
    
    if (Math.abs(difference) > 5) { // Minimum threshold to avoid tiny trades
      actions.push({
        team,
        action: difference > 0 ? 'BUY' : 'SELL',
        amount: Math.abs(difference),
        reason: `${team} probability ${difference > 0 ? 'increased' : 'decreased'}`
      });
    }
  }
  
  return actions;
};

// Main agent decision function
export const runAgentCycle = async (matchResults, currentStrategy) => {
  const store = usePortfolioStore.getState();
  
  // Step 1: Update probabilities based on match results
  const newProbabilities = calculateProbabilities(matchResults);
  
  // Step 2: Calculate new optimal weights
  const newWeights = calculateNewWeights(newProbabilities, currentStrategy);
  
  // Step 3: Generate rebalance actions
  const currentPositions = store.allocations;
  const rebalanceActions = calculateRebalance(currentPositions, newWeights, store.currentValue);
  
  // Step 4: Return decisions
  return {
    probabilities: newProbabilities,
    weights: newWeights,
    actions: rebalanceActions,
    timestamp: Date.now()
  };
};

// Yield generation calculation
export const calculateYield = (idleCapital, hoursIdle, apy = 0.08) => {
  const yearlyReturn = idleCapital * apy;
  const dailyReturn = yearlyReturn / 365;
  const hourlyReturn = dailyReturn / 24;
  return hourlyReturn * hoursIdle;
};