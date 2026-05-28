// src/hooks/useLiveMatches.js
import { useState, useEffect } from 'react';
import { findFIFAWorldCup, getMatchesByLeague, getTodaysMatches, getFIFAWorldCupData } from '../services/sportsDBService';

export const useLiveMatches = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [worldCupInfo, setWorldCupInfo] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Try to find FIFA World Cup
        let worldCup = await findFIFAWorldCup();
        
        if (worldCup && worldCup.idLeague) {
          console.log("Found World Cup league:", worldCup);
          setWorldCupInfo(worldCup);
          
          // Fetch matches
          const { upcoming, past } = await getMatchesByLeague(worldCup.idLeague);
          setUpcomingMatches(upcoming);
          setPastMatches(past);
          
          // Check for live matches today
          const todayMatches = await getTodaysMatches();
          const live = todayMatches.filter(m => m.strStatus === 'LIVE' || m.strStatus === 'In Progress');
          setLiveMatches(live);
          
          setUsingMockData(false);
        } else {
          // Use mock data as fallback
          console.log("Using mock FIFA World Cup data");
          const mockData = getFIFAWorldCupData();
          setWorldCupInfo({
            strLeague: 'FIFA World Cup 2026',
            strDescription: 'The FIFA World Cup 2026 features 48 teams across 12 groups.'
          });
          
          // Split mock matches into upcoming and past
          const now = new Date();
          const upcoming = mockData.matches.filter(m => new Date(m.dateEvent) > now || m.strStatus === 'NS');
          const past = mockData.matches.filter(m => new Date(m.dateEvent) <= now && m.strStatus === 'FT');
          
          setUpcomingMatches(upcoming);
          setPastMatches(past);
          setLiveMatches([]);
          setUsingMockData(true);
        }
      } catch (error) {
        console.error("Failed to fetch match data:", error);
        // Use mock data on error
        const mockData = getFIFAWorldCupData();
        setUpcomingMatches(mockData.matches);
        setWorldCupInfo({
          strLeague: 'FIFA World Cup 2026',
          strDescription: 'The FIFA World Cup 2026 features 48 teams across 12 groups.'
        });
        setUsingMockData(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Qualification probabilities based on match results
  const getQualificationProbability = (teamName) => {
    // This would be calculated by AI based on match results
    // For now, return mock probabilities
    const probabilities = {
      'Brazil': 71,
      'Morocco': 81,
      'Senegal': 65,
      'Panama': 45,
      'Japan': 55,
      'Ecuador': 60,
      'USA': 75,
      'Cameroon': 40
    };
    return probabilities[teamName] || 50;
  };

  return {
    liveMatches,
    upcomingMatches,
    pastMatches,
    isLoading,
    worldCupInfo,
    usingMockData,
    getQualificationProbability
  };
};