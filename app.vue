<script lang=ts setup>
import { useUserStore } from './store/user';

const useStore = useUserStore();
const user = useSupabaseUser();

onMounted(() => {
  if (user.value) {
    useStore.fetchUserData();
  }
});

</script>

<template>
  <NuxtPage />
</template>
