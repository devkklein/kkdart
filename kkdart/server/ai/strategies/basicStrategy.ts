import { Match } from "~/types/websocket";
import { AIPlayer } from "../models/aiPlayer";

export class BasicStrategy {
    private aiPlayer: AIPlayer;

    constructor(aiPlayer: AIPlayer) {
        this.aiPlayer = aiPlayer;
    }

    public makeMove(match: Match): string {
        const currentScore = this.aiPlayer.getCurrentScore();
        const targetScore = this.calculateTargetScore(currentScore);

        return this.chooseThrow(targetScore);
    }

    private calculateTargetScore(currentScore: number): number {
        if (currentScore <= 40) {
            return currentScore; // Aim for the remaining score
        }
        return 20; // Aim for the bullseye or a high score
    }

    private chooseThrow(targetScore: number): string {
        if (targetScore === 0) {
            return "Finish"; // Attempt to finish the game
        }
        return `Throw at ${targetScore}`; // Simple throw decision
    }
}