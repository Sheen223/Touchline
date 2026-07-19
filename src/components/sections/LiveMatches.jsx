// src/components/sections/LiveMatches.jsx
import React from 'react';
import { useLiveMatches } from '../../hooks/useLiveMatches';
import { Calendar, Clock, MapPin, AlertCircle, Trophy, BarChart2, TrendingUp } from 'lucide-react';

export const LiveMatches = () => {
  const { 
    liveMatches, 
    upcomingMatches, 
    pastMatches, 
    isLoading, 
    worldCupInfo,
    getQualificationProbability 
  } = useLiveMatches();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* World Cup Info */}
      {worldCupInfo && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                {worldCupInfo.strLeague}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{worldCupInfo.strDescription}</p>
            </div>
          </div>
        </div>
      )}

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-gray-900 font-bold tracking-tight">LIVE MATCHES</h3>
          </div>
          <div className="grid gap-3">
            {liveMatches.map(match => (
              <div key={match.id} className="bg-white border border-red-200 shadow-sm rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="font-bold text-gray-900">{match.homeTeam}</div>
                    <div className="text-2xl font-bold text-gray-900">{match.score?.split('-')[0] || '0'}</div>
                  </div>
                  <div className="px-4 text-center">
                    <div className="text-red-500 text-xs font-bold tracking-widest animate-pulse mb-1">LIVE</div>
                    <div className="text-gray-400 text-xs font-medium">VS</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="font-bold text-gray-900">{match.awayTeam}</div>
                    <div className="text-2xl font-bold text-gray-900">{match.score?.split('-')[1] || '0'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-gray-900 font-bold tracking-tight mb-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            UPCOMING MATCHES
          </h3>
          <div className="grid gap-3">
            {upcomingMatches.map(match => (
              <div key={match.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{match.homeTeam}</div>
                    </div>
                    <div className="text-gray-400 text-sm font-medium">vs</div>
                    <div>
                      <div className="font-semibold text-gray-900">{match.awayTeam}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{match.startTime ? new Date(match.startTime).toLocaleDateString() : 'TBD'}</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{match.startTime ? new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Results */}
      {pastMatches.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-gray-900 font-bold tracking-tight mb-4">
            <BarChart2 className="w-5 h-5 text-gray-500" />
            RECENT RESULTS
          </h3>
          <div className="grid gap-2">
            {pastMatches.map(match => (
              <div key={match.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                <span className="text-gray-700 font-medium text-sm">{match.homeTeam}</span>
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-lg">
                  <span className="font-bold text-gray-900 text-lg">{match.score?.split('-')[0] || '-'}</span>
                  <span className="text-gray-400 text-sm">-</span>
                  <span className="font-bold text-gray-900 text-lg">{match.score?.split('-')[1] || '-'}</span>
                </div>
                <span className="text-gray-700 font-medium text-sm">{match.awayTeam}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Qualification Probabilities */}
      <div>
        <h3 className="flex items-center gap-2 text-gray-900 font-bold tracking-tight mb-4">
          <TrendingUp className="w-5 h-5 text-gray-500" />
          AI QUALIFICATION PROBABILITIES
        </h3>
        <div className="grid gap-2">
          {(() => {
            const allTeamsInMatches = [...new Set([...liveMatches, ...upcomingMatches]
              .flatMap(m => [m.homeTeam, m.awayTeam])
            )];

            if (allTeamsInMatches.length === 0) {
              return (
                <div className="text-gray-500 text-sm font-medium p-6 text-center bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                  Waiting for live probability data...
                </div>
              );
            }

            return allTeamsInMatches.map(team => {
              const prob = getQualificationProbability(team);
              
              return (
                <div key={team} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <span className="text-gray-900 font-medium">{team}</span>
                  {prob !== null ? (
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-100 rounded-full h-2">
                        <div 
                          className="h-full rounded-full bg-black"
                          style={{ width: `${prob}%` }}
                        />
                      </div>
                      <span className="text-gray-900 font-bold text-sm w-10 text-right">{prob}%</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                      Probability unavailable
                    </span>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
};