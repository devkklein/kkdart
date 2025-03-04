<template>
  <div
    class="w-full bg-secondary-300 border-2 border-primary flex space-x-10 text-sm justify-center rounded-xl py-1 shadow-xl px-3">
    <div class="flex justify-center items-center space-x-2">
      <Icon name="material-symbols:login-rounded" class="w-4 h-4 mr-2 text-blue-400" />
      <p> {{ match.settings.inMode }}</p>
    </div>
    <div class="flex justify-center items-center space-x-2">
      <Icon name="material-symbols:logout-rounded" class="w-4 h-4 mr-2 text-green-400 scale-x-[-1]" />
      <p> {{ match.settings.outMode }}</p>
    </div>

    <div class="flex justify-center items-center space-x-2">
      <Icon name="heroicons:chart-bar" class="w-4 h-4 mr-2 text-yellow-400" />
      <p>{{ match.settings.baseScore }}</p>
    </div>
    <div class="flex justify-center items-center space-x-2">
      <Icon name="heroicons:clock" class="w-4 h-4 mr-2 text-red-400" />
      <p>{{ match.settings.maxRounds }}</p>
    </div>
    <div class="flex justify-center items-center space-x-2">
      <Icon name="game-icons:bullseye" class="w-4 h-4 mr-2 text-purple-400" />
      <p>{{ match.settings.bullOff }}</p>
    </div>
    <div class="flex justify-center items-center space-x-2">
      <Icon name="ci:line-l" class="w-4 h-4 mr-2 text-teal-400" />
      <p> {{ match.settings.legCount }}</p>
    </div>
    <div class="flex justify-center items-center space-x-2">
      <Icon name="material-symbols:check-rounded" class="w-4 h-4 mr-2 text-pink-400" />
      <p> {{ match.settings.setCount }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Match } from '~/types/websocket';

const props = defineProps<{
  match: Match
}>();
</script>

<style></style>