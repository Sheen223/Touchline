// src/components/ui/StrategyCard.jsx
import React from 'react';
import { TrendingUp, Shield, Zap } from 'lucide-react';

const strategies = [
  {
    id: 'Balanced',
    name: 'Balanced',
    description: '60% favorites, 30% mid-tier, 10% underdogs',
    icon: TrendingUp,
    risk: 'Moderate',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'Aggressive',
    name: 'Aggressive',
    description: '40% favorites, 40% mid-tier, 20% underdogs',
    icon: Zap,
    risk: 'High',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'Conservative',
    name: 'Conservative',
    description: '80% favorites, 15% mid-tier, 5% underdogs',
    icon: Shield,
    risk: 'Low',
    color: 'from-green-500 to-emerald-500'
  }
];

export const StrategyCard = ({ selected, onSelect }) => {
  return (
    <div className="space-y-3">
      {strategies.map((strat) => (
        <button
          key={strat.id}
          onClick={() => onSelect(strat.id)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
            selected === strat.id
              ? `bg-gradient-to-r ${strat.color} border-transparent`
              : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
          }`}
        >
          <strat.icon className="w-5 h-5" />
          <div className="flex-1 text-left">
            <div className="font-semibold">{strat.name}</div>
            <div className="text-xs opacity-80">{strat.description}</div>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            strat.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
            strat.risk === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {strat.risk} Risk
          </div>
        </button>
      ))}
    </div>
  );
};