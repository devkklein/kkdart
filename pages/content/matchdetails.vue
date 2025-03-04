<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="h-full w-full overflow-y-auto">
      <GameMatchSummary :match="match" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Match } from "~/types/websocket";
const match = useState<Match>("selectedMatch");
</script>

<style></style>
