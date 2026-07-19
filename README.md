# Touchline - AI-Powered World Cup Portfolio Manager

## Overview
**Touchline** is an autonomous AI agent that manages World Cup qualification portfolios on the **Solana Devnet**. Users connect their Phantom or Backpack wallets and deposit Devnet USDC. The AI agent connects to the **TxLINE StablePrice API**, monitors real-time match odds via Server-Sent Events (SSE), dynamically calculates qualification probabilities, and autonomously rebalances the portfolio based on live market movements.

---

## Table of Contents
- [Project Architecture](#project-architecture)
- [Smart Contract Development](#smart-contract-development)
- [Frontend Development](#frontend-development)
- [Wallet Integration](#wallet-integration)
- [Core Features](#core-features)
- [Transaction Flow](#transaction-flow)
- [Deployment Instructions](#deployment-instructions)
- [Testing Guide](#testing-guide)
- [Troubleshooting](#troubleshooting)
- [Hackathon Submission](#hackathon-submission)

---

## Project Architecture

### Tech Stack
| Component | Technology |
| :--- | :--- |
| **Smart Contract** | Rust (Anchor Framework) |
| **Blockchain** | Solana Devnet |
| **Frontend** | React 19 + Vite |
| **Styling** | Tailwind CSS 4 |
| **State Management**| React Context / Zustand |
| **Web3 Library** | `@solana/web3.js` & `@coral-xyz/anchor` |
| **Wallet Support** | Phantom, Backpack, Solflare |
| **Sports Data** | TxLINE API (Snapshot & SSE Stream) |
| **Backend Agent** | Node.js (Express & better-sqlite3) |

### Folder Structure
```text
touchline/
├── anchor/                  # Smart Contract workspace
│   ├── programs/
│   │   └── touchline/
│   │       └── src/
│   │           └── lib.rs   # Anchor Rust Smart Contract
│   └── tests/
├── server/                  # AI Agent Backend
│   ├── agent.js             # Autonomous Math & Rebalancing Engine
│   ├── server.js            # Express API & TxLINE SSE Proxy
│   └── solanaWallet.js      # AI Agent's programmatic keypair
├── src/                     # React Frontend
│   ├── components/
│   │   ├── sections/        # LiveMatches, AgentTerminal, etc.
│   │   └── ui/              # Reusable UI components
│   ├── context/
│   │   └── MatchContext.jsx # Global State & SSE Stream Parser
│   ├── hooks/
│   ├── services/
│   │   └── txlineService.js # API client for fetching snapshot odds
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

---

## Smart Contract Development

**Contract:** `touchline_program` (Anchor)
**Purpose:** Manages the secure USDC deposit vault and tracks individual user shares representing their stake in the AI's autonomous portfolio.

### Key Instructions (Anchor)
```rust
// Initialize the global vault and set the AI Agent authority
pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()>

// User deposits Devnet USDC into the vault to fund the portfolio
pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()>

// AI Agent autonomously updates portfolio weights based on TxLINE odds
pub fn update_weights(ctx: Context<UpdateWeights>, new_weights: Vec<Weight>) -> Result<()>
```

---

## Frontend Development

### Installation
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/touchline.git
cd touchline

# Install dependencies
npm install

# Start the AI Agent Backend (Port 3001)
cd server
npm install
node server.js

# Start the React Frontend (Port 3000)
cd ..
npm run dev
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_TXLINE_API_TOKEN=txoracle_api_e490fe5ec76142c99b997d2fe874c775
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

---

## Wallet Integration

### Supported Wallets
| Wallet | Status |
| :--- | :--- |
| **Phantom** | ✅ Full Support |
| **Backpack** | ✅ Full Support |
| **Solflare** | ✅ Full Support |

### Connection Flow
1. User clicks **"Connect Wallet"**.
2. `@solana/wallet-adapter-react` triggers the wallet extension popup.
3. User approves the connection.
4. App reads the public key and checks Devnet USDC/SOL balances.

---

## Core Features

### 1. Live TxLINE Data Stream
The Node.js backend continuously polls the **TxLINE StablePrice Feed** (`/api/odds/snapshot`), calculates real-time `HomeOddsShift`, and multiplexes the data through a Server-Sent Events (SSE) stream down to the React frontend.

### 2. Autonomous AI Math Engine
The agent listens to the live odds stream and calculates real-time qualification probabilities using the formula: `Probability = 100 / DecimalOdds`. When odds shift significantly, the agent mathematically rebalances its portfolio weights.

### 3. Portfolio Dashboard
Real-time displays:
- Upcoming and Live World Cup Matches
- AI Qualification Probabilities (visualized via dynamic progress bars)
- Active USDC Portfolio Positions
- Real-time Agent Logs & Console Terminal

---

## Transaction Flow

1. **User Deposit:** User connects wallet and signs a Solana transaction transferring Devnet USDC to the vault PDA.
2. **Data Ingestion:** The AI Backend fetches odds from `txline.txodds.com`.
3. **Agent Rebalance:** If the probability shifts, the programmatic AI wallet (`solanaWallet.js`) signs a transaction updating the portfolio weights on the Anchor program.
4. **UI Update:** The frontend SSE stream immediately reflects the new odds and portfolio layout.

---

## Testing Guide

### Prerequisites
- Phantom or Backpack Wallet installed.
- Network set to **Solana Devnet**.
- Wallet funded with Devnet SOL (for gas) and Devnet USDC (for deposits).

### Test Flow
1. **Boot Services:** Run `node server.js` and `npm run dev`.
2. **Connect Wallet:** Click "Connect" on the dashboard.
3. **Verify Data Flow:** Ensure "PROBABILITY UNAVAILABLE" disappears and real odds (e.g., 31%) render for matches like Spain vs. Argentina.
4. **Deposit:** Initiate a USDC deposit and sign the transaction.
5. **Watch the Agent:** Observe the Agent Terminal logs as it ingests TxLINE updates and rebalances the funds!

---

## Troubleshooting

| Error | Cause | Solution |
| :--- | :--- | :--- |
| **"PROBABILITY UNAVAILABLE"** | Match is too far out / Books closed | Wait for global sportsbooks to open lines. |
| **"Ghost Matches / 31% Blank Row"** | Missing `Participant1` mapping | Ensure `MatchContext.jsx` maps `Participant1` correctly from the SSE stream. |
| **Wallet Connection Failed** | Wrong Network | Switch your wallet to Solana Devnet. |
| **Stream Disconnected** | Backend Offline | Ensure `node server.js` is actively running. |

---

## Hackathon Submission

| Field | Value |
| :--- | :--- |
| **Project Name** | Touchline |
| **Network** | Solana Devnet |
| **Data Provider** | TxOdds / TxLINE StablePrice API |
| **GitHub** | *Pending...* |
| **Live Demo** | *Pending...* |

---

## Future Roadmap
- Decentralized Oracle Network for trustless odds reporting.
- Expansion to additional major tournaments (Champions League, Euros).
- Agent yield-farming integration (staking idle vault USDC into Kamino/Marginfi between matches).

---
*Built for the World Cup AI & Solana Hackathon - July 2026*
