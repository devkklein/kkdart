<template>
  <div class="h-screen w-64 bg-black text-white flex flex-col justify-between">
    <div>
      <SidebarProfile />

      <ul>
        <li>
          <div class="flex justify-center bg-yellow-600 rounded-full p-1">
            <Icon name="simple-icons:dart" size="20" />
          </div>
          <router-link to="/">Home</router-link>
        </li>
        <span></span>
        <p>Game</p>
        <li>
          <div class="flex justify-center bg-blue-500 rounded-full p-1">
            <Icon name="mdi:web" size="20" />
          </div>
          <router-link to="/newMatch">Online</router-link>
        </li>
        <li>
          <div class="flex justify-center bg-green-500 rounded-full p-1">
            <Icon name="game-icons:dart" size="20" />
          </div>
          <router-link to="/offline">Offline</router-link>
        </li>
        <li>
          <div class="flex justify-center bg-yellow-500 rounded-full p-1">
            <Icon name="game-icons:laurels-trophy" size="20" />
          </div>
          <router-link to="/tournaments">Tournaments</router-link>
        </li>
        <span></span>
        <p>Stats</p>
        <li>
          <div class="flex justify-center bg-red-500 rounded-full p-1">
            <Icon name="material-symbols:history" size="20" />
          </div>
          <router-link to="/history">History</router-link>
        </li>
        <li>
          <div class="flex justify-center bg-purple-500 rounded-full p-1">
            <Icon name="famicons:stats-chart" size="20" />
          </div>
          <router-link to="/statistics">Statistics</router-link>
        </li>
        <span></span>
        <p>Settings</p>
        <li>
          <div class="flex justify-center bg-blue-400 rounded-full p-1">
            <Icon name="tdesign:dart-board" size="20" />
          </div>
          <router-link to="/boards">Boards</router-link>
        </li>
      </ul>
    </div>
    <div class="p-4">
      <button
        @click="logout"
        class="flex flex-col justy-center items-center text-center w-full bg-primary text-white y-2 px-4 rounded hover:bg-secondary-300"
      >
        <Icon name="mdi:logout" size="20" class="scale-x-[-1]" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const client = useSupabaseClient();
const router = useRouter();

async function logout() {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    router.push("/login");
  } catch (error) {
    console.error(error);
  }
}
</script>

<style></style>
