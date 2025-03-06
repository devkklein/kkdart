<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="h-full w-full overflow-y-auto">

      <GameMatchSummary v-if="match?.finished && match" :match="match" />

      <div v-if="match?.started && match" class="w-full p-4">
        <GameMatchSettings :match="match" />
        <div class="flex flex-col justify-end">
          <div class="flex">
            <div class="flex w-8/12 flex-col">
              <div class="grid grid-flow-col py-4 space-x-5">
                <div v-for="(player, playerIndex) in match.players" :key="playerIndex">
                  <GameUserCard :player="player" :match="match" />
                </div>
              </div>

              <GameInputButtons v-if="match.bullOffFinished" @score="score" />
              <GameInputBulloff v-if="!match.bullOffFinished" @bullOffScoring="bullOffScoring" />
            </div>
            <div class="w-8/12 flex py-4 pl-4 pr-0 rounded-xl">
              <div class="flex flex-col w-full">
                <GameScoreChart :player="match.players[getPlayerIndex(match)]" />
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Match, Player } from '~/types/websocket';

import { watchEffect, nextTick } from 'vue';

const match = useState<Match>("offlineMatch");
const matchWinner = ref<string>("");





// Function to get the current player index for score chart display
function getPlayerIndex(match: Match) {
  return match.currentPlayerIndex;
}

// Handle bull-off scoring (entsprechend modifizieren)
function bullOffScoring(score: number, multiplier: number, points: number) {
  const currentPlayer = match.value.players[match.value.currentPlayerIndex];

  // Update player's dart scores
  currentPlayer.scores.thrownDarts++;
  currentPlayer.scores.dartScores[currentPlayer.scores.thrownDarts] = {
    value: score,
    multiplier,
    points: score * multiplier
  };

  // Check if bull-off should be completed
  if (currentPlayer.scores.thrownDarts === 3) {
    // Bei Bots immer nach dem ersten Wurf wechseln
    const nextPlayerIndex = match.value.currentPlayerIndex === match.value.players.length - 1
      ? 0
      : match.value.currentPlayerIndex + 1;

    if (nextPlayerIndex !== 0) {
      // Noch nicht alle Spieler waren dran
      match.value.currentPlayerIndex = nextPlayerIndex;
    } else {
      // Alle Spieler haben geworfen, bestimme Gewinner
      determineBullOffWinner();
    }
  }
}

// Separate the winner determination logic
function determineBullOffWinner() {
  // Find the player with highest bull score
  let highestScore = -1;
  let winnerIndex = 0;

  match.value.players.forEach((player, index) => {
    const playerScore =
      (player.scores.dartScores[1]?.points || 0) +
      (player.scores.dartScores[2]?.points || 0) +
      (player.scores.dartScores[3]?.points || 0);

    if (playerScore > highestScore) {
      highestScore = playerScore;
      winnerIndex = index;
    }
  });

  // Set the winner
  match.value.currentPlayerIndex = winnerIndex;
  match.value.bullOffFinished = true;
  match.value.startPlayerIndex = winnerIndex;
  resetPlayerDartScores(match.value.players);
}

// Handle dart score
function score(score: number, multiplier: number, points: number) {
  const currentPlayer = match.value.players[match.value.currentPlayerIndex];

  // Update player's dart count
  currentPlayer.scores.thrownDarts++;

  currentPlayer.scores.dartScores[currentPlayer.scores.thrownDarts] = {
    value: score,
    multiplier,
    points
  };
  handleX01Game(match.value, currentPlayer, score, multiplier, points)

  if (currentPlayer.scores.thrownDarts === 3) {
    switchPlayers(match.value) // Process the throw using X01 rules
  }
  // Process the throw using X01 rules
}

function handleX01Game(match: Match, player: Player, score: number, multiplayer: number, points: number) {
  const currentScore = player.scores.currentScore;
  const newScore = currentScore - points;
  const currentLeg = match.currentLeg
  const currentRound = match.currentRound


  if (newScore < 0) {
    resetBustedRound(player)
    if (isCheckoutAttemptDart(newScore, match.settings.outMode)) {
      trackCheckoutAttempt(player, false)
    }
    if (player.scores.thrownDarts < 3) {
      switchPlayers(match)
    }

  }
  else if (newScore === 1 && match.settings.outMode === "Double" || match.settings.outMode === "Master") {
    resetBustedRound(player)
    if (isCheckoutAttemptDart(newScore, match.settings.outMode)) {
      trackCheckoutAttempt(player, false)
    }
    if (player.scores.thrownDarts < 3) {
      switchPlayers(match)
    }

  }
  else if (newScore === 0) {
    if (isValidCheckout(match.settings.outMode, multiplayer)) {
      trackCheckoutAttempt(player, true)
      updateScore(player, score, match, multiplayer, points)
      endLeg(match, player)
    }


  }
  else {
    if (isCheckoutAttemptDart(newScore, match.settings.outMode)) {
      trackCheckoutAttempt(player, false)
    }


    updateScore(player, points, match, score, multiplayer)
  }



}
function resetBustedRound(player: Player): void {
  // Aktuellen Rundenwert zurücksetzen
  player.scores.currentScore = player.scores.currentScore + player.scores.roundScore;
  player.scores.roundScore = 0;

  // Rundenscore im Leg zurücksetzen
  const currentLeg = match.value.currentLeg;
  const currentRound = match.value.currentRound;
  player.scores.legScores[currentLeg].roundScores[currentRound] = { scores: [] };
}
function isValidCheckout(outMode: string, multiplier: number): boolean {
  switch (outMode) {
    case "Single":
      return true; // Jeder Multiplikator erlaubt
    case "Double":
      return multiplier === 2; // Nur Double erlaubt
    case "Master":
      return multiplier === 2 || multiplier === 3; // Double oder Triple erlaubt
    default:
      return true;
  }
}





// Helper functions
function resetPlayerDartScores(players: Player[]) {
  players.forEach(player => {
    player.scores.thrownDarts = 0;
    player.scores.dartScores[1] = {};
    player.scores.dartScores[2] = {};
    player.scores.dartScores[3] = {};
    player.scores.roundScore = 0;
  });
}

function isCheckoutAttemptDart(currentScore: number, outMode: string): boolean {
  if (outMode === "Single") {
    return currentScore <= 40;
  } else if (outMode === "Double") {
    return currentScore <= 40 && (currentScore % 2 === 0 || currentScore === 50);
  } else if (outMode === "Master") {
    return currentScore <= 60;
  }
  return false;
}


</script>

<style></style>
