<script lang="ts" setup>
import { useUserStore } from "./store/user";


const useStore = useUserStore();

const user = useSupabaseUser();

watch(user, () => {
  if (user.value) {
    useStore.fetchUserData();

  }
});

onMounted(() => {
  if (user.value) {
    useStore.fetchUserData();

  }
});
</script>

<template>
  <NuxtPage />
</template>
