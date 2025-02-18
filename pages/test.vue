<template>
  <div>
    <button @click="showId" type="button">crate match</button>
    <button @click="createMatch" type="button">crate match</button>
  </div>
</template>

<script lang="ts" setup>
const ws = ref<WebSocket | null>(null);
const matchId = ref<string | null>(null);

const createMatch = () => {
  ws.value = new WebSocket(`ws://${window.location.host}/api/ws`);
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "match-created") {
      matchId.value = data.matchId;
    }
  };
  ws.value.onopen = () => {
    ws.value?.send(JSON.stringify({ type: "create-match" }));
  };
};
const showId = () => {
  alert(matchId.value);
};
</script>

<style></style>
