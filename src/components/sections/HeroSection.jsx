import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { NeonButton } from '../ui/NeonButton';
import { usePortfolioStore } from '../../store/portfolioStore';

export const HeroSection = ({ onDeposit }) => {
  const { isActive, strategy } = usePortfolioStore();

  return (
    <GlassCard className="p-8 lg:p-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-cyan-400 font-mono">AUTONOMOUS AGENT ACTIVE</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold">
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              World Cup Portfolio
            </span>
            <br />
            <span className="text-cyan-400">AI-Powered Management</span>
          </h2>
          
          <p className="text-white/50 text-base max-w-lg">
            Deposit USDC and let our AI agent automatically manage your World Cup qualification portfolio across all 12 groups.
          </p>
        </div>
        
        {!isActive ? (
          <NeonButton onClick={onDeposit} size="lg">
            Launch Portfolio →
          </NeonButton>
        ) : (
          <div className="flex items-center gap-4 px-6 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/80">Active • {strategy} Strategy</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};