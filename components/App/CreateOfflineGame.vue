<template>
  <div class="flex h-full w-full justify-center items-center">
    <form 
      @submit.prevent="createGame"
      class="flex flex-col justify-center items-center bg-primary text-white p-4 rounded-lg shadow-lg space-y-5">
      <h1 class="text-3xl border-b-2 border-gray-500">Create Offline Game</h1>
      <div class="flex  justify-center text-center items-center space-x-2">
        <h1 class="text-xl">Spieler</h1>
        <div class="flex items-center justify-center bg-green-500 p-1 rounded-full"> 
        <Icon @click="showAddPlayer = true" name="line-md:plus" size="16"
          class="cursor-pointer text-white" />
        </div>
        <AppAddPlayer :showPopup="showAddPlayer" @close="showAddPlayer = false" @playerAdded="addPlayer" />
      </div>
      <div class="flex flex-row space-x-5 ">
        <div v-for="player in players" :key="player.id" class="">
          <div class="w-13 h-13 rounded-full overflow-hiddenflex items-center justify-center text-center">
            <img v-if="player.profileImage" :src="player.profileImage" alt="Profilbild"
              class="w-full h-full object-cover" />
            <img v-else src="/blankPb.png" alt="Profilbild" class="w-20 h-20 rounded-full object-fill" />
          </div>
          <div class="flex  justify-center text-center items-center space-x-2">
            <p class="text-lg font-semibold">{{ player.username }}</p>
            <div v-if="player.id !== userStore.id" class="flex items-center justify-center">
              <Icon name="material-symbols:delete-outline-rounded" size="20" class="cursor-pointer text-red-500"
                @click="removePlayer(player.id)" />
            </div>
          </div>
        </div>

      </div>
      <div class="flex flex-col justify-start items-center space-y-2 w-full ">
        <div class="flex flex-col justify-center items-center space-y-2 ">
          <h1 class="text-center w-full">Base Score</h1>
          <div class="bg-primary rounded-lg shadow-lg flex justify-center  w-full">
            <button type="button" :class="{ 'bg-secondary-300': basescore === 121 }" @click="setBaseScore(121)">121</button>
            <button type="button" :class="{ 'bg-secondary-300': basescore === 170 }" @click="setBaseScore(170)">170</button>
            <button type="button" :class="{ 'bg-secondary-300': basescore === 301 }" @click="setBaseScore(301)">301</button>
            <button type="button" :class="{ 'bg-secondary-300': basescore === 501 }" @click="setBaseScore(501)">501</button>
            <button type="button" :class="{ 'bg-secondary-300': basescore === 701 }" @click="setBaseScore(701)">701</button>
            <button type="button" :class="{ 'bg-secondary-300': basescore === 901 }" @click="setBaseScore(901)">901</button>
          </div>
        </div>
        <div class="flex space-x-5 ">
          <div class="flex flex-col justify-center items-center space-y-2 w-full">
            <h1 class="text-center w-full">In Mode</h1>
            <div class="bg-primary rounded-lg shadow-lg flex justify-center w-full">
              <button type="button" :class="{ 'bg-secondary-300': inMode === 'Single' }"
                @click="setInMode('Single')">Single</button>
              <button type="button" :class="{ 'bg-secondary-300': inMode === 'Double' }"
                @click="setInMode('Double')">Double</button>
              <button type="button" :class="{ 'bg-secondary-300': inMode === 'Master' }" @click="setInMode('Master')">Master
              </button>
            </div>
          </div>
          <div class="flex flex-col justify-center items-center space-y-2 w-full">
            <h1 class="text-center w-full">Out Mode</h1>
            <div class="bg-primary rounded-lg shadow-lg flex justify-center  w-full">
              <button type="button" :class="{ 'bg-secondary-300': outMode === 'Single' }"
                @click="setOutMode('Single')">Single</button>
              <button type="button" :class="{ 'bg-secondary-300': outMode === 'Double' }"
                @click="setOutMode('Double')">Double</button>
              <button type="button" :class="{ 'bg-secondary-300': outMode === 'Master' }" @click="setOutMode('Master')">Master
              </button>
            </div>
          </div>
          
        </div>
        <div class="flex flex-col justify-center items-center space-y-2 ">
          <h1 class="text-center w-full">Legs</h1>
          <div class="bg-primary rounded-lg shadow-lg flex justify-center  w-full">
            <button type="button" :class="{ 'bg-secondary-300': legCount === 1 }" @click="setLegCount(1)">1</button>
            <button type="button" :class="{ 'bg-secondary-300': legCount === 2 }" @click="setLegCount(2)">2</button>
            <button type="button" :class="{ 'bg-secondary-300': legCount === 3 }" @click="setLegCount(3)">3</button>
            <button type="button" :class="{ 'bg-secondary-300': legCount === 4 }" @click="setLegCount(4)">4</button>
            <button type="button" :class="{ 'bg-secondary-300': legCount === 5 }" @click="setLegCount(5)">5</button>
            <button type="button" :class="{ 'bg-secondary-300': legCount === 6 }" @click="setLegCount(6)">6</button>
            <button type="button" :class="{ 'bg-secondary-300': legCount === 7 }" @click="setLegCount(7)">7</button>
            <button type="button" :class="{ 'bg-secondary-300': legCount === 8 }" @click="setLegCount(8)">8</button>
            <button type="button" :class="{ 'bg-secondary-300': legCount === 9 }" @click="setLegCount(9)">9</button>
            <button type="button" :class="{ 'bg-secondary-300': legCount === 10 }" @click="setLegCount(10)">10</button>
          </div>
        </div>
        <div class="flex flex-col justify-center items-center space-y-2 ">
          <h1 class="text-center w-full">Sets</h1>
          <div class="bg-primary rounded-lg shadow-lg flex justify-center  w-full">
            <button type="button" :class="{ 'bg-secondary-300': setCount === 1 }" @click="setSetCount(1)">1</button>
            <button type="button" :class="{ 'bg-secondary-300': setCount === 2 }" @click="setSetCount(2)">2</button>
            <button type="button" :class="{ 'bg-secondary-300': setCount === 3 }" @click="setSetCount(3)">3</button>
            <button type="button" :class="{ 'bg-secondary-300': setCount === 4 }" @click="setSetCount(4)">4</button>
            <button type="button" :class="{ 'bg-secondary-300': setCount === 5 }" @click="setSetCount(5)">5</button>
            <button type="button" :class="{ 'bg-secondary-300': setCount === 6 }" @click="setSetCount(6)">6</button>
            <button type="button" :class="{ 'bg-secondary-300': setCount === 7 }" @click="setSetCount(7)">7</button>
            <button type="button" :class="{ 'bg-secondary-300': setCount === 8 }" @click="setSetCount(8)">8</button>
            <button type="button" :class="{ 'bg-secondary-300': setCount === 9 }" @click="setSetCount(9)">9</button>
            <button type="button" :class="{ 'bg-secondary-300': setCount === 10 }" @click="setSetCount(10)">10</button>
          </div>
        </div>
      </div>

      <button type="submit">Create Game </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/store/user';
import { useOffline_X01_GameStore } from '~/store/offline_X01_Games';
import type {OfflineGame} from '~/types/interface';
const router = useRouter();

const showAddPlayer = ref(false);
const userStore = useUserStore();
const gameStore = useOffline_X01_GameStore();
const players = ref<Array<{ id: any; username: string; profileImage: string | null }>>([]);
const basescore = ref(501);
const inMode = ref("Single");
const outMode = ref("Double");
const legCount = ref(3);
const setCount = ref(1);
const game = ref<OfflineGame | null>(null);


watch(
  () => userStore.username,
  (newUsername) => {
    if (newUsername && !players.value.find(p => p.id === userStore.id)) {
      players.value.push({
        id: userStore.id,
        username: userStore.username,
        profileImage: userStore.profileImage,
      });
    }
  },
  { immediate: true }
);


function setBaseScore(score: number) {
  basescore.value = score;
}
function setInMode(mode: string) {
  inMode.value = mode;
}
function setOutMode(mode: string) {
  outMode.value = mode;
}
function setLegCount(count: number) {
  legCount.value = count;
}
function setSetCount(count: number) {
  setCount.value = count;
}

function addPlayer(player: { id: any; username: string; profileImage: string | null }) {
  players.value.push(player);
  showAddPlayer.value = false;
}
function removePlayer(id: any) {
  players.value = players.value.filter(p => p.id !== id);
}
function createGame() {
  const gameId = "offline_" + new Date().getTime() + "_" + userStore.id;
  if(userStore.id){
   game.value = {
    id: gameId,
    creatorId: userStore.id,
    players: players.value,
    basescore: basescore.value,
    inMode: inMode.value,
    outMode: outMode.value,
    legCount: legCount.value,
    setCount: setCount.value,
  }
  gameStore.createGame(game.value);
  router.push(`/offlineGame/${gameId}`);
  
}
}


</script>

<style></style>
