<template>
  <div class="flex h-screen">
    <div class="w-1/2 bg-gray-200 min-h-full flex flex-col items-center justify-center">
      <form class=" bg-white flex flex-col items-right justify-center p-8 rounded-lg shadow-xl space-y-4">
        <h1 class="text-3xl">Willkommen zu Open Darts</h1>
        <p class="text-gray-500 text-sm">
          Die opensource online Dartplatform
        </p>
        <div class="flex items-center justify-center space-x-5">
          <div class="flex flex-col">
            <label for="firstname">Vorname</label>
            <input type="text" placeholder="Vorname" class="" />
          </div>
          <div class="flex flex-col min-w-1/2">
            <label for="lastname">Nachname</label>
            <input type="text" placeholder="Nachname" class="" />
          </div>
        </div>
        <div class="flex flex-col">
          <label for="email"> Emailadresse</label>
          <input type="email" placeholder="Email" class="" />
        </div>
        <div class="flex items-center justify-center space-x-5">
          <div class="flex flex-col">
            <label for="password"> Passwort</label>
            <input type="password" placeholder="Password" class="" />
          </div>
          <div class="flex flex-col">
            <label for="password"> Passwort Bestätigen</label>
            <input type="password" placeholder="Password" class="" />
          </div>
        </div>
        <div>
          <p class="text-xs text-gray-500">
            Mit dem erstellen eines Accounts stimmen sie unserer
            <a href="#" class="border-b border-gray-400 hover:text-blue-500">Nutzungsvereinbahrung</a>
            und
          </p>
          <p class="text-xs text-gray-500">
            <a href="#" class="border-b border-gray-400 hover:text-blue-500">Datenschutzerklärung</a>
            zu
          </p>
        </div>
        <button class="">Registrieren</button>
        <div class="flex items-right space-x-2">
          <p class="text-xs text-gray-500">Bereits ein Account?</p>
          <nuxt-link to="/login" class="border-b border-gray-400 hover:text-blue-500 text-xs">Einloggen</nuxt-link>

        </div>
      </form>
    </div>
    <div class="w-1/2 min-h-full bg-herobg bg-center bg-cover">
      <h1></h1>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>