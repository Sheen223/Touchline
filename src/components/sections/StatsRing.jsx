// src/components/sections/StatsRing.jsx
import React from 'react';
import { useWallet } from '../../context/WalletContext';

export const StatsRing = () => {
  const { balance, address } = useWallet();
  
  // Live OKB price (from CoinGecko API)
  const [okbPrice, setOkbPrice] = React.useState(0);
  
  React.useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=okb&vs_currencies=usd')
      .then(res => res.json())
      .then(data => setOkbPrice(data.okb?.usd || 42.50))
      .catch(() => setOkbPrice(42.50));
  }, []);
  
  const portfolioValue = (parseFloat(balance) * okbPrice).toFixed(2);
  
  const stats = [
    { label: 'Portfolio Value', value: `$${portfolioValue}`, icon: '💰' },
    { label: 'OKB Balance', value: `${parseFloat(balance).toFixed(4)} OKB`, icon: '💎' },
    { label: 'OKB Price', value: `$${okbPrice.toFixed(2)}`, icon: '📈' },
    { label: 'Wallet', value: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected', icon: '🔗' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white/5 rounded-xl border border-white/10 p-5">
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-sm text-white/40 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};