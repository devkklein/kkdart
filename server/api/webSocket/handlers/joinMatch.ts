import { matches } from "../ws";
export function handleJoinMatch (socket: WebSocket, data: any) {
    try {
     
        const match = matches[data.matchId];
        const matchId = data.matchId;
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
        
          if (match.players.length < 2) {
            match.players.push(player);
            

            socket.send(
              JSON.stringify({
                type: "match-joined",
              })
            );

            if (match.players.length === 2) {
              match.players.forEach((player) => {
                
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
}