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
import { DartBot } from '~/service/bot';
import { watchEffect, nextTick } from 'vue';

const match = useState<Match>("offlineMatch");
const matchWinner = ref<string>("");
const botInstances = ref<Map<string, DartBot>>(new Map());

// Initialisiere Bot-Instanzen für jeden Bot-Spieler
onMounted(() => {
  if (match.value) {
    match.value.players.forEach(player => {
      if (player.isBot && player.botLevel) {
        botInstances.value.set(
          player.id,
          DartBot.createByLevel(player.botLevel)
        );
      }
    });
  }
});

// Überwache den aktuellen Spieler und löse Bot-Aktionen aus, wenn nötig
watchEffect(() => {
  if (match.value?.started && match.value?.bullOffFinished) {
    const currentPlayer = match.value.players[match.value.currentPlayerIndex];
    if (currentPlayer?.isBot) {
      // Kleine Verzögerung für bessere UX
      setTimeout(() => {
        handleBotTurn(currentPlayer);
      }, 1000);
    }
  }
});

// Bot-Bulloff-Logik
watchEffect(() => {
  if (match.value?.started && !match.value?.bullOffFinished) {
    const currentPlayer = match.value.players[match.value.currentPlayerIndex];
    if (currentPlayer?.isBot) {
      // Kleine Verzögerung für bessere UX
      setTimeout(() => {
        handleBotBulloff(currentPlayer);
      }, 1000);
    }
  }
});

// Funktion zum Ausführen eines Bot-Bulloffs
function handleBotBulloff(botPlayer: Player) {
  const bot = botInstances.value.get(botPlayer.id);
  if (bot) {
    const throw1 = bot.throwBullOff();
    bullOffScoring(throw1.value, throw1.multiplier, throw1.points);
  }
}

// Funktion zum Ausführen eines Bot-Zugs
async function handleBotTurn(botPlayer: Player) {
  const bot = botInstances.value.get(botPlayer.id);
  if (!bot) return;

  // Simuliere drei Würfe mit Verzögerungen dazwischen
  for (let i = 1; i <= 3; i++) {
    // Prüfe, ob wir noch im selben Zug sind (falls ein Leg beendet wurde)
    if (match.value.players[match.value.currentPlayerIndex].id !== botPlayer.id) {
      break;
    }

    const dartThrow = bot.throwX01Dart(
      botPlayer.scores.currentScore,
      botPlayer.scores.thrownDarts + 1
    );

    // Führe den Wurf aus
    await nextTick();
    score(dartThrow.value, dartThrow.multiplier, dartThrow.points);

    // Warte zwischen den Würfen
    if (i < 3 && botPlayer.scores.thrownDarts < 3) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
}

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
  if (currentPlayer.scores.thrownDarts === 3 || currentPlayer.isBot) {
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

  // Process the throw using X01 rules
  handleX01Match(currentPlayer, score, multiplier);
}

// Handle X01 dart throw
function handleX01Match(currentPlayer: Player, score: number, multiplier: number) {
  const points = score * multiplier;
  const newScore = currentPlayer.scores.currentScore - points;

  // Always store the actual dart that was thrown, regardless of outcome
  currentPlayer.scores.dartScores[currentPlayer.scores.thrownDarts] = {
    value: score,
    multiplier,
    points: score * multiplier
  };

  // Check if this dart is a potential checkout
  const isCheckoutAttempt = isCheckoutAttemptDart(
    currentPlayer.scores.currentScore,
    match.value.settings.outMode
  );

  if (newScore < 0) {
    // Bust - reset the round score
    currentPlayer.scores.currentScore = currentPlayer.scores.currentScore + currentPlayer.scores.roundScore;
    currentPlayer.scores.legScores[match.value.currentLeg].roundScores[match.value.currentRound] = {
      scores: []
    };

    if (currentPlayer.scores.thrownDarts < 3) {
      switchPlayers(match.value);
    }
  } else if (newScore === 1 && (match.value.settings.outMode === "Double" || match.value.settings.outMode === "Master")) {
    // Can't finish on 1 in double or master out mode
    // Add points to round score even though it will be reset
    currentPlayer.scores.roundScore += points;

    currentPlayer.scores.currentScore = currentPlayer.scores.currentScore + currentPlayer.scores.roundScore;
    currentPlayer.scores.legScores[match.value.currentLeg].roundScores[match.value.currentRound] = {
      scores: []
    };

    if (currentPlayer.scores.thrownDarts < 3) {
      switchPlayers(match.value);
    }
  } else if (newScore === 0) {
    // Potential checkout
    if (match.value.settings.outMode === "Double") {
      if (multiplier === 2) {
        // Valid double out
        trackCheckoutAttempt(currentPlayer, true);
        updateScore(currentPlayer, points, match.value, score, multiplier);
        endLeg(match.value, currentPlayer);
      } else {
        // Invalid checkout - must finish on a double
        currentPlayer.scores.currentScore = currentPlayer.scores.currentScore + currentPlayer.scores.roundScore;
        currentPlayer.scores.legScores[match.value.currentLeg].roundScores[match.value.currentRound] = {
          scores: []
        };

        if (currentPlayer.scores.thrownDarts < 3) {
          switchPlayers(match.value);
        }
      }
    } else if (match.value.settings.outMode === "Master") {
      if (multiplier === 2 || multiplier === 3) {
        // Valid master out (double or triple)
        trackCheckoutAttempt(currentPlayer, true);
        updateScore(currentPlayer, points, match.value, score, multiplier);
        endLeg(match.value, currentPlayer);
      }
    } else {
      // Single out - any checkout is valid
      trackCheckoutAttempt(currentPlayer, true);
      updateScore(currentPlayer, points, match.value, score, multiplier);
      endLeg(match.value, currentPlayer);
    }
  } else {
    // Normal score
    if (isCheckoutAttempt) {
      trackCheckoutAttempt(currentPlayer, false);
    }
    updateScore(currentPlayer, points, match.value, score, multiplier);

    if (currentPlayer.scores.thrownDarts === 3) {
      switchPlayers(match.value);
    }
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

// Trigger bot turn after a leg is initialized
watch(() => match.value?.currentLeg, (newLeg, oldLeg) => {
  if (newLeg !== oldLeg && match.value?.started && match.value?.bullOffFinished) {
    nextTick(() => {
      const currentPlayer = match.value.players[match.value.currentPlayerIndex];
      if (currentPlayer?.isBot) {
        // Small delay for UX
        setTimeout(() => {
          handleBotTurn(currentPlayer);
        }, 1000);
      }
    });
  }
});
</script>

<style></style>
