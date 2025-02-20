interface PlayerScore {
  currentScore: number;
  legsWon: number;
  setsWon: number;
}

interface Match {
  players: WebSocket[];
  settings: {
    baseScore: number;
    inMode: string;
    outMode: string;
    legCount: number;
    setCount: number;
    lobbyMode?: string;
  };
  scores: Record<string, PlayerScore>;
  currentLeg: number;
  currentSet: number;
  finished: boolean;
}

const matches: Record<string, Match> = {};

// Dummy-Funktion für DB-Speicherung
async function storeMatchResults(matchId: string, match: Match) {
  console.log(`Speichere Ergebnis für Match ${matchId}`, match);
  // Beispiel: await db.insert({ matchId, ...match });
}

export default defineWebSocketHandler({
  open(socket) {
    console.log("Neuer Spieler verbunden");
  },
  message(socket, message) {
    let data: any;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.error("Ungültiges JSON:", err);
      return;
    }

    if (data.type === "create-match") {
      // Erhalte matchSettings aus der Nachricht; Beispiel aus den X01.vue Daten
      const matchSettings = data.matchSettings;
      const matchId = crypto.randomUUID();
      matches[matchId] = {
        players: [socket],
        settings: {
          baseScore: Number(matchSettings.baseScore),
          inMode: matchSettings.inMode,
          outMode: matchSettings.outMode,
          legCount: Number(matchSettings.countLegs),
          setCount: Number(matchSettings.countSets),
          lobbyMode: matchSettings.lobbyMode,
        },
        // Initialisiere die Scores erst, wenn beide Spieler beigetreten sind
        scores: {},
        currentLeg: 1,
        currentSet: 1,
        finished: false,
      };
      socket.send(
        JSON.stringify({
          type: "match-created",
          matchId,
        })
      );
    } else if (data.type === "join-match") {
      const { matchId } = data;
      const match = matches[matchId];
      if (match) {
        if (match.players.length < 2) {
          match.players.push(socket);
          socket.send(
            JSON.stringify({
              type: "match-joined",
              matchId,
            })
          );
          // Initialisiere die Spielerwerte (z.B. "Spieler1" und "Spieler2")
          if (!match.scores["Spieler1"] && !match.scores["Spieler2"]) {
            match.scores["Spieler1"] = {
              currentScore: match.settings.baseScore,
              legsWon: 0,
              setsWon: 0,
            };
            match.scores["Spieler2"] = {
              currentScore: match.settings.baseScore,
              legsWon: 0,
              setsWon: 0,
            };
          }
          // Startet das Match, wenn beide Spieler da sind
          if (match.players.length === 2) {
            match.players.forEach((ws) => {
              ws.send(
                JSON.stringify({
                  type: "match-start",
                  matchId,
                  settings: match.settings,
                  scores: match.scores,
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
    } else if (data.type === "dart-throw") {
      // Erwarte data: { matchId, playerId (z.B. "Spieler1" oder "Spieler2"), points }
      const { matchId, playerId, points } = data;
      const match = matches[matchId];
      if (match && !match.finished) {
        const playerScore = match.scores[playerId];
        // Prüfe, ob der Spieler existiert
        if (!playerScore) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Ungültiger Spieler",
            })
          );
          return;
        }
        // Subtrahiere die Punkte vom aktuellen Score
        const newScore = playerScore.currentScore - points;
        // Bei negativen Ergebnissen ignorieren wir diesen Wurf (oder erweitere die Logik für Überwurf)
        if (newScore < 0) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Überwurf – Punkte werden nicht abgezogen",
            })
          );
          return;
        }
        playerScore.currentScore = newScore;
  
        // Sende das Update an beide Spieler
        match.players.forEach((ws) => {
          ws.send(
            JSON.stringify({
              type: "score-update",
              matchId,
              playerId,
              currentScore: playerScore.currentScore,
            })
          );
        });
  
        // Prüfe, ob eine Leg gewonnen wurde (exakter Abschluss mit 0)
        if (newScore === 0) {
          playerScore.legsWon++;
          // Zurücksetzen der Scores für die nächste Leg
          match.scores["Spieler1"].currentScore = match.settings.baseScore;
          match.scores["Spieler2"].currentScore = match.settings.baseScore;
          match.currentLeg++;
  
          // Sende Leg-Update
          match.players.forEach((ws) => {
            ws.send(
              JSON.stringify({
                type: "leg-update",
                matchId,
                playerId,
                legsWon: playerScore.legsWon,
                currentLeg: match.currentLeg,
              })
            );
          });
  
          // Prüfe, ob der Spieler genug Legs gewonnen hat für einen Set
          if (playerScore.legsWon >= match.settings.legCount) {
            playerScore.setsWon++;
            // Zurücksetzen der Legs für beide Spieler
            match.scores["Spieler1"].legsWon = 0;
            match.scores["Spieler2"].legsWon = 0;
            match.currentSet++;
  
            match.players.forEach((ws) => {
              ws.send(
                JSON.stringify({
                  type: "set-update",
                  matchId,
                  playerId,
                  setsWon: playerScore.setsWon,
                  currentSet: match.currentSet,
                })
              );
            });
  
            // Prüfe, ob der Spieler auch den finalen Set gewonnen hat
            if (playerScore.setsWon >= match.settings.setCount) {
              match.finished = true;
              match.players.forEach((ws) => {
                ws.send(
                  JSON.stringify({
                    type: "match-end",
                    matchId,
                    winner: playerId,
                    scores: match.scores,
                  })
                );
              });
              storeMatchResults(matchId, match).catch((err) =>
                console.error("Fehler beim Speichern des Matches:", err)
              );
            }
          }
        }
      } else {
        socket.send(
          JSON.stringify({
            type: "error",
            message: "Ungültige Match-ID oder Match bereits beendet.",
          })
        );
      }
    } else {
      console.log("Unbekannter Nachrichtentyp:", data.type);
    }
  },
});
