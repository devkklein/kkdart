<template>
  <div class="w-full">
    <div class="mb-4">
      <label class="block text-sm text-gray-300 mb-2">Bot difficulty (Level 1-10)</label>
      <div class="flex items-center space-x-3">
        <input type="range" v-model.number="internalLevel" min="1" max="10" step="1"
          class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
        <span class="text-lg font-medium w-12 text-center">{{ internalLevel }}</span>
      </div>
    </div>

    <div class="flex justify-between text-sm text-gray-400">
      <div class="text-center">
        <div class="w-6 h-6 mx-auto mb-1 flex items-center justify-center rounded-full" :class="difficultyColor">
          <Icon name="mdi:dart" class="text-white" size="14" />
        </div>
        <p>{{ difficultyLabel }}</p>
      </div>

      <div class="text-center">
        <div class="flex justify-center space-x-1 mb-1">

        </div>
        <p>{{ difficultyAverage }} Ø</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['update:modelValue']);

const internalLevel = ref(props.modelValue);

watch(internalLevel, (newVal) => {
  emit('update:modelValue', newVal);
});

watch(() => props.modelValue, (newVal) => {
  internalLevel.value = newVal;
});

// Definierte Bot-Level mit Namen und Average
const botLevels = [
  { level: 1, name: "Beginner", average: 25 },
  { level: 2, name: "Novice", average: 30 },
  { level: 3, name: "Hobbyist", average: 36 },
  { level: 4, name: "Amateur", average: 42 },
  { level: 5, name: "Club Player", average: 50 },
  { level: 6, name: "Advanced", average: 56 },
  { level: 7, name: "League Player", average: 62 },
  { level: 8, name: "Professional", average: 75 },
  { level: 9, name: "Master", average: 87 },
  { level: 10, name: "World Class", average: 100 }
];

const currentBotLevel = computed(() => {
  return botLevels.find(level => level.level === internalLevel.value) || botLevels[4]; // Default to level 5
});

const difficultyLabel = computed(() => {
  return currentBotLevel.value.name;
});

const difficultyAverage = computed(() => {
  return currentBotLevel.value.average;
});

const difficultyColor = computed(() => {
  if (internalLevel.value <= 2) return "bg-green-600";
  if (internalLevel.value <= 4) return "bg-blue-600";
  if (internalLevel.value <= 6) return "bg-yellow-600";
  if (internalLevel.value <= 8) return "bg-orange-600";
  return "bg-red-600";
});
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #3b82f6;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #3b82f6;
  cursor: pointer;
}

/* Sichtbare Markierungen für die 10 Stufen */
input[type="range"] {
  --tick-height: 8px;
  background: linear-gradient(to right,
      transparent 0%, transparent 5%, #4c5563 5%, #4c5563 6%,
      transparent 6%, transparent 15%, #4c5563 15%, #4c5563 16%,
      transparent 16%, transparent 25%, #4c5563 25%, #4c5563 26%,
      transparent 26%, transparent 35%, #4c5563 35%, #4c5563 36%,
      transparent 36%, transparent 45%, #4c5563 45%, #4c5563 46%,
      transparent 46%, transparent 55%, #4c5563 55%, #4c5563 56%,
      transparent 56%, transparent 65%, #4c5563 65%, #4c5563 66%,
      transparent 66%, transparent 75%, #4c5563 75%, #4c5563 76%,
      transparent 76%, transparent 85%, #4c5563 85%, #4c5563 86%,
      transparent 86%, transparent 95%, #4c5563 95%, #4c5563 96%,
      transparent 96%, transparent 100%);
  background-repeat: no-repeat;
  background-size: 100% var(--tick-height);
  background-position: bottom;
}
</style>