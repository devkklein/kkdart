<template>
  <div>
    <button @click="test" type="button">list matches</button>

    <div v-if="matchHistory" v-for="match in matchHistory" :key="match.id">

      <p>{{ new Date(match.createdAt).toLocaleString() }}</p>
      <div v-for="player in match.players">
        <p>{{ player.username }}</p>


      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/store/user';
import type { Match } from '~/types/websocket';
const matchHistory = ref<Match[]>([]);
const store = useUserStore();

async function test() {
  const userId = store.id;
  const { matches, error: apiError } = await $fetch(`https://${window.location.host}/api/user/getMatchHistory`, {
    method: "POST",
    body: { userId },
  });
  if (apiError) {
    console.error("Error fetching match history:", apiError);

  }
  else {
    console.log(matches);
    matchHistory.value = matches;
  }

}


</script>

<style></style>
