// src/components/portfolio/AllocationChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { usePortfolioStore } from '../../store/portfolioStore';

const COLORS = ['#22d3ee', '#c084fc', '#4ade80', '#f472b6', '#fb923c', '#f43f5e'];

export const AllocationChart = () => {
  const { allocations } = usePortfolioStore();
  
  const data = Object.entries(allocations).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  }));

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40">No allocations yet</p>
          <p className="text-white/20 text-sm mt-1">Deposit to start</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={{ stroke: '#ffffff30', strokeWidth: 1 }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            background: '#1a1a1a', 
            border: '1px solid rgba(34,211,238,0.3)', 
            borderRadius: '12px',
            padding: '8px 12px'
          }}
          formatter={(value) => [`$${value.toFixed(2)}`, 'Allocation']}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};