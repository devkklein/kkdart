import type { Match, Sockets, Matches } from "~/types/websocket";
import { handleBullOff,handleDartThrow,handleCreateMatch,handleJoinMatch,handleLeaveMatch, handleListMatches, handleX01Match, handleStartMatch } from "./index";



export const matches = {} as Matches;

// Dummy-Funktion für DB-Speicherung


// Überprüfe alle 1 Sekunde, ob Matches gelöscht werden sollen

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
     
      switch (data.type) {
        case "create-match":
          handleCreateMatch(socket, data);
          break;
        case "join-match":
          handleJoinMatch(socket, data);
          break;
        case "start-match":
          handleStartMatch(socket, data);
          break;
          
        case "leave-match":
          handleLeaveMatch(socket, data);
          break;
        case "bulloff-dart":
          handleBullOff(socket, data);
          break;
        case "dart-throw":
          handleDartThrow(socket, data);
          break;
        case "list-matches":
          handleListMatches(socket);
          break;
        case "x01-match":
          handleDartThrow(socket, data);
          break;
          
        default:
          console.log("Unbekannter Nachrichtentyp:", data.type);
      }
    } catch (err) {
      console.error("Fehler beim Verarbeiten der Nachricht:", err);
    }
  },
});

setInterval(() => {
  try {
    const now = Date.now();
    Object.entries(matches).forEach(([matchId,{match, sockets} ]) => {
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
