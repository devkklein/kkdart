<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="h-full w-full overflow-y-auto">

      <GameMatchSummary v-if="match?.finished && match" :match="match" />

      <div v-if="match?.started && match" class="w-full p-4">
        <GameMatchSettings :match="match" />
        <div class="flex flex-col justify-end">
          <div class="flex">
            <div class="flex w-8/12 flex-col">
              <div class="grid grid-flow-col py-4 space-x-5">
                <div v-for="(player, playerIndex) in sortedPlayers" :key="playerIndex">
                  <GameUserCard :player="player" :match="match" />
                </div>
              </div>

              <GameInputButtons v-if="match.bullOffFinished" @score="score" />
              <GameInputBulloff v-if="!match.bullOffFinished" @bullOffScoring="bullOffScoring" />
            </div>
            <div class="w-8/12 flex py-4 pl-4 pr-0 rounded-xl">
              <div class="flex flex-col w-full">
                <GameScoreChart :player="match.players[getPlayerIndex(match)]" />
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="waitingForPlayer && match && matchId" class="w-full h-full">
        <GameWaitingRoom :matchId="matchId" :settings="match.settings" :players="match.players"
          @cancel="handleCancelMatch" @start="handleStartMatch" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DartScore, Match } from "~/types/websocket";
import { useUserStore } from "~/store/user";

const router = useRouter();

const user = useUserStore();
const route = useRoute();
const matchId = ref<string | null>(null);
const ws = ref<WebSocket | null>(null);
const bullOffTie = ref<boolean>(false);

const currentPlayerIndex = ref<number>(0);

const bullOffWinner = ref<string>("");
const matchWinner = ref<string>("");
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
const joinMatch = (matchIdVal: string, role?: "Spieler1" | "Spieler2") => {
  ws.value = new WebSocket(
    `${window.location.protocol === "https:" ? "wss://" : "ws://"}${window.location.host
    }/api/webSocket/ws`
  );

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "match-joined") {
      match.value = data.match;
      matchId.value = data.matchId;
    }
    if (data.type === "match-start") {
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
      bullOffWinner.value = data.winner;
      match.value = data.match;

      match.value?.currentPlayerIndex === 2;




      if (!data.match.currentPlayerIndex) {
        match.value?.currentPlayerIndex === 0;
      } else {
        match.value?.currentPlayerIndex === 1;
      }
      match.value = data.match;

    }
    if (data.type === "dart-update") {
      match.value = data.match;
    }

    if (data.type === "leg-update") {
      match.value = data.match;
    }
    if (data.type === "match-finished") {
      match.value = data.match;

      matchWinner.value = data.winner;
    }
  };

  ws.value.onopen = () => {
    ws.value?.send(
      JSON.stringify({
        type: "join-match",
        matchId: matchIdVal,
        player: {
          id: user.id,
          username: user.username,
          image: user.profileImage || null,
        },
      })
    );
  };
};
const sortedPlayers = computed(() => {
  if (!match.value || !match.value.players) {
    return [];
  }

  const players = [...match.value.players];

  players.sort((a, b) => {
    if (a.id === user.id) return -1;
    if (b.id === user.id) return 1;

    return 0;
  });
  return players;
});

// mount functions
onMounted(() => {
  matchId.value = route.params.id as string;

  if (matchId.value) {
    if (route.query.creator === "true") {
      joinMatch(matchId.value, "Spieler1");
    } else {
      //
      joinMatch(matchId.value);
    }
  }

  window.addEventListener("beforeunload", () => {
    if (ws.value) {
      ws.value.send(
        JSON.stringify({
          type: "leave-match",
          matchId: matchId.value,
          player: { id: user.id, username: user.username },
        })
      );
    }
  });
});

onBeforeUnmount(() => {
  if (ws.value) {
    ws.value.send(
      JSON.stringify({
        type: "leave-match",
        matchId: matchId.value,
        player: { id: user.id, username: user.username },
      })
    );
    ws.value.close();
  }
});

// utility functions
function handleCancelMatch() {
  router.back();
}
function handleStartMatch() {
  ws.value?.send(
    JSON.stringify({ type: "start-match", matchId: matchId.value })
  );
}

function bullOffScoring(score: number, multiplier: number, points: number) {
  const currentPlayer = match.value?.players.find(
    (player: any) => player.id === user.id
  );

  ws.value?.send(
    JSON.stringify({
      type: "bulloff-dart",
      matchId: matchId.value,
      player: currentPlayer,
      score,
      multiplier,
      points,
    })
  );
}
function score(score: number, multiplier: number, points: number) {
  const currentPlayer = match.value?.players.find(
    (player: any) => player.id === user.id
  );

  ws.value?.send(
    JSON.stringify({
      type: "dart-throw",
      matchId: matchId.value,
      player: currentPlayer,
      score,
      multiplier,
      points,
    })
  );
  //ws.value?.send(JSON.stringify({ type: 'x01-match', matchId: matchId.value, player: currentPlayer, score, multiplier, points }));
}
</script>

<style scoped></style>
