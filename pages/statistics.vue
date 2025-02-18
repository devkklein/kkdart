<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="h-full w-full flex justify-center items-center">
      <div
        class="bg-primary p-4 rounded-xl shadow-xl flex justify-start flex-col space-y-4"
      >
        <SidebarProfile />
        <div>
          <h1 class="text-xl font-bold">Statistics</h1>
          <p class="text-sm text-gray-300">Your personal statistics</p>
          <p class="border-b-2 border-gray-300"></p>
        </div>
        <div>
          <h2 class="text-lg font-semibold">Matches</h2>
          <div class="grid grid-cols-4 gap-4">
            <div class="">
              <p class="text-sm text-gray-300">matches Played</p>
              <p class="text-lg font-semibold">{{ matches_played }}</p>
            </div>
            <div class="">
              <p class="text-sm text-gray-300">matches Won</p>
              <p class="text-lg font-semibold">{{ matches_won }}</p>
            </div>
            <div class="">
              <p class="text-sm text-gray-300">matches Lost</p>
              <p class="text-lg font-semibold">{{ matches_lost }}</p>
            </div>
            <div class="">
              <p class="text-sm text-gray-300">Winrate</p>
              <p class="text-lg font-semibold">{{ winrate }}%</p>
            </div>
          </div>
        </div>
        <p class="border-b-2 border-gray-300"></p>
        <div>
          <h2 class="text-lg font-semibold">General</h2>
          <div class="grid grid-cols-4 gap-4">
            <div class="">
              <p class="text-sm text-gray-300">Average</p>
              <p class="text-lg font-semibold">{{ average }}</p>
            </div>
            <div class="">
              <p class="text-sm text-gray-300">First 9 AVG</p>
              <p class="text-lg font-semibold">{{ first9avg }}</p>
            </div>
            <div class="">
              <p class="text-sm text-gray-300">Checkout %</p>
              <p class="text-lg font-semibold">{{ checkout }}%</p>
            </div>
          </div>
        </div>
        <p class="border-b-2 border-gray-300"></p>
        <div>
          <h2 class="text-lg font-semibold">Score</h2>
          <div class="grid grid-cols-4 gap-4">
            <div class="">
              <p class="text-sm text-gray-300">60+</p>
              <p class="text-lg font-semibold">{{ score_60 }}</p>
            </div>
            <div class="">
              <p class="text-sm text-gray-300">100+</p>
              <p class="text-lg font-semibold">{{ score_100 }}</p>
            </div>
            <div class="">
              <p class="text-sm text-gray-300">140+</p>
              <p class="text-lg font-semibold">{{ score_140 }}</p>
            </div>
            <div class="">
              <p class="text-sm text-gray-300">180+</p>
              <p class="text-lg font-semibold">{{ score_180 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStatsStore } from "~/store/stats";

const store = useStatsStore();
const matches_played = ref<number>(0);
const matches_won = ref<number>(0);
const matches_lost = ref<number>(0);
const winrate = ref<number>(0.0);
const average = ref<number>(0.0);
const first9avg = ref<number>(0.0);
const checkout = ref<number>(0.0);
const score_60 = ref<number>(0);
const score_100 = ref<number>(0);
const score_140 = ref<number>(0);
const score_180 = ref<number>(0);

onMounted(() => {
  matches_played.value = store.matches_played;
  matches_won.value = store.matches_won;
  matches_lost.value = store.matches_lost;
  winrate.value = store.winrate;
  average.value = store.average;
  first9avg.value = store.first9avg;
  checkout.value = store.checkout;
  score_60.value = store.score_60;
  score_100.value = store.score_100;
  score_140.value = store.score_140;
  score_180.value = store.score_180;
});
</script>

<style></style>
