# CupFolio - AI-Powered World Cup Portfolio Manager

## Overview

CupFolio is an autonomous AI agent that manages World Cup qualification portfolios on X Layer Mainnet. Users deposit OKB, and the AI agent automatically detects upsets, calculates qualification probabilities, and rebalances the portfolio based on real match results.

**Contract Address:** `0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61`

**Network:** X Layer Mainnet (Chain ID: 196)

---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Smart Contract Development](#smart-contract-development)
3. [Frontend Development](#frontend-development)
4. [Wallet Integration](#wallet-integration)
5. [Deployment](#deployment)
6. [Testing Guide](#testing-guide)
7. [Troubleshooting](#troubleshooting)
8. [Hackathon Submission](#hackathon-submission)

---

## Project Architecture

### Tech Stack

| Component | Technology |
|-----------|------------|
| **Smart Contract** | Solidity 0.8.20 |
| **Blockchain** | X Layer Mainnet (Chain ID: 196) |
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS 4 |
| **State Management** | Zustand |
| **Web3 Library** | ethers.js v6 |
| **Wallet Support** | OKX Wallet, MetaMask, Coinbase Wallet |
| **3D Graphics** | Three.js + React Three Fiber |
| **Animations** | Framer Motion |

### Folder Structure
cupfolio/
├── contracts/
│ └── CupFolioHook.sol
├── src/
│ ├── components/
│ │ ├── layout/
│ │ │ ├── Sidebar.jsx
│ │ │ └── Header.jsx
│ │ ├── sections/
│ │ │ ├── StatsRing.jsx
│ │ │ ├── AgentTerminal.jsx
│ │ │ ├── AllocationChart.jsx
│ │ │ ├── PositionsTable.jsx
│ │ │ ├── ActivityFeed.jsx
│ │ │ ├── PortfolioSection.jsx
│ │ │ ├── TransactionsSection.jsx
│ │ │ └── LiveMatches.jsx
│ │ └── ui/
│ │ ├── GlassCard.jsx
│ │ └── DemoBadge.jsx
│ ├── context/
│ │ └── WalletContext.jsx
│ ├── hooks/
│ │ ├── useWalletConnection.js
│ │ ├── useCupFolioContract.js
│ │ └── useLiveMatches.js
│ ├── services/
│ │ ├── sportsDBService.js
│ │ ├── transactionService.js
│ │ └── apiService.js
│ ├── store/
│ │ └── portfolioStore.js
│ ├── config/
│ │ └── contract.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── public/
├── hardhat.config.cjs
├── package.json
└── vite.config.js

text

---

## Smart Contract Development

### Contract: CupFolioHook.sol

**Purpose:** Manages World Cup qualification probabilities and dynamic fees.

**Key Functions:**

```solidity
// Set AI agent wallet (only callable once)
function setAIAgent(address _aiAgent) external

// Register a team pool for a World Cup match
function registerPool(
    bytes32 poolId,
    address poolAddress,
    string calldata teamA,
    string calldata teamB,
    uint32 groupId
) external returns (bool)

// Update upset probability (only AI agent)
function updateUpsetProbability(
    address poolAddress,
    uint8 probability
) external returns (uint24)

// View functions
function getUpsetProbability(address poolAddress) view returns (uint8)
function getDynamicFee(address poolAddress) view returns (uint24)
function aiAgent() view returns (address)
Events:

solidity
event PoolRegistered(bytes32 indexed poolId, string teamA, string teamB, uint32 groupId, address poolAddress);
event UpsetProbabilityUpdated(bytes32 indexed poolId, uint8 oldProb, uint8 newProb);
event AIAgentSet(address indexed agent);
Dynamic Fee Tiers:

Upset Probability	Fee Tier
≥ 50%	0.05% (500)
≥ 30%	0.10% (1000)
≥ 20%	0.20% (2000)
≥ 10%	0.25% (2500)
< 10%	0.30% (3000)
Contract Deployment
Deployment Command:

bash
npx hardhat run scripts/deploy.js --network xlayer_mainnet
Deployment Details:

Contract Address: 0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61

Deployer Wallet: 0x465DD377C8C1cD172Bd0c6297189021F2Aa62fcE

Transaction Hash: 0xb203ed84140...

Gas Used: ~0.00003222 OKB

Network: X Layer Mainnet

Chain ID: 196

Verification:

bash
npx hardhat verify --network xlayer_mainnet 0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61
Team Pool Addresses
Team	Pool Address	Group
Brazil	0x0000...0001	C
Morocco	0x0000...0002	C
Senegal	0x0000...0003	A
Panama	0x0000...0004	A
USA	0x0000...0005	D
Cameroon	0x0000...0006	D
Japan	0x0000...0007	E
Ecuador	0x0000...0008	E
Scotland	0x0000...0009	C
Australia	0x0000...0010	F
Paraguay	0x0000...0011	D
Haiti	0x0000...0012	A
Frontend Development
Installation
bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/cupfolio.git
cd cupfolio

# Install dependencies
npm install

# Install Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# Install additional packages
npm install ethers zustand framer-motion lucide-react recharts
npm install three @react-three/fiber @react-three/drei
npm install react-hot-toast
Key Dependencies
json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "ethers": "^6.10.0",
    "zustand": "^4.4.7",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.309.0",
    "recharts": "^2.10.3",
    "three": "^0.160.0",
    "@react-three/fiber": "^8.15.12",
    "@react-three/drei": "^9.92.7",
    "tailwindcss": "^4.0.0-beta.1"
  }
}
Environment Variables
Create .env file:

env
VITE_CONTRACT_ADDRESS=0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61
VITE_XLAYER_RPC=https://rpc.xlayer.tech
Running Development Server
bash
npm run dev
The app will open at http://localhost:3000

Building for Production
bash
npm run build
The build output will be in the dist/ folder.

Wallet Integration
Supported Wallets
Wallet	Detection	Status
OKX Wallet	window.okxwallet	✅ Full Support
MetaMask	window.ethereum	✅ Full Support
Coinbase Wallet	window.ethereum	✅ Full Support
Wallet Connection Flow
User clicks "Connect Wallet"

App detects available wallet (OKX priority)

Triggers eth_requestAccounts popup

User approves connection

App reads wallet address and OKB balance

Auto-switches to X Layer Mainnet if needed

Network Configuration
javascript
const XLAYER_NETWORK = {
  chainId: '0xc4', // 196 in hex
  chainName: 'X Layer Mainnet',
  nativeCurrency: {
    name: 'OKB',
    symbol: 'OKB',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.xlayer.tech'],
  blockExplorerUrls: ['https://www.okx.com/xlayer/explorer'],
};
Core Features
1. AI Agent Console
The Agent Terminal allows users to:

Run autonomous portfolio rebalancing cycles

View real-time agent logs

Execute transactions on X Layer

Flow:

Click "RUN AGENT CYCLE"

Agent analyzes match results

Detects upsets (e.g., Brazil loses to Morocco)

Updates probabilities on-chain

Rebalances portfolio positions

2. Upset Probability Updates
Users can manually update team probabilities:

Select a team from the dropdown

Adjust probability slider (0-100%)

Click "Update Probability"

Approve transaction in wallet

Wait for confirmation

3. Portfolio Dashboard
Real-time displays:

Portfolio value in USD

OKB balance

Active positions

Qualification probabilities

Transaction history

4. Live World Cup Data
Fetches match data from TheSportsDB API:

Upcoming matches

Live scores

Recent results

Team information

Transaction Flow
Transaction Types
Transaction	Description	Gas Cost
Set AI Agent	Configure wallet as AI agent	~0.00001 OKB
Register Pool	Add team to contract	~0.00002 OKB
Update Probability	Change upset probability	~0.00001 OKB
Transaction Confirmation
User initiates action

Wallet popup appears

User approves transaction

Transaction broadcasts to X Layer

Confirmation received (10-15 seconds)

UI updates with new data

Viewing Transactions
In App: Transactions Section shows history

On Explorer: https://web3.okx.com/explorer/x-layer/evm/address/YOUR_WALLET

Deployment Instructions
Deploy to Vercel
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
Deploy to Netlify
bash
# Build
npm run build

# Deploy via Netlify Drop
# Go to https://app.netlify.com/drop
# Drag and drop the 'dist' folder
Deploy to Cloudflare Pages
Connect GitHub repository

Build command: npm run build

Output directory: dist

Deploy

Testing Guide
Prerequisites
OKX Wallet or MetaMask installed

Wallet connected to X Layer Mainnet

Minimum 0.01 OKB for gas fees

Test Flow
Step 1: Connect Wallet

Click "Connect Wallet"

Select your wallet

Approve connection

Step 2: Set AI Agent

Find "AI Agent Wallet" section

Click "Set My Wallet as AI Agent"

Approve transaction

Wait for confirmation

Step 3: Register Pool (First time only)

Select a team from dropdown

Click "Update Probability"

First transaction: Register Pool

Second transaction: Update Probability

Step 4: Run Agent Cycle

Click "RUN AGENT CYCLE"

Watch logs appear

Approve transactions

See portfolio update

Expected Results
text
✅ Wallet connected
✅ AI Agent set
✅ Pool registered
✅ Probability updated
✅ Transaction appears in history
✅ Portfolio value updates
Troubleshooting
Common Errors
Error	Cause	Solution
"Pool not registered"	Team pool not registered	First update will auto-register
"Pool already registered"	Pool exists	Normal, continue with update
"Transaction rejected"	User denied approval	Approve in wallet popup
"No wallet detected"	Wallet not installed	Install OKX Wallet or MetaMask
"Wrong network"	Not on X Layer	Switch network in wallet
"Contract not initialized"	Contract loading	Wait or refresh page
Debugging Console Commands
javascript
// Check contract connection
const provider = new ethers.JsonRpcProvider("https://rpc.xlayer.tech");
const contract = new ethers.Contract(
  "0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61",
  ["function aiAgent() view returns (address)"],
  provider
);
const agent = await contract.aiAgent();
console.log("AI Agent:", agent);

// Check wallet balance
const balance = await provider.getBalance("YOUR_WALLET_ADDRESS");
console.log("Balance:", ethers.formatEther(balance), "OKB");
Hackathon Submission
Required Information
Field	Value
Project Name	CupFolio
Contract Address	0x3C39ee3BC1c49f9323cEE20EE736e84A6b831d61
Network	X Layer Mainnet (Chain ID: 196)
GitHub Repository	https://github.com/donlykirah/cupfolio.git
Live Demo URL	https://cupfolio.vercel.app
Useful Links
Resource	URL
X Layer Explorer	https://web3.okx.com/explorer/x-layer
X Layer RPC	https://rpc.xlayer.tech
OKX Wallet	https://www.okx.com/web3
X Layer Faucet	https://web3.okx.com/xlayer/faucet/xlayerfaucet
TheSportsDB API	https://www.thesportsdb.com
Future Roadmap
User deposit vault for shared portfolio management

Additional sports leagues (UEFA Champions League, Copa America)

AI model training on historical match data

Mobile app with push notifications

Governance token for fee sharing

Integration with additional prediction markets

License
MIT License - See LICENSE file for details

Acknowledgments
Uniswap V4 for Hook architecture

X Layer for blockchain infrastructure

TheSportsDB for free sports data API

OKX Wallet for Web3 wallet support

*Built for the X Layer x Uniswap V4 Hackathon - May 2026*
