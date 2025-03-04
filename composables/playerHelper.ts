import type { Match, Player } from "~/types/websocket";
const user = useSupabaseUser();

export function getPlayerIndex(match: Match ) {

  if (!match || !user.value?.id) return -1;

  const index = match.players.findIndex((player) => player.id === user.value?.id);
  return index;
  
}
export function getOriginalPlayerIndex(match: Match,  player: Player): number {
  if (!match || !match.players) return -1;

  return match.players.findIndex(p => p.id === player.id);
}