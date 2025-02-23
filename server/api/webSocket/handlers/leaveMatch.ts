import { matches } from "../ws";

export function handleLeaveMatch(socket: WebSocket, data: any) {
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
}