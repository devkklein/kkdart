<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="h-full w-full flex justify-center items-center p-20 space-x-10">
      <div
        class="flex-1 h-full shadow-xl rounded-xl bg-boardbg bg-center bg-cover cursor-pointer transition-transform duration-700 hover:-translate-y-4"
      >
        <div
          @click="createLobby"
          class="p-10 bg-primary bg-opacity-70 rounded-xl w-full h-full flex flex-col justify-end"
        >
          <h1 class="text-4xl font-bold">Create Lobby</h1>
          <p class="text-lg text-gray-300">Create your own Online Game</p>
        </div>
      </div>
      <div
        class="flex-1 h-full shadow-xl rounded-xl bg-herobg bg-center bg-cover cursor-pointer transition-transform duration-700 hover:-translate-y-4"
      >
        <div
          class="p-10 bg-primary bg-opacity-70 rounded-xl w-full h-full flex flex-col justify-end"
        >
          <h1 class="text-4xl font-bold">Lobbys</h1>
          <p class="text-lg text-gray-300">Browse existing Game Lobbys</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();

function createLobby() {
  router.push("/online/create");
}
</script>

<style></style>
