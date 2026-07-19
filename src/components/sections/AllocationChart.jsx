// src/components/sections/AllocationChart.jsx
import React, { useState } from 'react';

import { useLiveMatches } from '../../hooks/useLiveMatches';

const AllocationPie = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1; // prevent div by zero
  
  // Generate SVG arc paths for pie chart
  let currentAngle = -90;
  const arcs = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    // Calculate SVG arc coordinates
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = 100 + 70 * Math.cos(startRad);
    const y1 = 100 + 70 * Math.sin(startRad);
    const x2 = 100 + 70 * Math.cos(endRad);
    const y2 = 100 + 70 * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;
    
    return {
      ...item,
      path: `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`,
      percentage: (percentage * 100).toFixed(0),
      startAngle,
      endAngle,
      hovered: hoveredIndex === index
    };
  });
  
  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      {/* SVG Pie Chart */}
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          {arcs.map((arc, idx) => (
            <g key={idx}>
              <path
                d={arc.path}
                fill={arc.color}
                className="transition-all duration-300 cursor-pointer"
                style={{ 
                  opacity: hoveredIndex === null || hoveredIndex === idx ? 1 : 0.4,
                  filter: arc.hovered ? 'brightness(1.2)' : 'none'
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}
          {/* Center circle */}
          <circle cx="100" cy="100" r="40" fill="#f9fafb" />
          <text 
            x="100" 
            y="95" 
            textAnchor="middle" 
            fill="#111827" 
            fontSize="20" 
            fontWeight="bold"
            className="rotate-90"
          >
            {data.length > 0 ? Math.round(total) : 0}
          </text>
          <text 
            x="100" 
            y="115" 
            textAnchor="middle" 
            fill="#6b7280" 
            fontSize="10"
            className="rotate-90"
          >
            Total
          </text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex-1 space-y-2 w-full">
        {arcs.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-900 font-bold">${item.value.toFixed(2)}</span>
              <span className="text-xs text-gray-500 w-12 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
        {arcs.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-8 font-medium">
            Waiting for live match data...
          </div>
        )}
      </div>
    </div>
  );
};

export const AllocationChart = () => {
  const [timeframe, setTimeframe] = useState('current');
  const { portfolioPositions } = useLiveMatches();
  
  const colors = ['#06b6d4', '#a855f7', '#34d399', '#f472b6', '#fb923c'];
  
  const dynamicData = portfolioPositions.map((pos, idx) => ({
    name: pos.team,
    value: pos.value,
    color: colors[idx % colors.length]
  }));

  const data = {
    current: dynamicData,
    target: dynamicData.map(d => ({ ...d, value: d.value * 1.2 })) // Just a dummy target variation for the demo toggle
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 mt-8">
      {/* Section header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-3">
          <span className="text-[11px] text-gray-500 font-bold tracking-wider">ALLOCATION</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Portfolio Distribution</h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Current asset allocation by team</p>
            <div className="w-12 h-1 bg-black rounded-full mt-4" />
          </div>
          
          {/* Timeframe toggle */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200">
            <button
              onClick={() => setTimeframe('current')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                timeframe === 'current' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Current
            </button>
            <button
              onClick={() => setTimeframe('target')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${
                timeframe === 'target' 
                  ? 'bg-white shadow-sm text-gray-900' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Target
            </button>
          </div>
        </div>
      </div>
      
      {/* Chart Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <AllocationPie data={data[timeframe]} />
      </div>
    </div>
  );
};