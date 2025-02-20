export interface Player {
  id: string;
  username: string;
  profileImage: string | null;
  currentScore?: number;
  wonLegs?: number;
  wonSets?: number;
  currentThrowScore?: number;
  score60?: number;
  score100?: number;
  score140?: number;
  score180?: number;
  average?: number;
  first9Average?: number;
  checkoutRate?: number;

}
export interface Players {
  users: Player[];
}

export interface OfflineGame {
  id: string;
  creatorId: string;
  players: Player[];
  basescore: number;
  inMode: string;
  outMode: string;
  legCount: number;
  setCount: number;
  // neu:
  startingPlayerId?: string | null;
}
export interface onlineGame {
  id: string;
  creatorId: string;
  players: Player[];
  startingPlayerId?: string | null;
  lobbyMode: string;
}
export interface X01Game extends onlineGame {
  basescore: number;
  inMode: string;
  outMode: string;
  legCount: number;
  setCount: number;
  currentLeg?: number;
  currentSet?: number;
  currentTurn?: number;
  currentThrow?: number;
  currentPlayerId?: string;
}

