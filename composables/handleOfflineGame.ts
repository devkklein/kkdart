
import type {  Match } from "~/types/websocket"


export const initializeMatch = (matchSettings: any, player: any) => {
  
  
  
  const match: Match = {
    id:crypto.randomUUID(),
    settings: matchSettings._value,
    players: [],
    currentPlayerIndex: 0,
    currentLeg: 1,
    currentSet: 1,
    currentRound: 1,
    finished: false,
    started: false,
    createdAt: Date.now(),
    bullOffFinished: false,

  
  }
  console.log(match)
  const player1 = initializeOfflinePlayer(match, player)
  match.players.push(player1)


  return match


}
