<template>
  <div class="flex space-x-4">
    <div
      class="bg-green-500 rounded-lg shadow-lg flex flex-wrap justify-center w-full"
    >
      <div
        class="flex justify-center items-center w-1/5"
        v-for="n in 20"
        :key="n"
      >
        <button type="button" class="w-full p-4" @click="sendScore(n)">
          {{ n }}
        </button>
      </div>
    </div>
    <div
      class="bg-green-500 rounded-lg shadow-lg flex flex-wrap justify-center w-full"
    >
      <div
        class="flex justify-center text-center w-1/5"
        v-for="n in 20"
        :key="n"
      >
        <button type="button" class="w-full p-4" @click="sendScore(n)">
          {{ 2 * n }}
        </button>
      </div>
    </div>
    <div
      class="bg-green-500 rounded-lg shadow-lg flex flex-wrap justify-center w-full"
    >
      <div class="flex justify-center w-1/5" v-for="n in 20" :key="n">
        <button type="button" class="w-full p-4" @click="sendScore(n)">
          {{ 3 * n }}
        </button>
      </div>
    </div>
    <div class="bg-green-500 rounded-lg shadow-lg justify-center">
      <div class="flex flex-col">
        <button type="button" class="p-4" @click="sendScore(25)">
          {{ 25 }}
        </button>
        <button type="button" class="p-4" @click="sendScore(25)">
          {{ 50 }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["score"]);
const score = ref(0);

const sendScore = (score: number) => {
  emit("score", score);
};
</script>

<style></style>
