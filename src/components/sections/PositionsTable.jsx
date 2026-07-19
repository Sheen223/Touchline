// src/components/sections/PositionsTable.jsx
import React, { useState } from 'react';

const PositionRow = ({ position, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getProbabilityColor = (prob) => {
    if (prob >= 70) return 'text-green-600';
    if (prob >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <tr 
      className="border-b border-gray-100 transition-all hover:bg-gray-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-900">
            {position.team.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{position.team}</div>
            <div className="text-xs text-gray-500 font-medium">Group {position.group}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-gray-900 font-bold font-mono">${position.value.toFixed(2)}</div>
        <div className="text-xs text-gray-500 font-medium">Allocation</div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div 
              className="h-full rounded-full bg-black transition-all duration-500"
              style={{ width: `${position.probability}%` }}
            />
          </div>
          <span className={`text-sm font-bold font-mono ${getProbabilityColor(position.probability)}`}>
            {position.probability}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            position.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
          }`} />
          <span className="text-sm text-gray-700 font-medium capitalize">{position.status}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        {isHovered && (
          <button className="text-xs font-semibold text-gray-900 hover:underline transition-colors cursor-pointer">
            View →
          </button>
        )}
      </td>
    </tr>
  );
};

import { useLiveMatches } from '../../hooks/useLiveMatches';

export const PositionsTable = () => {
  const { portfolioPositions } = useLiveMatches();
  const positions = portfolioPositions;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 mt-8">
      {/* Section header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-3">
          <span className="text-[11px] text-gray-500 font-bold tracking-wider">POSITIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Active Positions</h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">Current exposure by team</p>
        <div className="w-12 h-1 bg-black rounded-full mt-4" />
      </div>
      
      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Team</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Probability</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
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
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-gray-500">Showing {positions.length} active positions</span>
            <span className="text-gray-900 font-bold">Total Value: ${positions.reduce((sum, p) => sum + p.value, 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};