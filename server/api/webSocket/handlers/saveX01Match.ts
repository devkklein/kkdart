import { Match } from "~/types/websocket";
import { createClient } from "@supabase/supabase-js";
import Id from "~/pages/offlineGame/[id].vue";
const key = process.env.SUPABASE_KEY;
const url = process.env.SUPABASE_URL;
const supabase = createClient(url, key);

export async function handleSaveX01Match(match: Match) {
  try {
    const { data, error } = await supabase
      .from("x01matches")
      .insert([
        {
          base_score: match.settings.baseScore,
          in_mode: match.settings.inMode,
          out_mode: match.settings.outMode,
          leg_count: match.settings.legCount,
          set_count: match.settings.setCount,
          lobby_mode: match.settings.lobbyMode,
          bull_off: match.settings.bullOff,
          max_rounds: match.settings.maxRounds,
          created_at: new Date(match.createdAt).toISOString(),
          legs: match.currentLeg,
          sets: match.currentSet,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error.message);
    }
    saveMatchPlayer(data?.id, match);
    console.log("Match saved");
    console.log(data);
  } catch (error: any) {
    console.error(error.message);
  }
}
async function saveMatchPlayer(matchId: string, match: Match) {
  const playerData = match.players.map((player) => {
    return {
      match_id: matchId,
      user_id: player.id,
      username: player.username,
      image: player.image,
      average: player.stats.average,
      first9_average: player.stats.first9Average,
      first9_points: player.stats.first9Points,
      first9_darts_thrown: player.stats.first9DartsThrown,
      checkout_percentage: player.stats.checkoutPercentage,
      checkouts: player.stats.checkouts,
      checkouts_attempts: player.stats.checkoutsAttemps,
      score60: player.stats.score60,
      score100: player.stats.score100,
      score140: player.stats.score140,
      score180: player.stats.score180,
      all_points: player.stats.allPoints,
      legs_won: player.scores.legsWon,
      sets_won: player.scores.setsWon,
      leg_darts_count: player.scores.legDartsCount,
      leg_scores: player.scores.legScores,
    };
  });
  const { error: playerError } = await supabase
    .from("x01match_players")
    .upsert(playerData);
  if (playerError) {
    console.error(playerError.message);
  }
}
