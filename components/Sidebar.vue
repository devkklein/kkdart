<template>
  <div class="h-screen w-64 bg-secondary-300 text-white flex flex-col justify-between border-r border-primary">
    <!-- Header with Profile -->
    <div class="h-full flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-primary mb-4">
        <SidebarProfile />
        <SidebarOptions />
      </div>

      <!-- Navigation Menu -->
      <div class=" px-3 flex-1 overflow-y-auto">
        <!-- Home Section -->
        <div class="mb-6">
          <div class="p-2 bg-primary rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
            <router-link to="/"
              class="flex items-center space-x-3 p-2 hover:bg-secondary-400 rounded-lg transition-all">
              <div class="flex justify-center items-center bg-yellow-600 rounded-full p-2 min-w-8 min-h-8">
                <Icon name="simple-icons:dart" size="16" />
              </div>
              <span class="text-sm">Home</span>
            </router-link>
          </div>
        </div>

        <!-- Game Section -->
        <div class="mb-6">
          <p class="text-xs uppercase tracking-wider mb-2 px-2 opacity-70">Game</p>
          <div class="p-2 bg-primary rounded-xl shadow-lg space-y-1">
            <router-link to="/newMatch"
              class="flex items-center space-x-3 p-2 hover:bg-secondary-400 rounded-lg transition-all">
              <div class="flex justify-center items-center bg-blue-500 rounded-full p-2 min-w-8 min-h-8">
                <Icon name="mdi:web" size="16" />
              </div>
              <span class="text-sm">Online</span>
            </router-link>

            <router-link to="/offline"
              class="flex items-center space-x-3 p-2 hover:bg-secondary-400 rounded-lg transition-all">
              <div class="flex justify-center items-center bg-green-500 rounded-full p-2 min-w-8 min-h-8">
                <Icon name="game-icons:dart" size="16" />
              </div>
              <span class="text-sm">Offline</span>
            </router-link>

            <router-link to="/tournaments"
              class="flex items-center space-x-3 p-2 hover:bg-secondary-400 rounded-lg transition-all">
              <div class="flex justify-center items-center bg-yellow-500 rounded-full p-2 min-w-8 min-h-8">
                <Icon name="game-icons:laurels-trophy" size="16" />
              </div>
              <span class="text-sm">Tournaments</span>
            </router-link>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="mb-6">
          <p class="text-xs uppercase tracking-wider mb-2 px-2 opacity-70">Stats</p>
          <div class="p-2 bg-primary rounded-xl shadow-lg space-y-1">
            <router-link to="/history"
              class="flex items-center space-x-3 p-2 hover:bg-secondary-400 rounded-lg transition-all">
              <div class="flex justify-center items-center bg-red-500 rounded-full p-2 min-w-8 min-h-8">
                <Icon name="material-symbols:history" size="16" />
              </div>
              <span class="text-sm">History</span>
            </router-link>

            <router-link to="/statistics"
              class="flex items-center space-x-3 p-2 hover:bg-secondary-400 rounded-lg transition-all">
              <div class="flex justify-center items-center bg-purple-500 rounded-full p-2 min-w-8 min-h-8">
                <Icon name="famicons:stats-chart" size="16" />
              </div>
              <span class="text-sm">Statistics</span>
            </router-link>
          </div>
        </div>

        <!-- Settings Section -->
        <div class="mb-6">
          <p class="text-xs uppercase tracking-wider mb-2 px-2 opacity-70">Settings</p>
          <div class="p-2 bg-primary rounded-xl shadow-lg">
            <router-link to="/boards"
              class="flex items-center space-x-3 p-2 hover:bg-secondary-400 rounded-lg transition-all">
              <div class="flex justify-center items-center bg-blue-400 rounded-full p-2 min-w-8 min-h-8">
                <Icon name="tdesign:dart-board" size="16" />
              </div>
              <span class="text-sm">Boards</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.router-link-active {
  background-color: #ffffff1a;
  border-radius: 0.5rem;
}
</style>
