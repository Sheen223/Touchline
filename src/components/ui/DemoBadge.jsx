import React, { useState } from 'react';
import { Film, Activity } from 'lucide-react';

export const DemoBadge = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative"
      >
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/50 rounded-lg px-4 py-2 cursor-help">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Film className="w-4 h-4 text-yellow-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
            </div>
            <span className="text-yellow-400 font-mono text-xs font-bold">DEMO MODE</span>
            <div className="w-px h-4 bg-yellow-500/30" />
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-yellow-400/70" />
              <span className="text-yellow-400/70 text-[10px] font-mono">Mock Transactions</span>
            </div>
          </div>
        </div>
        
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-black/95 backdrop-blur-xl border border-yellow-500/30 rounded-lg shadow-2xl">
            <div className="text-yellow-400 text-xs font-mono mb-2">🎬 DEMO PRESENTATION MODE</div>
            <div className="text-gray-400 text-[11px] space-y-1">
              <p>• Smart contract ready on X Layer</p>
              <p>• AI agent detecting real upsets</p>
              <p>• Simulated transactions for smooth demo</p>
              <p>• Same code works with real OKB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};