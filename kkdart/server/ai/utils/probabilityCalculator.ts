import { GameState } from "../../types/ai";

// Function to calculate the probability of hitting a specific score
export function calculateHitProbability(score: number, gameState: GameState): number {
    // Example logic for calculating hit probability based on game state
    const totalDartsThrown = gameState.totalDartsThrown;
    const successfulHits = gameState.successfulHits[score] || 0;

    return totalDartsThrown > 0 ? successfulHits / totalDartsThrown : 0;
}

// Function to calculate the probability of winning based on current scores
export function calculateWinningProbability(playerScore: number, opponentScore: number): number {
    // Simple probability calculation based on scores
    const totalScore = playerScore + opponentScore;
    return totalScore > 0 ? playerScore / totalScore : 0;
}

// Function to calculate the probability of a successful checkout
export function calculateCheckoutProbability(checkoutScore: number, gameState: GameState): number {
    const successfulCheckouts = gameState.successfulCheckouts[checkoutScore] || 0;
    const totalCheckouts = gameState.totalCheckouts;

    return totalCheckouts > 0 ? successfulCheckouts / totalCheckouts : 0;
}