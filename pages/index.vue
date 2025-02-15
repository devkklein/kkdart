<template>
  <div class="flex  h-screen">
    <Sidebar />
    <div class=" h-full w-full ">
      <div class="grid grid-cols-4 gap-4 p-4">
        <div class="col-span-2 bg-white p-4">
          <AppOnline />
        </div>
        <div class="col-span-1 bg-white p-4">Section 2</div>
        <div class="col-span-1 bg-white p-4">Section 3</div>
      </div>
    
      
     

    </div>
  
  </div>
</template>

<script lang="ts" setup>
import { AppOnline } from '#components';

</script>

<style></style>
