export interface AIPlayer {
    id: string;
    username: string;
    image: string;
    difficultyLevel: DifficultyLevel;
    makeMove(gameState: GameState): Move;
}

export enum DifficultyLevel {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
}

export interface GameState {
    currentScore: number;
    opponentScore: number;
    remainingDarts: number;
    currentLeg: number;
    currentSet: number;
    playerStats: PlayerStats;
}

export interface PlayerStats {
    average: number;
    first9Average: number;
    checkouts: number;
    checkoutsAttempts: number;
    score60: number;
    score100: number;
    score140: number;
    score180: number;
    allPoints: number;
}

export interface Move {
    target: string; // e.g., "T20", "BULL"
    score: number;
    dartsThrown: number;
}