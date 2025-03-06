import { Static } from "vue";
import { matches } from "../ws";
import type { Player, Match } from "~/types/websocket";

export function handleJoinMatch(socket: WebSocket, data: any) {
  try {
    const match = matches[data.matchId].match;
    const sockets = matches[data.matchId].sockets;
    const matchId = data.matchId;
    const player: Player = {
      ...data.player,
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
        winner: false,
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
    const ws = socket;
    if (match) {
      if (match.players.length < 2) {
        match.players.push(player);
        sockets.ws.push(ws);

        sockets.ws.forEach((ws) => {
          ws.send(
            JSON.stringify({
              type: "match-joined",
              matchId,
              match,
            })
          );
        });
      } else {
        socket.send(
          JSON.stringify({
            type: "error",
            message: "Match voll",
          })
        );
      }
    } else {
      socket.send(
        JSON.stringify({
          type: "error",
          message: "Ungültige Match-ID",
        })
      );
    }
  } catch (err) {
    console.error("Fehler beim Beitreten des Matches:", err);
  }
}
