<template>
  <div class=" justify-center items-center h-full w-full p-4">
    <PopupsLeaveMatch :showPopup="showLeave" @close="showLeave = false" />
    <div v-if="matchStarted" class="w-full ">
      <div class="flex flex-col justify-end">
        <div class="flex">
          <div class="flex flex-col">
          <div class="grid grid-flow-col py-4">
            <div class=" px-10 py-5">
              <div class="grid grid-flow-col w-full ">
                <div class="h-full w-10 flex flex-col py-3 justify-end">
                  <h1>100</h1>
                </div>
                <div class=" w-full items-center justify-center bg-primary p-4 rounded-xl shadow-xl ">

                  <div class="">
                    <div class="flex flex-col items-center justify-center">
                      <GameProfile :User="players[0]" />
                      <div class="flex space-x-3">
                        <p>Legs: {{ scores.Spieler1.legsWon }}</p>
                        <p>Sets: {{ scores.Spieler1.setsWon }}</p>
                      </div>
                      <h1 class="text-6xl">{{ scores.Spieler1.currentScore }}</h1>
                    </div>
                  </div>
                  <div class="flex space-x-3 mt-4">
                    <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                      <p v-if="scores.Spieler1.dart1.value != 0">{{ scores.Spieler1.dart1.value }}</p>
                      <p v-else>Miss</p>
                    </div>
                    <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                      <p v-if="scores.Spieler1.dart2.value != 0">{{ scores.Spieler1.dart2.value }}</p>
                      <p v-else>Miss</p>
                    </div>
                    <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                      <p v-if="scores.Spieler1.dart3.value != 0">{{ scores.Spieler1.dart3.value }}</p>
                      <p v-else>Miss</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div class=" px-10 py-5 border-l-2 border-primary ">
              <div class="grid grid-flow-col">
                <div class="w-full bg-primary p-4 rounded-xl shadow-xl ">
                  <div class="">
                    <div class="flex flex-col items-center justify-center">
                      <GameProfile :User="players[1]" />
                      <div class="flex space-x-3">
                        <p>Legs: {{ scores.Spieler2.legsWon }}</p>
                        <p>Sets: {{ scores.Spieler2.setsWon }}</p>
                      </div>
                      <h1 class="text-6xl">{{ scores.Spieler2.currentScore }}</h1>
                    </div>
                  </div>
                  <div class="flex space-x-3 mt-4">
                    <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                      <p v-if="scores.Spieler2.dart1.value != 0">{{ scores.Spieler2.dart1.value }}</p>
                      <p v-else>Miss</p>
                    </div>
                    <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                      <p v-if="scores.Spieler2.dart2.value != 0">{{ scores.Spieler2.dart2.value }}</p>
                      <p v-else>Miss</p>
                    </div>
                    <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                      <p v-if="scores.Spieler2.dart3.value != 0">{{ scores.Spieler2.dart3.value }}</p>
                      <p v-else>Miss</p>
                    </div>
                  </div>

                </div>
                <div class="h-full w-10 flex flex-col p-3 justify-end">
                  <h1>100</h1>
                </div>
              </div>
            </div>

          </div>
          <GameInputButtons />
        </div>
          <div class=" w-full  bg-primary p-4 rounded-xl shadow-xl">

          </div>

        </div>

      </div>
    </div>
    <div v-else class="bg-primary p-20">
      <h1>Waiting for Enemy player</h1>
    </div>
    
  </div>
  <footer class="absolute bottom-0 p-4 w-full flex justify-between">
      <div class="bg-primary flex w-1/8 justify-start items-center rounded-xl shadow-xl px-3">
        <button @click="leaveMatch" class="flex items-center justify-center p-3 rounded ">
          <Icon name="mdi:logout" size="20" class="scale-x-[-1] text-red-500" />
          <span class="ml-2">Leave Match</span>
        </button>
      </div>
      <div class="bg-primary flex w-1/8 justify-end items-center rounded-xl shadow-xl px-3 space-x-4">
        <button class="flex items-center justify-center p-3 rounded ">
          <Icon name="mdi:cog" size="20" class="text-white" />
        </button>
        <button class="flex items-center justify-center p-3 rounded ">
          <Icon name="mdi:chat" size="20" class="text-white" />
        </button>
      </div>
    </footer>

</template>

<script lang="ts" setup>
import type { DartScore } from '~/types/interface';
import { useUserStore } from '~/store/user';

const showLeave = ref<boolean>(false);

const user = useUserStore();
const route = useRoute();
const matchId = ref<string | null>(null);
const ws = ref<WebSocket | null>(null);
const matchStarted = ref<boolean>(true);
const scores = ref<Record<string, { currentScore: number; legsWon: number; setsWon: number; dart1: DartScore; dart2: DartScore; dart3: DartScore }>>({
  Spieler1: {
    currentScore: 501, legsWon: 0, setsWon: 0, dart1: { value: 0, multiplier: 1 },
    dart2: { value: 0, multiplier: 1 },
    dart3: { value: 0, multiplier: 1 }
  },
  Spieler2: {
    currentScore: 501, legsWon: 0, setsWon: 0, dart1: { value: 0, multiplier: 1 },
    dart2: { value: 0, multiplier: 1 },
    dart3: { value: 0, multiplier: 1 }
  }
});
const settings = ref<any>({});
const playerRole = ref<string>('');
const joinCalled = ref<boolean>(false);
const players = ref<any>([
  { id: '1', username: 'Player1', image: null },
  { id: '2', username: 'Player2', image: null }
]);

// websocket functions
const joinMatch = (matchIdVal: string, role?: 'Spieler1' | 'Spieler2') => {
  if (joinCalled.value) return;
  joinCalled.value = true;

  ws.value = new WebSocket(
    `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}/api/ws`
  );

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "match-joined") {
      if (!playerRole.value) {
        playerRole.value = role ? role : 'Spieler2';
      }
    }
    if (data.type === "match-start") {
      matchStarted.value = true;
      scores.value = data.scores;
      settings.value = data.settings;
      players.value = data.players;
      console.log("Match started", data.scores, data.settings);
    }
  };

  ws.value.onopen = () => {
    ws.value?.send(JSON.stringify({ type: 'join-match', matchId: matchIdVal, player: { id: user.id, username: user.username, image: user.profileImage || null } }));
  };
};

// mount functions 
onMounted(() => {
  matchId.value = route.params.id as string;

  if (matchId.value) {
    if (route.query.creator === 'true') {
      joinMatch(matchId.value, 'Spieler1');
    } else {
      joinMatch(matchId.value);
    }
  }

  window.addEventListener('beforeunload', () => {
    if (ws.value) {
      ws.value.send(JSON.stringify({ type: 'leave-match', matchId: matchId.value, player: { id: user.id, username: user.username } }));
    }
  });
});

onBeforeUnmount(() => {
  if (ws.value) {
    ws.value.send(JSON.stringify({ type: 'leave-match', matchId: matchId.value, player: { id: user.id, username: user.username } }));
    ws.value.close();
  }
});

// utility functions 
function leaveMatch() {
  showLeave.value = true;
}

function testScore(score: number, multiplier: number) {
  console.log(score * multiplier);
}
</script>

<style scoped></style>
