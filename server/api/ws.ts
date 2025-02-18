interface Match {
  players: WebSocket[];
}

const matches: Record<string, Match> = {};

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
      const matchId = crypto.randomUUID();
      matches[matchId] = { players: [socket] };
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
          // Sobald beide Spieler beigetreten sind, starten wir das Spiel
          if (match.players.length === 2) {
            match.players.forEach((ws) => {
              ws.send(
                JSON.stringify({
                  type: "match-start",
                  matchId,
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
    } else {
      console.log("Unbekannter Nachrichtentyp:", data.type);
    }
  },
});
