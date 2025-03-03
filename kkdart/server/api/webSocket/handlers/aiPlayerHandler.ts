import { Match } from "~/types/websocket";
import { AIPlayer } from "~/ai/models/aiPlayer";
import { DifficultyLevels } from "~/ai/models/difficultyLevels";
import { BasicStrategy } from "~/ai/strategies/basicStrategy";
import { AdvancedStrategy } from "~/ai/strategies/advancedStrategy";
import { ProStrategy } from "~/ai/strategies/proStrategy";

export class AIPlayerHandler {
    private aiPlayers: AIPlayer[];

    constructor() {
        this.aiPlayers = [];
    }

    initializeAIPlayers(playerCount: number, difficulty: DifficultyLevels) {
        for (let i = 0; i < playerCount; i++) {
            const aiPlayer = new AIPlayer(`AI_Player_${i + 1}`, this.getStrategy(difficulty));
            this.aiPlayers.push(aiPlayer);
        }
    }

    private getStrategy(difficulty: DifficultyLevels) {
        switch (difficulty) {
            case DifficultyLevels.EASY:
                return new BasicStrategy();
            case DifficultyLevels.MEDIUM:
                return new AdvancedStrategy();
            case DifficultyLevels.HARD:
                return new ProStrategy();
            default:
                throw new Error("Invalid difficulty level");
        }
    }

    processAIMove(match: Match) {
        this.aiPlayers.forEach(aiPlayer => {
            const move = aiPlayer.makeMove(match);
            // Logic to apply the move to the match state
        });
    }
}