<template>
  <div class=" flex flex-col text-center  items-center space-x-4 cursor-pointer p-4 justify-center">
    <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
      <img
        v-if="props.User.image"
        :src="props.User.image"
        alt="Profilbild"
        class="w-full h-full object-cover"
      />
      <img v-else src="/blankPb.png" alt="Profilbild" class="w-20 h-20 rounded-full object-fill" />
    </div>
    <div class="flex  justify-center text-center items-center space-x-2">
      <p class="text-lg font-semibold">{{ props.User.username }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>


const emit = defineEmits();

const props = defineProps<{
  User: {
    userId: string;
    username: string;
    image: string;
  } 
// Stelle sicher, dass userId als string definiert ist
}>();


</script>

<style>
/* Füge hier deine Styles hinzu */
</style>