import { matches } from "../ws";

export function handleCreateMatch(socket: WebSocket, data: any) {
    try {
        console.log("Erstelle Match mit Einstellungen:", data.matchSettings);
        const matchSettings = data.matchSettings;
        const matchId = crypto.randomUUID();
        console.log("Match erstellt:", matchId);
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
}