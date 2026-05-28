// src/components/sections/AllocationChart.jsx
import React, { useState } from 'react';

const AllocationPie = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
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
          <circle cx="100" cy="100" r="40" fill="black" />
          <text 
            x="100" 
            y="95" 
            textAnchor="middle" 
            fill="white" 
            fontSize="20" 
            fontWeight="bold"
            className="rotate-90"
          >
            {total}
          </text>
          <text 
            x="100" 
            y="115" 
            textAnchor="middle" 
            fill="white/40" 
            fontSize="10"
            className="rotate-90"
          >
            Total
          </text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex-1 space-y-2">
        {arcs.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all hover:bg-white/5"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-white/80">{item.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white font-mono">${item.value}</span>
              <span className="text-xs text-white/40 w-12 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AllocationChart = () => {
  const [timeframe, setTimeframe] = useState('current');
  
  const data = {
    current: [
      { name: 'Brazil', value: 110, color: '#06b6d4' },
      { name: 'Morocco', value: 150, color: '#a855f7' },
      { name: 'Scotland', value: 100, color: '#34d399' },
      { name: 'USA', value: 80, color: '#f472b6' },
      { name: 'Australia', value: 84.5, color: '#fb923c' }
    ],
    target: [
      { name: 'Brazil', value: 60, color: '#06b6d4' },
      { name: 'Morocco', value: 200, color: '#a855f7' },
      { name: 'Scotland', value: 120, color: '#34d399' },
      { name: 'USA', value: 70, color: '#f472b6' },
      { name: 'Australia', value: 74.5, color: '#fb923c' }
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8">
      {/* Section header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
          <span className="text-[11px] text-white/50 font-mono tracking-wider">ALLOCATION</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Portfolio Distribution</h2>
            <p className="text-white/40 text-sm mt-2">Current asset allocation by team</p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4" />
          </div>
          
          {/* Timeframe toggle */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
            <button
              onClick={() => setTimeframe('current')}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                timeframe === 'current' 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Current
            </button>
            <button
              onClick={() => setTimeframe('target')}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                timeframe === 'target' 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              Target
            </button>
          </div>
        </div>
      </div>
      
      {/* Chart Card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <AllocationPie data={data[timeframe]} />
      </div>
    </div>
  );
};