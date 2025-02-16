<template>
  <div class="flex h-screen">
    <div
      class="w-1/2 bg-gray-200 min-h-full flex flex-col items-center justify-center"
    >
      <form
      @submit.prevent="signUp"
        class="bg-white flex flex-col items-right justify-center p-8 rounded-lg shadow-xl space-y-4"
      >
        <h1 class="text-3xl text-black">Willkommen zu Open Darts</h1>
        <p class="text-gray-500 text-sm">Die opensource online Dartplatform</p>

        <div class="flex flex-col min-w-1/2">
          <label for="username">Benutzername</label>
          <input class="text-black" v-model="username" type="text" placeholder="Benutzername"  />
        </div>

        <div class="flex flex-col">
          <label for="email"> Emailadresse</label>
            <input v-model="email" type="email" placeholder="Email" class="text-black" />
        </div>
        <div class="flex items-center justify-center space-x-5">
          <div class="flex flex-col">
            <label for="password"> Passwort</label>
            <input v-model="password" type="password" placeholder="Password" class="text-black" />
          </div>
          <div class="flex flex-col">
            <label for="password"> Passwort Bestätigen</label>
            <input v-model="password2" type="password" placeholder="Password" class="text-black" />
          </div>
        </div>
        <div>
          <p class="text-xs text-gray-500">
            Mit dem erstellen eines Accounts stimmen sie unserer
            <a href="#" class="border-b border-gray-400 hover:text-blue-500"
              >Nutzungsvereinbahrung</a
            >
            und
          </p>
          <p class="text-xs text-gray-500">
            <a href="#" class="border-b border-gray-400 hover:text-blue-500"
              >Datenschutzerklärung</a
            >
            zu
          </p>
        </div>
        <button type="submit" class="">Registrieren</button>
        <div class="flex items-right space-x-2">
          <p class="text-xs text-gray-500">Bereits ein Account?</p>
          <nuxt-link
            to="/login"
            class="border-b border-gray-400 hover:text-blue-500 text-xs text-black"
            >Einloggen</nuxt-link
          >
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

const username = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const password2 = ref<string>("");

const errorMsg = ref<string>("");
const successMsg = ref<string>("");

async function saveUserData(userId: string) {
  try {
    const { data, error } = await client
      .from('User')
      .insert([
        { id: userId, email: email.value, username: username.value }
      ]);
      
    if (error) throw error;
    console.log('User data saved:', data);
  } catch (error) {
    console.error('Error saving user data:', error.message);
  }
}

async function saveUserStatistic(userId: string) {
  try {
    const { data, error } = await client
      .from('Statistics')
      .insert([{ User_id: userId }]); // Stelle sicher, dass in der Tabelle Statistics die Spalte "userId" vorhanden ist!
    if (error) throw error;
    console.log('Statistics created:', data);
  } catch (error) {
    console.error('Error saving statistics:', error.message);
  }
}


async function signUp() {
  if (password.value === password2.value) {
    try {
      const{data, error} = await client.auth.signUp({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      successMsg.value = "Check your email to confirm your account!";
      if (data.user) {
        saveUserData(data.user.id);
        console.log(data.user);
        saveUserStatistic(data.user.id);
        alert("Check your email to confirm your account!" );
      }
      else {
        alert("gehtnicht ")
      }
    } catch (error) {
      alert("die Email ist bereits vergeben"); 
    }
      
  }
  console.log("signUp");
}
</script>

<style></style>
