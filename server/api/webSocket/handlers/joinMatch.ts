import { matches } from "../ws";
export function handleJoinMatch (socket: WebSocket, data: any) {
    try {
     
        const match = matches[data.matchId].match;
        const sockets = matches[data.matchId].sockets;
        const matchId = data.matchId;
        const player = {
          ...data.player,
          scores: {
            currentScore: match.settings.baseScore,
            legsWon: 0,
            setsWon: 0,
            dart1: {},
            dart2: {},
            dart3: {},
            thrownDarts: 0,
            roundScore: 0,
            legScores: [],
          },
        };
        const ws = socket;
        if (match) {
        
          if (match.players.length < 2) {
            match.players.push(player);
            sockets.ws.push(ws);
            

            socket.send(
              JSON.stringify({
                type: "match-joined",
              })
            );

            if (match.players.length === 2) {
              sockets.ws.forEach((ws) => {
                
                ws.send(
                  JSON.stringify({
                    type: "match-start",
                    matchId,
                    match,
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