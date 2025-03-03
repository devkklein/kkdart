import { matches } from "../ws";

export function handleStartMatch(socket: WebSocket, data: any) {
    try {
        const match = matches[data.matchId].match;
        const sockets = matches[data.matchId].sockets;
        const matchId = data.matchId;
        
        if (match) {
            match.started = true;
            
            sockets.ws.forEach((ws) => {
                ws.send(JSON.stringify({
                    type: "match-start",
                    matchId,
                    match,
                }));
            });
        }
    }
    catch (err) {
        console.error("Fehler beim Starten des Matches:", err);
    }
}