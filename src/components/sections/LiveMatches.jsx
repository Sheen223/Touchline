// src/components/sections/LiveMatches.jsx
import React from 'react';
import { useLiveMatches } from '../../hooks/useLiveMatches';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

export const LiveMatches = () => {
  const { 
    liveMatches, 
    upcomingMatches, 
    pastMatches, 
    isLoading, 
    worldCupInfo,
    usingMockData,
    getQualificationProbability 
  } = useLiveMatches();

  if (isLoading) {
    return (
      <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-1/3 mx-auto" />
          <div className="h-20 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* World Cup Info */}
      {worldCupInfo && (
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/30 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">🏆 {worldCupInfo.strLeague}</h3>
              <p className="text-white/40 text-sm mt-1">{worldCupInfo.strDescription}</p>
            </div>
            {usingMockData && (
              <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full">
                <AlertCircle className="w-3 h-3" />
                <span>Demo Data - Live when tournament starts</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-white font-semibold">LIVE MATCHES</h3>
          </div>
          <div className="grid gap-3">
            {liveMatches.map(match => (
              <div key={match.idEvent} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="font-bold text-white">{match.strHomeTeam}</div>
                    <div className="text-2xl font-bold text-white">{match.intHomeScore}</div>
                  </div>
                  <div className="px-4">
                    <div className="text-red-400 text-xs font-mono animate-pulse">LIVE</div>
                    <div className="text-white/40 text-xs">VS</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="font-bold text-white">{match.strAwayTeam}</div>
                    <div className="text-2xl font-bold text-white">{match.intAwayScore}</div>
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
          <h3 className="text-white font-semibold mb-4">📅 UPCOMING MATCHES</h3>
          <div className="grid gap-3">
            {upcomingMatches.map(match => (
              <div key={match.idEvent} className="bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium text-white">{match.strHomeTeam}</div>
                    </div>
                    <div className="text-white/40 text-sm">vs</div>
                    <div>
                      <div className="font-medium text-white">{match.strAwayTeam}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <Calendar className="w-3 h-3" />
                    <span>{match.dateEvent ? new Date(match.dateEvent).toLocaleDateString() : 'TBD'}</span>
                    <Clock className="w-3 h-3" />
                    <span>{match.strTime || 'TBD'}</span>
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
          <h3 className="text-white font-semibold mb-4">📊 RECENT RESULTS</h3>
          <div className="grid gap-2">
            {pastMatches.map(match => (
              <div key={match.idEvent} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-white/80 text-sm">{match.strHomeTeam}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-white text-lg">{match.intHomeScore}</span>
                  <span className="text-white/40 text-sm">-</span>
                  <span className="font-mono text-white text-lg">{match.intAwayScore}</span>
                </div>
                <span className="text-white/80 text-sm">{match.strAwayTeam}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Qualification Probabilities */}
      <div>
        <h3 className="text-white font-semibold mb-4">📈 AI QUALIFICATION PROBABILITIES</h3>
        <div className="grid gap-2">
          {['Brazil', 'Morocco', 'Senegal', 'USA', 'Japan', 'Ecuador'].map(team => (
            <div key={team} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">{team}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-white/10 rounded-full h-2">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    style={{ width: `${getQualificationProbability(team)}%` }}
                  />
                </div>
                <span className="text-cyan-400 font-mono text-sm">{getQualificationProbability(team)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};