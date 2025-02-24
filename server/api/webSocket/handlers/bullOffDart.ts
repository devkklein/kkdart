import { matches } from "../ws";
import { resetPlayerDartScores } from "../utils";

export function  handleBullOff(socket: WebSocket, data: any) {

    try {
              const { matchId, player, score, multiplier } = data;
              console.log("Bull-Off-Dart: data received");
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
                currentPlayer.scores.thrownDarts++;
                match.players.map((p) => {
                  if (p.id === currentPlayer.id) {
                    return currentPlayer;
                  }
                  return p;
                });
    
                sockets.ws.forEach((ws) => {
                 ws.send(
                    JSON.stringify({
                      type: "bulloff-update",
                      matchId,
                      match,
                    })
                  );
                });
    
                if (currentPlayer.scores.thrownDarts === 3) {
                  if (match.currentPlayerIndex === 0) {
                    match.currentPlayerIndex = 1;
                    sockets.ws.forEach((ws) => {
                      ws.send(
                        JSON.stringify({
                          type: "switch-turn",
                          matchId,
                          match,
                        })
                      );
                    });
                  } else {
                    const player1 = match.players[0];
                    const player2 = match.players[1];
                    const player1Score =
                      (player1.scores.dart1.value ?? 0) *
                        (player1.scores.dart1.multiplier ?? 0) +
                      (player1.scores.dart2.value ?? 0) *
                        (player1.scores.dart2.multiplier ?? 0) +
                      (player1.scores.dart3.value ?? 0) *
                        (player1.scores.dart3.multiplier ?? 0);
                    const player2Score =
                      (player2.scores.dart1.value ?? 0) *
                        (player2.scores.dart1.multiplier ?? 0) +
                      (player2.scores.dart2.value ?? 0) *
                        (player2.scores.dart2.multiplier ?? 0) +
                      (player2.scores.dart3.value ?? 0) *
                        (player2.scores.dart3.multiplier ?? 0);
    
                    if (player1Score > player2Score) {
                      match.currentPlayerIndex = 0;
                      match.bullOffFinished = true;
                      match.startPlayerIndex = 0;
                     resetPlayerDartScores(match.players);
                      match.players.map((p) => {
                        if(p.id === player1.id) {
                          return player1;
                        }
                        return p;
                      });

                      sockets.ws.forEach((ws) => {
                        ws.send(
                          JSON.stringify({
                            type: "bulloff-winner",
                            matchId,
                            winner: player1.username,
                           match,
                          })
                        );
                      });
                    } else if (player2Score > player1Score) {
                      match.currentPlayerIndex = 1;
                      match.bullOffFinished = true;
                      match.startPlayerIndex = 1;
                      resetPlayerDartScores(match.players);
                      match.players.map((p) => {
                        if(p.id === player2.id) {
                          return player2;
                        }
                        return p;
                      });
                      sockets.ws.forEach((ws) => {
                        ws.send(
                          JSON.stringify({
                            type: "bulloff-winner",
                            matchId,
                            winner: player2.username,                              
                           match,
                          })
                        );
                      });
                    } else {
                      resetPlayerDartScores(match.players);
                      sockets.ws.forEach((ws) => {
                        ws.send(
                          JSON.stringify({
                            type: "bulloff-tie",
                            matchId,
                            match
                          })
                        );
                      });
                      match.currentPlayerIndex = 0;
                    }
                  }
                }
              }
            } catch (err) {
              console.error("Fehler beim Verarbeiten des Bull-Off-Darts:", err);
            }


}