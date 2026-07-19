import React from 'react';
import { motion } from 'framer-motion';
import { TransactionsSection } from '../components/sections/TransactionsSection';
import { ActivityFeed } from '../components/sections/ActivityFeed';

export const TransactionsPage = ({ refreshTrigger }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-500 text-sm">On-chain history and live activity</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">On-Chain History</h2>
            <p className="text-gray-500 text-sm">Recent Solana transactions</p>
          </div>
          <TransactionsSection refreshTrigger={refreshTrigger} />
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Agent Activity</h2>
            <p className="text-gray-500 text-sm">Real-time autonomous actions</p>
          </div>
          <ActivityFeed />
        </div>
      </div>
    </motion.div>
  );
};
