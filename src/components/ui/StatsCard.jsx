import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const StatsCard = ({ label, value, change, changeType, subtitle }) => {
  return (
    <GlassCard className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/50">{label}</span>
          {change && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              changeType === 'up' 
                ? 'bg-green-500/10 text-green-400' 
                : changeType === 'down'
                ? 'bg-red-500/10 text-red-400'
                : 'bg-white/10 text-white/60'
            }`}>
              {changeType === 'up' && <TrendingUp className="w-3 h-3" />}
              {changeType === 'down' && <TrendingDown className="w-3 h-3" />}
              {change}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-3xl font-bold text-white">{value}</div>
          {subtitle && <div className="text-xs text-white/30">{subtitle}</div>}
        </div>
      </div>
    </GlassCard>
  );
};