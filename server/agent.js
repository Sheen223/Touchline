import { EventSource } from 'eventsource';

// Portfolio state
let portfolio = {
  usdcBalance: 0,
  positions: []
};
import db from './db.js';
import { fetchOnChainBalance, agentKeypair, connection } from './solanaWallet.js';
import { Transaction, TransactionInstruction, PublicKey, sendAndConfirmTransaction, SystemProgram } from '@solana/web3.js';

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
const PREDICTION_VAULT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

const executeTradeOnChain = async (amountSol, message) => {
  try {
    const tx = new Transaction();
    
    if (amountSol > 0) {
      const lamports = Math.floor(amountSol * 1e9);
      tx.add(
        SystemProgram.transfer({
          fromPubkey: agentKeypair.publicKey,
          toPubkey: PREDICTION_VAULT,
          lamports,
        })
      );
    }

    tx.add(
      new TransactionInstruction({
        keys: [{ pubkey: agentKeypair.publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from(message, 'utf-8'),
        programId: MEMO_PROGRAM_ID,
      })
    );
    
    const signature = await sendAndConfirmTransaction(connection, tx, [agentKeypair]);
    return signature;
  } catch (err) {
    console.error("Trade execution failed:", err);
    return null;
  }
};
// Get current portfolio
export const getPortfolio = () => {
  const usdcBal = parseFloat(db.prepare(`SELECT value FROM agent_state WHERE key = 'sol_balance'`).get()?.value || 0);
  const positions = db.prepare(`SELECT * FROM portfolio`).all();
  return { usdcBalance: usdcBal, positions };
};

// Get last 50 logs
export const getLogs = () => {
  return db.prepare(`SELECT * FROM agent_logs ORDER BY timestamp DESC LIMIT 50`).all();
};

let emitEventToClients = null;

export const setEventEmitter = (emitter) => {
  emitEventToClients = emitter;
};

// Insert a log and emit it to clients
const addAgentLog = (logObj) => {
  const data = {
    amount: null, // default
    ...logObj
  };
  
  const stmt = db.prepare(`
    INSERT INTO agent_logs (type, message, amount, icon, color) 
    VALUES (@type, @message, @amount, @icon, @color)
  `);
  stmt.run(data);
  
  if (emitEventToClients) {
    emitEventToClients({
      ...data,
      timestamp: new Date().toISOString()
    });
  }
};

// Broadcast portfolio to clients
const broadcastPortfolio = () => {
  if (emitEventToClients) {
    emitEventToClients({
      type: 'portfolio_update',
      portfolio: getPortfolio()
    });
  }
};

const refreshOnChainBalance = async () => {
  const balance = await fetchOnChainBalance();
  if (balance !== null) {
    db.prepare(`INSERT INTO agent_state (key, value) VALUES ('sol_balance', ?)
                ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(balance.toString());
    broadcastPortfolio();
  }
};

// Initialize the Agent
export const startAgent = async () => {
  console.log(`🤖 Agent initialized. Identity: ${agentKeypair.publicKey.toBase58()}`);
  
  // Load initial balance
  await refreshOnChainBalance();
  
  addAgentLog({
    type: 'info',
    message: `Agent initialized. Connected to Solana Devnet. Standing by for real-time data...`,
    icon: 'Activity',
    color: 'white'
  });

  // Periodic refresh every 60 seconds
  setInterval(refreshOnChainBalance, 60000);
};

const logToTerminal = (message, color = 'white') => {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  addAgentLog({
    type: 'info',
    message: `[${timestamp}] ${message}`,
    icon: 'Terminal',
    color: color
  });
};

const calculateStrategy = (team, odds, oddsShift, isHome, payload) => {
  const matchTimeStr = payload.MatchTime || payload.matchTime || "0";
  const matchTime = parseInt(matchTimeStr.replace("'", "")) || 0;
  
  const homeScoreStr = payload.HomeScore || payload.homeScore || "0";
  const awayScoreStr = payload.AwayScore || payload.awayScore || "0";
  const homeScore = parseInt(homeScoreStr);
  const awayScore = parseInt(awayScoreStr);
  
  const teamScore = isHome ? homeScore : awayScore;
  const oppScore = isHome ? awayScore : homeScore;
  const scoreDiff = teamScore - oppScore;

  let confidence = 50; 
  let reasons = [];

  // Odds Momentum
  if (oddsShift < -0.05) {
      confidence += 18;
      reasons.push(`Odds movement: +18 (Shifted ${oddsShift.toFixed(2)})`);
  } else if (oddsShift > 0.05) {
      confidence -= 15;
      reasons.push(`Negative odds momentum: -15`);
  } else {
      reasons.push(`Stable market odds`);
  }

  // Score Advantage
  if (scoreDiff > 0) {
      confidence += 25;
      reasons.push(`Current score advantage: +25`);
  } else if (scoreDiff < 0) {
      confidence -= 30;
      reasons.push(`Trailing opponent: -30`);
  }

  // Time Advantage
  if (scoreDiff > 0 && matchTime > 60) {
      confidence += 20;
      reasons.push(`Time advantage: +20`);
  }

  // Market Inefficiency
  const marketProb = (100 / parseFloat(odds));
  const aiProb = Math.min(marketProb + (confidence - 50) * 0.4, 99); 
  
  if (aiProb > marketProb + 2) {
      confidence += 21;
      reasons.push(`Market inefficiency: +21`);
  }

  return {
      confidence: Math.min(Math.max(confidence, 0), 100),
      reasons,
      p: aiProb / 100, 
      b: parseFloat(odds) - 1
  };
};

export const processMatchEvent = async (payload) => {
  const homeOdds = payload.HomeOdds || payload.homeOdds;
  const awayOdds = payload.AwayOdds || payload.awayOdds;
  const homeOddsShift = payload.HomeOddsShift || 0;
  const awayOddsShift = payload.AwayOddsShift || 0;
  
  if (!homeOdds && !awayOdds) return;

  const matchData = {
    home: { name: payload.HomeTeam || payload.homeTeam, odds: homeOdds, shift: homeOddsShift, isHome: true },
    away: { name: payload.AwayTeam || payload.awayTeam, odds: awayOdds, shift: awayOddsShift, isHome: false },
    status: payload.GameState || payload.gameState,
    league: payload.CompetitionName || payload.competitionName
  };

  for (const side of ['home', 'away']) {
    const teamData = matchData[side];
    if (!teamData.name || !teamData.odds) continue;

    const existingPosition = db.prepare(`SELECT * FROM portfolio WHERE team = ?`).get(teamData.name);
    
    // Only process if we don't have a position OR if we have a position we want to divest
    // For simplicity, we just evaluate new buys for now
    if (!existingPosition) {
      
      const strategy = calculateStrategy(teamData.name, teamData.odds, teamData.shift, teamData.isHome, payload);
      
      if (strategy.confidence >= 80) {
        logToTerminal(`TxLINE Event Received: ${matchData.home.name} vs ${matchData.away.name}`);
        logToTerminal(`Analyzing Match State... (${matchData.home.name} ${payload.HomeScore || 0}-${payload.AwayScore || 0} ${matchData.away.name}, ${payload.MatchTime || '0'}' )`);
        
        strategy.reasons.forEach(r => logToTerminal(r, 'gray'));
        
        logToTerminal(`Confidence Score: ${Math.round(strategy.confidence)}/100`, 'yellow');

        // Kelly Criterion
        const q = 1 - strategy.p;
        const kellyFraction = ((strategy.b * strategy.p) - q) / strategy.b;
        
        if (kellyFraction > 0) {
          const riskCap = 0.20; // Maximum 20%
          const finalAllocationPct = Math.min(kellyFraction, riskCap);
          
          logToTerminal(`Risk Engine: Kelly suggests ${(kellyFraction*100).toFixed(1)}%. Applying limits...`);
          logToTerminal(`Recommended allocation: ${(finalAllocationPct*100).toFixed(1)}% of portfolio`);
          
          await triggerAllocation(teamData.name, strategy, finalAllocationPct, matchData.league);
        } else {
          logToTerminal(`Risk Engine: No mathematical edge detected. Holding.`, 'red');
        }
      }
    }
  }
};

const triggerAllocation = async (team, strategy, allocationPct, league) => {
  const portfolio = getPortfolio();
  
  const allocateAmount = portfolio.usdcBalance * allocationPct;
  
  if (allocateAmount < 0.01) {
    logToTerminal(`Insufficient funds to execute trade.`, 'red');
    return;
  }

  logToTerminal(`Executing... Sending ${allocateAmount.toFixed(3)} SOL to Prediction Position Vault`, 'cyan');

  // Update Balance locally immediately
  const newBalance = portfolio.usdcBalance - allocateAmount;
  db.prepare(`INSERT INTO agent_state (key, value) VALUES ('sol_balance', ?)
              ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(newBalance.toString());

  db.prepare(`
    INSERT INTO portfolio (team, group_name, value, probability)
    VALUES (?, ?, ?, ?)
  `).run(team, league || 'World Cup', allocateAmount, strategy.p * 100);

  const memoMsg = `[Touchline AI] BUY ${team} | Conf: ${Math.round(strategy.confidence)}/100 | Kelly: ${(allocationPct*100).toFixed(1)}%`;
  
  const txHash = await executeTradeOnChain(allocateAmount, memoMsg);

  if (txHash) {
    logToTerminal(`Solana transaction confirmed. TX: ${txHash.substring(0, 8)}...`, 'green');
    addAgentLog({
      type: 'allocation',
      message: `ALLOCATION: ${team} Position Opened`,
      amount: `-${allocateAmount.toFixed(3)} SOL`,
      icon: 'TrendingUp',
      color: 'green'
    });
  } else {
    logToTerminal(`Solana transaction failed to confirm.`, 'red');
  }

  broadcastPortfolio();
  setTimeout(refreshOnChainBalance, 2000); 
};
