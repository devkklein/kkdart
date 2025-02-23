import BullOffWinner from "~/components/Popups/BullOffWinner.vue";
import type { DartScore } from "~/types/interface";

interface PlayerScore {
  currentScore: number;
  legsWon: number;
  setsWon: number;
  dart1: DartScore;
  dart2: DartScore;
  dart3: DartScore;
  thrownDarts: number;
}
interface Player {
  id: string;
  username: string;
  image?: string;
  scores: PlayerScore;
  ws: WebSocket;
}

interface Match {
  players: Player[];
  settings: any;
  currentLeg: number;
  currentSet: number;
  finished: boolean;
  createdAt: number;
  bullOffFinished: boolean;
  currentPlayerIndex: number;
  startPlayerIndex?: number;
  currentRound: number; // Index des aktuellen Spielers
}

const matches: Record<string, Match> = {};

// Dummy-Funktion für DB-Speicherung
async function storeMatchResults(matchId: string, match: Match) {
  try {
    console.log(`Speichere Ergebnis für Match ${matchId}`, match);
    // Beispiel: await db.insert({ matchId, ...match });
  } catch (err) {
    console.error("Fehler beim Speichern des Matches:", err);
  }
}

// Überprüfe alle 1 Sekunde, ob Matches gelöscht werden sollen
setInterval(() => {
  try {
    const now = Date.now();
    Object.entries(matches).forEach(([matchId, match]) => {
      // Lösche Matches, die nicht beendet sind, weniger als 2 Spieler haben
      // und älter als 5 Sekunden sind
      if (
        (!match.players.length && now - match.createdAt >= 5000) ||
        match.finished ||
        (match.players.length === 1 && now - match.createdAt >= 70000)
      ) {
        console.log(
          `Match ${matchId} wird gelöscht, da keine weiteren Spieler beigetreten sind.`
        );
        delete matches[matchId];
      }
    });
  } catch (err) {
    console.error("Fehler beim Überprüfen der Matches:", err);
  }
}, 1000);

export default defineWebSocketHandler({
  open(socket) {
    try {
      console.log("Neuer Spieler verbunden");
    } catch (err) {
      console.error("Fehler beim Öffnen der Verbindung:", err);
    }
  },
  message(socket, message) {
    let data: any;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.error("Ungültiges JSON:", err);
      return;
    }

    try {
      if (data.type === "create-match") {
        try {
          console.log("Erstelle Match mit Einstellungen:", data.matchSettings);
          const matchSettings = data.matchSettings;
          const matchId = crypto.randomUUID();
          matches[matchId] = {
            players: [],
            settings: matchSettings,
            currentLeg: 1,
            currentSet: 1,
            finished: false,
            createdAt: Date.now(),
            bullOffFinished: false,
            currentPlayerIndex: 0,
            currentRound: 1,
          };
          socket.send(
            JSON.stringify({
              type: "match-created",
              matchId,
            })
          );
        } catch (err) {
          console.error("Fehler beim Erstellen des Matches:", err);
        }
      } else if (data.type === "join-match") {
        try {
          console.log("Spieler tritt Match bei", data.matchId);
          const match = matches[data.matchId];
          const matchId = data.matchId;
          console.log("Spieler tritt Match bei", matchId);
          const player = {
            ...data.player,
            ws: socket,
            scores: {
              currentScore: match.settings._value.baseScore,
              legsWon: 0,
              setsWon: 0,
              dart1: {},
              dart2: {},
              dart3: {},
              thrownDarts: 0,
            },
          };
          if (match) {
            console.log("settings", match.settings);
            if (match.players.length < 2) {
              match.players.push(player);
              console.log("Spieler ist dem Match beigetreten");
              console.log("Spieleranzahl: ", match.players);

              socket.send(
                JSON.stringify({
                  type: "match-joined",
                })
              );

              if (match.players.length === 2) {
                match.players.forEach((player) => {
                  console.log("Match startet");
                  player.ws.send(
                    JSON.stringify({
                      type: "match-start",
                      matchId,
                      players: match.players.map((p) => ({
                        id: p.id,
                        username: p.username,
                        image: p.image || null,
                        scores: p.scores,
                      })),
                      settings: match.settings,
                      bullOff: match.bullOffFinished,
                    })
                  );
                });
              }
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
      } else if (data.type === "leave-match") {
        try {
          const match = matches[data.matchId];
          const player = data.player;
          if (match) {
            if (player) {
              match.players = match.players.filter((p) => p.id !== player.id);
              console.log("Spieler hat das Match verlassen");
              socket.send(
                JSON.stringify({
                  type: "match-left",
                })
              );
              if (!match.players.length) {
                delete matches[data.matchId];
              }
            } else {
              socket.send(
                JSON.stringify({
                  type: "error",
                  message: "Spieler nicht im Match",
                })
              );
            }
          }
        } catch (err) {
          console.error("Fehler beim Verlassen des Matches:", err);
        }
      } else if (data.type === "bulloff-dart") {
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
      } else if (data.type === "dart-throw") {
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

            if (newScore === 0) {
              if (
                match.settings._value.outMode === "Double" &&
                multiplier !== 2
              ) {
                socket.send(
                  JSON.stringify({
                    type: "error",
                    message: "Überwurf – Punkte werden nicht abgezogen",
                  })
                );
                return;
              }
              if (
                (match.settings._value.outMode === "Master" &&
                  multiplier === 3) ||
                multiplier === 2
              ) {
                socket.send(
                  JSON.stringify({
                    type: "error",
                    message: "Überwurf – Punkte werden nicht abgezogen",
                  })
                );
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
                  storeMatchResults(matchId, match).catch((err) =>
                    console.error("Fehler beim Speichern des Matches:", err)
                  );
                }
              }
            }

            if (currentPlayer.scores.thrownDarts === 3) {
              currentPlayer.scores.thrownDarts = 0;
              if (match.currentPlayerIndex === match.startPlayerIndex) {
                match.currentRound++;
              }
              match.currentPlayerIndex = (match.currentPlayerIndex + 1) % 2;
              const nextPlayer = match.players[match.currentPlayerIndex];
              nextPlayer.scores.dart1 = {};
              nextPlayer.scores.dart2 = {};
              nextPlayer.scores.dart3 = {};
              nextPlayer.scores.thrownDarts = 0;

              match.players.forEach((player) => {
                player.ws.send(
                  JSON.stringify({
                    type: "switch-turn",
                    matchId,
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
      } else if (data.type === "list-matches") {
        const availableMatches = Object.entries(matches)
          .filter(
            ([matchId, match]) => match.players.length < 2 && !match.finished
          )
          .map(([matchId, match]) => ({
            matchId,
            settings: match.settings,
          }));
        availableMatches.forEach((match) => {
          console.log("Verfügbares Match:", match);
        });
        socket.send(
          JSON.stringify({ type: "matches-list", matches: availableMatches })
        );
      } else {
        console.log("Unbekannter Nachrichtentyp:", data.type);
      }
    } catch (err) {
      console.error("Fehler beim Verarbeiten der Nachricht:", err);
    }
  },
});
