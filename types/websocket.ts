export interface PlayerScore {
    currentScore: number;
    legsWon: number;
    setsWon: number;
    dart1: DartScore;
    dart2: DartScore;
    dart3: DartScore;
    roundScore: number;
    legScores: legScore[];
    thrownDarts: number;
}

export interface legScore{
    leg: number;
    scores: number[];
}
export interface Player {
    id: string;
    username: string;
    image?: string;
    scores: PlayerScore;
}

export interface Match {
    players: Player[];
    settings: MatchSettings;
    currentLeg: number;
    currentSet: number;
    finished: boolean;
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
    value?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 25;
    multiplier?: 1 | 2 | 3;
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