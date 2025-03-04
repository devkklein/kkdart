<template>
  <div class="flex flex-col space-x-4 bg-pr">
    <div class="flex justify-center">
      <div
        class="w-full flex flex-col p-2 rounded-lg bg-secondary-300 border-2 border-primary shadow-lg"
      >
        <div class="flex justify-center space-x-4">
          <button
            type="button"
            @click="selectType('single')"
            :class="{ 'bg-blue-500': selectedType === 'single' }"
          >
            Single
          </button>
          <button
            type="button"
            @click="selectType('double')"
            :class="{ 'bg-blue-500': selectedType === 'double' }"
          >
            Double
          </button>
          <button
            type="button"
            @click="selectType('triple')"
            :class="{ 'bg-blue-500': selectedType === 'triple' }"
          >
            Triple
          </button>
        </div>
        <div class="flex">
          <div
            v-if="selectedType === 'single'"
            class="flex flex-wrap justify-center"
          >
            <div
              class="flex justify-center items-center w-1/5"
              v-for="n in 20"
              :key="n"
            >
              <button
                type="button"
                class="w-full p-4 button-size"
                @click="sendScore(n, 1, n)"
              >
                {{ n }}
              </button>
            </div>
          </div>
          <div
            v-if="selectedType === 'double'"
            class="flex flex-wrap justify-center"
          >
            <div
              class="flex justify-center text-center w-1/5"
              v-for="n in 20"
              :key="n"
            >
              <button
                type="button"
                class="w-full p-4 button-size"
                @click="sendScore(n, 2, n * 2)"
              >
                {{ n }}
              </button>
            </div>
          </div>
          <div
            v-if="selectedType === 'triple'"
            class="flex flex-wrap justify-center"
          >
            <div class="flex justify-center w-1/5" v-for="n in 20" :key="n">
              <button
                type="button"
                class="w-full p-4 button-size"
                @click="sendScore(n, 3, n * 3)"
              >
                {{ n }}
              </button>
            </div>
          </div>
          <div class="justify-center">
            <div class="flex flex-col">
              <button
                type="button"
                class="p-4 button-size"
                @click="sendScore(0, 1, 0)"
              >
                miss
              </button>
              <button
                type="button"
                class="p-4 button-size"
                @click="sendScore(25, 1, 25)"
              >
                {{ 25 }}
              </button>
              <button
                type="button"
                class="p-4 button-size"
                @click="sendScore(25, 2, 25 * 2)"
              >
                {{ 50 }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DartScore } from "~/types/websocket";

const emit = defineEmits(["score"]);
const selectedType = ref("single");

function selectType(type: string) {
  selectedType.value = type;
}

const sendScore = (score: number, mutiplier: number, points: number) => {
  emit("score", score, mutiplier, points);
};
</script>

<style scoped>
.button-size {
  @apply bg-secondary-300 hover:bg-primary;
}
</style>
