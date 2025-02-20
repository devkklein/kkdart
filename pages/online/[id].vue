<template>
  <div> {{ matchId }}</div>
</template>

<script lang="ts" setup>

const matchId = ref<string | null>(null);
const route = useRoute();
const ws = ref<WebSocket | null>(null);

const joinMatch = (matchId: string) => {
  ws.value = new WebSocket(`ws://${window.location.host}/api/ws`);
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "match-joined") {
      alert("Match joined: " + data.matchId);
    }
  };
  ws.value.onopen = () => {
    ws.value.send(JSON.stringify({ type: 'join-match', matchId }));
  };
};


onMounted(() => {

  matchId.value = route.params.id as string;
  joinMatch(matchId.value);
});

</script>

<style></style>
