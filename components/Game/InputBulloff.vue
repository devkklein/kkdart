<template>
  <div>
    <div class="flex flex-col items-center justify-center space-y-4">
      <h1>Normal Bull Off</h1>
      <div class="flex space-x-4">
        <button
          @click="bullOffScoring(0, 1, 0)"
          class="p-4 rounded-xl shadow-xl"
        >
          00
        </button>
        <button
          @click="bullOffScoring(25, 1, 25)"
          class="p-4 rounded-xl bg-green-500 shadow-xl"
        >
          25
        </button>
        <button
          @click="bullOffScoring(25, 2, 50)"
          class="p-4 rounded-xl bg-red-500 shadow-xl"
        >
          50
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["bullOffScoring"]);

function bullOffScoring(score: number, player: number, totalScore: number) {
  emit("bullOffScoring", score, player, totalScore);
}
</script>

<style></style>
