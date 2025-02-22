<template>
  <div class="flex flex-col text-center items-center space-y-4 cursor-pointer justify-center">
    <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
      <img
        v-if="props.User.image"
        :src="props.User.image"
        alt="Profilbild"
        class="w-52 h-52 rounded-full object-cover"
      />
      <img v-else src="/blankPb.png" alt="Profilbild" class=" w-52 h-52 rounded-full object-fill" />
    </div>
    <div>
      <p class="text-lg text-center font-semibold">{{ props.User.username }}</p>
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