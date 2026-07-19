import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Fix for Node 18+ IPv6 DNS resolution issues on Windows
dns.setDefaultResultOrder('ipv4first');
import { startAgent, setEventEmitter, processMatchEvent } from './agent.js';

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const TXLINE_ORIGIN = 'https://txline.txodds.com';
const TXLINE_API_TOKEN = process.env.VITE_TXLINE_API_TOKEN || 'txoracle_api_e490fe5ec76142c99b997d2fe874c775';

// Authenticate helper for TxLine
let jwtToken = null;
const authenticateTxLine = async () => {
  if (jwtToken) return jwtToken;
  try {
    const res = await fetch(`${TXLINE_ORIGIN}/auth/guest/start`, { method: 'POST' });
    const data = await res.json();
    jwtToken = data.token;
    return jwtToken;
  } catch (err) {
    console.error("Failed to authenticate with TxLine:", err);
    return null;
  }
};

// Array of connected SSE clients
let clients = [];

// Broadcast event to all connected SSE clients
const broadcast = (data) => {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

// Wire the agent to broadcast to our clients
setEventEmitter((eventData) => {
  broadcast(eventData);
});

import { agentKeypair } from './solanaWallet.js';

// Get AI Agent Public Key
app.get('/api/agent', (req, res) => {
  res.json({ publicKey: agentKeypair.publicKey.toBase58() });
});

// Simulate Odds Shift (For Testing Dashboard UI)
app.post('/api/simulate', express.json(), (req, res) => {
  const { team, probability } = req.body;
  if (!team || !probability) return res.status(400).json({ error: 'Missing team or probability' });

  // Convert probability back to odds format (p = 100 / odds) => odds = 100 / p
  const odds = (100 / probability).toFixed(2);
  
  const mockPayload = {
    HomeTeam: team,
    AwayTeam: 'Opponent',
    HomeOdds: odds,
    AwayOdds: '2.00',
    GameState: 'live'
  };

  processMatchEvent(mockPayload);
  res.json({ success: true, message: `Simulated odds shift for ${team} to ${probability}%` });
});

// Proxy for the initial snapshot
app.get('/api/snapshot', async (req, res) => {
  try {
    const token = await authenticateTxLine();
    if (!token) return res.status(500).json({ error: "Auth failed" });

    const response = await fetch(`${TXLINE_ORIGIN}/api/fixtures/snapshot`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Api-Token': TXLINE_API_TOKEN
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch snapshot" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

import { getPortfolio, getLogs } from './agent.js';

// Get current portfolio
app.get('/api/portfolio', (req, res) => {
  try {
    const portfolio = getPortfolio();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recent agent logs
app.get('/api/logs', (req, res) => {
  try {
    const logs = getLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SSE endpoint combining TxLine stream and Agent events
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Add this client
  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);

  // Send current cached state to the new client immediately
  Object.values(previousMatches).forEach(match => {
    if (match.fullPayload) {
      res.write(`data: ${JSON.stringify({ type: 'txline_update', payload: match.fullPayload })}\n\n`);
    }
  });

  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
  });
});

// Store previous state to calculate diffs
let previousMatches = {};

const INTERNATIONAL_TEAMS = [
  "argentina", "france", "england", "netherlands", "portugal", "spain", "germany", "uruguay",
  "brazil", "croatia", "morocco", "japan", "senegal", "usa", "poland", "australia",
  "korea republic", "switzerland", "cameroon", "serbia", "mexico", "belgium", "ghana", "ecuador",
  "tunisia", "iran", "costa rica", "wales", "canada", "saudi arabia", "qatar", "denmark"
];

// Continuously fetch snapshot and pipe changes as SSE
const pipeTxLineStream = async () => {
  const token = await authenticateTxLine();
  if (!token) {
    setTimeout(pipeTxLineStream, 5000);
    return;
  }

  try {
    const response = await fetch(`${TXLINE_ORIGIN}/api/fixtures/snapshot`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Api-Token': TXLINE_API_TOKEN
      }
    });

    if (!response.ok) {
      throw new Error(`Snapshot returned ${response.status}`);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data?.data || []);

    // Filter to World Cup teams only to avoid spamming the odds API
    const worldCupMatches = list.filter(fixture => {
      const homeTeam = (fixture.Participant1IsHome ? fixture.Participant1 : fixture.Participant2 || '').toLowerCase();
      const awayTeam = (fixture.Participant1IsHome ? fixture.Participant2 : fixture.Participant1 || '').toLowerCase();
      const compName = (fixture.CompetitionName || fixture.competitionName || '').toLowerCase();
      
      if (compName.includes('friendl') || compName.includes('exhibition')) return false;
      return INTERNATIONAL_TEAMS.some(team => homeTeam.includes(team) || awayTeam.includes(team));
    });

    for (const fixture of worldCupMatches) {
      const fixId = fixture.FixtureId || fixture.fixtureId;
      const prev = previousMatches[fixId];
      
      // Secondary Fetch: Pull Live Odds for this specific fixture
      let fetchedHomeOdds = fixture.HomeOdds || fixture.homeOdds;
      let fetchedAwayOdds = fixture.AwayOdds || fixture.awayOdds;

      try {
        const oddsRes = await fetch(`${TXLINE_ORIGIN}/api/odds/snapshot/${fixId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Api-Token': TXLINE_API_TOKEN
          }
        });
        if (oddsRes.ok) {
          const oddsData = await oddsRes.json();
          const oddsArray = Array.isArray(oddsData) ? oddsData : (oddsData?.data || [oddsData]);
          
          if (oddsArray.length > 0) {
            const o = oddsArray[0];
            if (o.Prices && Array.isArray(o.Prices)) {
              fetchedHomeOdds = o.Prices[0] ? (o.Prices[0] / 1000).toFixed(2) : fetchedHomeOdds;
              fetchedAwayOdds = o.Prices[2] ? (o.Prices[2] / 1000).toFixed(2) : fetchedAwayOdds;
            } else {
              fetchedHomeOdds = o.homeOdds || o.HomeOdds || o.price1 || o.Price1 || fetchedHomeOdds;
              fetchedAwayOdds = o.awayOdds || o.AwayOdds || o.price2 || o.Price2 || fetchedAwayOdds;
            }
          }
        }
      } catch (err) {
        console.error(`Failed to fetch odds for ${fixId}:`, err.message);
      }
      
      const gameState = fixture.GameState || fixture.gameState;

      // Check if odds or state changed
      if (!prev || prev.homeOdds !== fetchedHomeOdds || prev.awayOdds !== fetchedAwayOdds || prev.gameState !== gameState) {
        
        const payload = {
          ...fixture,
          HomeOdds: fetchedHomeOdds,
          AwayOdds: fetchedAwayOdds,
          HomeOddsShift: prev && fetchedHomeOdds ? fetchedHomeOdds - prev.homeOdds : 0,
          AwayOddsShift: prev && fetchedAwayOdds ? fetchedAwayOdds - prev.awayOdds : 0
        };

        // Broadcast to connected clients (and our own agent)
        broadcast({ type: 'txline_update', payload });
        
        // Feed data to the autonomous agent
        processMatchEvent(payload);

        previousMatches[fixId] = { homeOdds: fetchedHomeOdds, awayOdds: fetchedAwayOdds, gameState, fullPayload: payload };
      }
    }

  } catch (err) {
    console.error("Failed to fetch TxLine snapshot:", err);
  }

  // Poll every 10 seconds to simulate a live stream
  setTimeout(pipeTxLineStream, 10000);
};

// Start the server and backend services
app.listen(PORT, async () => {
  console.log(`🧠 AI Backend running on http://localhost:${PORT}`);
  
  // Start polling to create pseudo-stream
  pipeTxLineStream();
  
  // Start the AI Agent loop
  startAgent();
});
