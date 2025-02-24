import { matches } from "../ws";
export function handleListMatches(socket: WebSocket) {
    const availableMatches = Object.entries(matches)
              .filter(
                ([matchId, {sockets, match}]) => match.players.length < 2 && !match.finished
              )
              .map(([matchId, {sockets, match}]) => ({
                matchId,
                settings: match.settings,
              }));
            availableMatches.forEach((match) => {
              console.log("Verfügbares Match:", match);
            });
            socket.send(
              JSON.stringify({ type: "matches-list", matches: availableMatches })
            );
}