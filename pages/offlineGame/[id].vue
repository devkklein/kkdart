<template>
  <div class="h-screen" v-if="game">
    <!-- Falls noch kein Startspieler festgelegt wurde, wird ein Auswahlfeld angezeigt -->

    <!-- Sobald ein Startspieler festgelegt wurde, wird das normale Spiel-Layout angezeigt -->
    <div>
      <div class="flex justify-center items-center space-x-4 p-10">
        <div
          v-for="player in game.players"
          :key="player.id"
          :style="{ width: 100 / game.players.length + '%' }"
          class="flex flex-col justify-around items-center rounded-xl bg-gray-900 shadow-xl p-4">
          <img
            v-if="player.profileImage"
            :src="player.profileImage"
            alt="Profilbild"
            class="w-40 h-40 rounded-full object-cover" />
          <img
            v-else
            src="/game-icons--dart.png"
            alt="Profilbild"
            class="w-40 h-40 rounded-full object-fill" />
          <div class="space-y-2 text-center">
            <h1 class="text-3xl text-white">{{ player.username }}</h1>
            <h1 class="text-7xl text-red-500">{{ game.basescore }}</h1>
          </div>
          <h1 class="text-3xl text-gray-400">average</h1>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4 p-10">
        <div
          v-for="player in playersLeft"
          :key="player.id"
          class="col-span-1 flex flex-col justify-around items-center rounded-xl shadow-lg p-4 bg-white">
          {{ player.username }}
        </div>
        <div
          class="col-span-2 flex flex-col justify-around items-center rounded-xl shadow-lg p-4 bg-white">
          <GameInputButtons v-if="inputMode" />
          <GameInputTypeIn v-else @submitScore="handleSubmitScore" />
          <div v-if="!game.startingPlayerId" class="p-10">
            <p class="mb-4 text-xl">Wähle den Startspieler:</p>
            <select v-model="selectedStartingPlayer" class="p-2 border rounded">
              <option disabled value="">-- Bitte wählen --</option>
              <option
                v-for="player in game.players"
                :key="player.id"
                :value="player.id">
                {{ player.username }}
              </option>
            </select>
            <button
              @click="confirmStartingPlayer"
              class="ml-4 p-2 bg-green-500 text-white rounded">
              Startspieler festlegen
            </button>
          </div>
          <!-- Anzeige der bisherigen Eintragungen (Turns) für den Startspieler -->
          <div class="mt-4">
            <h2 class="mb-2 text-lg">Bisherige Eintragungen:</h2>
            <ul>
              <li v-for="(turn, idx) in turns" :key="idx">
                {{ turn }}
              </li>
            </ul>
          </div>
        </div>
        <div
          v-for="player in playersRight"
          :key="player.id"
          class="col-span-1 flex flex-col justify-around items-center rounded-xl shadow-lg p-4 bg-white">
          {{ player.username }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useOffline_X01_GameStore } from "~/store/offline_X01_Games";
import { useUserStore } from "~/store/user";
import type { Player, OfflineGame } from "~/types/interface";
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const gameStore = useOffline_X01_GameStore();
const inputMode = ref(false);

const playersLeft = ref<Player[]>([]);
const playersRight = ref<Player[]>([]);
const game = ref<OfflineGame | null>(null);
// Variable für den im Select gewählten Startspieler
const selectedStartingPlayer = ref<string | "">("");
// Array, um Eintragungen (z. B. Turn-Scores) zu speichern
const turns = ref<number[]>([]);

function initializePlayers(gameObj: OfflineGame) {
  gameObj.players = gameObj.players.map((player: Player) => ({
    ...player,
    currentScore: player.currentScore ?? gameObj.basescore,
  }));
  playersLeft.value = gameObj.players.filter((_, index) => index % 2 === 0);
  playersRight.value = gameObj.players.filter((_, index) => index % 2 !== 0);
}

onMounted(() => {
  const gameId = route.params.id as string;
  const foundGame = gameStore.getGameById(gameId);
  if (foundGame) {
    initializePlayers(foundGame);
    game.value = foundGame;
  } else {
    router.push("/offline");
  }
});

function confirmStartingPlayer() {
  if (!selectedStartingPlayer.value) return;
  if (game.value) {
    // Hier wird der Startspieler in der Spielinstanz gespeichert.
    game.value.startingPlayerId = selectedStartingPlayer.value;
    // Optional: Wenn ein neuer Startspieler gewählt wird, könnte man
    // bisherige Eintragungen zurücksetzen.
    turns.value = [];
  }
}

function handleSubmitScore(score: number) {
  // Hier werden alle Punkte (z.B. vom InputTypeIn) gesammelt und den Turns hinzugefügt.
  // Die Funktion wird per Event aus GameInputTypeIn aufgerufen.
  // Du kannst diese Logik erweitern, um je nach Spieler abzuwechseln.
  turns.value.push(score);
}
</script>

<style></style>
