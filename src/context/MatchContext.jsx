// src/context/MatchContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchTxLineSnapshot, subscribeToMatchStream } from '../services/txlineService';

const MatchContext = createContext();

export const useMatchContext = () => useContext(MatchContext);

export const MatchProvider = ({ children }) => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [portfolioPositions, setPortfolioPositions] = useState([]);
  const [agentEvents, setAgentEvents] = useState([]);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [oddsShifts, setOddsShifts] = useState({});

  useEffect(() => {
    // 1. Fetch Initial State from Backend DB
    const fetchInitialState = async () => {
      try {
        const [portfolioRes, logsRes] = await Promise.all([
          fetch('http://localhost:3001/api/portfolio'),
          fetch('http://localhost:3001/api/logs')
        ]);
        
        if (portfolioRes.ok) {
          const p = await portfolioRes.json();
          setPortfolioPositions(p.positions || []);
          setUsdcBalance(p.usdcBalance || 0);
        }
        
        if (logsRes.ok) {
          const l = await logsRes.json();
          setAgentEvents(l);
        }
      } catch (err) {
        console.error("Failed to fetch initial state:", err);
      }
    };

    fetchInitialState().then(() => {
      // 2. Connect to Multiplexed SSE Stream
      const es = new EventSource('http://localhost:3001/api/stream');

      es.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);

          if (payload.type === 'txline_update') {
            const raw = payload.payload;
            // Classify as live or upcoming based on game state
            const state = raw.GameState || raw.gameState || 0;
            if (state > 0 && state < 8) {
              setLiveMatches(prev => {
                const oldMatch = prev.find(m => m.id === (raw.FixtureId || raw.fixtureId));
                const existing = prev.filter(m => m.id !== (raw.FixtureId || raw.fixtureId));
                return [...existing, {
                  id: raw.FixtureId || raw.fixtureId,
                  homeTeam: (raw.Participant1IsHome ? raw.Participant1 : raw.Participant2) || raw.HomeTeam || raw.homeTeam,
                  awayTeam: (raw.Participant1IsHome ? raw.Participant2 : raw.Participant1) || raw.AwayTeam || raw.awayTeam,
                  homeScore: raw.HomeScore || raw.homeScore || 0,
                  awayScore: raw.AwayScore || raw.awayScore || 0,
                  status: `${raw.MatchTime || "45"}'`,
                  league: raw.CompetitionName || raw.competitionName,
                  homeOdds: raw.HomeOdds || raw.homeOdds || oldMatch?.homeOdds,
                  awayOdds: raw.AwayOdds || raw.awayOdds || oldMatch?.awayOdds
                }];
              });
            } else {
              setUpcomingMatches(prev => {
                const oldMatch = prev.find(m => m.id === (raw.FixtureId || raw.fixtureId));
                const existing = prev.filter(m => m.id !== (raw.FixtureId || raw.fixtureId));
                return [...existing, {
                  id: raw.FixtureId || raw.fixtureId,
                  homeTeam: (raw.Participant1IsHome ? raw.Participant1 : raw.Participant2) || raw.HomeTeam || raw.homeTeam,
                  awayTeam: (raw.Participant1IsHome ? raw.Participant2 : raw.Participant1) || raw.AwayTeam || raw.awayTeam,
                  startTime: raw.StartTime || raw.startTime,
                  league: raw.CompetitionName || raw.competitionName,
                  homeOdds: raw.HomeOdds || raw.homeOdds || oldMatch?.homeOdds,
                  awayOdds: raw.AwayOdds || raw.awayOdds || oldMatch?.awayOdds
                }];
              });
            }
          } else if (payload.type === 'portfolio_update') {
            setPortfolioPositions(payload.portfolio?.positions || []);
            setUsdcBalance(payload.portfolio?.usdcBalance || 0);
          } else if (['allocation', 'divestment', 'info'].includes(payload.type)) {
            setAgentEvents(prev => [payload, ...prev].slice(0, 50));
          }

        } catch (err) {
          console.error("Context Error parsing SSE:", err);
        }
      };

      es.onerror = (err) => {
        console.error("MatchContext Stream Error:", err);
        es.close();
      };

      return () => es.close();
    });
    
    setIsLoading(false);
    
    const fetchAndCategorizeMatches = () => {
      fetchTxLineSnapshot().then(matches => {
        if (Array.isArray(matches)) {
          setLiveMatches(prev => {
            const newLive = matches.filter(m => m.status === 'live');
            return newLive.map(nm => {
               const existing = prev.find(p => p.id === nm.id);
               return existing ? { ...nm, homeOdds: existing.homeOdds || nm.homeOdds, awayOdds: existing.awayOdds || nm.awayOdds } : nm;
            });
          });
          setUpcomingMatches(prev => {
            const newUpcoming = matches.filter(m => m.status === 'upcoming');
            return newUpcoming.map(nm => {
               const existing = prev.find(p => p.id === nm.id);
               return existing ? { ...nm, homeOdds: existing.homeOdds || nm.homeOdds, awayOdds: existing.awayOdds || nm.awayOdds } : nm;
            });
          });
          setPastMatches(matches.filter(m => m.status === 'completed'));
        }
      }).catch(err => console.error("Snapshot fetch error:", err));
    };

    fetchAndCategorizeMatches(); // Fetch immediately on mount
    
    const interval = setInterval(fetchAndCategorizeMatches, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getQualificationProbability = (teamName) => {
    const allMatches = [...liveMatches, ...upcomingMatches];
    const match = allMatches.find(m => m.homeTeam === teamName || m.awayTeam === teamName);
    
    if (match) {
        if (match.homeTeam === teamName && match.homeOdds) {
            return Math.min(Math.round(100 / parseFloat(match.homeOdds)), 99);
        }
        if (match.awayTeam === teamName && match.awayOdds) {
            return Math.min(Math.round(100 / parseFloat(match.awayOdds)), 99);
        }
    }
    return null;
  };

  return (
    <MatchContext.Provider value={{
      liveMatches,
      upcomingMatches,
      pastMatches,
      portfolioPositions,
      agentEvents,
      usdcBalance,
      oddsShifts,
      getQualificationProbability,
      isLoading
    }}>
      {children}
    </MatchContext.Provider>
  );
};
