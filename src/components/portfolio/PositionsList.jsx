import React from 'react';
import { Eye } from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';

export const PositionsList = () => {
  const { positions } = usePortfolioStore();

  if (positions.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-white/40">No active positions</p>
        <p className="text-white/20 text-sm mt-1">Deposit to start building your portfolio</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-white/10">
          <tr>
            <th className="text-left p-4 text-white/40 font-medium text-sm">Team</th>
            <th className="text-left p-4 text-white/40 font-medium text-sm">Group</th>
            <th className="text-right p-4 text-white/40 font-medium text-sm">Value</th>
            <th className="text-right p-4 text-white/40 font-medium text-sm">Probability</th>
            <th className="text-right p-4 text-white/40 font-medium text-sm">Status</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    position.probability > 0.7 ? 'bg-green-500/20' : 
                    position.probability > 0.4 ? 'bg-yellow-500/20' : 'bg-red-500/20'
                  }`}>
                    <Eye className={`w-4 h-4 ${
                      position.probability > 0.7 ? 'text-green-400' : 
                      position.probability > 0.4 ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                  </div>
                  <div>
                    <div className="text-white font-medium">{position.team}</div>
                    <div className="text-xs text-white/30">Qualify</div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-white/60">Group {position.group}</td>
              <td className="p-4 text-right text-white font-medium">${position.value.toFixed(2)}</td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 bg-white/10 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                      style={{ width: `${position.probability * 100}%` }}
                    />
                  </div>
                  <span className="text-white/80 text-sm">{(position.probability * 100).toFixed(0)}%</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-sm">Active</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};