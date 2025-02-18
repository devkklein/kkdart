<template>
  <div
    class="relative flex items-center space-x-4 cursor-pointer p-4 justify-center"
  >
    <div
      class="w-13 h-13 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
    >
      <img
        v-if="profileImage"
        :src="profileImage"
        alt="Profilbild"
        class="w-full h-full object-cover"
      />
      <Icon
        v-else
        name="solar:user-circle-bold-duotone"
        style="color: gray"
        size="40"
      />
    </div>
    <div>
      <p class="text-lg font-semibold">{{ username }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "~/store/user";

const userStore = useUserStore();
const username = computed(() => userStore.username);
const profileImage = computed(() => userStore.profileImage);

// Hier kannst du den Benutzernamen setzen
</script>

<style scoped>
/* Zusätzliche Stile hier */
</style>
