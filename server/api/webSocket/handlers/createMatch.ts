import { matches } from "../ws";


export function handleCreateMatch(socket: WebSocket, data: any) {
    try {
        console.log("Erstelle Match mit Einstellungen:", data.matchSettings);
        const matchSettings = data.matchSettings._value;
        const matchId = crypto.randomUUID();
        console.log("Match erstellt:", matchId);
        matches[matchId] = {
          match: {
          players: [],
          settings: matchSettings,
          currentLeg: 1,
          currentSet: 1,
          finished: false,
          createdAt: Date.now(),
          bullOffFinished: false,
          currentPlayerIndex: 0,
          startPlayerIndex: 0,
          currentRound: 1,
          },
          sockets: {
            ws: [],
          },
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