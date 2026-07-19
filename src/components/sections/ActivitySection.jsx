// src/components/sections/ActivitySection.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, TrendingUp, AlertCircle, Zap, Clock } from 'lucide-react';

export const ActivitySection = () => {
  // Start with an empty array of genuine activities. Real transactions will be pushed here later.
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Ready to subscribe to real smart contract events / TxLINE streams in the future.
  }, []);

  return (
    <div className="my-16">
      {/* Section Header */}
      <div className="relative mb-10">
        <motion.div 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Activity className="w-3 h-3 text-cyan-400" />
          <span className="text-[11px] text-white/60 font-mono tracking-wide">LIVE ACTIVITY FEED</span>
        </motion.div>
        
        <motion.h3 
          className="text-3xl font-bold text-white tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Recent Activity
        </motion.h3>
        
        <motion.p 
          className="text-white/40 text-base mt-2 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Real-time agent actions and transactions
        </motion.p>
        
        <motion.div 
          className="absolute -bottom-3 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: '60px' }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />
      </div>
      
      {/* Activity List */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="divide-y divide-white/5">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-white/40 italic">
              Listening for live agent transactions...
            </div>
          ) : (
            activities.map((activity, idx) => (
              <motion.div
                key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
            >
              <div className={`p-2.5 rounded-xl bg-${activity.color === 'cyan' ? 'cyan' : activity.color === 'purple' ? 'purple' : activity.color === 'emerald' ? 'emerald' : activity.color === 'yellow' ? 'yellow' : 'white'}/10`}>
                <activity.icon className={`w-4 h-4 text-${activity.color === 'cyan' ? 'cyan' : activity.color === 'purple' ? 'purple' : activity.color === 'emerald' ? 'emerald' : activity.color === 'yellow' ? 'yellow' : 'white'}-400`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-white text-sm font-medium">{activity.message}</p>
                  {activity.amount && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      activity.amount.startsWith('+') 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {activity.amount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-white/30 text-xs">{activity.detail}</p>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-white/20" />
                    <span className="text-white/20 text-[10px] font-mono">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};