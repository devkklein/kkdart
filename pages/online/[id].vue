<template>
  <div class="flex h-screen  ">
    <Sidebar />
    <div class=" h-full w-full overflow-y-auto">
      <PopupsLeaveMatch :showPopup="showLeave" @close="showLeave = false" />
      <PopupsBullOffWinner v-if="viewBullOffWinner" :winner="bullOffWinner" />
      <GameMatchSummary v-if="matchWinner && match" :match=match />

      <div v-if="matchStarted && match" class="w-full p-4 ">
        <div
          class="w-full bg-secondary-300 border-2 border-primary flex space-x-10 text-sm justify-center rounded-xl py-1 shadow-xl px-3">
          <p>In Mode: {{ match.settings.inMode }}</p>
          <p>Out Mode: {{ match.settings.outMode }}</p>
          <p>Bull Off: {{ match.settings.bullOff }}</p>
          <div>
            <p>Legs: {{ match.settings.legCount }}</p>
          </div>
          <div>
            <p>Sets: {{ match.settings.setCount }}</p>
          </div>
          <div>
            <p>Max Rounds: {{ match.settings.maxRounds }}</p>
          </div>
          <div>
            <p>BaseScore: {{ match.settings.baseScore }}</p>
          </div>
        </div>
        <div class="flex flex-col justify-end">
          <div class="flex ">
            <div class="flex w-8/12 flex-col">
              <div class="grid grid-flow-col py-4 space-x-5">
                <div v-for="(player, playerIndex) in match.players" :key="playerIndex">



                  <div
                    class=" flex w-full flex-col items-center bg-secondary-300  justify-center bg-secondary border-2 p-4 rounded-xl shadow-xl "
                    :class="match.currentPlayerIndex === playerIndex ? 'border-blue-500' : 'border-primary'">
                    <div class="flex">
                      <div class="flex flex-col items-center justify-end stat-column">
                        <div class="stat-container">
                          <p class="stat-label">Average</p>
                          <p class="stat-value">{{ player.stats.average }}</p>
                        </div>

                        <div class="stat-container">
                          <p class="stat-label">First9Avg</p>
                          <p class="stat-value">{{ player.stats.first9Average }}</p>
                        </div>
                        <div class="stat-container">
                          <p class="stat-label">Checkout</p>
                          <p class="stat-value"> {{ player.stats.checkoutPercentage }}%</p>
                        </div>
                      </div>


                      <div class="flex flex-col items-center justify-center">
                        <GameProfile :User="player" />
                        <div class="flex space-x-3">
                          <p>Legs: {{ player.scores.legsWon }}</p>
                          <p>Sets: {{ player.scores.setsWon }}</p>
                        </div>
                        <h1 class="text-8xl">{{ player.scores.currentScore }}</h1>

                      </div>
                      <div
                        class=" w-16 h-auto max-h-80 overflow-hidden relative flex flex-col items-center justify-end ">
                        <div
                          class="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-secondary-300 to-transparent">
                        </div>
                        <div v-for="(score, index) in player.scores.legScores" :key="index">
                          <h1 class="text-gray-300 text-xs text-nowrap ">Leg: {{ index }}</h1>
                          <div v-for="(s, i) in score.roundScores" :key="i" class="text-xl">
                            <p>{{s.scores.reduce((acc, val) => acc + val, 0)}}</p>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div class="flex w-full justify-center space-x-2 mt-4">
                      <div v-for="dartNum in 3" :key="dartNum"
                        class="w-24 h-20 p-1 border-2 border-primary rounded flex items-center justify-center">
                        <div v-if="player.scores.dartScores[dartNum].multiplier"
                          class="flex flex-col justify-center items-center">
                          <div v-if="player.scores.dartScores[dartNum].value != 0"
                            class="flex flex-col justify-center items-center">
                            <p class="text-3xl">{{ (player.scores.dartScores[dartNum].value ?? 0) *
                              player.scores.dartScores[dartNum].multiplier }}</p>
                            <p class="text-sm text-gray-200" v-if="player.scores.dartScores[dartNum].multiplier === 1">
                              S{{ player.scores.dartScores[dartNum].value }}</p>
                            <p class="text-sm text-gray-200" v-if="player.scores.dartScores[dartNum].multiplier === 2">
                              D{{ player.scores.dartScores[dartNum].value }}</p>
                            <p class="text-sm text-gray-200" v-if="player.scores.dartScores[dartNum].multiplier === 3">
                              T{{ player.scores.dartScores[dartNum].value }}</p>
                          </div>
                          <p v-else>Miss</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <GameInputButtons v-if="bullOffFinished" @score="score" />
              <div v-if="!bullOffFinished">
                <div class="flex flex-col items-center justify-center space-y-4">
                  <h1>Normal Bull Off</h1>
                  <div class="flex space-x-4">
                    <button @click="bullOffScoring(0, 1, 0)" class=" p-4 rounded-xl shadow-xl">00</button>
                    <button @click="bullOffScoring(25, 1, 25)"
                      class=" p-4 rounded-xl bg-green-500 shadow-xl">25</button>
                    <button @click="bullOffScoring(25, 2, 50)" class="p-4 rounded-xl bg-red-500 shadow-xl">50</button>
                  </div>
                  <h1 v-if="bullOffTie" class="text-2xl"> BullOff TIE! Starting next round... </h1>
                </div>

              </div>
              <div></div>
            </div>
            <div class=" w-8/12 flex py-4 pl-4  pr-0  rounded-xl ">
              <div class="flex flex-col  w-full ">


                <GameScoreChart :player="match.players[getPlayerIndex(match)]" />



              </div>
              <div>

              </div>

            </div>

          </div>

        </div>
      </div>
      <div v-if="waitingForPlayer" class="flex flex-col h-full w-full justify-center items-center">
        <h1>Waiting for Enemy player</h1>
        <GameMatchList />
      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>
import type { DartScore, Match } from '~/types/websocket';
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
const waitingForPlayer = ref<boolean>(true);
const match = ref<Match | null>(null);


/*const match: Match = {
  players: [
    {

      id: '1',
      username: 'PlayerOne',
      stats: {
        average: 51.2,
        checkoutPercentage: 32.5,
        first9Average: 56.2,
        score60: 12,
        score100: 5,
        score140: 2,
        score180: 1,
      },
      scores: {
        currentScore: 501,
        legsWon: 0,
        setsWon: 0,
        dartScores: {
          1: { value: 1, multiplier: 2 },
          2: { value: 5, multiplier: 3 },
          3: { value: 20, multiplier: 2 }
        },
        roundScore: 0,
        roundDartsCount: {
          1: 3,
          2: 3,
          3: 3,
        },
        thrownDarts: 0,
        legScores: {
          0: {
            roundScores: {
              1: { scores: [2, 15, 40] },
              2: { scores: [2, 15, 40] },
              3: { scores: [2, 15, 40] }
            }
          }, 1: {
            roundScores: {
              1: { scores: [2, 15, 1] },
              2: { scores: [2, 15, 40] },
              3: { scores: [2, 60, 40] },
              4: { scores: [32, 32, 56] }
            }
          }, 2: {
            roundScores: {
              1: { scores: [2, 15, 40] },
              2: { scores: [2, 15, 40] },
              3: { scores: [2, 15, 40] }
            }
          },
          3: {
            roundScores: {
              1: { scores: [2, 15, 40] },
              2: { scores: [2, 15, 40] },
              3: { scores: [2, 15, 40] }
            }
          }
        }
       
      }
    },
    {
      id: '2',
      username: 'PlayerTwo',
      stats: {
        average: 51.2,
        checkoutPercentage: 32.5,
        first9Average: 56.2,
        score60: 12,
        score100: 5,
        score140: 2,
        score180: 1,
      },
      scores: {
        currentScore: 501,
        legsWon: 0,
        setsWon: 0,
        dartScores: {
          1: { value: 1, multiplier: 2 },
          2: { value: 5, multiplier: 3 },
          3: { value: 20, multiplier: 2 }
        },
        roundScore: 0,
        thrownDarts: 0,
        roundDartsCount: {
          1: 3,
          2: 3,
          3: 3,
        },
        legScores: {
          0: {
            roundScores: {
              0: { scores: [2, 15, 40] },
              1: { scores: [2, 15, 40] },
              2: { scores: [2, 15, 40] }
            }
          }, 1: {
            roundScores: {
              0: { scores: [2, 15, 40] },
              1: { scores: [2, 15, 40] },
              2: { scores: [2, 15, 40] }
            }
          }, 2: {
            roundScores: {
              0: { scores: [2, 15, 40] },
              1: { scores: [2, 15, 40] },
              2: { scores: [2, 15, 40] }
            }
          }
        }
      }
    }
  ],
  settings: {
    baseScore: 501,
    inMode: 'double',
    outMode: 'double',
    legCount: 5,
    setCount: 3,
    lobbyMode: 'private',
    bullOff: '25',
    maxRounds: 20
  },
  currentLeg: 0,
  currentSet: 0,
  finished: false,
  createdAt: Date.now(),
  bullOffFinished: false,
  currentPlayerIndex: 0,
  startPlayerIndex: 0,
  currentRound: 0
};*/
//const match = ref<Match | null>(null);
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
      waitingForPlayer.value = false;
      matchId.value = data.matchId;
      match.value = data.match;
      currentPlayerIndex.value = data.match.currentPlayerIndex;
    }
    if (data.type === "bulloff-update") {

      match.value = data.match;

    }
    if (data.type === "switch-turn") {

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
      match.value = data.match;

      match.value?.currentPlayerIndex === 2;
      setTimeout(() => {
        viewBullOffWinner.value = true;
      }, 1000);

      setTimeout(() => {
        viewBullOffWinner.value = false;
        if (!data.match.currentPlayerIndex) {
          match.value?.currentPlayerIndex === 0;
        }
        else {
          match.value?.currentPlayerIndex === 1;
        }
        match.value = data.match;
      }, 3000);
    }
    if (data.type === "dart-update") {
      match.value = data.match;

    }


    if (data.type === "leg-update") {
      match.value = data.match;

    }
    if (data.type === "match-finished") {
      match.value = data.match;
      matchStarted.value = false;
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
      //
      joinMatch(matchId.value);
    }
  }

  window.addEventListener('beforeunload', () => {
    if (ws.value) {
      ws.value.send(JSON.stringify({ type: 'leave-match', matchId: matchId.value, player: { id: user.id, username: user.username } }));
    }
  });
});
// Function to get player index for the current user
function getPlayerIndex(match: Match): number {
  if (!match || !user.id) return -1;

  const index = match.players.findIndex((player) => player.id === user.id);
  return index;
}



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

function bullOffScoring(score: number, multiplier: number, points: number) {
  const currentPlayer = match.value?.players.find((player: any) => player.id === user.id);

  ws.value?.send(JSON.stringify({ type: 'bulloff-dart', matchId: matchId.value, player: currentPlayer, score, multiplier, points }));
}
function score(score: number, multiplier: number, points: number) {
  const currentPlayer = match.value?.players.find((player: any) => player.id === user.id);

  ws.value?.send(JSON.stringify({ type: 'dart-throw', matchId: matchId.value, player: currentPlayer, score, multiplier, points }));
  //ws.value?.send(JSON.stringify({ type: 'x01-match', matchId: matchId.value, player: currentPlayer, score, multiplier, points }));
}
</script>

<style scoped>
.grid-container {
  direction: rtl;
}

.stat-label {
  @apply text-xs text-gray-500;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

/* New styles for fixed width stats */
.stat-column {
  width: 70px;
  min-width: 70px;
}

.stat-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
}

.stat-container:last-child {
  margin-bottom: 0;
}

.stat-value {
  width: 44px;
  min-width: 44px;
  text-align: right;
  font-weight: 500;
  padding-left: 4px;
}
</style>
