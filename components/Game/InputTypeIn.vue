<template>
  <div>
    <input
      v-model.number="score"
      type="number"
      class="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
      placeholder="Score"
      @keyup.enter="submitScore"
      @keypress="allowOnlyNumbers" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits(['submitScore'])
const score = ref(null)

const submitScore = () => {

  emit('submitScore', score.value)
  score.value = null
}

const allowOnlyNumbers = (evt: KeyboardEvent) => {
  // Erlaubte Zeichen: 0-9 und ggf. einen Minus-/Punkt-Zeichen
  const char = String.fromCharCode(evt.charCode)
  if (!/[0-9]/.test(char)) {
    evt.preventDefault()
  }
}
</script>

<style>
</style>