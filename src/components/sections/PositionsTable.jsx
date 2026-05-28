// src/components/sections/PositionsTable.jsx
import React, { useState } from 'react';

const PositionRow = ({ position, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getProbabilityColor = (prob) => {
    if (prob >= 70) return 'text-emerald-400';
    if (prob >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <tr 
      className="border-b border-white/5 transition-all hover:bg-white/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-sm">
            {position.team.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-medium text-white">{position.team}</div>
            <div className="text-xs text-white/30">Group {position.group}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-white font-mono">${position.value.toFixed(2)}</div>
        <div className="text-xs text-white/30">Allocation</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 bg-white/10 rounded-full h-1.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
              style={{ width: `${position.probability}%` }}
            />
          </div>
          <span className={`text-sm font-mono ${getProbabilityColor(position.probability)}`}>
            {position.probability}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${
            position.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'
          }`} />
          <span className="text-sm text-white/60 capitalize">{position.status}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        {isHovered && (
          <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            View →
          </button>
        )}
      </td>
    </tr>
  );
};

export const PositionsTable = () => {
  const positions = [
    { team: 'Brazil', group: 'C', value: 110, probability: 71, status: 'active' },
    { team: 'Morocco', group: 'C', value: 150, probability: 81, status: 'active' },
    { team: 'Scotland', group: 'C', value: 100, probability: 68, status: 'active' },
    { team: 'USA', group: 'D', value: 80, probability: 75, status: 'active' },
    { team: 'Australia', group: 'E', value: 84.5, probability: 65, status: 'active' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8">
      {/* Section header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
          <span className="text-[11px] text-white/50 font-mono tracking-wider">POSITIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Active Positions</h2>
        <p className="text-white/40 text-sm mt-2">Current exposure by team</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4" />
      </div>
      
      {/* Table Card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40">Team</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40">Value</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40">Probability</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-white/40"></th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, idx) => (
                <PositionRow key={idx} position={position} index={idx} />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table footer */}
        <div className="px-4 py-3 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/30">Showing {positions.length} active positions</span>
            <span className="text-white/30">Total Value: ${positions.reduce((sum, p) => sum + p.value, 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};