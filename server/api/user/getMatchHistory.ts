import { createClient } from '@supabase/supabase-js'
import type { Match, Player, PlayerStatistic, MatchSettings } from '~/types/websocket';
const key = process.env.SUPABASE_KEY;
const url = process.env.SUPABASE_URL;

// Fix the string | undefined issue
if (!url || !key) {
  throw new Error('Supabase credentials missing');
}
const supabase = createClient(url, key);

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)
  try {
    const { data: playerMatches, error: playerMatchesError } = await supabase
      .from('x01match_players')
      .select('match_id')
      .eq('user_id', body.userId)
      
    if(playerMatchesError){
      console.error(playerMatchesError.message)
      return { error: playerMatchesError.message }
    }
    console.log(playerMatches)

    // Ensure matchIds is an array with values
    const matchIds = playerMatches?.map((match: any) => match.match_id) || []
    console.log(matchIds)
    
    // Don't proceed if we don't have any match IDs
    if (matchIds.length === 0) {
      return { matches: [] }
    }

    const { data: matchDetails, error: matchDetailsError } = await supabase
      .from('x01match_players')
      .select(`
        match_id,
        x01matches (
          id,
          base_score,
          in_mode,
          out_mode,
          leg_count,
          set_count,
          lobby_mode,
          bull_off,
          max_rounds,
          created_at,
          legs,
          sets
        ),
        user_id,
        username,
        image,
        average,
        first9_average,
        first9_points,
        first9_darts_thrown,        
        checkout_percentage,
        checkouts,
        checkouts_attempts,
        score60,
        score100,
        score140,
        score180,
        all_points,
        legs_won,
        sets_won,
        leg_darts_count,
        leg_scores
      `)
      .in('match_id', matchIds)
      .order('created_at', { ascending: false })
      
    if (matchDetailsError) {
      console.error(matchDetailsError.message)
      return { error: matchDetailsError.message }
    }
    
    // Transform the data into Match objects
    const formattedMatches: Match[] = transformMatchData(matchDetails);
    
    return { matches: formattedMatches }
  } catch (error: any) {
    console.error(error)
    return { error: error.message || 'Unknown error occurred' }
  }
})

function transformMatchData(matchPlayerRecords: any[]): Match[] {
  // Group players by match_id
  const matchesMap: Record<string, any[]> = {};
  
  matchPlayerRecords.forEach(record => {
    const matchId = record.match_id;
    if (!matchesMap[matchId]) {
      matchesMap[matchId] = [];
    }
    matchesMap[matchId].push(record);
  });
  
  // Convert each match group to a Match object
  return Object.entries(matchesMap).map(([matchId, playerRecords]) => {
    // All player records for a match have the same match settings
    const matchSettings = playerRecords[0].x01matches;
    
    // Create player objects
    const players: Player[] = playerRecords.map(record => {
      // Parse leg_scores if it exists and is a string
      let legScores = {};
      try {
        if (typeof record.leg_scores === 'string') {
          legScores = JSON.parse(record.leg_scores);
        } else if (record.leg_scores) {
          legScores = record.leg_scores;
        }
      } catch (e) {
        console.error('Error parsing leg_scores:', e);
      }
      
      // Parse leg_darts_count if it exists and is a string
      let legDartsCount = {};
      try {
        if (typeof record.leg_darts_count === 'string') {
          legDartsCount = JSON.parse(record.leg_darts_count);
        } else if (record.leg_darts_count) {
          legDartsCount = record.leg_darts_count;
        }
      } catch (e) {
        console.error('Error parsing leg_darts_count:', e);
      }
      
      // Create player statistics
      const playerStats: PlayerStatistic = {
        allPoints: record.all_points || 0,
        first9Points: record.first9_points || 0,
        first9DartsThrown: record.first9_darts_thrown || 0,
        average: record.average || 0,
        checkoutPercentage: record.checkout_percentage || 0,
        first9Average: record.first9_average || 0,
        score60: record.score60 || 0,
        score100: record.score100 || 0,
        score140: record.score140 || 0,
        score180: record.score180 || 0,
        checkouts: record.checkouts || 0,
        checkoutsAttemps: record.checkouts_attempts || 0,
      };
      
      // Create player scores
      return {
        id: record.user_id,
        username: record.username,
        image: record.image,
        stats: playerStats,
        scores: {
          currentScore: matchSettings.base_score || 501,
          legsWon: record.legs_won || 0,
          setsWon: record.sets_won || 0,
          dartScores: {
            "1": {},
            "2": {},
            "3": {}
          },
          roundScore: 0,
          legScores: legScores,
          thrownDarts: 0,
          legDartsCount: legDartsCount,
          trackedRounds: { "1": { "1": true } },
          currentVisitHasCheckoutAttempt: false
        }
      };
    });
    
    // Create match settings
    const settings: MatchSettings = {
      baseScore: matchSettings.base_score || 501,
      inMode: matchSettings.in_mode || 'Singel',
      outMode: matchSettings.out_mode || 'Double',
      legCount: matchSettings.leg_count || 3,
      setCount: matchSettings.set_count || 1,
      lobbyMode: matchSettings.lobby_mode || 'Public',
      bullOff: matchSettings.bull_off || 'Normal',
      maxRounds: matchSettings.max_rounds || 50
    };
    
    // Create complete match object
    return {
      players,
      settings,
      currentLeg: matchSettings.legs || 1,
      currentSet: matchSettings.sets || 1,
      finished: true, // Assuming historical matches are finished
      started: true,
      createdAt: new Date(matchSettings.created_at).getTime(),
      bullOffFinished: true,
      currentPlayerIndex: 0,
      startPlayerIndex: 0,
      currentRound: 1
    };
  });
}
