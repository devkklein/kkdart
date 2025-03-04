<template>
  <div
    class="h-full w-full flex flex-col items-center justify-center overflow-auto"
  >
    <div class="w-full max-w-6xl p-4 flex flex-col items-center">
      <!-- Header area with smaller margins -->
      <div v-if="players.length < 2" class="text-center mb-4">
        <img
          src="/public/dartboard_small.png"
          alt="Waiting..."
          class="h-20 w-20 animate-spin-slow mb-2 mx-auto"
        />
        <h2 class="text-3xl font-semibold text-white">Waiting for Opponent</h2>
        <p class="text-sm text-neutral-400">
          Please wait while we find an opponent
        </p>
      </div>
      <div v-if="players.length === 2" class="text-center mb-4">
        <h2 class="text-3xl font-semibold text-white mb-4">
          Match is ready to start
        </h2>
        <p class="text-neutral-400">Good Darts!</p>
      </div>

      <!-- Main content in 2 columns for larger screens -->
      <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Left column: Match info + Players -->
        <div class="space-y-4">
          <!-- Match info - more compact -->
          <div
            class="p-4 bg-neutral-900 rounded-lg shadow-md border-l-4 border-l-blue-500"
          >
            <div class="flex justify-between items-center mb-2">
              <div class="text-lg font-medium">
                Game #{{ matchId.substring(0, 8) }}
              </div>
              <div
                class="font-medium px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-300"
              >
                Waiting
              </div>
            </div>

            <div class="flex flex-wrap w-full gap-2 mb-2">
              <div class="stat-badge">
                <Icon
                  name="material-symbols:login-rounded"
                  class="w-4 h-4 mr-1 text-blue-400"
                />
                <span>{{ settings.inMode }}</span>
              </div>
              <div class="stat-badge">
                <Icon
                  name="material-symbols:logout-rounded"
                  class="w-4 h-4 mr-1 text-green-400 scale-x-[-1]"
                />
                <span>{{ settings.outMode }}</span>
              </div>
              <div class="stat-badge">
                <Icon
                  name="heroicons:chart-bar"
                  class="w-4 h-4 mr-1 text-yellow-400"
                />
                <span>{{ settings.baseScore }}</span>
              </div>
              <div class="stat-badge">
                <Icon name="ci:line-l" class="w-4 h-4 mr-1 text-teal-400" />
                <span>{{ settings.legCount }} Legs</span>
              </div>
              <div class="stat-badge">
                <Icon
                  name="material-symbols:check-rounded"
                  class="w-4 h-4 mr-1 text-pink-400"
                />
                <span>{{ settings.setCount }} Sets</span>
              </div>
            </div>
          </div>

          <!-- Players section - more compact -->
          <div class="p-5 bg-neutral-900 rounded-lg shadow-md mb-8">
            <h3 class="text-lg font-medium mb-3">Players</h3>

            <div class="space-y-2">
              <div
                v-for="(player, index) in players"
                :key="index"
                class="flex justify-between items-center p-3 bg-neutral-800 rounded-lg"
              >
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 flex items-center justify-center bg-neutral-700 rounded-full mr-3"
                  >
                    <Icon name="mdi:account" size="16" />
                  </div>
                  <p class="font-medium">{{ player.username }}</p>
                </div>
              </div>

              <div
                v-if="players.length < 2"
                class="flex justify-between items-center p-3 bg-neutral-800/50 rounded-lg border border-dashed border-neutral-700"
              >
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 flex items-center justify-center bg-neutral-700/50 rounded-full mr-3"
                  >
                    <Icon
                      name="mdi:account-plus"
                      size="16"
                      class="text-neutral-500"
                    />
                  </div>
                  <p class="text-neutral-500 text-sm">Waiting for player...</p>
                </div>
                <div
                  class="font-medium px-2 py-0.5 rounded-full bg-neutral-700/30 text-neutral-500"
                >
                  Empty
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Share section -->
        <div class="p-4 bg-neutral-900 rounded-lg shadow-md">
          <h3 class="text-lg font-medium mb-3">Share this match</h3>

          <div class="flex flex-col space-y-4">
            <QRCode
              :value="shareableLink"
              :size="150"
              class="bg-white p-1 rounded"
            />

            <div class="space-y-3">
              <div class="flex bg-neutral-800 rounded-lg p-2">
                <input
                  type="text"
                  readonly
                  :value="shareableLink"
                  class="bg-transparent flex-1 outline-none text-black p-1"
                />
                <button
                  @click="copyLink"
                  class="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-white transition-colors"
                >
                  <Icon
                    v-if="copied"
                    name="material-symbols:check"
                    class="text-green-400"
                    size="14"
                  />
                  <Icon
                    v-else
                    name="material-symbols:content-copy-outline"
                    size="14"
                  />
                </button>
              </div>

              <p class="text-neutral-400 text-sm">
                Send this link to invite a friend to your match
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom action buttons -->
      <div class="flex items-center justify-center space-x-4 mt-4">
        <button
          @click="startMatch"
          class="px-4 py-2 bg-secondary-300 hover:bg-secondary-400 text-white rounded-lg transition-colors flex items-center space-x-1"
        >
          <Icon name="heroicons:play" size="16" />
          <span>Start Match</span>
        </button>

        <button
          @click="cancelMatch"
          class="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center space-x-1"
        >
          <Icon name="heroicons:x-mark" size="16" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import QRCode from "qrcode.vue";
import type { Player } from "~/types/websocket";

const props = defineProps({
  matchId: {
    type: String,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
  players: {
    type: Array as () => Player[],
    default: () => [],
  },
});

const emit = defineEmits(["cancel", "start"]);
const copied = ref(false);

const shareableLink = computed(() => {
  return `${window.location.origin}/online/${props.matchId}`;
});

function cancelMatch() {
  emit("cancel");
}

function startMatch() {
  if (props.players.length < 2) return;
  emit("start");
}

function copyLink() {
  navigator.clipboard.writeText(shareableLink.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>

<style scoped>
.stat-badge {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}

.animate-spin-slow {
  animation: slow-spin 3s linear infinite;
}

@keyframes slow-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
