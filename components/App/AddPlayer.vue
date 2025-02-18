<template>
  <div
    class="absolute inset-0"
    v-if="showPopup"
    @click.self="emit('close')"
  ></div>
  <div v-if="showPopup" class="absolute" @click.self="emit('close')">
    <div class="w-96">
      <div class="bg-primary rounded-2xl shadow-2xl p-6 text-center space-y-2">
        <h2>Add Player</h2>
        <div class="space-x-4 flex items-center justify-center">
          <input
            v-model="playerName"
            type="text"
            placeholder="Enter player name"
            class="text-black"
          />
          <button class="" @click="addPlayer" type="button">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  showPopup: Boolean,
});

const emit = defineEmits(["update:showPopup", "playerAdded", "close"]);

let playerName = "";

const closePopup = () => {
  emit("update:showPopup", false);
};

const addPlayer = () => {
  const player = {
    id: "offline_" + playerName,
    username: playerName,
    profileImage: "",
  };
  emit("playerAdded", player);
};
</script>
