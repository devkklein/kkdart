<template>
  <div>
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-primary p-6 rounded shadow-lg text-center">
        <h1 class="mb-4 text-2xl">{{ winner }} has won the Game!!!</h1>
        <button
          @click="leaveMatch"
          class="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          leave
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();

defineProps({
  winner: String,
});

function leaveMatch() {
  // Logik zum Verlassen des Matches hier einfügen

  router.push("/newMatch");
}
</script>
