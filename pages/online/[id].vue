<template>
  <div class="flex justify-center items-center h-full w-full">
    <div v-if="matchStarted" class="bg-primary p-20">
      <h1>Match Started</h1>
      <div class="mt-4">
        <p><strong>Dein Score:</strong> {{ scores[playerRole]?.currentScore }}</p>
        <p>
          <strong>Gegner Score:</strong>
          {{
            playerRole === 'Spieler1'
              ? scores['Spieler2']?.currentScore
              : scores['Spieler1']?.currentScore
          }}
        </p>
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
const matchStarted = ref<boolean>(false);
const scores = ref<Record<string, { currentScore: number; legsWon: number; setsWon: number }>>({});
const settings = ref<any>({});
const playerRole = ref<string>('');
const joinCalled = ref<boolean>(false); // Flag verhindern doppelten Join

// Einheitliche Funktion zum Beitreten – mit optionaler Rollenangabe.
const joinMatch =  (matchIdVal: string, role?: 'Spieler1' | 'Spieler2') => {
  if (joinCalled.value) return; // Falls schon join ausgeführt, tue nichts
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
    }
  };

  ws.value.onopen = () => {
    ws.value?.send(JSON.stringify({ type: 'join-match', matchId: matchIdVal , player: {id: user.id , username: user.username}  }));
  };
};

onMounted(() => {
  matchId.value = route.params.id as string;
 
  if (matchId.value) {
    if (route.query.creator === 'true') {
      // Ersteller als Spieler1: Übergib explizit die Rolle, damit joinMatch sie nicht überschreibt.
      joinMatch(matchId.value, 'Spieler1');
    } else {
      joinMatch(matchId.value);
    }
  }

  window.addEventListener('beforeunload', () => {
    if (ws.value) {
      ws.value.send(JSON.stringify({ type: 'leave-match', matchId: matchId.value , player: {id: user.id , username: user.username} }));
    }
  });
});

onBeforeUnmount(() => {
  if (ws.value) {
    ws.value.send(JSON.stringify({ type: 'leave-match', matchId: matchId.value , player: {id: user.id , username: user.username} }));
    ws.value.close();
  }
});
</script>

<style></style>
