import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Percent, Clock, ArrowUpRight, Activity } from 'lucide-react';
import { usePortfolioStore } from '../../store/portfolioStore';

// Animated Counter Hook
const useAnimatedNumber = (targetValue, duration = 1000) => {
  const [value, setValue] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, targetValue, {
      duration: duration / 1000,
      onUpdate: (value) => setValue(Math.floor(value)),
    });
    return controls.stop;
  }, [targetValue, duration]);
  
  return value;
};

// Floating Stat Card Component
const FloatingStatCard = ({ stat, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const numericValue = parseFloat(stat.value.replace(/[^0-9.-]+/g, ''));
  const animatedValue = useAnimatedNumber(numericValue, 800);
  
  const formattedValue = stat.value.includes('$') 
    ? `$${animatedValue.toFixed(2)}`
    : stat.value.includes('%')
    ? `${animatedValue}%`
    : animatedValue;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Animated Border Glow */}
      <motion.div 
        className="absolute -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-0"
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Card Content */}
      <div className="relative bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {/* Scan Effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '200%' : '-100%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <motion.div 
              className="relative"
              animate={{ rotate: isHovered ? [0, -5, 5, 0] : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                <stat.icon className="w-5 h-5 text-cyan-400" />
              </div>
            </motion.div>
            
            {stat.change && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  stat.changeType === 'up' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {stat.changeType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </motion.div>
            )}
          </div>
          
          {/* Value */}
          <div className="space-y-2">
            <motion.div 
              className="text-3xl font-bold text-white tracking-tight font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {formattedValue}
            </motion.div>
            
            <div className="space-y-1">
              <p className="text-sm text-white/50">{stat.label}</p>
              {stat.subtitle && (
                <p className="text-xs text-white/30 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {stat.subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Bottom Accent Bar */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Main Stats Section
export const StatsSection = () => {
  const { currentValue, profitLoss, yieldEarned } = usePortfolioStore();
  
  const stats = [
    { 
      label: 'Portfolio Value', 
      value: `$${currentValue.toFixed(2)}`, 
      change: '+4.9%', 
      changeType: 'up',
      icon: DollarSign,
      trend: 'rising'
    },
    { 
      label: 'Total P&L', 
      value: `${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)}`, 
      change: '+4.9%', 
      changeType: 'up',
      icon: TrendingUp,
      trend: 'rising'
    },
    { 
      label: 'Yield Earned', 
      value: `$${yieldEarned.toFixed(2)}`, 
      subtitle: '+0.42 this week',
      icon: Percent,
      trend: 'stable'
    },
    { 
      label: 'Active Positions', 
      value: '8', 
      subtitle: 'Across 4 groups',
      icon: Clock,
      trend: 'active'
    }
  ];

  return (
    <div className="relative my-16">
      {/* Section Header */}
      <div className="relative mb-10">
        <div className="flex items-baseline justify-between flex-wrap gap-4">
          <div>
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] text-white/60 font-mono tracking-wide">LIVE DATA STREAM</span>
            </motion.div>
            
            <motion.h3 
              className="text-3xl font-bold text-white tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Portfolio Overview
            </motion.h3>
            
            <motion.p 
              className="text-white/40 text-base mt-2 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Real-time performance metrics with AI-predicted trends
            </motion.p>
          </div>
          
          <motion.button 
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white transition-colors group"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span>Last 7 days</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>
        
        {/* Animated Underline */}
        <motion.div 
          className="absolute -bottom-3 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: '60px' }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <FloatingStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>
      
      {/* Status Bar */}
      <motion.div 
        className="flex items-center justify-center gap-4 mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-white/40 font-mono tracking-wider">AI AGENT ACTIVE</span>
          <div className="w-px h-3 bg-white/10 mx-1" />
          <span className="text-[10px] text-white/30 font-mono">Solana • CHAIN 196</span>
          <div className="w-px h-3 bg-white/10 mx-1" />
          <span className="text-[10px] text-white/30 font-mono">GAS: 1.2 GWEI</span>
        </div>
      </motion.div>
    </div>
  );
};