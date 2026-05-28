// src/services/sportsDBService.js
const SPORTSDB_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/123';

// Fetch all leagues and find FIFA World Cup
export const findFIFAWorldCup = async () => {
  try {
    const response = await fetch(`${SPORTSDB_BASE_URL}/all_leagues.php`);
    const data = await response.json();
    
    // Search for "FIFA World Cup" specifically
    const worldCup = data.leagues?.find(league => 
      league.strLeague === 'FIFA World Cup' ||
      league.strLeague?.includes('FIFA World Cup') ||
      league.strLeagueAlternate === 'FIFA World Cup'
    );
    
    console.log("Found FIFA World Cup:", worldCup);
    return worldCup;
  } catch (error) {
    console.error("Failed to fetch leagues:", error);
    return null;
  }
};

// Get matches by league ID
export const getMatchesByLeague = async (leagueId, season = '2026') => {
  try {
    // Get upcoming matches
    const upcomingResponse = await fetch(
      `${SPORTSDB_BASE_URL}/eventsnextleague.php?id=${leagueId}`
    );
    const upcoming = await upcomingResponse.json();
    
    // Get past matches for the season
    const pastResponse = await fetch(
      `${SPORTSDB_BASE_URL}/eventspastleague.php?id=${leagueId}`
    );
    const past = await pastResponse.json();
    
    return {
      upcoming: upcoming.events || [],
      past: past.events || []
    };
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return { upcoming: [], past: [] };
  }
};

// Get live scores for today
export const getTodaysMatches = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `${SPORTSDB_BASE_URL}/eventsday.php?d=${today}&s=Soccer`
    );
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Failed to fetch today's matches:", error);
    return [];
  }
};

// Get team details
export const getTeamDetails = async (teamName) => {
  try {
    const response = await fetch(
      `${SPORTSDB_BASE_URL}/searchteams.php?t=${encodeURIComponent(teamName)}`
    );
    const data = await response.json();
    return data.teams?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch team ${teamName}:`, error);
    return null;
  }
};

// Get league table (standings)
export const getLeagueStandings = async (leagueId, season = '2026') => {
  try {
    const response = await fetch(
      `${SPORTSDB_BASE_URL}/lookuptable.php?l=${leagueId}&s=${season}`
    );
    const data = await response.json();
    return data.table || [];
  } catch (error) {
    console.error("Failed to fetch standings:", error);
    return [];
  }
};

// Hardcoded FIFA World Cup data (fallback)
export const getFIFAWorldCupData = () => {
  return {
    idLeague: '4328', // Premier League ID - we need to find actual World Cup ID
    strLeague: 'FIFA World Cup',
    strSport: 'Soccer',
    strDescription: 'The FIFA World Cup is the most prestigious international soccer tournament.',
    // Sample matches for 2026 World Cup
    matches: [
      {
        idEvent: 'WC001',
        strEvent: 'Brazil vs Morocco',
        strHomeTeam: 'Brazil',
        strAwayTeam: 'Morocco',
        dateEvent: '2026-06-15',
        strTime: '15:00',
        intHomeScore: '1',
        intAwayScore: '2',
        strStatus: 'FT'
      },
      {
        idEvent: 'WC002',
        strEvent: 'Senegal vs Panama',
        strHomeTeam: 'Senegal',
        strAwayTeam: 'Panama',
        dateEvent: '2026-06-16',
        strTime: '12:00',
        strStatus: 'NS'
      },
      {
        idEvent: 'WC003',
        strEvent: 'Japan vs Ecuador',
        strHomeTeam: 'Japan',
        strAwayTeam: 'Ecuador',
        dateEvent: '2026-06-17',
        strTime: '18:00',
        strStatus: 'NS'
      },
      {
        idEvent: 'WC004',
        strEvent: 'USA vs Cameroon',
        strHomeTeam: 'USA',
        strAwayTeam: 'Cameroon',
        dateEvent: '2026-06-18',
        strTime: '21:00',
        strStatus: 'NS'
      }
    ]
  };
};