import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Keypair, Connection, clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

export const loadAgentKeypair = () => {
  // 1. Try from Environment Variable (Base58 or JSON string)
  if (process.env.AGENT_PRIVATE_KEY) {
    try {
      if (process.env.AGENT_PRIVATE_KEY.startsWith('[')) {
        // It's a JSON array
        const secretKey = Uint8Array.from(JSON.parse(process.env.AGENT_PRIVATE_KEY));
        return Keypair.fromSecretKey(secretKey);
      } else {
        // Assume Base58
        const secretKey = bs58.decode(process.env.AGENT_PRIVATE_KEY);
        return Keypair.fromSecretKey(secretKey);
      }
    } catch (err) {
      console.error("Failed to parse AGENT_PRIVATE_KEY env variable:", err);
    }
  }

  // 2. Try from Keypair Path or fallback to generating a local file
  const keypairPath = process.env.AGENT_KEYPAIR_PATH || path.join(__dirname, 'agent-keypair.json');
  
  if (fs.existsSync(keypairPath)) {
    try {
      const secretKeyString = fs.readFileSync(keypairPath, 'utf-8');
      const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
      return Keypair.fromSecretKey(secretKey);
    } catch (err) {
      console.error(`Failed to read keypair from ${keypairPath}:`, err);
    }
  }

  // 3. Generate new keypair and save it
  console.log("No valid agent keypair found. Generating a new one for development...");
  const newKeypair = Keypair.generate();
  const secretKeyArray = Array.from(newKeypair.secretKey);
  
  fs.writeFileSync(keypairPath, JSON.stringify(secretKeyArray));
  console.log(`New agent keypair saved to: ${keypairPath}`);
  console.log(`Agent Public Key: ${newKeypair.publicKey.toBase58()}`);
  console.log("Please airdrop Devnet SOL to this address to provide the agent with capital.");
  
  return newKeypair;
};

export const agentKeypair = loadAgentKeypair();

export const fetchOnChainBalance = async () => {
  try {
    const lamports = await connection.getBalance(agentKeypair.publicKey);
    return lamports / 1e9; // Convert to SOL
  } catch (err) {
    console.error("Failed to fetch on-chain balance:", err);
    return null;
  }
};
