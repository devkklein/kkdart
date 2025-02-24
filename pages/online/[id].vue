<template>
  <div class=" justify-center items-center h-full w-full p-4">
    <PopupsLeaveMatch :showPopup="showLeave" @close="showLeave = false" />
    <PopupsBullOffWinner v-if="viewBullOffWinner" :winner="bullOffWinner" />
    <PopupsWinnerPopup v-if="matchWinner" :winner="matchWinner"  />
    <div v-if="matchStarted && match" class="w-full ">
      <div class="flex flex-col justify-end">
        <div class="flex">
          <div class="flex flex-col">
            <div class="grid grid-flow-col py-4">
              <div class=" px-10 py-5">
                <div class="grid grid-flow-col w-full ">
                  <div class="h-full w-10 flex flex-col py-3 mx-2 justify-end">
                    <h1>100</h1>
                  </div>
                  <div
                    class=" w-full items-center justify-center bg-primary p-4 rounded-xl transition-transform duration-700 shadow-xl"
                    :class="{ ' scale-110': currentPlayerIndex === 0 }">

                    <div class="">
                      <div class="flex flex-col items-center justify-center">
                        <GameProfile :User="match.players[0]" />
                        <div class="flex space-x-3">
                          <p>Legs: {{ match.players[0].scores.legsWon }}</p>
                          <p>Sets: {{ match.players[0].scores.setsWon }}</p>
                        </div>
                        <h1 class="text-6xl">{{ match.players[0].scores.currentScore }}</h1>
                      </div>
                    </div>
                    <div class="flex space-x-3 mt-4">
                      <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                        <div v-if="match.players[0].scores.dart1.multiplier"
                          class="flex flex-col justify-center items-center ">
                          <div v-if="match.players[0].scores.dart1.value != 0"
                            class="flex flex-col justify-center items-center">
                            <p class="text-3xl">{{ (match.players[0].scores.dart1.value ?? 0) * match.players[0].scores.dart1.multiplier }}
                            </p>
                            <p class="text-sm text-gray-300" v-if="match.players[0].scores.dart1.multiplier === 1">S{{
                              match.players[0].scores.dart1.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[0].scores.dart1.multiplier === 2">D{{
                              match.players[0].scores.dart1.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[0].scores.dart1.multiplier === 3">T{{
                              match.players[0].scores.dart1.value }}</p>

                          </div>

                          <p v-else>Miss</p>
                        </div>
                      </div>
                      <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                        <div v-if="match.players[0].scores.dart2.multiplier"
                          class="flex flex-col justify-center items-center ">
                          <div v-if="match.players[0].scores.dart2.value != 0"
                            class="flex flex-col justify-center items-center ">
                            <p class="text-3xl">{{ (match.players[0].scores.dart2.value ?? 0 )  * match.players[0].scores.dart2.multiplier }}
                            </p>
                            <p class="text-sm text-gray-300" v-if="match.players[0].scores.dart2.multiplier === 1">S{{
                              match.players[0].scores.dart2.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[0].scores.dart2.multiplier === 2">D{{
                              match.players[0].scores.dart2.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[0].scores.dart2.multiplier === 3">T{{
                              match.players[0].scores.dart2.value }}</p>

                          </div>

                          <p v-else>Miss</p>
                        </div>
                      </div>
                      <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                        <div v-if="match.players[0].scores.dart3.multiplier"
                          class="flex flex-col justify-center items-center ">
                          <div v-if="match.players[0].scores.dart3.value != 0"
                            class="flex flex-col justify-center items-center ">
                            <p class="text-3xl">{{ (match.players[0].scores.dart3.value ?? 0) * match.players[0].scores.dart3.multiplier }}
                            </p>
                            <p class="text-sm text-gray-300" v-if="match.players[0].scores.dart3.multiplier === 1">S{{
                              match.players[0].scores.dart3.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[0].scores.dart3.multiplier === 2">D{{
                              match.players[0].scores.dart3.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[0].scores.dart3.multiplier === 3">T{{
                              match.players[0].scores.dart3.value }}</p>

                          </div>

                          <p v-else>Miss</p>

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div class=" px-10 py-5 border-l-2 border-primary ">
                <div class="grid grid-flow-col">
                  <div class="w-full bg-primary p-4 rounded-xl transition-transform duration-700 shadow-xl"
                    :class="{ ' scale-110': currentPlayerIndex === 1 }">
                    <div class="">
                      <div class="flex flex-col items-center justify-center">
                        <GameProfile :User="match.players[1]" />
                        <div class="flex space-x-3">
                          <p>Legs: {{ match.players[1].scores.legsWon }}</p>
                          <p>Sets: {{ match.players[1].scores.setsWon }}</p>
                        </div>
                        <h1 class="text-6xl">{{ match.players[1].scores.currentScore }}</h1>
                      </div>
                    </div>
                    <div class="flex space-x-3 mt-4">
                      <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                        <div v-if="match.players[1].scores.dart1.multiplier"
                          class="flex flex-col justify-center items-center ">
                          <div v-if="match.players[1].scores.dart1.value != 0"
                            class="flex flex-col justify-center items-center ">
                            <p class="text-3xl">{{ (match.players[1].scores.dart1.value ?? 0) * match.players[1].scores.dart1.multiplier }}
                            </p>
                            <p class="text-sm text-gray-300" v-if="match.players[1].scores.dart1.multiplier === 1">S{{
                              match.players[1].scores.dart1.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[1].scores.dart1.multiplier === 2">D{{
                              match.players[1].scores.dart1.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[1].scores.dart1.multiplier === 3">T{{
                              match.players[1].scores.dart1.value }}</p>

                          </div>

                          <p v-else>Miss</p>
                        </div>
                      </div>
                      <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                        <div v-if="match.players[1].scores.dart2.multiplier"
                          class="flex flex-col justify-center items-center ">
                          <div v-if="match.players[1].scores.dart2.value != 0"
                            class="flex flex-col justify-center items-center ">
                            <p class="text-3xl">{{ (match.players[1].scores.dart2.value?? 0) * match.players[1].scores.dart2.multiplier }}
                            </p>
                            <p class="text-sm text-gray-300" v-if="match.players[1].scores.dart2.multiplier === 1">S{{
                              match.players[1].scores.dart2.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[1].scores.dart2.multiplier === 2">D{{
                              match.players[1].scores.dart2.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[1].scores.dart2.multiplier === 3">T{{
                              match.players[1].scores.dart2.value }}</p>

                          </div>

                          <p v-else>Miss</p>
                        </div>
                      </div>
                      <div class="w-20 h-20 bg-secondary-300 shadow-xl rounded-xl flex items-center justify-center">
                        <div v-if="match.players[1].scores.dart3.multiplier"
                          class="flex flex-col justify-center items-center ">
                          <div v-if="match.players[1].scores.dart3.value != 0"
                            class="flex flex-col justify-center items-center ">
                            <p class="text-3xl">{{ (match.players[1].scores.dart3.value?? 0)* match.players[1].scores.dart3.multiplier }}
                            </p>
                            <p class="text-sm text-gray-300" v-if="match.players[1].scores.dart3.multiplier === 1">S{{
                              match.players[1].scores.dart3.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[1].scores.dart3.multiplier === 2">D{{
                              match.players[1].scores.dart3.value }}</p>
                            <p class="text-sm text-gray-300" v-if="match.players[1].scores.dart3.multiplier === 3">T{{
                              match.players[1].scores.dart3.value }}</p>

                          </div>


                          <p v-else>Miss</p>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div class="h-full w-10 flex flex-col py-3 mx-4 justify-end">
                    <h1>100</h1>
                  </div>
                </div>
              </div>

            </div>
            <GameInputButtons v-if="bullOffFinished" @score="score" />
            <div v-if="!bullOffFinished">
              <div class="flex flex-col items-center justify-center space-y-4">
                <h1>Normal Bull Off</h1>
                <div class="flex space-x-4">
                  <button @click="bullOffScoring(0, 1)" class=" p-4 rounded-xl shadow-xl">00</button>
                  <button @click="bullOffScoring(25, 1)" class=" p-4 rounded-xl bg-green-500 shadow-xl">25</button>
                  <button @click="bullOffScoring(25, 2)" class="p-4 rounded-xl bg-red-500 shadow-xl">50</button>
                </div>
                <h1 v-if="bullOffTie" class="text-2xl"> BullOff TIE! Starting next round... </h1>
              </div>

            </div>
            <div></div>
          </div>
          <div class=" w-full flex  bg-secondary-300 p-4 rounded-xl   space-x-5">
            <div class="flex flex-col w-1/2 ">
              <h1> Match settings</h1>
              <h1 class="text-sm text-gray-300">General</h1>
              <div class="flex flex-col space-y-2 border-t-2 border-primary">
                <p>Legs: {{ match.settings.legCount }}</p>
                <p>Sets: {{ match.settings.setCount }}</p>
                <p>Max Rounds: {{ match.settings.maxRounds }}</p>
                <p>BaseScore: {{ match.settings.baseScore }}</p>

              </div>
              <div class="mt-4"></div>
              <h1 class="text-sm text-gray-300">Lobby</h1>
              <div class="flex flex-col space-y-4 border-t-2 border-primary">
                <p>In Mode: {{ match.settings.inMode }}</p>
                <p>Out Mode: {{ match.settings.outMode }}</p>
                <p>Bull Off: {{ match.settings.bullOff }}</p>

              </div>

            </div>
            <div class="flex flex-col w-1/2">
              <h1>Match Statistics</h1>


            </div>
            <div>

            </div>

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
import type { DartScore,Match } from '~/types/websocket';
import { useUserStore } from '~/store/user';


const showLeave = ref<boolean>(false);

const user = useUserStore();
const route = useRoute();
const matchId = ref<string | null>(null);
const ws = ref<WebSocket | null>(null);
const matchStarted = ref<boolean>(false);
const bullOffTie = ref<boolean>(false);
const bullOffFinished = ref<boolean>(false);
const playerRole = ref<string>('');
const currentPlayerIndex = ref<number>(0);
const viewBullOffWinner = ref<boolean>(false);
const bullOffWinner = ref<string>('');
const matchWinner = ref<string>('');
const match = ref<Match | null>(null);
// websocket functions
const joinMatch = (matchIdVal: string, role?: 'Spieler1' | 'Spieler2') => {



  ws.value = new WebSocket(
    `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}/api/webSocket/ws`
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
      matchId.value = data.matchId;
      match.value = data.match;
    }
    if (data.type === "bulloff-update") {

      match.value = data.match;

    }
    if (data.type === "switch-turn") {
      currentPlayerIndex.value = data.match.currentPlayerIndex;
      match.value = data.match;
      
    }
    if (data.type === "bulloff-tie") {
      bullOffTie.value = true;
      setTimeout(() => {
        bullOffTie.value = false;
        currentPlayerIndex.value = 0;
        match.value = data.match;
      }, 3000);

    }
    if (data.type === "bulloff-winner") {
      bullOffFinished.value = true;
      bullOffWinner.value = data.winner;

      currentPlayerIndex.value = 2;
      setTimeout(() => {
        viewBullOffWinner.value = true;
      }, 1000);

      setTimeout(() => {
        viewBullOffWinner.value = false;
        if (!data.match.currentPlayerIndex) {
          currentPlayerIndex.value = 0;
        }
        else {
          currentPlayerIndex.value = 1;
        }
        match.value = data.match;
      }, 3000);
    }
    if (data.type === "dart-update") {
      match.value = data.match;
      
    }
    

    if (data.type === "leg-update") {
     match.value = data.match;
      currentPlayerIndex.value = data.match.currentPlayerIndex;
    }
    if (data.type === "match-finished") {
      match.value = data.match;
      currentPlayerIndex.value = 2;
      matchWinner.value = data.winner;
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

function bullOffScoring(score: number, multiplier: number) {
  const currentPlayer = match.value?.players.find((player: any) => player.id === user.id);
  
  ws.value?.send(JSON.stringify({ type: 'bulloff-dart', matchId: matchId.value, player: currentPlayer, score, multiplier }));
}
function score(score: number, multiplier: number) {
  const currentPlayer = match.value?.players.find((player: any) => player.id === user.id);

  //ws.value?.send(JSON.stringify({ type: 'dart-throw', matchId: matchId.value, player: currentPlayer, score, multiplier }));
  ws.value?.send(JSON.stringify({ type: 'x01-match', matchId: matchId.value, player: currentPlayer, score, multiplier }));
}
</script>

<style scoped></style>
