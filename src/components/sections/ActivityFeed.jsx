import React from 'react';
import { RefreshCw, Coins, AlertTriangle, CheckCircle2, Search, ClipboardList, TrendingUp, TrendingDown, Terminal } from 'lucide-react';
import { useMatchContext } from '../../context/MatchContext';

const ActivityIcon = ({ type }) => {
  const icons = {
    trade: <RefreshCw className="w-5 h-5 text-gray-700" />,
    yield: <Coins className="w-5 h-5 text-gray-700" />,
    alert: <AlertTriangle className="w-5 h-5 text-gray-700" />,
    success: <CheckCircle2 className="w-5 h-5 text-gray-700" />,
    scan: <Search className="w-5 h-5 text-gray-700" />,
    allocation: <TrendingUp className="w-5 h-5 text-green-600" />,
    divestment: <TrendingDown className="w-5 h-5 text-red-600" />,
    info: <Terminal className="w-5 h-5 text-gray-700" />
  };
  return <div>{icons[type] || <ClipboardList className="w-5 h-5 text-gray-700" />}</div>;
};

export const ActivityFeed = () => {
  const { agentEvents } = useMatchContext();
  
  // Filter for actual actions (allocations, trades, alerts, etc.)
  // We can just show all agentEvents, but since "Agent Console" already shows everything,
  // let's specifically filter for high-level events (allocation, divestment, success)
  // or just show the last 10 events of any type that have an amount or are explicitly flagged.
  const activities = agentEvents.filter(e => e.type === 'allocation' || e.type === 'divestment' || e.type === 'trade' || e.type === 'success' || e.amount);

  // If no trades have happened yet, show a clean starting state
  if (activities.length === 0) {
    activities.push({
      id: 'init',
      type: 'success',
      message: 'Portfolio initialized',
      detail: 'Awaiting Live Feed',
      timestamp: new Date().toISOString()
    });
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8 mb-12">
      {/* Section header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-3">
          <span className="text-[11px] text-gray-500 font-bold tracking-wider">LIVE FEED</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Recent Activity</h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">Real-time agent actions</p>
        <div className="w-12 h-1 bg-black rounded-full mt-4" />
      </div>
      
      {/* Activity Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-100">
          {activities.map((activity, idx) => (
            <div key={activity.id || idx} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                <ActivityIcon type={activity.type} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-gray-900 text-sm font-semibold">{activity.message}</p>
                  {(activity.detail || activity.amount) && (
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                      (activity.detail || activity.amount).startsWith('+') 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : (activity.detail || activity.amount).startsWith('-')
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {activity.detail || activity.amount}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 font-medium text-xs mt-1">
                  {activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString() : 'Just now'}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Live updates every 10 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};