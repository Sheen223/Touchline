import React from 'react';
import { useMatchContext } from '../../context/MatchContext';
import { Activity, CheckCircle, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const getIcon = (iconString) => {
  if (iconString === 'TrendingUp') return TrendingUp;
  if (iconString === 'TrendingDown') return TrendingDown;
  if (iconString === 'CheckCircle') return CheckCircle;
  if (iconString === 'AlertCircle') return AlertCircle;
  return Activity;
};

export const ActivityFeed = () => {
  const { agentEvents } = useMatchContext();

  const activities = agentEvents.length > 0 ? agentEvents : [
    { type: 'info', message: 'Agent initialized. Standing by for real-time data...', timestamp: 'Just now', icon: 'Activity', color: 'white', id: 1 }
  ];

  return (
    <div className="divide-y divide-white/5">
      {activities.map((activity, idx) => {
        const IconComponent = getIcon(activity.icon);
        return (
          <div key={idx} className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
            <div className={`p-2 rounded-lg bg-${activity.color === 'cyan' ? 'cyan' : activity.color === 'purple' ? 'purple' : activity.color === 'green' ? 'green' : 'white'}/10`}>
              <IconComponent className={`w-4 h-4 text-${activity.color === 'cyan' ? 'cyan' : activity.color === 'purple' ? 'purple' : activity.color === 'green' ? 'green' : 'white'}-400`} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.message}</p>
              <p className="text-white/30 text-xs mt-0.5">{new Date(activity.timestamp).toLocaleTimeString()}</p>
            </div>
            {activity.amount && (
              <span className={`text-sm font-medium ${
                activity.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {activity.amount}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};