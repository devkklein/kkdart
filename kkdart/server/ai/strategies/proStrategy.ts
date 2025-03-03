import { Match } from "~/types/websocket";
import { AIPlayer } from "../models/aiPlayer";
import { calculateOptimalScore } from "../utils/probabilityCalculator";

export class ProStrategy {
    private aiPlayer: AIPlayer;

    constructor(aiPlayer: AIPlayer) {
        this.aiPlayer = aiPlayer;
    }

    public makeMove(match: Match): string {
        const currentScore = this.aiPlayer.getCurrentScore();
        const optimalScore = this.calculateBestScore(currentScore, match);

        if (optimalScore) {
            return `Aim for ${optimalScore}`;
        } else {
            return "Make a random throw";
        }
    }

    private calculateBestScore(currentScore: number, match: Match): number | null {
        const possibleScores = this.getPossibleScores(currentScore);
        const bestScore = calculateOptimalScore(possibleScores, match);

        return bestScore;
    }

    private getPossibleScores(currentScore: number): number[] {
        // Logic to determine possible scores based on the current score
        // This could involve checking the dartboard layout and available scoring options
        return [currentScore - 1, currentScore - 2, currentScore - 3]; // Example values
    }
}