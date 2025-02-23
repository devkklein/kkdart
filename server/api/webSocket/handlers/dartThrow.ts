import { matches } from "../ws";
import type { Match } from "~/types/websocket";


export function handleDartThrow(socket: WebSocket, data: any) {
    try {
        const { matchId, player, score, multiplier } = data;
        const match = matches[matchId];
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
          const points = score * multiplier;
          const newScore = currentPlayer.scores.currentScore - points;
          if (newScore < 0) {
            socket.send(
              JSON.stringify({
                type: "error",
                message: "Überwurf – Punkte werden nicht abgezogen",
              })
            );
            return;
          }
          if (currentPlayer.scores.thrownDarts === 0) {
            currentPlayer.scores.dart1 = {
              value: score,
              multiplier: multiplier,
            };
          } else if (currentPlayer.scores.thrownDarts === 1) {
            currentPlayer.scores.dart2 = {
              value: score,
              multiplier: multiplier,
            };
          } else if (currentPlayer.scores.thrownDarts === 2) {
            currentPlayer.scores.dart3 = {
              value: score,
              multiplier: multiplier,
            };
          }

          if (match.settings._value.inMode === "Double") {
            if (
              currentPlayer.scores.currentScore ===
              match.settings._value.baseScore
            ) {
              if (multiplier === 2) {
                currentPlayer.scores.currentScore =
                  match.settings._value.baseScore;
                if (currentPlayer.scores.thrownDarts === 0) {
                  currentPlayer.scores.dart1 = { value: 0, multiplier: 1 };
                } else if (currentPlayer.scores.thrownDarts === 1) {
                  currentPlayer.scores.dart2 = { value: 0, multiplier: 1 };
                } else if (currentPlayer.scores.thrownDarts === 2) {
                  currentPlayer.scores.dart3 = { value: 0, multiplier: 1 };
                }
              }
            }
          }
          if (match.settings._value.inMode === "Master") {
            if (
              currentPlayer.scores.currentScore ===
              match.settings._value.baseScore
            ) {
              if (multiplier === 3 || multiplier === 2) {
                currentPlayer.scores.currentScore =
                  match.settings._value.baseScore;
                if (currentPlayer.scores.thrownDarts === 0) {
                  currentPlayer.scores.dart1 = { value: 0, multiplier: 1 };
                } else if (currentPlayer.scores.thrownDarts === 1) {
                  currentPlayer.scores.dart2 = { value: 0, multiplier: 1 };
                } else if (currentPlayer.scores.thrownDarts === 2) {
                  currentPlayer.scores.dart3 = { value: 0, multiplier: 1 };
                }
              }
            }
          }
          currentPlayer.scores.thrownDarts++;
          currentPlayer.scores.currentScore = newScore;
          match.players.forEach((player) => {
            player.ws.send(
              JSON.stringify({
                type: "score-update",
                matchId,
                player: {
                  id: currentPlayer.id,
                  username: currentPlayer.username,
                  image: currentPlayer.image || null,
                  scores: currentPlayer.scores,
                },
              })
            );
          });
          if(newScore === 1 && match.settings._value.outMode === "Double" || match.settings._value.outMode === "Master" ) {
            switchplayers(match);
            return;
          }

          if (newScore === 0) {
            if (
              match.settings._value.outMode === "Double" &&
              multiplier !== 2
            ) {
              switchplayers(match);
              return;
            }
            if (
              (match.settings._value.outMode === "Master" &&
                multiplier === 3) ||
              multiplier === 2
            ) {
              switchplayers(match);
              return;
            } else {
              currentPlayer.scores.legsWon++;
              if (match.startPlayerIndex === 1) {
                match.currentPlayerIndex = 0;
                match.startPlayerIndex = 0;
              } else {
                match.currentPlayerIndex = 1;
                match.startPlayerIndex = 1;
              }
              match.players.forEach((player) => {
                player.scores.currentScore = match.settings._value.baseScore;
                player.ws.send(
                  JSON.stringify({
                    type: "leg-update",
                    matchId,
                    currentPlayer: match.currentPlayerIndex,
                    player: {
                      id: player.id,
                      username: player.username,
                      image: player.image || null,
                      scores: player.scores,
                    },
                  })
                );

              });
              switchplayers(match);

              match.currentLeg++;
              match.currentRound = 1;
            }

            if (currentPlayer.scores.legsWon >= match.settings.legCount) {
              currentPlayer.scores.setsWon++;
              match.currentSet++;

              match.players.forEach((player) => {
                player.scores.legsWon = 0;
                player.scores.currentScore = match.settings._value.baseScore;
                player.ws.send(
                  JSON.stringify({
                    type: "set-update",
                    matchId,
                    player: {
                      id: player.id,
                      username: player.username,
                      image: player.image || null,
                      scores: player.scores,
                    },
                  })
                );
              });

              if (currentPlayer.scores.setsWon >= match.settings.setCount) {
                match.finished = true;
                match.players.forEach((player) => {
                  player.ws.send(
                    JSON.stringify({
                      type: "match-end",
                      matchId,
                      winner: player,
                    })
                  );
                });
                
              }
            }
          }

          if (currentPlayer.scores.thrownDarts === 3) {
            currentPlayer.scores.thrownDarts = 0;
            if (match.currentPlayerIndex === match.startPlayerIndex) {
              match.currentRound++;
            }
            match.currentPlayerIndex = (match.currentPlayerIndex + 1) % 2;
            switchplayers(match);
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
function switchplayers(match:Match){
    const nextPlayer = match.players[match.currentPlayerIndex];
                nextPlayer.scores.dart1 = {};
                nextPlayer.scores.dart2 = {};
                nextPlayer.scores.dart3 = {};
                nextPlayer.scores.thrownDarts = 0;
  
                match.players.forEach((player) => {
                  player.ws.send(
                    JSON.stringify({
                      type: "switch-turn",                     
                      currentPlayer: match.currentPlayerIndex,
                      player: {
                        id: nextPlayer.id,
                        username: nextPlayer.username,
                        image: nextPlayer.image || null,
                        scores: nextPlayer.scores,
                      },
                    })
                  );
                });
  }