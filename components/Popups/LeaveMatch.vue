<template>
  <div>
    <div
      v-if="showPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      @click.self="closePopup"
    >
      <div class="bg-priamry p-6 rounded shadow-lg text-center">
        <h1 class="mb-4 text-2xl">Leave match ?</h1>
        <p class="mb-4">
          It is unsportsmanlike to leave a match just because you are playing
          poorly.
        </p>
        <button
          @click="leaveMatch"
          class="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          leave
        </button>
        <button
          @click="closePopup"
          class="bg-green-500 text-white px-4 py-2 rounded"
        >
          stay
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const props = defineProps({
  showPopup: Boolean,
});
const emit = defineEmits(["close"]);

function leaveMatch() {
  // Logik zum Verlassen des Matches hier einfügen
  emit("close");
  router.push("/newMatch");
}
function closePopup() {
  emit("close");
}
</script>
