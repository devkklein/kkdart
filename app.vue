<script lang="ts" setup>
import { useUserStore } from "./store/user";
import { useStatsStore } from "./store/stats";

const useStore = useUserStore();
const statsStore = useStatsStore();
const user = useSupabaseUser();

onMounted(() => {
  if (user.value) {
    useStore.fetchUserData();
    statsStore.fetchStatsData();
  }
});
</script>

<template>
  <NuxtPage />
</template>
