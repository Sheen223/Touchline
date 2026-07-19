import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Railway, we might want to store this in a persistent volume path
// We'll default to the local directory for now
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'agent.db');

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath, { verbose: null });

// Initialize schema
db.pragma('journal_mode = WAL'); // Better performance

// Create portfolio table
db.prepare(`
  CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team TEXT UNIQUE NOT NULL,
    group_name TEXT,
    value REAL NOT NULL,
    probability REAL NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Create agent_logs table
db.prepare(`
  CREATE TABLE IF NOT EXISTS agent_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    amount TEXT,
    icon TEXT,
    color TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Create state table for balances
db.prepare(`
  CREATE TABLE IF NOT EXISTS agent_state (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  )
`).run();

export default db;
