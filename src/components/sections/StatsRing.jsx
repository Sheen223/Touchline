import React from 'react';
import { DollarSign, Wallet, TrendingUp, Coins } from 'lucide-react';
import { useMatchContext } from '../../context/MatchContext';

export const StatsRing = () => {
  const { portfolioPositions, usdcBalance } = useMatchContext();

  // Mock USDC price to avoid CoinGecko rate limits/CORS
  const USDCPrice = 1.00;

  const totalAssetValue = portfolioPositions.reduce((sum, p) => sum + p.value, 0);
  const portfolioValue = (usdcBalance + totalAssetValue);

  const formatSol = (val) => {
    return `${val.toFixed(2)} SOL`;
  };

  const stats = [
    { label: 'Total Value (SOL)', value: formatSol(portfolioValue), icon: <Wallet className="w-6 h-6 text-gray-800" /> },
    { label: 'Treasury Balance', value: formatSol(usdcBalance), icon: <Coins className="w-6 h-6 text-gray-800" /> },
    { label: 'Active Positions', value: portfolioPositions.length.toString(), icon: <TrendingUp className="w-6 h-6 text-gray-800" /> },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow ${idx === 2 ? 'col-span-2 lg:col-span-1' : ''}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">{stat.icon}</div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 tracking-tight truncate">{stat.value}</div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};