// src/components/sections/PortfolioSection.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Filter, Download } from 'lucide-react';

const PerformanceCard = ({ label, value, change, isPositive }) => (
  <div className="bg-white/5 rounded-xl border border-white/10 p-5">
    <div className="text-sm text-white/40 mb-2">{label}</div>
    <div className="flex items-baseline gap-2">
      <div className="text-2xl font-bold text-white">{value}</div>
      {change && (
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      )}
    </div>
  </div>
);

export const PortfolioSection = () => {
  const [timeframe, setTimeframe] = useState('7d');
  
  const performanceData = {
    '7d': { return: '+12.4%', sharpe: '1.8', volatility: '15.2%', maxDrawdown: '-5.3%' },
    '30d': { return: '+28.7%', sharpe: '2.1', volatility: '18.4%', maxDrawdown: '-8.1%' },
    '90d': { return: '+45.2%', sharpe: '2.4', volatility: '22.1%', maxDrawdown: '-12.3%' }
  };
  
  const current = performanceData[timeframe];
  
  return (
    <div className="space-y-6">
      {/* Header with time selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Analytics</h2>
          <p className="text-white/40 text-sm mt-1">Performance metrics and risk analysis</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                timeframe === t 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                  : 'bg-white/5 text-white/40 hover:text-white/80'
              }`}
            >
              {t}
            </button>
          ))}
          <button className="p-1.5 rounded-lg bg-white/5 border border-white/10">
            <Download className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>
      
      {/* Performance Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PerformanceCard label="Total Return" value={current.return} change={current.return} isPositive />
        <PerformanceCard label="Sharpe Ratio" value={current.sharpe} />
        <PerformanceCard label="Volatility" value={current.volatility} />
        <PerformanceCard label="Max Drawdown" value={current.maxDrawdown} change={current.maxDrawdown} isPositive={false} />
      </div>
      
      {/* Risk Metrics */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-white font-medium mb-4">Risk Distribution</h3>
        <div className="space-y-4">
          {[
            { label: 'Market Risk', value: 65, color: 'from-cyan-500 to-blue-500' },
            { label: 'Concentration Risk', value: 45, color: 'from-purple-500 to-pink-500' },
            { label: 'Liquidity Risk', value: 25, color: 'from-emerald-500 to-teal-500' }
          ].map((risk) => (
            <div key={risk.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">{risk.label}</span>
                <span className="text-white/40">{risk.value}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${risk.color}`}
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