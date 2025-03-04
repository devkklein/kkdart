<template>
  <div class="h-full w-full flex flex-col items-center">
    <div v-if="!loaded" class="flex items-center justify-center h-full">
      <img
        src="/public/dartboard_small.png"
        alt="Loading..."
        class="h-20 w-20 animate-spin-slow"
      />
    </div>

    <div v-else class="max-w-3xl w-full p-6 space-y-4 overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-white">Available Matches</h2>
        <button
          @click="backTo"
          class="text-sm flex items-center space-x-1 text-neutral-400 hover:text-white transition-colors"
        >
          <Icon name="ic:round-arrow-back-ios" size="16" />
          <span>Back</span>
        </button>
      </div>

      <div
        v-if="matches.length === 0"
        class="flex flex-col items-center justify-center py-12 text-neutral-400"
      >
        <Icon name="game-icons:dart" class="mb-2" size="48" />
        <p>No available matches found</p>
        <p class="text-sm mt-2">Try refreshing or create your own match</p>
      </div>

      <div
        v-for="match in matches"
        :key="match.matchId"
        class="flex flex-col w-full p-5 bg-neutral-900 rounded-lg shadow-md transition-all hover:shadow-lg cursor-pointer match-card"
        @click="joinMatch(match.matchId)"
      >
        <div class="flex justify-between items-center mb-3">
          <div class="text-lg font-medium">
            Game #{{ match.matchId.substring(0, 8) }}
          </div>
          <div
            class="text-sm font-medium px-3 py-1 rounded-full bg-blue-900/30 text-blue-300"
          >
            Available
          </div>
        </div>

        <div class="flex flex-wrap gap-3 mb-3">
          <div class="stat-badge">
            <Icon
              name="material-symbols:login-rounded"
              class="w-4 h-4 mr-1 text-blue-400"
            />
            <span>{{ match.settings.inMode }}</span>
          </div>
          <div class="stat-badge">
            <Icon
              name="material-symbols:logout-rounded"
              class="w-4 h-4 mr-1 text-green-400 scale-x-[-1]"
            />
            <span>{{ match.settings.outMode }}</span>
          </div>
          <div class="stat-badge">
            <Icon
              name="heroicons:chart-bar"
              class="w-4 h-4 mr-1 text-yellow-400"
            />
            <span>{{ match.settings.baseScore }}</span>
          </div>
          <div class="stat-badge">
            <Icon name="ci:line-l" class="w-4 h-4 mr-1 text-teal-400" />
            <span>{{ match.settings.legCount }} Legs</span>
          </div>
          <div class="stat-badge">
            <Icon
              name="material-symbols:check-rounded"
              class="w-4 h-4 mr-1 text-pink-400"
            />
            <span>{{ match.settings.setCount }} Sets</span>
          </div>
        </div>

        <button
          class="mt-2 w-full py-2 bg-secondary-300 hover:bg-secondary-400 text-white rounded-lg transition-colors"
          @click.stop="joinMatch(match.matchId)"
        >
          Join Match
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const matches = ref<Array<{ matchId: string; settings: any }>>([]);
const ws = ref<WebSocket | null>(null);
const loaded = ref<boolean>(false);

const joinMatch = (matchId: string) => {
  router.push(`/online/${matchId}`);
};

onMounted(() => {
  ws.value = new WebSocket(
    `${window.location.protocol === "https:" ? "wss://" : "ws://"}${
      window.location.host
    }/api/webSocket/ws`
  );

  ws.value.onopen = () => {
    ws.value?.send(JSON.stringify({ type: "list-matches" }));
  };

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "matches-list") {
      matches.value = data.matches.map((match: any) => ({
        matchId: match.matchId,
        settings: match.settings,
      }));
      loaded.value = true;
    }
  };
});

function backTo() {
  router.back();
}
</script>

<style scoped>
.match-card {
  transition: transform 0.2s ease, box-shadow 0.3s ease,
    background-color 0.3s ease;
  border-left: 4px solid #3b82f6;
  /* Blue border to indicate available matches */
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.03);
}

.stat-badge {
  display: flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}
</style>
