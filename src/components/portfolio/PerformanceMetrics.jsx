import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, Clock } from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';

export const PerformanceMetrics = () => {
  const { initialDeposit, currentValue, profitLoss, yieldEarned } = usePortfolioStore();
  
  const roi = initialDeposit > 0 ? ((currentValue - initialDeposit) / initialDeposit * 100).toFixed(1) : 0;
  
  const metrics = [
    {
      label: 'Portfolio Value',
      value: `$${currentValue.toFixed(2)}`,
      change: `${roi}%`,
      icon: DollarSign,
      color: 'cyan'
    },
    {
      label: 'Total P&L',
      value: `${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)}`,
      change: profitLoss >= 0 ? '+ Profit' : 'Loss',
      icon: profitLoss >= 0 ? TrendingUp : TrendingDown,
      color: profitLoss >= 0 ? 'green' : 'red'
    },
    {
      label: 'Yield Earned',
      value: `$${yieldEarned.toFixed(2)}`,
      subtext: 'From idle capital',
      icon: Percent,
      color: 'purple'
    },
    {
      label: 'Active Time',
      value: '24/7',
      subtext: 'Autonomous agent',
      icon: Clock,
      color: 'cyan'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-black/40 backdrop-blur-xl rounded-2xl border border-neon-cyan/30 p-6 hover:border-neon-cyan/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-${metric.color === 'cyan' ? 'neon-cyan' : metric.color === 'green' ? 'neon-green' : metric.color === 'purple' ? 'neon-purple' : 'neon-cyan'}/10`}>
              <metric.icon className={`w-5 h-5 text-${metric.color === 'cyan' ? 'neon-cyan' : metric.color === 'green' ? 'neon-green' : metric.color === 'purple' ? 'neon-purple' : 'neon-cyan'}`} />
            </div>
            {metric.change && (
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                metric.change === '+ Profit' ? 'bg-neon-green/10 text-neon-green' : 
                metric.change === 'Loss' ? 'bg-red-500/10 text-red-400' :
                'bg-neon-cyan/10 text-neon-cyan'
              }`}>
                {metric.change}
              </div>
            )}
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
          <div className="text-sm text-gray-400">{metric.label}</div>
          {metric.subtext && <div className="text-xs text-gray-500 mt-2">{metric.subtext}</div>}
        </div>
      ))}
    </div>
  );
};