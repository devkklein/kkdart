<template>
  <div class="flex h-full w-full justify-center items-center">
    <form
      class="flex flex-col justify-center items-center bg-white p-4 rounded-lg shadow-lg space-y-5">
      <h1 class="text-3xl border-b-2 border-green-500">Create Offline Game</h1>
      <div class="flex  justify-center text-center items-center space-x-2">
        <h1>Spieler</h1>
        <Icon name="zondicons:add-outline" size="20" class="cursor-pointer text-green-500" />
      </div>
      <div class="flex flex-row space-x-5 ">
        <div v-for="player in players" :key="player.id" class="">
          <div
            class="w-13 h-13 rounded-full overflow-hiddenflex items-center justify-center text-center">
            <img
              v-if="player.profileImage"
              :src="player.profileImage"
              alt="Profilbild"
              class="w-full h-full object-cover" />
              <img
              v-else
              src="/blankPb.png"
              alt="Profilbild"
                class="w-20 h-20 rounded-full object-fill" />
          </div>
          <div class="flex  justify-center text-center items-center space-x-2" >
            <p class="text-lg font-semibold">{{ player.username }}</p>
            <Icon name="material-symbols:delete-outline-rounded" size="20" class="cursor-pointer text-red-600" />
          </div>
        </div>
      
      </div>
      <div class="flex justify-center items-center space-x-2">
        <h1>Base Score</h1>
       <div  class="bg-green-500 rounded-lg shadow-lg" >
        <button class=""> 121 </button>
        <button class=""> 170 </button>
        <button class=""> 301 </button>
        <button class=""> 501 </button>
        <button class=""> 701 </button>
        <button class=""> 901 </button>

       </div>
      </div>

      <button type="submit">Create Game</button>
    </form>
  </div>
</template>

<script lang="ts" setup>






const players = ref([
  {
    id: 1,
    username: "Player 1",
    profileImage: ""
  },
  {
    id: 2,
    username: "Player 2",
    profileImage: ""
  }
])

</script>

<style></style>
