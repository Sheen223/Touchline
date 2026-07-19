// src/components/sections/PortfolioSection.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Filter, Download } from 'lucide-react';

const PerformanceCard = ({ label, value, change, isPositive }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
    <div className="text-sm font-medium text-gray-500 mb-2">{label}</div>
    <div className="flex items-baseline gap-2">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {change && (
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {change}
        </div>
      )}
    </div>
  </div>
);

import { useLiveMatches } from '../../hooks/useLiveMatches';

export const PortfolioSection = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const { portfolioPositions, usdcBalance } = useLiveMatches();
  
  // Calculate total portfolio value dynamically
  const totalValue = usdcBalance + portfolioPositions.reduce((sum, p) => sum + p.value, 0);
  
  const hasPositions = portfolioPositions.length > 0;

  const performanceData = {
    '7d': { 
      return: '0.00%', 
      sharpe: '0.0', 
      volatility: '0.0%', 
      maxDrawdown: '0.0%' 
    },
    '30d': { return: '0.00%', sharpe: '0.0', volatility: '0.0%', maxDrawdown: '0.0%' },
    '90d': { return: '0.00%', sharpe: '0.0', volatility: '0.0%', maxDrawdown: '0.0%' }
  };
  
  const current = performanceData[timeframe];
  const isPositive = parseFloat(current.return) >= 0;
  
  return (
    <div className="space-y-6">
      {/* Header with time selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Portfolio Analytics</h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">Performance metrics and risk analysis</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                timeframe === t 
                  ? 'bg-black text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
          <button className="p-1.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
            <Download className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Performance Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PerformanceCard label="Total Return" value={current.return} change={current.return} isPositive={isPositive} />
        <PerformanceCard label="Sharpe Ratio" value={current.sharpe} />
        <PerformanceCard label="Volatility" value={current.volatility} />
        <PerformanceCard label="Max Drawdown" value={current.maxDrawdown} change={current.maxDrawdown} isPositive={false} />
      </div>
      
      {/* Risk Metrics */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-gray-900 font-bold tracking-tight mb-4">Risk Distribution</h3>
        <div className="space-y-4">
          {[
            { label: 'Market Risk', value: hasPositions ? 45 : 0 },
            { label: 'Concentration Risk', value: hasPositions ? 20 : 0 },
            { label: 'Liquidity Risk', value: hasPositions ? 10 : 0 }
          ].map((risk) => (
            <div key={risk.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 font-medium">{risk.label}</span>
                <span className="text-gray-500">{risk.value}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-black transition-all duration-500"
                  style={{ width: `${risk.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};