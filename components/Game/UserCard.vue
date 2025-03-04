<template>

  <div
    class=" flex w-full flex-col items-center bg-secondary-300  justify-center bg-secondary border-2 p-4 rounded-xl shadow-xl "
    :class="match.currentPlayerIndex === getOriginalPlayerIndex(match, player) ? 'border-blue-500' : 'border-primary'">
    <div class="flex">
      <div class="flex flex-col items-center justify-end stat-column">
        <div class="stat-container">
          <p class="stat-label">Average</p>
          <p class="stat-value">{{ player.stats.average }}</p>
        </div>

        <div class="stat-container">
          <p class="stat-label">First9Avg</p>
          <p class="stat-value">{{ player.stats.first9Average }}</p>
        </div>
        <div class="stat-container">
          <p class="stat-label">Checkout</p>
          <p class="stat-value"> {{ player.stats.checkoutPercentage }}%</p>
        </div>
      </div>


      <div class="flex flex-col items-center justify-center">
        <GameProfile :User="player" />
        <div class="flex space-x-3">
          <p>Legs: {{ player.scores.legsWon }}</p>
          <p>Sets: {{ player.scores.setsWon }}</p>
        </div>
        <h1 class="text-8xl">{{ player.scores.currentScore }}</h1>

      </div>
      <div class=" w-16 h-auto max-h-80 overflow-hidden relative flex flex-col items-center justify-end ">
        <div class="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-secondary-300 to-transparent">
        </div>
        <div v-for="(score, index) in player.scores.legScores" :key="index">
          <h1 class="text-gray-300 text-xs text-nowrap ">Leg: {{ index }}</h1>
          <div v-for="(s, i) in score.roundScores" :key="i" class="text-xl">
            <p>{{s.scores.reduce((acc, val) => acc + val, 0)}}</p>
          </div>
        </div>

      </div>
    </div>

    <div class="flex w-full justify-center space-x-2 mt-4">
      <div v-for="dartNum in 3" :key="dartNum"
        class="w-24 h-20 p-1 border-2 border-primary rounded flex items-center justify-center">
        <div v-if="player.scores.dartScores[dartNum].multiplier" class="flex flex-col justify-center items-center">
          <div v-if="player.scores.dartScores[dartNum].value != 0" class="flex flex-col justify-center items-center">
            <p class="text-3xl">{{ (player.scores.dartScores[dartNum].value ?? 0) *
              player.scores.dartScores[dartNum].multiplier }}</p>
            <p class="text-sm text-gray-200" v-if="player.scores.dartScores[dartNum].multiplier === 1">
              S{{ player.scores.dartScores[dartNum].value }}</p>
            <p class="text-sm text-gray-200" v-if="player.scores.dartScores[dartNum].multiplier === 2">
              D{{ player.scores.dartScores[dartNum].value }}</p>
            <p class="text-sm text-gray-200" v-if="player.scores.dartScores[dartNum].multiplier === 3">
              T{{ player.scores.dartScores[dartNum].value }}</p>
          </div>
          <p v-else>Miss</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Player, Match } from '~/types/websocket';

const props = defineProps<{
  match: Match,
  player: Player

}>();

</script>

<style scoped>
.grid-container {
  direction: rtl;
}

.stat-label {
  @apply text-xs text-gray-500;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

/* New styles for fixed width stats */
.stat-column {
  width: 70px;
  min-width: 70px;
}

.stat-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
}

.stat-container:last-child {
  margin-bottom: 0;
}

.stat-value {
  width: 44px;
  min-width: 44px;
  text-align: right;
  font-weight: 500;
  padding-left: 4px;
}
</style>