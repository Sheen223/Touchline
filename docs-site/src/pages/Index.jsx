import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Shield, Zap, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

export const IndexPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center bg-gray-50">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-32 pb-20 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium mb-8 inline-block shadow-sm">
            Built for World Cup AI & Solana Hackathon
          </span>
        </motion.div>

        <motion.div 
          className="w-64 md:w-96 mx-auto mb-8"
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        >
          <Logo animated={true} />
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Autonomous AI Agent for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
            World Cup Portfolios
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl text-gray-500 max-w-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Touchline manages World Cup qualification portfolios on Solana Devnet. 
          It ingests live odds from TxLINE, calculates probabilities, and autonomously rebalances your USDC.
        </motion.p>

        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/docs" className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-black/10 hover:bg-gray-900 transition-all">
            Read the Docs <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-7xl mx-auto px-4 py-20 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <Terminal className="w-10 h-10 text-green-600 mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900">TxLINE Integration</h3>
          <p className="text-gray-500">Streams live TxLINE StablePrice data via Server-Sent Events for real-time odds monitoring.</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <Shield className="w-10 h-10 text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900">Solana Anchor Program</h3>
          <p className="text-gray-500">Built natively on Solana using Rust & Anchor. Securely holds user USDC deposits and executes lightning-fast rebalances.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <Zap className="w-10 h-10 text-green-500 mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900">Autonomous AI Engine</h3>
          <p className="text-gray-500">Our Node.js math engine dynamically calculates probabilities and autonomously adjusts portfolio weights on-chain.</p>
        </div>
      </div>
      
      {/* Contract Info */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-32 relative z-10 text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 inline-flex items-center gap-4 text-sm font-mono text-gray-600">
          <Code size={16} className="text-green-600" />
          <span>Program: touchline_program</span>
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-semibold border border-gray-200">Solana Devnet</span>
        </div>
      </div>
    </div>
  );
};
