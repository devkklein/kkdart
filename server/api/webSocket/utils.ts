import type { Player, Match, Sockets, } from '~/types/websocket';

export function resetPlayerDartScores(players: Player[]) {
  players.forEach((player) => {
    player.scores.thrownDarts = 0;
    player.scores.dartScores[1] = {};
    player.scores.dartScores[2] = {};
    player.scores.dartScores[3] = {};
   
    player.scores.roundScore = 0;

  });
}


export function switchplayers(match: Match, sockets: Sockets, currentPlayer: Player) {
  currentPlayer.scores.thrownDarts = 0;
  match.currentPlayerIndex = (match.currentPlayerIndex + 1) % 2;
  if (match.currentPlayerIndex === match.startPlayerIndex) {
    match.currentRound++;
    
  }

  const nextPlayer = match.players[match.currentPlayerIndex];
  nextPlayer.scores.dartScores[1] = {};
  nextPlayer.scores.dartScores[2] = {};
  nextPlayer.scores.dartScores[3] = {};
  nextPlayer.scores.thrownDarts = 0;
  nextPlayer.scores.roundScore = 0;
  nextPlayer.scores.legScores[match.currentLeg].roundScores[match.currentRound] = {
    scores: [],
  };

  updateMatch(match,  sockets);
}
export function updateMatch(match: Match,  sockets: Sockets) {

 

  sockets.ws.forEach((ws) => {
    ws.send(
      JSON.stringify({
        type: "switch-turn",
        match,
      })
    );
  });


}
export function mapPlayer(match: Match, player: Player) {
  match.players.map((p) => {
    if (p.id === player.id) {
      return player;
    }
    return p;
  });
}
export function updateScore(player: Player, points: number, match: Match) {
  player.scores.currentScore -= points;
  player.scores.roundScore += points;

  player.scores.legScores[match.currentLeg].roundScores[match.currentRound].scores.push(points);


}

export function initializeLeg(match: Match) {
  match.players.forEach((p) => {
    p.scores.currentScore = match.settings.baseScore;
    p.scores.roundScore = 0;
    p.scores.thrownDarts = 0;
    p.scores.dartScores[1] = {};
    p.scores.dartScores[2] = {};
    p.scores.dartScores[3] = {};
  });
  if (match.startPlayerIndex === 0) {
    match.startPlayerIndex = 1;
  }
  else {
    match.startPlayerIndex = 0;
  }
  match.currentPlayerIndex = match.startPlayerIndex;
  match.currentRound = 1;
  match.players.forEach((player) => {
    player.scores.legScores[match.currentLeg] = {
      roundScores: {
        [match.currentRound]: {
          scores: [],
        },
      },
    };
  });
}




export function endLeg(match: Match, player: Player, sockets: Sockets) {
  player.scores.legsWon++;
  match.currentLeg++;

  if (player.scores.legsWon === match.settings.legCount) {
    player.scores.setsWon++;
    match.currentSet++;
    endSet(match, player, sockets);
    initializeLeg(match);
    updateMatch(match,  sockets);
    if (player.scores.setsWon === match.settings.setCount) {
      endMatch(match, player, sockets);
    }
  }
  else {
    
    mapPlayer(match, player);
    initializeLeg(match);
    updateMatch(match,  sockets);
  }

}
export function endSet(match: Match, player: Player, sockets: Sockets) {


  match.players.forEach((p) => {
    p.scores.legsWon = 0;
  });
  mapPlayer(match, player);

}
export function endMatch(match: Match, player: Player, sockets: Sockets) {



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