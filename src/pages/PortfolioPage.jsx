import React from 'react';
import { motion } from 'framer-motion';
import { AllocationChart } from '../components/sections/AllocationChart';
import { PositionsTable } from '../components/sections/PositionsTable';
import { PortfolioSection } from '../components/sections/PortfolioSection';

export const PortfolioPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -10 }} 
      className="space-y-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <p className="text-gray-500 text-sm">Detailed allocation and positions</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Asset Allocation</h2>
        <p className="text-gray-500 text-sm">Current distribution of capital</p>
      </div>
      <AllocationChart />

      <div className="mb-4 mt-8">
        <h2 className="text-lg font-bold text-gray-900">Active Positions</h2>
        <p className="text-gray-500 text-sm">Real-time performance metrics</p>
      </div>
      <PositionsTable />

      <PortfolioSection />
    </motion.div>
  );
};
