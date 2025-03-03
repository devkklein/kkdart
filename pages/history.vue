<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="h-full w-full flex flex-col items-center">
      <div v-if="!loadHistory" class="flex items-center justify-center h-full">
        <img src="/public/dartboard_small.png" alt="Loading..." class="h-20 w-20 animate-spin-slow">
      </div>

      <div v-if="loadHistory && user" class="max-w-3xl w-full p-6 space-y-4 overflow-y-auto">
        <h2 class="text-2xl font-semibold text-white mb-6">Match History</h2>

        <div v-for="match in matchHistory" :key="match.id"
          class="flex flex-col w-full p-5 bg-neutral-900 rounded-lg shadow-md transition-all hover:shadow-lg cursor-pointer match-card"
          :class="{ 'border-l-4 border-l-green-500': userWonMatch(match), 'border-l-4 border-l-red-500': !userWonMatch(match) }"
          @click="viewMatchDetails(match)">

          <div class="flex justify-between items-center mb-3">
            <p class="text-sm text-neutral-400">{{ formatDate(match.createdAt) }}</p>
            <div class="text-sm font-medium px-2 py-0.5 rounded-full"
              :class="userWonMatch(match) ? 'bg-green-500/80 text-gren-500' : 'bg-red-900/30 text-red-300'">
              {{ userWonMatch(match) ? 'WIN' : 'LOSS' }}
            </div>
          </div>


          <div class="flex items-center justify-center space-x-3 mb-3">
            <div class="player-card flex-1"
              :class="{ 'winner': getCurrentUserOrFirstPlayer(match).scores.setsWon > getOpponent(match).scores.setsWon }">
              <div class="flex flex-col">
                <span class="font-bold">{{ getCurrentUserOrFirstPlayer(match).username }}</span>
                <span class="text-neutral-400 text-xs">Average: {{ getCurrentUserOrFirstPlayer(match).stats.average
                }} | First9Avg: {{ getCurrentUserOrFirstPlayer(match).stats.first9Average }} | Checkout: {{
                    getCurrentUserOrFirstPlayer(match).stats.checkoutPercentage }}%</span>
              </div>
              <span class="text-2xl font-semibold">{{ getCurrentUserOrFirstPlayer(match).scores.setsWon }}</span>
            </div>

            <div class="vs-badge">VS</div>

            <div class="player-card flex-1"
              :class="{ 'winner': getOpponent(match).scores.setsWon > getCurrentUserOrFirstPlayer(match).scores.setsWon }">
              <div class="flex flex-col">
                <span class="font-bold">{{ getOpponent(match).username }}</span>
                <span class="text-neutral-400 text-xs">Average: {{ getOpponent(match).stats.average
                }} | First9Avg: {{ getOpponent(match).stats.first9Average }} | Checkout: {{
                    getOpponent(match).stats.checkoutPercentage }}%</span>
              </div>
              <span class="text-2xl font-semibold">{{ getOpponent(match).scores.setsWon }}</span>
            </div>
          </div>

          <!-- Match settings -->
          <div class="flex items-center justify-between text-sm text-neutral-500 mt-1 border-t border-neutral-800 pt-2">
            <div>{{ match.settings.baseScore }} points</div>
            <div>{{ match.settings.outMode }} out</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Match, Player } from "~/types/websocket";

const user = useSupabaseUser();
const matchHistory = ref<Match[]>([]);
const loadHistory = ref<boolean>(false);
const router = useRouter();

const selectedMatch = useState<Match>('selectedMatch', () => ({} as Match));

// Format date to a readable format
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}


function getCurrentUserOrFirstPlayer(match: Match): Player {
  if (!user.value) return match.players[0];

  const currentUser = match.players.find(player => player.id === user.value?.id);
  return currentUser || match.players[0];
}


function getOpponent(match: Match): Player {
  if (!user.value) return match.players[1];

  const opponent = match.players.find(player => player.id !== user.value?.id);
  return opponent || match.players[1];
}

function userWonMatch(match: Match): boolean {
  const currentUser = getCurrentUserOrFirstPlayer(match);
  const opponent = getOpponent(match);


  return currentUser.scores.setsWon > opponent.scores.setsWon;
}


function viewMatchDetails(match: Match) {
  selectedMatch.value = match;
  router.push('/content/matchdetails');
}

async function getMatchHistory() {
  const userId = user.value?.id;
  const { matches, error: apiError } = await $fetch<{ matches: Match[], error: string }>(`https://${window.location.host}/api/user/getMatchHistory`, {
    method: "POST",
    body: { userId },
  });
  if (apiError) {
    console.error("Error fetching match history:", apiError);
  }
  else {
    console.log(matches);
    matchHistory.value = matches;
    loadHistory.value = true;
  }
}

onMounted(() => {
  getMatchHistory();
});
</script>

<style scoped>
.player-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
}



.winner {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}

/* Add these new styles for hover effects */
.match-card {
  transition: transform 0.2s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.03);
}
</style>