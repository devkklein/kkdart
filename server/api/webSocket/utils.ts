import type { Player, Match, Sockets } from '~/types/websocket';

export function resetPlayerDartScores(players: Player[]) {
    players.forEach((player) => {
        player.scores.thrownDarts = 0;
        player.scores.dart1 = {};
        player.scores.dart2 = {};
        player.scores.dart3 = {};
        player.scores.roundScore = 0;
    
    });
}


export function switchplayers(match:Match, sockets: Sockets, currentPlayer: Player){
    currentPlayer.scores.thrownDarts = 0;
    if (match.currentPlayerIndex === match.startPlayerIndex) {
      match.currentRound++;
    }
    match.currentPlayerIndex = (match.currentPlayerIndex + 1) % 2;
    const nextPlayer = match.players[match.currentPlayerIndex];
                nextPlayer.scores.dart1 = {};
                nextPlayer.scores.dart2 = {};
                nextPlayer.scores.dart3 = {};
                nextPlayer.scores.thrownDarts = 0;
                nextPlayer.scores.roundScore = 0;
  
                sockets.ws.forEach((ws) => {
                  ws.send(
                    JSON.stringify({
                      type: "switch-turn",                     
                     match,
                    })
                  );
                });
  }
export function resetPlayer(match:Match, player:Player, sockets: Sockets){
    match.players.forEach((p) => {
        p.scores.currentScore = match.settings.baseScore;
        p.scores.roundScore = 0;
        p.scores.thrownDarts = 0;
        p.scores.dart1 = {};
        p.scores.dart2 = {};
        p.scores.dart3 = {};
    });
    if(match.startPlayerIndex === 0){
        match.startPlayerIndex = 1;
    }
    else{
        match.startPlayerIndex = 0;
    }
    match.currentPlayerIndex = match.startPlayerIndex;

    sockets.ws.forEach((ws) => {
        ws.send(
          JSON.stringify({
            type: "switch-turn",                     
           match,
          })
        );
      });


}
export function mapPlayer(match:Match, player:Player){
    match.players.map((p) => {
        if (p.id === player.id) {
          return player;
        }
        return p;
      });
}
export function updateScore(player: Player, points: number){
    player.scores.currentScore -= points;
    player.scores.roundScore += points;
}



export function endLeg(match:Match, player:Player, sockets: Sockets){
    player.scores.legsWon++;
    match.currentLeg++;
    
    if(player.scores.legsWon === match.settings.legCount){
        player.scores.setsWon++;
        match.currentSet++;
        endSet(match, player, sockets);
        resetPlayer(match, player, sockets);
        if(player.scores.setsWon === match.settings.setCount){
            endMatch(match, player, sockets);
        }
    }
    else{
        mapPlayer(match, player);
        resetPlayer(match, player, sockets);
    }
    
}
export function endSet(match: Match, player: Player, sockets: Sockets){
    
    
    match.players.forEach((p) => {
        p.scores.legsWon = 0;
    });
    mapPlayer(match, player);

}
export function endMatch(match: Match, player: Player, sockets: Sockets){
    
    
    
    sockets.ws.forEach((ws) => {
        ws.send(
          JSON.stringify({
            type: "match-finished",
            match,
            winner: player.username,
          })
        );
      });
    
}