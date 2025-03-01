import { matches } from "../ws";
import type { Match } from "~/types/websocket";
import { resetPlayerDartScores, endLeg, endSet, switchplayers, mapPlayer } from "../utils";
import { handleX01Match, handleMatchStats, trackScore } from "../index";


export function handleDartThrow(socket: WebSocket, data: any) {
    try {
        const { matchId, player, score, multiplier } = data;
        const match = matches[matchId].match;
        const sockets = matches[matchId].sockets;
        if (match && !match.finished) {
          const currentPlayer = match.players[match.currentPlayerIndex];
          
          if (!currentPlayer || currentPlayer.id !== player.id) {
            socket.send(
              JSON.stringify({
                type: "wait-for-turn",
              })
            );
            return;
          }

          if (!currentPlayer) {
            socket.send(
              JSON.stringify({
                type: "error",
                message: "Ungültiger Spieler",
              })
            );
            return;
          }
          
          // Inkrementiere thrownDarts
          currentPlayer.scores.thrownDarts++;
          
          // Tracke den Score (Punkte) für diesen Wurf
          //trackScore(currentPlayer, score * multiplier, match);
          
          // Aktualisiere legDartsCount für jeden Wurf direkt
          if (!currentPlayer.scores.legDartsCount) {
            currentPlayer.scores.legDartsCount = {};
          }
          if (!currentPlayer.scores.legDartsCount[match.currentLeg]) {
            currentPlayer.scores.legDartsCount[match.currentLeg] = 0;
          }
          currentPlayer.scores.legDartsCount[match.currentLeg]++;
          
          // Aktualisiere first9Points
          // Zähle die gesamte Anzahl der bisher geworfenen Darts in diesem Leg
          const totalDartsInLeg = currentPlayer.scores.legDartsCount[match.currentLeg];
          if (totalDartsInLeg <= 9) {
            if (!currentPlayer.stats.first9Points) {
              currentPlayer.stats.first9Points = 0;
            }
            currentPlayer.stats.first9Points += score * multiplier;
            currentPlayer.stats.first9DartsThrown ++;
          }
          
          currentPlayer.scores.dartScores[currentPlayer.scores.thrownDarts] = {
            value: score,
            multiplier,
            points: score * multiplier,
          };

          // Nach jedem Leg resetten wir den flag für Checkout-Tracking
          if (currentPlayer.scores.thrownDarts === 3) {
            currentPlayer.scores.currentVisitHasCheckoutAttempt = false;
          }
         
          handleX01Match(match, sockets, matchId, currentPlayer, score, multiplier);
          
          sockets.ws.forEach((ws) => {
            ws.send(
              JSON.stringify({
                type: "dart-update",
                matchId,
                match,
              })
            );
          });

          if (currentPlayer.scores.thrownDarts === 3) {
            // Bei Spielerwechsel wird die Funktion switchplayers aufgerufen,
            // aber wir haben die Darts bereits gezählt, daher müssen wir 
            // sicherstellen, dass sie nicht doppelt gezählt werden
            switchplayers(match, sockets, currentPlayer);
          }
        } else {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Ungültige Match-ID oder Match bereits beendet.",
            })
          );
        }
      } catch (err) {
        console.error("Fehler beim Verarbeiten des Dartwurfs:", err);
      }
}
