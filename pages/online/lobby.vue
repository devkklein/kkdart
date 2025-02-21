<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Verfügbare Matches</h1>
    <ul>
      <li v-for="match in matches" :key="match.matchId" class="mb-2 p-4 bg-primary rounded flex justify-between items-center">
        <div>
          <p><strong>In Mode:</strong> {{ match.settings.inMode }}</p>
          <p><strong>Out Mode:</strong> {{ match.settings.outMode }}</p>
          <p><strong>Base Score:</strong> {{ match.settings.baseScore }}</p>
          <p><strong>Legs:</strong> {{ match.settings.legCount }} | <strong>Sets:</strong> {{ match.settings.setCount }}</p>
        </div>
        <button @click="joinMatch(match.matchId)" class="bg-secondary-300 text-white rounded p-2">Beitreten</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const matches = ref<Array<{ matchId: string; settings: any }>>([]);
const ws = ref<WebSocket | null>(null);

const joinMatch = (matchId: string) => {
  // Navigiere zur Match-Seite. Eventuell kannst du hier auch gleich den
  // join-match WS-Call implementieren, wenn der [id].vue das übernimmt.
  router.push(`/online/${matchId}`);
};

onMounted(() => {
  ws.value = new WebSocket(`${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}/api/ws`);
  
  ws.value.onopen = () => {
    ws.value?.send(JSON.stringify({ type: "list-matches" }));
  };
  
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "matches-list") {
      matches.value = data.matches.map((match: any) => ({
        matchId: match.matchId,
        settings: match.settings._value || match.settings // Füge dies hinzu, um sicherzustellen, dass du auf die richtigen Werte zugreifst
      }));
      console.log("Received matches:", matches.value);
    }
  };
});
</script>

<style scoped>
/* Füge hier deine Styles hinzu */
</style>