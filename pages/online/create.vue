<template>
  <div class="flex h-screen ">
    <Sidebar />
    <div class="h-full w-full flex justify-center items-center ">
      <form  type="submit" class="p-4 bg-primary shadow-md rounded-xl w-1/2 space-y-4">
        <div class="mb-4 flex justify-center items-center flex-col">
          <SidebarProfile class=" scale-125"/>
          <div class="mb-4"></div>
          <label class="text-white text-sm text-xl font-bold mb-2" for="matchName">
            Match Name
          </label>
          <input
          v-model="matchName"
            class="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="matchName" type="text" placeholder="Enter match name" />
        </div>
        <div>
          <div class="bg-primary rounded-xl shadow-lg flex justify-center items-center">
            <button type="button" class="rounded-t-lg rounded-none" :class="{ 'bg-secondary-300': gameMode === 'x01' }"
              @click="setMode('x01')"> X01 </button>
            <button type="button" class="rounded-t-lg rounded-none"
              :class="{ 'bg-secondary-300': gameMode === 'cricket' }" @click="setMode('cricket')"> Cricket</button>
            <button type="button" class="rounded-t-lg rounded-none" :class="{ 'bg-secondary-300': gameMode === 'clock' }"
              @click="setMode('clock')"> A round the Clock</button>
            <button type="button" class="rounded-t-lg rounded-none" :class="{ 'bg-secondary-300': gameMode === '121' }"
              @click="setMode('121')"> 121</button>
          </div>
          <div class="bg-secondary-300 shadow-lg rounded-xl p-4">
            <ModeClock v-if="gameMode === 'clock'" />
            <ModeX01 @sendMatchdata="updateSettings" v-if="gameMode === 'x01'" />
            <ModeCricket v-if="gameMode === 'cricket'" />
            <ModeX121 v-if="gameMode === '121'" />
          </div>
        </div>
        <div class="flex  w-full justify-between items-center">

          <button type="button" class="flex items-center text-white " @click="$router.back()">
            <Icon name="ic:round-arrow-back-ios" size="24" />
          </button>
          <button @click="createGame" type="button" class="bg-secondary-300 text-white rounded-lg p-2">Create Game</button>

        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/store/user';

const router = useRouter();

const user = useUserStore();
const matchName =  ref<string>(user.username);
const gameMode = ref<string>('x01');
const matchid = ref<string>('');
const matchSettings = ref<any>({});

const ws = ref<WebSocket | null>(null);

function setMode(mode: string) {

  gameMode.value = mode;
}
function updateSettings(settings: any) {
  matchSettings.value = settings;
}


const createGame = () => {
 
  ws.value = new WebSocket(`ws://${window.location.host}/api/ws`);
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if ( data.type === "match-created") {
      matchid.value = data.matchId;
      router.push(`/online/${matchid.value}`);
      
    }
  };
  ws.value.onopen = () => {
    ws.value.send(JSON.stringify({ type: 'create-match', matchSettings }));
  };
  
};




onMounted(() => {
  matchName.value = user.username + " Match";
});
</script>

<style></style>
