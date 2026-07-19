import { useState } from 'react';
import { Code, Terminal, CheckCircle2, AlertTriangle, Book, Settings, Layers, Box } from 'lucide-react';

export const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex gap-8 items-start relative bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 shrink-0 sticky top-24 hidden md:block">
        <nav className="flex flex-col gap-1">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">Documentation</h4>
          {[
            { id: 'overview', icon: Book, label: 'Overview' },
            { id: 'architecture', icon: Layers, label: 'Project Architecture' },
            { id: 'smart-contracts', icon: Code, label: 'Smart Contracts' },
            { id: 'features', icon: Terminal, label: 'Core Features' },
            { id: 'wallet', icon: Settings, label: 'Wallet Integration' },
            { id: 'testing', icon: CheckCircle2, label: 'Testing Guide' },
            { id: 'troubleshooting', icon: AlertTriangle, label: 'Troubleshooting' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left font-medium
                ${activeSection === item.id ? 'bg-green-50 text-green-700 shadow-sm border border-green-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent'}
              `}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pb-32">
        <div className="prose max-w-none space-y-16 text-gray-700">
          
          {/* Overview */}
          <section id="overview" className="scroll-mt-24">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">Touchline Overview</h1>
            <p className="text-lg leading-relaxed mb-6">
              Touchline is an autonomous AI agent that manages World Cup qualification portfolios on the Solana Devnet. Users connect their Phantom or Backpack wallets and deposit Devnet USDC. The AI agent connects to the TxLINE StablePrice API, monitors real-time match odds via Server-Sent Events (SSE), dynamically calculates qualification probabilities, and autonomously rebalances the portfolio based on live market movements.
            </p>
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Contract Program</div>
                  <code className="text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100 font-mono text-sm">touchline_program (Anchor)</code>
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium mb-1">Network</div>
                  <div className="font-semibold text-gray-900">Solana Devnet</div>
                </div>
              </div>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900"><Layers className="text-green-600" /> Project Architecture</h2>
            
            <h3 className="text-xl font-bold mb-4 mt-8 text-gray-900">Tech Stack</h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="p-4 font-semibold text-gray-900">Component</th>
                    <th className="p-4 font-semibold text-gray-900">Technology</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-4 font-medium text-gray-900">Smart Contract</td><td className="p-4 font-mono text-green-700 bg-green-50/30">Rust (Anchor Framework)</td></tr>
                  <tr><td className="p-4 font-medium text-gray-900">Blockchain</td><td className="p-4">Solana Devnet</td></tr>
                  <tr><td className="p-4 font-medium text-gray-900">Frontend</td><td className="p-4">React 19 + Vite</td></tr>
                  <tr><td className="p-4 font-medium text-gray-900">Styling</td><td className="p-4">Tailwind CSS 4</td></tr>
                  <tr><td className="p-4 font-medium text-gray-900">Web3 Library</td><td className="p-4">@solana/web3.js & @coral-xyz/anchor</td></tr>
                  <tr><td className="p-4 font-medium text-gray-900">Sports Data</td><td className="p-4">TxLINE API (Snapshot & SSE Stream)</td></tr>
                  <tr><td className="p-4 font-medium text-gray-900">Backend Agent</td><td className="p-4">Node.js (Express & better-sqlite3)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Smart Contracts */}
          <section id="smart-contracts" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900"><Code className="text-green-600" /> Smart Contract Development</h2>
            <p className="mb-6">Contract: <code className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">touchline_program</code><br/>Purpose: Manages the secure USDC deposit vault and tracks individual user shares representing their stake in the AI's autonomous portfolio.</p>
            
            <h3 className="text-xl font-bold mb-4 text-gray-900">Key Instructions (Anchor)</h3>
            <div className="bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-800 font-mono text-sm text-green-400 mb-8 whitespace-pre overflow-x-auto leading-relaxed">
{`// Initialize the global vault and set the AI Agent authority
pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()>

// User deposits Devnet USDC into the vault to fund the portfolio
pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()>

// AI Agent autonomously updates portfolio weights based on TxLINE odds
pub fn update_weights(ctx: Context<UpdateWeights>, new_weights: Vec<Weight>) -> Result<()>`}
            </div>
          </section>

          {/* Core Features */}
          <section id="features" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900"><Terminal className="text-green-600" /> Core Features</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs">1</span>
                  Live TxLINE Data Stream
                </h3>
                <p className="ml-8">The Node.js backend continuously polls the TxLINE StablePrice Feed (/api/odds/snapshot), calculates real-time HomeOddsShift, and multiplexes the data through a Server-Sent Events (SSE) stream down to the React frontend.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs">2</span>
                  Autonomous AI Math Engine
                </h3>
                <p className="ml-8">The agent listens to the live odds stream and calculates real-time qualification probabilities using the formula: Probability = 100 / DecimalOdds. When odds shift significantly, the agent mathematically rebalances its portfolio weights.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs">3</span>
                  Portfolio Dashboard
                </h3>
                <ul className="list-disc list-outside ml-12 space-y-1 mt-2">
                  <li>Upcoming and Live World Cup Matches</li>
                  <li>AI Qualification Probabilities (visualized via dynamic progress bars)</li>
                  <li>Active USDC Portfolio Positions</li>
                  <li>Real-time Agent Logs & Console Terminal</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Wallet Integration */}
          <section id="wallet" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900"><Settings className="text-green-600" /> Wallet Integration</h2>
            <p className="mb-6">Touchline supports major Solana wallets with automatic detection and Devnet connection capabilities.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-200">
                <div className="font-bold text-gray-900 text-lg mb-2">Phantom</div>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 inline-block px-2.5 py-1 rounded-full">✅ Full Support</div>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-200">
                <div className="font-bold text-gray-900 text-lg mb-2">Backpack</div>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 inline-block px-2.5 py-1 rounded-full">✅ Full Support</div>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-200">
                <div className="font-bold text-gray-900 text-lg mb-2">Solflare</div>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 inline-block px-2.5 py-1 rounded-full">✅ Full Support</div>
              </div>
            </div>
          </section>

          {/* Testing */}
          <section id="testing" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900"><CheckCircle2 className="text-green-600" /> Testing Guide</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Boot Services', desc: 'Run `node server.js` and `npm run dev`.' },
                { step: 2, title: 'Connect Wallet', desc: 'Click "Connect" on the dashboard using your Phantom or Backpack wallet.' },
                { step: 3, title: 'Verify Data Flow', desc: 'Ensure "PROBABILITY UNAVAILABLE" disappears and real odds render.' },
                { step: 4, title: 'Deposit & Watch', desc: 'Initiate a USDC deposit and watch the Agent Terminal logs as it rebalances the funds!' }
              ].map(item => (
                <div key={item.step} className="bg-white rounded-2xl p-6 flex gap-5 shadow-sm border border-gray-200">
                  <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 text-green-700 flex items-center justify-center font-bold shrink-0 shadow-sm">
                    {item.step}
                  </div>
                  <div className="pt-2">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900"><AlertTriangle className="text-green-600" /> Troubleshooting</h2>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="p-4 font-semibold text-gray-900">Error</th>
                    <th className="p-4 font-semibold text-gray-900">Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-4 font-mono text-red-600 font-medium">"PROBABILITY UNAVAILABLE"</td><td className="p-4">Match is too far out / Books closed. Wait for global sportsbooks to open lines.</td></tr>
                  <tr><td className="p-4 font-mono text-red-600 font-medium">"Ghost Matches"</td><td className="p-4">Ensure `MatchContext.jsx` maps `Participant1` correctly from the SSE stream.</td></tr>
                  <tr><td className="p-4 font-mono text-red-600 font-medium">Wallet Connection Failed</td><td className="p-4">Switch your wallet to Solana Devnet.</td></tr>
                  <tr><td className="p-4 font-mono text-red-600 font-medium">Stream Disconnected</td><td className="p-4">Backend Offline. Ensure `node server.js` is actively running.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
