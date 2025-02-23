import { matches } from "../ws";

export function  handleBullOff(socket: WebSocket, data: any) {

    try {
              const { matchId, player, score, multiplier } = data;
              console.log("Bull-Off-Dart: data received");
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
    
                match.players.forEach((player) => {
                  player.ws.send(
                    JSON.stringify({
                      type: "bulloff-update",
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
    
                if (currentPlayer.scores.thrownDarts === 3) {
                  if (match.currentPlayerIndex === 0) {
                    match.currentPlayerIndex = 1;
                    match.players.forEach((player) => {
                      player.ws.send(
                        JSON.stringify({
                          type: "switch-turn",
                          matchId,
                          currentPlayer: match.currentPlayerIndex,
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
                      match.players.forEach((player) => {
                        player.scores.dart1 = {};
                        player.scores.dart2 = {};
                        player.scores.dart3 = {};
                        player.scores.thrownDarts = 0;
                      });
                      match.players.forEach((player) => {
                        player.ws.send(
                          JSON.stringify({
                            type: "bulloff-winner",
                            matchId,
                            winner: player1.username,
                            currentPlayer: 0,
                            players: match.players.map((p) => ({
                              id: p.id,
                              username: p.username,
                              image: p.image || null,
                              scores: p.scores,
                            })),
                          })
                        );
                      });
                    } else if (player2Score > player1Score) {
                      match.currentPlayerIndex = 1;
                      match.bullOffFinished = true;
                      match.startPlayerIndex = 1;
                      match.players.forEach((player) => {
                        player.scores.dart1 = {};
                        player.scores.dart2 = {};
                        player.scores.dart3 = {};
                        player.scores.thrownDarts = 0;
                      });
                      match.players.forEach((player) => {
                        player.ws.send(
                          JSON.stringify({
                            type: "bulloff-winner",
                            matchId,
                            winner: player2.username,
                            currentPlayer: 1,
                            players: match.players.map((p) => ({
                              id: p.id,
                              username: p.username,
                              image: p.image || null,
                              scores: p.scores,
                            })),
                          })
                        );
                      });
                    } else {
                      match.players.forEach((player) => {
                        player.scores.dart1 = {};
                        player.scores.dart2 = {};
                        player.scores.dart3 = {};
                        player.scores.thrownDarts = 0;
                      });
                      match.players.forEach((player) => {
                        player.ws.send(
                          JSON.stringify({
                            type: "bulloff-tie",
                            matchId,
                            players: match.players.map((p) => ({
                              id: p.id,
                              username: p.username,
                              image: p.image || null,
                              scores: p.scores,
                            })),
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