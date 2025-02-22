import { clearNuxtState } from "nuxt/app";
import type { DartScore } from "~/types/interface";



interface PlayerScore {
  currentScore: number;
  legsWon: number;
  setsWon: number;
  dart1: DartScore;
  dart2: DartScore;
  dart3: DartScore;
}
interface Player {
  id: string;
  username: string;
  image?: string;
  ws: WebSocket;
}


interface Match {
  players:  Player[];
  settings: any;
  scores: Record<string, PlayerScore>;
  currentLeg: number;
  currentSet: number;
  finished: boolean;
  createdAt: number; // Zeitpunkt der Erstellung in ms
}

const matches: Record<string, Match> = {};

// Dummy-Funktion für DB-Speicherung
async function storeMatchResults(matchId: string, match: Match) {
  console.log(`Speichere Ergebnis für Match ${matchId}`, match);
  // Beispiel: await db.insert({ matchId, ...match });
}

// Überprüfe alle 1 Sekunde, ob Matches gelöscht werden sollen
setInterval(() => {
  const now = Date.now();
  Object.entries(matches).forEach(([matchId, match]) => {
    // Lösche Matches, die nicht beendet sind, weniger als 2 Spieler haben
    // und älter als 5 Sekunden sind
    if (!match.players.length  && now - match.createdAt >= 5000 || match.finished || match.players.length === 1 && now - match.createdAt >= 70000) {
      console.log(`Match ${matchId} wird gelöscht, da keine weiteren Spieler beigetreten sind.`);
      delete matches[matchId];
    }
  });
}, 1000);
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
      console.log("Erstelle Match mit Einstellungen:", data.matchSettings);
      // Erhalte matchSettings aus der Nachricht; Beispiel aus den X01.vue Daten
    
      const matchSettings = data.matchSettings;
      
      const matchId = crypto.randomUUID();
      matches[matchId] = {
        players: [],
        settings: matchSettings,
        // Initialisiere die Scores erst, wenn beide Spieler beigetreten sind
        scores: {},
        currentLeg: 1,
        currentSet: 1,
        finished: false,
        createdAt: Date.now(), // Zeitpunkt der Erstellung
      };
      socket.send(
        JSON.stringify({
          type: "match-created",
          matchId,
        })
      );
    } else if (data.type === "join-match") {
       const match =  matches[data.matchId];
       const matchId = data.matchId;
       const player = {...data.player , ws: socket};
      if (match) {
        console.log("settings", match.settings);
        if (match.players.length  < 2 ) {
          match.players.push(player);
          console.log("Spieler ist dem Match beigetreten");
          console.log("Spieleranzahl: ", match.players);
         
          socket.send(
            JSON.stringify({
              type: "match-joined",
              
            })
          );
          // Initialisiere die Spielerwerte (z.B. "Spieler1" und "Spieler2")
          if (!match.scores["Spieler1"] && !match.scores["Spieler2"]) {
            match.scores["Spieler1"] = {
              currentScore: match.settings._value.baseScore,
              legsWon: 0,
              setsWon: 0,
              dart1: {value: 0, multiplier: 1},
              dart2: {value: 0, multiplier: 1},
              dart3: {value: 0, multiplier: 1},
            };
            match.scores["Spieler2"] = {
              currentScore: match.settings._value.baseScore,
              legsWon: 0,
              setsWon: 0,
              dart1: {value: 0, multiplier: 1},
              dart2: {value: 0, multiplier: 1},
              dart3: {value: 0, multiplier: 1},
            };
          }
          // Startet das Match, wenn beide Spieler da sind
          if (match.players.length === 2) {
            match.players.forEach((player) => {
              console.log("Match startet");
                player.ws.send(
                JSON.stringify({
                type: "match-start",  
                matchId,
                players: match.players.map(p => ({ id: p.id, username: p.username, image: p.image || null })), 
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
    } 
    else if (data.type === "leave-match") {
    const match = matches[data.matchId];
    const player = data.player;
    if (match) {
      
      if (player) {
        match.players = match.players.filter(p => p.id !== player.id);
        console.log("Spieler hat das Match verlassen");
        socket.send(
          JSON.stringify({
            type: "match-left",
          })
        );
        // Wenn das Match leer ist, lösche es
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
  }

    else if (data.type === "dart-throw") {
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
        match.players.forEach((player) => {
          player.ws.send(
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
          match.players.forEach((player) => {
            player.ws.send(
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
  
            match.players.forEach((player) => {
              player.ws.send(
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
              match.players.forEach((player) => {
                player.ws.send(
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
    } 
    else if (data.type === "list-matches") {
      // Filtere z. B. alle Matches, die noch nicht voll (weniger als 2 Spieler) und nicht beendet sind
      const availableMatches = Object.entries(matches)
        .filter(([matchId, match]) => match.players.length < 2 && !match.finished)
        .map(([matchId, match]) => ({
          matchId,
          settings: match.settings,
        }));
        availableMatches.forEach((match) => {
          console.log("Verfügbares Match:", match);
        });
      socket.send(JSON.stringify({ type: "matches-list", matches: availableMatches }));
    }
    else {
      console.log("Unbekannter Nachrichtentyp:", data.type);
    }
  },
});
