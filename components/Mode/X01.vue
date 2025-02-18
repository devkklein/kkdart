<template>
  <div class="p-4">
    <div class="flex space-x-8">
      <div class="flex flex-col flex-1 justify-center">

        <h1 class="p-1">In Mode</h1>
        <select v-model="inMode" class=" rounded p-1 bg-primary">
          <option value="Singel">Singel</option>
          <option value="Double">Double</option>
          <option value="Master">Master</option>
        </select>

        <h1 class="p-1">Out Mode</h1>
        <select v-model="outMode" class=" rounded p-1 bg-primary justify-center">
          <option value="Singel">Singel</option>
          <option value="Double">Double</option>
          <option value="Master">Master</option>
        </select>


      </div>

    
      <div class="flex  flex-1 justify-center ">

        <div class="flex-1 justify-center">
         
            <h1 class="p-1">Base Score</h1>
            <select v-model="baseScore" class="rounded p-1 bg-primary">
              <option value="121">121</option>
              <option value="170">170</option>
              <option value="301">301</option>
              <option value="501">501</option>
              <option value="701">701</option>
              <option value="901">901</option>
              <option value="1001">1001</option>
            </select>
          
          

            <h1 class="p-1"> Max Rounds</h1>
            <select v-model="maxRounds" class="rounded p-1 bg-primary">
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="80">80</option>
              <option value="100">100</option>
            </select>
         
        </div>
        <div class="flex-2 justify-center ">
         
            <h1 class="p-1">Bull-Off</h1>
            <select v-model="bullOff" class="rounded p-1 bg-primary">
              <option value="Off">Off</option>
              <option value="Normal">Normal</option>
              <option value="Offical">Offical</option>
            
            </select>
         
            <h1 class="p-1"> Lobby</h1>
            <select v-model="lobbyMode" class="rounded p-1 bg-primary">
              <option value="Public">Public</option>
              <option value="Private">Private</option>
             
            </select>
          
        </div>


      </div>
      <div class="flex flex-col flex-1 space-y-2 justify-center">
        <div>
          <h1>Legs {{ countLegs }}</h1>
          <input type="range" v-model="countLegs" min="1" max="10" />
        </div>
        <div>
          <h1>Sets {{ countSets }}</h1>
          <input type="range" v-model="countSets" min="1" max="10" />
        </div>
      </div>
    </div>


  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const countLegs = ref(3);
const countSets = ref(1);

const inMode = ref<string>('Singel');
const outMode = ref<string>('Double');
const baseScore = ref<string>('501');
const maxRounds = ref<string>('50');
const bullOff = ref<string>('Normal');
const lobbyMode = ref<string>('Public');

function setInMode(mode: string) {
  inMode.value = mode;
}
</script>

<style></style>
