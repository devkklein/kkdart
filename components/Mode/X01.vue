<template>
  <div
    class="p-6 bg-secondary-300 rounded-xl shadow-lg backdrop-blur-sm backdrop-filter relative overflow-hidden border-2 border-primary">
    <!-- Background decorative elements -->

    <div class="flex flex-col md:flex-row gap-8 relative z-10">
      <!-- In/Out Mode Section -->
      <div class="flex flex-col flex-1 space-y-4">
        <div class="space-y-2">
          <label class="text-sm text-gray-300 uppercase tracking-wider font-medium flex items-center">
            <Icon name="material-symbols:login-rounded" class="w-4 h-4 mr-2 text-blue-400" />
            In Mode
          </label>
          <div class="custom-select-wrapper">
            <select v-model="inMode"
              class="w-full rounded-lg p-3 bg-primary bg-opacity-60 border-2 border-primary hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none custom-select">
              <option value="Singel">Singel</option>
              <option value="Double">Double</option>
              <option value="Master">Master</option>
            </select>
            <div class="custom-select-arrow"></div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm text-gray-300 uppercase tracking-wider font-medium flex items-center">
            <Icon name="material-symbols:logout-rounded" class="w-4 h-4 mr-2 text-green-400 scale-x-[-1]" />
            Out Mode
          </label>
          <div class="custom-select-wrapper">
            <select v-model="outMode"
              class="w-full rounded-lg p-3 bg-primary bg-opacity-60 border-2 border-primary hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none custom-select">
              <option value="Singel">Singel</option>
              <option value="Double">Double</option>
              <option value="Master">Master</option>
            </select>
            <div class="custom-select-arrow"></div>
          </div>
        </div>
      </div>

      <!-- Game Settings Section -->
      <div class="flex flex-col md:flex-row flex-1 gap-6">
        <div class="flex flex-col space-y-4 flex-1">
          <div class="space-y-2">
            <label class="text-sm text-gray-300 uppercase tracking-wider font-medium flex items-center">
              <Icon name="heroicons:chart-bar" class="w-4 h-4 mr-2 text-yellow-400" />
              Base Score
            </label>
            <div class="custom-select-wrapper">
              <select v-model="baseScore"
                class="w-full rounded-lg p-3 bg-primary bg-opacity-60 border-2 border-primary hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none custom-select">
                <option value="121">121</option>
                <option value="170">170</option>
                <option value="301">301</option>
                <option value="501">501</option>
                <option value="701">701</option>
                <option value="901">901</option>
                <option value="1001">1001</option>
              </select>
              <div class="custom-select-arrow"></div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-300 uppercase tracking-wider font-medium flex items-center">
              <Icon name="heroicons:clock" class="w-4 h-4 mr-2 text-red-400" />
              Max Rounds
            </label>
            <div class="custom-select-wrapper">
              <select v-model="maxRounds"
                class="w-full rounded-lg p-3 bg-primary bg-opacity-60 border-2 border-primary hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none custom-select">
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="80">80</option>
                <option value="100">100</option>
              </select>
              <div class="custom-select-arrow"></div>
            </div>
          </div>
        </div>

        <div class="flex flex-col space-y-4 flex-1">
          <div class="space-y-2">
            <label class="text-sm text-gray-300 uppercase tracking-wider font-medium flex items-center">
              <Icon name="game-icons:bullseye" class="w-4 h-4 mr-2 text-purple-400" />
              Bull-Off
            </label>
            <div class="custom-select-wrapper">
              <select v-model="bullOff"
                class="w-full rounded-lg p-3 bg-primary bg-opacity-60 border-2 border-primary hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none custom-select">
                <option value="Off">Off</option>
                <option value="Normal">Normal</option>
                <option value="Offical">Offical</option>
              </select>
              <div class="custom-select-arrow"></div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm text-gray-300 uppercase tracking-wider font-medium flex items-center">
              <Icon name="heroicons:user-group" class="w-4 h-4 mr-2 text-indigo-400" />
              Lobby
            </label>
            <div v-if="props.public" class="custom-select-wrapper">
              <select v-model="lobbyMode"
                class="w-full rounded-lg p-3 bg-primary bg-opacity-60 border-2 border-primary hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none custom-select">
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <div class="custom-select-arrow"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legs/Sets Section -->
      <div class="flex flex-col flex-1">
        <div class="">
          <div class="flex justify-between items-center">
            <label class="text-sm text-gray-300 uppercase tracking-wider font-medium flex items-center">
              <Icon name="ci:line-l" class="w-4 h-4 mr-2 text-teal-400" />
              Legs
            </label>
            <span class="text-lg font-bold bg-primary/60 border-2 border-primary px-3 py-1 rounded-md shadow-inner">{{
              countLegs }}</span>
          </div>
          <div class="slider-container">
            <input type="range" v-model="countLegs" min="1" max="10" class="custom-range" />
          </div>
        </div>

        <div class="">
          <div class="flex justify-between items-center">
            <label class="text-sm text-gray-300 uppercase tracking-wider font-medium flex items-center">
              <Icon name="material-symbols:check-rounded" class="w-4 h-4 mr-2 text-pink-400" />
              Sets
            </label>
            <span class="text-lg font-bold bg-primary/60 border-2 border-primary px-3 py-1 rounded-md shadow-inner">{{
              countSets }}</span>
          </div>
          <div class="slider-container">
            <input type="range" v-model="countSets" min="1" max="10" class="custom-range" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  public: boolean;
}>();

const emit = defineEmits();

const countLegs = ref<number>(3);
const countSets = ref<number>(1);

const inMode = ref<string>("Singel");
const outMode = ref<string>("Double");
const baseScore = ref<number>(501);
const maxRounds = ref<number>(50);
const bullOff = ref<string>("Normal");
const lobbyMode = ref<string>("Public");

watch(
  [
    inMode,
    outMode,
    baseScore,
    maxRounds,
    bullOff,
    lobbyMode,
    countLegs,
    countSets,
  ],
  () => {
    emit("sendMatchdata", {
      baseScore: baseScore.value,
      inMode: inMode.value,
      outMode: outMode.value,
      legCount: Number(countLegs.value),
      setCount: Number(countSets.value),
      lobbyMode: lobbyMode.value,
      bullOff: bullOff.value,
      maxRounds: maxRounds.value,
    });
  }
);

function setInMode(mode: string) {
  inMode.value = mode;
}

onMounted(() => {
  emit("sendMatchdata", {
    baseScore: baseScore.value,
    inMode: inMode.value,
    outMode: outMode.value,
    legCount: countLegs.value,
    setCount: countSets.value,
    lobbyMode: lobbyMode.value,
    bullOff: bullOff.value,
    maxRounds: maxRounds.value,
  });
});
</script>

<style scoped>
/* Custom select styling */
.custom-select-wrapper {
  position: relative;
}

.custom-select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(156, 163, 175, 0.8);
  pointer-events: none;
}

.custom-select:hover+.custom-select-arrow {
  border-top-color: rgba(96, 165, 250, 0.8);
}

/* Custom range slider styling */
.slider-container {
  position: relative;
  padding: 10px 4px;
}

.custom-range {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 4px;
  background: rgba(25, 42, 86, 0.5);
  outline: none;
}

.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.custom-range::-webkit-slider-thumb:hover {
  background: #dbeafe;
  transform: scale(1.1);
}

.custom-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.custom-range::-moz-range-thumb:hover {
  background: #dbeafe;
  transform: scale(1.1);
}
</style>
