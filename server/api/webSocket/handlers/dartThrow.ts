import { matches } from "../ws";
import type { Match } from "~/types/websocket";
import { resetPlayerDartScores, endLeg, endSet, switchplayers, mapPlayer } from "../utils";
import { handleX01Match } from "./x01Match";


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
          currentPlayer.scores.thrownDarts++;
         
          currentPlayer.scores.dartScores[currentPlayer.scores.thrownDarts] = {
            value: score,
            multiplier: multiplier,
            points: score * multiplier,
          };

         
          
          
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
