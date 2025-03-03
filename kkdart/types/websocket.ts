export interface Match {
    id: string;
    settings: MatchSettings;
    players: Player[];
    currentLeg: number;
    currentSet: number;
    createdAt: string;
}

export interface MatchSettings {
    baseScore: number;
    inMode: string;
    outMode: string;
    legCount: number;
    setCount: number;
    lobbyMode: boolean;
    bullOff: boolean;
    maxRounds: number;
}

export interface Player {
    id: string;
    username: string;
    image: string;
    stats: PlayerStats;
    scores: PlayerScores;
}

export interface PlayerStats {
    average: number;
    first9Average: number;
    first9Points: number;
    first9DartsThrown: number;
    checkoutPercentage: number;
    checkouts: number;
    checkoutsAttemps: number;
    score60: number;
    score100: number;
    score140: number;
    score180: number;
    allPoints: number;
}

export interface PlayerScores {
    legsWon: number;
    setsWon: number;
    legDartsCount: number;
    legScores: number[];
}