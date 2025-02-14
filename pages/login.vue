<template>
  <div class="flex h-screen">
    <div
      class="w-1/2 bg-gray-200 min-h-full flex flex-col items-center justify-center"
    >
      <form @submit.prevent="login"
        class="bg-white flex flex-col items-right justify-center p-8 rounded-lg shadow-xl space-y-4"
      >
        <h1 class="text-3xl">Willkommen zurück zu OpenDarts</h1>
        <p class="text-gray-500 text-sm">Die opensource online Dartplatform</p>

        <div class="flex flex-col min-w-1/2">
          <label for="username">Email</label>
          <input
          v-model="email"
            type="email"
            id="email"
            placeholder="Email"
            class="border rounded p-2"
          />
        </div>

        <div class="flex flex-col">
          <label for="password">Passwort</label>
          <input
          v-model="password"
            type="password"
            id="password"
            placeholder="Password"
            class="border rounded p-2"
          />
        </div>

        <button type="submit" class="text-white rounded p-2">Login</button>
        <div class="flex items-right space-x-2">
          <p class="text-xs text-gray-500">Noch keinen Account?</p>
          <nuxt-link
            to="/register"
            class="border-b border-gray-400 hover:text-blue-500 text-xs"
            >Registrieren
          </nuxt-link>
        </div>
      </form>
    </div>
    <div class="w-1/2 min-h-full bg-herobg bg-center bg-cover">
      <h1></h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
const client = useSupabaseClient();
const router = useRouter();

const email = ref<string>("");
const password = ref<string>("");

async function login() {
  const {user, session, error } = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  
  if (error) {
    console.error(error);
  } else {
    console.log(user,session );
    router.push("/");
  }
}
</script>

<style scoped></style>
