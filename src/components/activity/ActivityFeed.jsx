import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

const generateActivity = () => {
  const actions = [
    { type: 'trade', message: 'Agent bought Morocco YES', amount: '+$40', icon: TrendingUp, color: 'cyan' },
    { type: 'trade', message: 'Agent sold Brazil YES', amount: '-$60', icon: TrendingUp, color: 'purple' },
    { type: 'yield', message: 'Yield earned from idle capital', amount: '+$0.42', icon: CheckCircle, color: 'green' },
    { type: 'alert', message: 'Brazil upset detected - rebalancing', icon: AlertCircle, color: 'yellow' }
  ];
  return actions[Math.floor(Math.random() * actions.length)];
};

export const ActivityFeed = () => {
  const [activities, setActivities] = useState([
    { type: 'info', message: 'Agent initialized', timestamp: 'Just now', icon: Activity, color: 'white' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [{
        ...newActivity,
        timestamp: 'Just now',
        id: Date.now()
      }, ...prev].slice(0, 10));
      
      // Update timestamps
      setTimeout(() => {
        setActivities(prev => prev.map(act => ({
          ...act,
          timestamp: act.timestamp === 'Just now' ? '1 min ago' : act.timestamp
        })));
      }, 3000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="divide-y divide-white/5">
      {activities.map((activity, idx) => (
        <div key={idx} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
          <div className={`p-2 rounded-lg bg-${activity.color === 'cyan' ? 'cyan' : activity.color === 'purple' ? 'purple' : activity.color === 'green' ? 'green' : 'white'}/10`}>
            <activity.icon className={`w-4 h-4 text-${activity.color === 'cyan' ? 'cyan' : activity.color === 'purple' ? 'purple' : activity.color === 'green' ? 'green' : 'white'}-400`} />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm">{activity.message}</p>
            <p className="text-white/30 text-xs mt-0.5">{activity.timestamp}</p>
          </div>
          {activity.amount && (
            <span className={`text-sm font-medium ${
              activity.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
            }`}>
              {activity.amount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};