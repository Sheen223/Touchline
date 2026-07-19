// src/services/txlineService.js
const BACKEND_URL = 'https://touchline-production-1bc1.up.railway.app';

export const fetchTxLineSnapshot = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/snapshot`);
    if (!res.ok) throw new Error('Failed to fetch snapshot from backend');
    const data = await res.json();
    
    const list = Array.isArray(data) ? data : (data?.data || []);
    
    // We strictly filter for World Cup matches and DO NOT MOCK friendlies
    const INTERNATIONAL_TEAMS = [
      "argentina", "france", "england", "netherlands", "portugal", "spain", "germany", "uruguay",
      "brazil", "croatia", "morocco", "japan", "senegal", "usa", "poland", "australia",
      "korea republic", "switzerland", "cameroon", "serbia", "mexico", "belgium", "ghana", "ecuador",
      "tunisia", "iran", "costa rica", "wales", "canada", "saudi arabia", "qatar", "denmark"
    ];

    const worldCupMatches = list.filter(fixture => {
      const homeTeam = (fixture.Participant1IsHome ? fixture.Participant1 : fixture.Participant2 || '').toLowerCase();
      const awayTeam = (fixture.Participant1IsHome ? fixture.Participant2 : fixture.Participant1 || '').toLowerCase();
      const compName = (fixture.CompetitionName || fixture.competitionName || '').toLowerCase();
      
      // Strict rejection of friendlies as per user requirement
      if (compName.includes('friendl') || compName.includes('exhibition')) {
        return false;
      }
      
      return INTERNATIONAL_TEAMS.some(team => homeTeam.includes(team) || awayTeam.includes(team));
    });

    // Deduplicate by matchup to avoid multiple betting markets or phantom duplicates
    const uniqueMatches = [];
    const seenMatchups = new Set();
    
    worldCupMatches.forEach(fixture => {
      const homeTeam = (fixture.Participant1IsHome ? fixture.Participant1 : fixture.Participant2 || '').trim();
      const awayTeam = (fixture.Participant1IsHome ? fixture.Participant2 : fixture.Participant1 || '').trim();
      const matchupKey = `${homeTeam}-${awayTeam}`.toLowerCase();
      
      if (!seenMatchups.has(matchupKey)) {
        seenMatchups.add(matchupKey);
        uniqueMatches.push(fixture);
      }
    });

    return uniqueMatches.map(fixture => {
      const gs = Number(fixture.GameState || fixture.gameState);
      const isUpcoming = gs === 1;
      const isFinished = gs === 6;
      const isLive = gs >= 2 && gs <= 5;
      
      const homeTeam = fixture.Participant1IsHome ? fixture.Participant1 : fixture.Participant2;
      const awayTeam = fixture.Participant1IsHome ? fixture.Participant2 : fixture.Participant1;
      
      let matchStatus = 'upcoming';
      const startTime = fixture.StartTime || fixture.startTime;
      
      if (startTime && startTime <= Date.now()) {
        matchStatus = 'live';
      }
      
      if (isFinished) matchStatus = 'completed';
      else if (isLive) matchStatus = 'live';

      return {
        id: fixture.FixtureId || fixture.fixtureId,
        league: fixture.Competition || fixture.competition || fixture.CompetitionName || fixture.competitionName || 'Unknown',
        homeTeam: homeTeam || 'TBD',
        awayTeam: awayTeam || 'TBD',
        status: matchStatus,
        startTime: fixture.StartTime || fixture.startTime,
        score: fixture.Score || (isUpcoming ? 'vs' : '0-0'),
        homeOdds: fixture.homeOdds || fixture.HomeOdds,
        awayOdds: fixture.awayOdds || fixture.AwayOdds
      };
    });
  } catch (error) {
    console.error("TxLine Fetch Error:", error);
    throw error;
  }
};

export const subscribeToMatchStream = (activeMatchIds, onTxLineUpdate, onAgentUpdate) => {
  if (typeof window === 'undefined') return () => {};

  const es = new EventSource(`${BACKEND_URL}/api/stream`);

  es.onmessage = (e) => {
    try {
      const event = JSON.parse(e.data);
      
      if (event.type === 'txline_update') {
        const payload = event.payload;
        const fixId = payload.FixtureId || payload.fixtureId;
        
        // Filter out matches we don't care about or have on screen
        // If activeMatchIds is not provided, we process all
        if (!activeMatchIds || activeMatchIds.includes(fixId)) {
          if (onTxLineUpdate) {
            onTxLineUpdate({
              id: fixId,
              time: payload.MatchTime || payload.matchTime,
              state: payload.GameState || payload.gameState,
              statusId: payload.StatusId || payload.statusId,
              events: payload,
              homeOddsShift: payload.HomeOddsShift || null,
              awayOddsShift: payload.AwayOddsShift || null,
              homeOdds: payload.HomeOdds || payload.homeOdds,
              awayOdds: payload.AwayOdds || payload.awayOdds
            });
          }
        }
      } else {
        // Must be an agent update (allocation, divestment, info, portfolio_update)
        if (onAgentUpdate) {
          onAgentUpdate(event);
        }
      }
    } catch (err) {
      // ignore empty pings
    }
  };

  es.onerror = (err) => {
    console.error("Backend Stream connection failed");
    es.close();
  };

  return () => es.close();
};
