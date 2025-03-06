import type { userStats } from "~/types/user"
const client = useSupabaseClient()

// Define the type for x01match_players table rows
interface X01MatchPlayer {
  id: string;
  user_id: string;
  winner: boolean;
  score60: number;
  score100: number;
  score140: number;
  score180: number;
  average: number;
  first9_average: number;
  checkout_percentage: number;
  // Add any other fields from your table
}

export const loadUserOnlineStats = async (userId: string): Promise<userStats | null> => {
  try {
    console.log(userId)
    const { data: userGameStats, error: userGameStatsError } = await client
      .from('x01match_players')
      .select('*')
      .eq('user_id', userId)

    if (userGameStatsError) {
      console.error('Error loading user game stats:', userGameStatsError)
      return null;
    }
    
    if (!userGameStats || userGameStats.length === 0) {
      return {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        score60: 0,
        score100: 0,
        score140: 0,
        score180: 0,
        average: 0,
        first9Average: 0,
        checkoutPercentage: 0,
        winnrate: 0
      };
    }
    
    console.log(userGameStats)
    
    // Cast the data to the correct type
    const typedGameStats = userGameStats as unknown as X01MatchPlayer[];
    
    const stats: userStats = {
      gamesPlayed: typedGameStats.length,
      gamesWon: typedGameStats.filter((game) => game.winner === true).length,
      gamesLost: typedGameStats.filter((game) => game.winner === false).length,
      score60: typedGameStats.reduce((acc, game) => acc + (game.score60 || 0), 0),
      score100: typedGameStats.reduce((acc, game) => acc + (game.score100 || 0), 0),
      score140: typedGameStats.reduce((acc, game) => acc + (game.score140 || 0), 0),
      score180: typedGameStats.reduce((acc, game) => acc + (game.score180 || 0), 0),
      average: typedGameStats.reduce((acc, game) => acc + (game.average || 0), 0) / typedGameStats.length,
      first9Average: typedGameStats.reduce((acc, game) => acc + (game.first9_average || 0), 0) / typedGameStats.length,
      checkoutPercentage: typedGameStats.reduce((acc, game) => acc + (game.checkout_percentage || 0), 0) / typedGameStats.length,
      winnrate: typedGameStats.filter((game) => game.winner === true).length / typedGameStats.length * 100,
    }
    
    // Round floating point values for better display
    stats.average = Number(stats.average.toFixed(2));
    stats.first9Average = Number(stats.first9Average.toFixed(2));
    stats.checkoutPercentage = Number(stats.checkoutPercentage.toFixed(2));
    stats.winnrate = Number(stats.winnrate.toFixed(2));
    
    console.log(stats)
    
    return stats;
  } catch (error: any) {
    console.error('Error loading user game stats:', error.message)
    return null;
  }
}