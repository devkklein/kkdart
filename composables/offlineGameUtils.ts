import type { Match, Player } from '~/types/websocket';

export function updateScore(player: Player, points: number, match: Match, score: number, multiplier: number) {
  // Update darts count
  updateDartsCount(player, score, multiplier, match);
  
  // Update scores
  player.scores.currentScore -= points;
  player.scores.roundScore += points;
  player.stats.allPoints += points;
  
  // Save score in leg history
  player.scores.legScores[match.currentLeg].roundScores[match.currentRound].scores.push(points);
  
  // Update statistics
  handleMatchStats(player, match);
}

export function switchPlayers(match: Match) {
  const currentPlayer = match.players[match.currentPlayerIndex];
  const currentRound = match.currentRound;
  const currentLeg = match.currentLeg;
  
  // Track round score for statistics
  const roundScores = currentPlayer.scores.legScores[currentLeg]?.roundScores[currentRound]?.scores;
  if (roundScores && roundScores.length > 0) {
    const roundTotal = roundScores.reduce((sum, score) => sum + score, 0);
    
    // Track only once per round
    if (roundTotal > 0 && !currentPlayer.scores.trackedRounds?.[currentLeg]?.[currentRound]) {
      trackRoundScore(currentPlayer, roundTotal);
      
      // Mark this round as tracked
      if (!currentPlayer.scores.trackedRounds) {
        currentPlayer.scores.trackedRounds = {};
      }
      if (!currentPlayer.scores.trackedRounds[currentLeg]) {
        currentPlayer.scores.trackedRounds[currentLeg] = {};
      }
      currentPlayer.scores.trackedRounds[currentLeg][currentRound] = true;
    }
  }

  // Reset current player's throw count
  currentPlayer.scores.thrownDarts = 0;
  
  // Support games with more than 2 players
  if(match.currentPlayerIndex === match.players.length - 1){
    match.currentPlayerIndex = 0;
  } else {
    match.currentPlayerIndex++;
  }
  
  // Increment round if we've gone through all players
  if (match.currentPlayerIndex === match.startPlayerIndex) {
    match.currentRound++;
  }
  
  // Initialize next player's darts
  const nextPlayer = match.players[match.currentPlayerIndex];
  nextPlayer.scores.dartScores[1] = {};
  nextPlayer.scores.dartScores[2] = {};
  nextPlayer.scores.dartScores[3] = {};
  nextPlayer.scores.thrownDarts = 0;
  nextPlayer.scores.roundScore = 0;
  nextPlayer.scores.legScores[match.currentLeg].roundScores[match.currentRound] = {
    scores: []
  };
}

export function endLeg(match: Match, player: Player) {
  // Update stats for final round
  const currentRound = match.currentRound;
  const currentLeg = match.currentLeg;
  const roundScores = player.scores.legScores[currentLeg]?.roundScores[currentRound]?.scores;

  if (roundScores && roundScores.length > 0) {
    const roundTotal = roundScores.reduce((sum, score) => sum + score, 0);
    trackRoundScore(player, roundTotal);
  }

  // Update leg win count
  player.scores.legsWon++;
  match.currentLeg++;

  // Check if this leg win results in a set win
  if (player.scores.legsWon === match.settings.legCount) {
    player.scores.setsWon++;
    match.currentSet++;
    endSet(match, player);
    initializeLeg(match);
    
    // Check if match is finished
    if (player.scores.setsWon === match.settings.setCount) {
      match.finished = true;
      endMatch(match, player);
    }
  } else {
    initializeLeg(match);
  }
  
  // Makes sure any bot players get triggered on new leg
  nextTick();
}

export function endSet(match: Match, player: Player) {
  // Reset legs won for all players when a set ends
  match.players.forEach((p) => {
    p.scores.legsWon = 0;
  });
}

export function endMatch(match: Match, player: Player) {
  match.started = false;
  // In offline mode, we don't need to save to a server
}

export function initializeLeg(match: Match) {
  match.players.forEach((p) => {
    // Reset scores for new leg
    p.scores.currentScore = match.settings.baseScore;
    p.scores.roundScore = 0;
    p.scores.thrownDarts = 0;
    p.scores.dartScores[1] = {};
    p.scores.dartScores[2] = {};
    p.scores.dartScores[3] = {};
  });

  // Alternate starting player between legs
  if (match.startPlayerIndex === 0) {
    match.startPlayerIndex = 1;
  } else {
    match.startPlayerIndex = 0;
  }

  match.currentPlayerIndex = match.startPlayerIndex;
  match.currentRound = 1;

  // Initialize leg scores structure
  match.players.forEach((player) => {
    player.scores.legScores[match.currentLeg] = {
      roundScores: {
        [match.currentRound]: {
          scores: [],
        },
      },
    };

    // Initialize leg darts count
    if (!player.scores.legDartsCount) {
      player.scores.legDartsCount = {};
    }
    player.scores.legDartsCount[match.currentLeg] = 0;
  });
}

export function updateDartsCount(player: Player, score: number, multiplier: number, match: Match) {
  // Track darts thrown in this leg
  if (!player.scores.legDartsCount) {
    player.scores.legDartsCount = {};
  }
  if (!player.scores.legDartsCount[match.currentLeg]) {
    player.scores.legDartsCount[match.currentLeg] = 0;
  }
  player.scores.legDartsCount[match.currentLeg]++;

  // Track first 9 darts statistics
  const totalDartsInLeg = player.scores.legDartsCount[match.currentLeg];
  if (totalDartsInLeg <= 9) {
    if (!player.stats.first9Points) {
      player.stats.first9Points = 0;
    }
    player.stats.first9Points += score * multiplier;
    player.stats.first9DartsThrown++;
  }

  // Record the dart score
  player.scores.dartScores[player.scores.thrownDarts] = {
    value: score,
    multiplier,
    points: score * multiplier,
  };
}

export function trackRoundScore(player: Player, roundScore: number) {
  ensureStatsInitialized(player);
  
  // Track scores by tier
  if (roundScore === 180) {
    player.stats.score180 += 1;
  } else if (roundScore >= 140 && roundScore < 180) {
    player.stats.score140 += 1;
  } else if (roundScore >= 100 && roundScore < 140) {
    player.stats.score100 += 1;
  } else if (roundScore >= 60 && roundScore < 100) {
    player.stats.score60 += 1;
  }
}

export function trackCheckoutAttempt(player: Player, isSuccessful: boolean) {
  ensureStatsInitialized(player);

  player.stats.checkoutsAttemps++;
  if (isSuccessful) {
    player.stats.checkouts++;
  }

  // Update checkout percentage
  player.stats.checkoutPercentage =
    Math.round(
      (player.stats.checkouts / player.stats.checkoutsAttemps) * 100 * 10
    ) / 10;
}

export function handleMatchStats(player: Player, match: Match) {
  ensureStatsInitialized(player);

  // Calculate overall average
  const totalDartsThrown = getTotalDartsThrown(player);
  if (totalDartsThrown > 0) {
    // Calculate average with 1 decimal place
    player.stats.average =
      Math.round((player.stats.allPoints / totalDartsThrown) * 3 * 10) / 10;

    // First 9 Average
    if (player.stats.first9Points && player.stats.first9Points > 0) {
      player.stats.first9Average =
        Math.round(
          (player.stats.first9Points / player.stats.first9DartsThrown) * 3 * 10
        ) / 10;
    }
  }

  // Calculate checkout percentage
  if (player.stats.checkoutsAttemps > 0) {
    player.stats.checkoutPercentage =
      Math.round(
        (player.stats.checkouts / player.stats.checkoutsAttemps) * 100 * 10
      ) / 10;
  }
}

function getTotalDartsThrown(player: Player): number {
  if (!player.scores.legDartsCount) {
    return 0;
  }
  return Object.values(player.scores.legDartsCount).reduce(
    (sum, count) => sum + count,
    0
  );
}

function ensureStatsInitialized(player: Player) {
  if (!player.stats) {
    player.stats = {
      average: 0,
      first9Average: 0,
      first9Points: 0,
      first9DartsThrown: 0,
      checkoutPercentage: 0,
      checkouts: 0,
      checkoutsAttemps: 0,
      allPoints: 0,
      score180: 0,
      score140: 0,
      score100: 0,
      score60: 0,
    };
  }

  // Ensure all fields exist
  if (player.stats.score180 === undefined) player.stats.score180 = 0;
  if (player.stats.score140 === undefined) player.stats.score140 = 0;
  if (player.stats.score100 === undefined) player.stats.score100 = 0;
  if (player.stats.score60 === undefined) player.stats.score60 = 0;
  if (player.stats.first9Points === undefined) player.stats.first9Points = 0;
}


export const useOfflineGameUtils = () => {
  return ref()
}
