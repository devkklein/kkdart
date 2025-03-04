import type { Match, Player } from '~/types/websocket';

export const initializeOfflinePlayer = (match: Match, p:any ) => {
  const player: Player = {
        ...p,
        stats: {
          average: 0,
          first9Average: 0,
          first9Points: 0,
          first9DartsThrown: 0, // Neu für First 9 Tracking
          checkoutPercentage: 0,
          checkouts: 0,
          checkoutsAttemps: 0,
          score60: 0,
          score100: 0,
          score140: 0,
          score180: 0,
          allPoints: 0,
        },
        scores: {
          currentScore: match.settings.baseScore,
          legsWon: 0,
          setsWon: 0,
          dartScores: {
            [1]: {},
            [2]: {},
            [3]: {},
          },
          thrownDarts: 0,
          legDartsCount: {
            [match.currentLeg]: 0,
          },
          roundScore: 0,
          trackedRounds: {}, // Initialisierung des Tracking-Status
          currentVisitHasCheckoutAttempt: false, // Initialisierung des Checkout-Tracking-Status
          legScores: {
            [match.currentLeg]: {
              roundScores: {
                [match.currentRound]: {
                  scores: [],
                },
              },
            },
          },
        },
      };
      
      return player;
    }
