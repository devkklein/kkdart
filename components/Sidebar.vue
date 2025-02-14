<template>
  <div class="h-screen w-64 bg-gray-800 text-white flex flex-col justify-between">
    <div>
      <SidebarProfile />
    

    <ul>
      <li>
        <Icon name="simple-icons:dart" size="20" />
        <router-link to="/">Home</router-link>
      </li>
      <span></span>
      <p> Game</p>
      <li>
        <Icon name="mdi:web" size="20" />
        <router-link to="/online">Online</router-link>
      </li>
      <li>
        <Icon name="game-icons:dart" size="20" />
        <router-link to="/offline">Offline</router-link>
      </li>
      <li>
        <Icon name="game-icons:laurels-trophy" size="20" />
        <router-link to="/tournaments">Tournaments</router-link>
      </li>
      <span></span>
      <p>Stats</p>
      <li>
        <Icon name="material-symbols:history" size="20" />
        <router-link to="/history">History</router-link>
      </li>
      <li>
        <Icon name="lets-icons:stat" size="20" />
        <router-link to="/statistics">Statistics</router-link>
      </li>
      <span></span>
      <p>Settings</p>
      <li>
        <Icon name="tdesign:dart-board" size="20" />
        <router-link to="/boards">Boards</router-link>
      </li>
    </ul>
    </div>
    <div class="p-4">
      <button @click="logout" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const client = useSupabaseClient();
const router = useRouter();

async function logout() {
  try{
  const {error} = await client.auth.signOut();
  if(error)throw error;
  router.push("/login");
  }catch(error){
    console.error(error);
  }
}


</script>

<style></style>
