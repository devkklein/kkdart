import { Match } from "~/types/websocket";
import { AIPlayer } from "../models/aiPlayer";
import { calculateProbability } from "../utils/probabilityCalculator";
import { getScoringOptions } from "../utils/dartBoardGeometry";

export class AdvancedStrategy {
    private aiPlayer: AIPlayer;

    constructor(aiPlayer: AIPlayer) {
        this.aiPlayer = aiPlayer;
    }

    public makeDecision(match: Match): string {
        const scoringOptions = getScoringOptions(this.aiPlayer);
        const bestOption = this.evaluateOptions(scoringOptions, match);
        return bestOption;
    }

    private evaluateOptions(options: string[], match: Match): string {
        let bestScore = -1;
        let bestOption = options[0];

        for (const option of options) {
            const probability = calculateProbability(option, match);
            const score = this.calculateScore(option, probability);

            if (score > bestScore) {
                bestScore = score;
                bestOption = option;
            }
        }

        return bestOption;
    }

    private calculateScore(option: string, probability: number): number {
        // Implement scoring logic based on option and probability
        return probability * this.getWeight(option);
    }

    private getWeight(option: string): number {
        // Define weights for different options based on strategy
        const weights: { [key: string]: number } = {
            'triple20': 3,
            'double16': 2,
            'bullseye': 4,
            // Add more options as needed
        };

        return weights[option] || 1; // Default weight
    }
}