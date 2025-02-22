<template>
  <div class="flex flex-col space-x-4 bg-pr">
    
    <div class="flex justify-center ">
      <div class="w-1/2 flex flex-col p-2 rounded-lg bg-primary shadow-lg">
        <div class="flex justify-center space-x-4 ">
      <button type="button" @click="selectType('single')" :class="{ 'bg-green-500': selectedType === 'single' }">Single</button>
      <button type="button" @click="selectType('double')" :class="{ 'bg-green-500': selectedType === 'double' }">Double</button>
      <button type="button" @click="selectType('triple')" :class="{ 'bg-green-500': selectedType === 'triple' }">Triple</button>
      </div>
      <div class="flex">
        <div v-if="selectedType === 'single'" class=" flex flex-wrap justify-center">
          <div class="flex justify-center items-center w-1/5" v-for="n in 20" :key="n">
            <button type="button" class="w-full p-4 button-size" @click="sendScore(n, 1)">
              {{ n }}
            </button>
          </div>
        </div>
        <div v-if="selectedType === 'double'" class=" flex flex-wrap justify-center">
          <div class="flex justify-center text-center w-1/5" v-for="n in 20" :key="n">
            <button type="button" class="w-full p-4 button-size" @click="sendScore(n , 2)">
              {{ 2 * n }}
            </button>
          </div>
        </div>
        <div v-if="selectedType === 'triple'" class=" flex flex-wrap justify-center">
          <div class="flex justify-center w-1/5" v-for="n in 20" :key="n">
            <button type="button" class="w-full p-4 button-size" @click="sendScore(n, 3)">
              {{ 3 * n }}
            </button>
          </div>
        </div>
        <div class=" justify-center">
          <div class="flex flex-col">
            <button type="button" class="p-4 button-size" @click="sendScore(25,1)">
              {{ 25 }}
            </button>
            <button type="button" class="p-4 button-size" @click="sendScore(25, 2)">
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
import type { DartScore } from '~/types/interface';

const emit = defineEmits(["score"]);
const selectedType = ref("single");
const score = ref<DartScore>({
  value: 0,
  multiplier: 1,
});

function selectType(type: string) {
  selectedType.value = type;
}

const sendScore = (score: number, mutiplier: number) => {
  emit("score", score, mutiplier);
};
</script>

<style scoped>
.button-size {
  @apply w-14 h-14
}
</style>
