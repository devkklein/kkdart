export interface PlayerScore {
  currentScore: number;
  legsWon: number;
  setsWon: number;
  dartScores: DartScore;
  roundScore: number;
  legScores: legScores;
  thrownDarts: number;
  legDartsCount: {
    [key: number]: number;
  };
  trackedRounds?: {
    [legIndex: number]: {
      [roundIndex: number]: boolean;
    };
  };
  currentVisitHasCheckoutAttempt?: boolean; // Tracking für aktuelle Visit
  // roundDartsCount entfernen oder als veraltet markieren
}
export interface RoundScores {
  [key: number]: {
    scores: number[];
  };
}
export interface legScores {
  [key: number]: {
    roundScores: RoundScores;
  };
}
export interface Player {
  id: string;
  username: string;
  image?: string;
  scores: PlayerScore;
  stats: PlayerStatistic;
}

export interface Match {
  id?: string;
  players: Player[];
  settings: MatchSettings;
  currentLeg: number;
  currentSet: number;
  finished: boolean;
  started: boolean;
  createdAt: number;
  bullOffFinished: boolean;
  currentPlayerIndex: number;
  startPlayerIndex?: number;
  currentRound: number; // Index des aktuellen Spielers
}
export interface Sockets {
  ws: WebSocket[];
}
export interface Matches {
  [key: string]: {
    match: Match;
    sockets: Sockets;
  };
}
export interface DartScore {
  [key: string]: {
    value?: number;
    multiplier?: number;
    points?: number;
  };
}
export interface MatchSettings {
  baseScore: number;
  inMode: string;
  outMode: string;
  legCount: number;
  setCount: number;
  lobbyMode: string;
  bullOff: string;
  maxRounds: number;
}
export interface PlayerStatistic {
  allPoints: number;
  first9Points: number;
  first9DartsThrown: number; // Neu hinzugefügt
  average: number;
  checkoutPercentage: number;
  first9Average: number;
  score60: number;
  score100: number;
  score140: number;
  score180: number;
  checkouts: number;
  checkoutsAttemps: number;
}
