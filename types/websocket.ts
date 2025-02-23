export interface PlayerScore {
    currentScore: number;
    legsWon: number;
    setsWon: number;
    dart1: DartScore;
    dart2: DartScore;
    dart3: DartScore;
    thrownDarts: number;
}
export interface Player {
    id: string;
    username: string;
    image?: string;
    scores: PlayerScore;
    ws: WebSocket;
}

export interface Match {
    players: Player[];
    settings: any;
    currentLeg: number;
    currentSet: number;
    finished: boolean;
    createdAt: number;
    bullOffFinished: boolean;
    currentPlayerIndex: number;
    startPlayerIndex?: number;
    currentRound: number; // Index des aktuellen Spielers
}
export interface DartScore {
    value?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 25;
    multiplier?: 1 | 2 | 3;
}
