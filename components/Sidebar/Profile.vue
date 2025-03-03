<template>
  <div class="flex items-center space-x-3 p-1 cursor-pointer">
    <div class="w-9 h-9 rounded-full  flex items-center justify-center bg-primary shadow-md">
      <img v-if="profileImage" :src="profileImage" alt="Profilbild" class="w-full h-full object-cover" />
      <Icon v-else name="solar:user-circle-bold-duotone" size="30" class="text-gray-400" />
    </div>
    <div class="flex flex-col">
      <p class="text-base font-medium leading-tight">{{ username || 'User' }}</p>
      <p class="text-xs text-green-500 ">Online</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "~/store/user";

const userStore = useUserStore();
const username = ref();
const profileImage = ref();

watch(() => userStore.username, (newUsername) => {
  username.value = newUsername;
});

watch(() => userStore.profileImage, (newProfileImage) => {
  profileImage.value = newProfileImage;
});

onMounted(() => {
  username.value = userStore.username;
  profileImage.value = userStore.profileImage;
});
</script>

<style scoped>
.profile-icon {
  color: rgba(156, 163, 175, 0.8);
}
</style>
