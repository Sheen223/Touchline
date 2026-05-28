import React, { useState, useEffect } from 'react';

const ActivityIcon = ({ type }) => {
  const icons = {
    trade: '🔄',
    yield: '💰',
    alert: '⚠️',
    success: '✅',
    scan: '🔍'
  };
  return <span className="text-lg">{icons[type] || '📋'}</span>;
};

export const ActivityFeed = () => {
  const [activities, setActivities] = useState([
    { id: 1, type: 'success', message: 'Portfolio initialized', detail: 'Strategy: Balanced', timestamp: 'Just now' }
  ]);

  useEffect(() => {
    const actions = [
      { type: 'trade', message: 'Agent bought Morocco YES', detail: '+$40', color: 'cyan' },
      { type: 'trade', message: 'Agent sold Brazil YES', detail: '-$60', color: 'purple' },
      { type: 'yield', message: 'Yield earned', detail: '+$0.42', color: 'emerald' },
      { type: 'alert', message: 'Brazil upset detected', detail: 'Rebalancing', color: 'yellow' }
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      const action = actions[index % actions.length];
      setActivities(prev => [{
        id: Date.now(),
        ...action,
        timestamp: 'Just now'
      }, ...prev].slice(0, 10));
      
      // Update timestamps after 3 seconds
      setTimeout(() => {
        setActivities(prev => prev.map(act => ({
          ...act,
          timestamp: act.timestamp === 'Just now' ? '1 min ago' : 
                     act.timestamp === '1 min ago' ? '5 mins ago' : 
                     act.timestamp === '5 mins ago' ? '1 hour ago' : act.timestamp
        })));
      }, 3000);
      
      index++;
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8 mb-12">
      {/* Section header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
          <span className="text-[11px] text-white/50 font-mono tracking-wider">LIVE FEED</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Recent Activity</h2>
        <p className="text-white/40 text-sm mt-2">Real-time agent actions</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 mt-4" />
      </div>
      
      {/* Activity Card */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="divide-y divide-white/5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                activity.color === 'cyan' ? 'from-cyan-500/20 to-cyan-500/10' :
                activity.color === 'purple' ? 'from-purple-500/20 to-purple-500/10' :
                activity.color === 'emerald' ? 'from-emerald-500/20 to-emerald-500/10' :
                'from-yellow-500/20 to-yellow-500/10'
              } flex items-center justify-center`}>
                <ActivityIcon type={activity.type} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-white text-sm font-medium">{activity.message}</p>
                  {activity.detail && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      activity.detail.startsWith('+') 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : activity.detail.startsWith('-')
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/10 text-white/40'
                    }`}>
                      {activity.detail}
                    </span>
                  )}
                </div>
                <p className="text-white/30 text-xs mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10 bg-white/5">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live updates every 10 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};