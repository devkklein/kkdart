<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="w-full justify-center items-center p-10 space-y-4 overflow-y-auto">
      <h1 class="uppercase tracking-wider mb-2 px-2 opacity-70 font-bold mb-2 border-b-2 border-primary">
        Create a new offline Match
      </h1>

      <!-- Players Management Card -->
      <div class="p-8 bg-neutral-900 shadow-md rounded-lg w-full flex flex-col">
        <h2 class="text-xl font-semibold mb-4">Players</h2>

        <!-- Players List -->
        <div class="mb-6">
          <div v-if="match?.players.length === 0" class="text-neutral-400 italic mb-4">
            No players added yet
          </div>

          <div v-else class="space-y-2 mb-4">
            <div v-for="(player, index) in match?.players" :key="index"
              class="flex justify-between items-center p-3 bg-neutral-800/60 rounded-lg">
              <div class="flex items-center">
                <div class="w-8 h-8 flex items-center justify-center bg-neutral-700 rounded-full mr-3">
                  <Icon name="mdi:account" size="16" />
                </div>
                <p class="font-medium">{{ player.username }}</p>
                <span v-if="player.id === user.id"
                  class="ml-2 text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full">
                  You
                </span>
              </div>

              <button v-if="player.id !== user.id" @click="removePlayer(index)" class="text-red-400 hover:text-red-300">
                <Icon name="heroicons:trash" size="18" />
              </button>
            </div>
          </div>

          <!-- Add Player Form -->
          <div class="flex space-x-2">
            <div class="relative flex-1">
              <input v-model="newPlayerName" type="text" placeholder="Enter player name"
                class="w-full text-black rounded-lg p-3 bg-neutral-800 border border-neutral-700 focus:border-primary focus:outline-none"
                @keyup.enter="addPlayer" />
              <div v-if="inputError" class="text-red-400 text-xs mt-1 absolute bottom-[-20px] left-0">
                {{ inputError }}
              </div>
            </div>
            <button @click="addPlayer" type="button"
              class="px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center"
              :disabled="!newPlayerName.trim()">
              <Icon name="heroicons:plus" class="mr-1" size="18" />
              Add
            </button>
          </div>
        </div>

        <!-- Bot Player Option -->
        <div class="mt-4">
          <label class="flex items-center space-x-2 cursor-pointer mb-4 ">
            <input type="checkbox" v-model="addBot" class="w-4 h-4 accent-primary">
            <span class="text-white opacity-70">Add Bot Player</span>
          </label>

          <div v-if="addBot" class="bg-neutral-800 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg">Bot Settings</h3>
              <div class="text-sm text-gray-400">
                Bot Name: {{ botName }}
              </div>
            </div>

            <AppBotDifficultySlider v-model="botAverage" />
            <button @click="addBotToMatch"> Add Bot</button>

            <div class="text-sm text-gray-400 mt-4">
              <p>
                The bot will play with a target 3-dart average of {{ botAverage }}.
                Professional players average 85+, while casual players average 30-45.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Settings Card -->
      <ModeX01 @sendMatchdata="updateSettings" />

      <!-- Start Game Button -->
      <div class="flex justify-end mt-6">
        <button @click="startGame" type="button"
          class="px-6 py-3 bg-secondary-300 hover:bg-secondary-400 text-white rounded-lg transition-colors flex items-center space-x-2">
          <Icon name="heroicons:play" size="20" />
          <span>Start Offline Game</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import offlinegame from "~/middleware/offlinegame";
import { useUserStore } from "~/store/user";
import type { Player, Match } from '~/types/websocket';

const router = useRouter();
const match = ref<Match | null>(null);
const user = useUserStore();
const newPlayerName = ref('');
const inputError = ref('');
const matchSettings = ref<any>({});
const addBot = ref(false);

const offlineMatch = useState<Match>("offlineMatch", () => ({} as Match))
// Default to adding a bot
const botAverage = ref(60); // Default target average

// Add the current user as the first player
onMounted(() => {
  user.fetchUserData();
  const host = {
    id: user.id,
    username: user.username,
    ...(user.profileImage && { image: user.profileImage }),
  };
  match.value = initializeMatch(matchSettings, host);

});

function updateSettings(settings: any) {
  matchSettings.value = settings?.__v_isRef ? settings._value : settings;
}

function addPlayer() {
  const trimmedName = newPlayerName.value.trim();

  if (!trimmedName) {
    inputError.value = 'Player name cannot be empty';
    return;
  }

  // Check for duplicate names
  if (match.value?.players.some(player => player.username.toLowerCase() === trimmedName.toLowerCase())) {
    inputError.value = 'Player name already exists';
    return;
  }
  const newPlayer = {
    id: crypto.randomUUID(),
    username: trimmedName,
  };
  match.value?.players.push(initializeOfflinePlayer(match.value, newPlayer));
  // Add the new player


  // Clear input and errors
  newPlayerName.value = '';
  inputError.value = '';
}
function addBotToMatch() {
  const bot = {
    id: crypto.randomUUID(),
    username: botName.value,
    isBot: true,
    targetAverage: botAverage.value
  };
  match.value?.players.push(initializeOfflinePlayer(match.value, bot));
}

function removePlayer(index: number) {
  match.value?.players.splice(index, 1);
}

const botName = computed(() => {
  if (botAverage.value < 40) return "Beginner Bot";
  if (botAverage.value < 50) return "Novice Bot";
  if (botAverage.value < 60) return "Amateur Bot";
  if (botAverage.value < 70) return "Intermediate Bot";
  if (botAverage.value < 80) return "Advanced Bot";
  if (botAverage.value < 90) return "Expert Bot";
  return "Pro Bot";
});



function startGame() {
  // Create final player list including bot if selected

  if (match.value) {
    match.value.started = true;
    offlineMatch.value = match.value;
  }

  // Navigate to the game page
  router.push(`/offlineGame/${match.value?.id}`);
}
</script>
