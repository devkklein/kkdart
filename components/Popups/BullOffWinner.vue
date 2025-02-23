<template>
  <div>
    <div class="absolute  inset-0 bg-black bg-opacity-50 flex justify-center items-center" >
      <div class="bg-priamry p-6 rounded shadow-lg text-center">
        <h1 class="mb-4 text-2xl">{{ winner }} has won the Bull Off!!!</h1>
        <p class="mb-4">The match will start now </p>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  winner: String,
});




</script>
