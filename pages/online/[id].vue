<template>
  <div class="flex justify-center items-center h-full w-full">
    <div v-if="matchStarted" class="bg-primary p-20">
      <div class="flex">
        <div class="flex flex-col">
          <GameProfile :User="players[0]" />
          <p>Current Score: {{ scores.Spieler1.currentScore }}</p>
          <p>Legs Won: {{ scores.Spieler1.legsWon }}</p>
          <p>Sets Won: {{ scores.Spieler1.setsWon }}</p>
        </div>
        <div class="flex flex-col">
          <GameProfile :User="players[1]" />
          <p>Current Score: {{ scores.Spieler2.currentScore }}</p>
          <p>Legs Won: {{ scores.Spieler2.legsWon }}</p>
          <p>Sets Won: {{ scores.Spieler2.setsWon }}</p>
        </div>
      </div>
    </div>
    <div v-else class="bg-primary p-20">
      <h1>Waiting for Enemy player</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '~/store/user';

const user = useUserStore();
const route = useRoute();
const matchId = ref<string | null>(null);
const ws = ref<WebSocket | null>(null);
const matchStarted = ref<boolean>(true);
const scores = ref<Record<string, { currentScore: number; legsWon: number; setsWon: number }>>({
  Spieler1: { currentScore: 501, legsWon: 0, setsWon: 0 },
  Spieler2: { currentScore: 501, legsWon: 0, setsWon: 0 }
});
const settings = ref<any>({});
const playerRole = ref<string>('');
const joinCalled = ref<boolean>(false); 
const players = ref<any>([
  { id: '1', username: 'Player1', image: null },
  { id: '2', username: 'Player2', image: null }
]);

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
</script>

<style></style>
