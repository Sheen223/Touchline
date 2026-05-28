// src/components/layout/Header.jsx
import React from 'react';
import { Bell, Wallet, ChevronDown } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-end">
          {/* Right Section - No duplicate title */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Bell className="w-4 h-4 text-white/60" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            </button>
            
            {/* Wallet Button */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all">
              <Wallet className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium text-sm">$524.50</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/40" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};