import type { Player, Match, Sockets, } from '~/types/websocket';
import { handleMatchStats ,trackRoundScore} from './index';

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
  const currentRound = match.currentRound;
  const currentLeg = match.currentLeg;
  
  // Zugriff auf die Scores der aktuellen Runde
  const roundScores = currentPlayer.scores.legScores[currentLeg]?.roundScores[currentRound]?.scores;
  
  // Tracke den Rundenscore für die Statistik
  if (roundScores && roundScores.length > 0) {
    const roundTotal = roundScores.reduce((sum, score) => sum + score, 0);
    
    // Nur tracken, wenn tatsächlich Punkte erzielt wurden (vermeidet Mehrfachtracking)
    if (roundTotal > 0 && !currentPlayer.scores.trackedRounds?.[currentLeg]?.[currentRound]) {
      trackRoundScore(currentPlayer, roundTotal);
      
      // Markiere diese Runde als getrackt
      if (!currentPlayer.scores.trackedRounds) {
        currentPlayer.scores.trackedRounds = {};
      }
      if (!currentPlayer.scores.trackedRounds[currentLeg]) {
        currentPlayer.scores.trackedRounds[currentLeg] = {};
      }
      currentPlayer.scores.trackedRounds[currentLeg][currentRound] = true;
    }
  }
  
  // WICHTIG: Da wir die Darts bereits einzeln zählen, 
  // kommentieren wir diese Zeilen aus, um doppelte Zählung zu vermeiden
  // if (currentPlayer.scores.thrownDarts > 0) {
  //   currentPlayer.scores.legDartsCount[match.currentLeg] += currentPlayer.scores.thrownDarts;
  // }
  
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

  updateMatch(match, sockets);
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
  player.stats.allPoints += points;
  player.scores.legScores[match.currentLeg].roundScores[match.currentRound].scores.push(points);
  handleMatchStats( player, match);

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
    
    // Initialisiere legDartsCount für das neue Leg
    if (!player.scores.legDartsCount) {
      player.scores.legDartsCount = {};
    }
    player.scores.legDartsCount[match.currentLeg] = 0;
    
    // First9Points werden für jedes neue Leg nicht zurückgesetzt,
    // da sie für die Gesamtstatistik des Spielers relevant sind
  });
}

export function endLeg(match: Match, player: Player, sockets: Sockets) {
  // Add this debug log at the beginning of the function


  const currentRound = match.currentRound;
  const currentLeg = match.currentLeg;
  const roundScores = player.scores.legScores[currentLeg]?.roundScores[currentRound]?.scores;
  
  if (roundScores && roundScores.length > 0) {
    const roundTotal = roundScores.reduce((sum, score) => sum + score, 0);
    trackRoundScore(player, roundTotal);
  }


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