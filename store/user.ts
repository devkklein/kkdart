import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useUserStore = defineStore('user', () => {
  const username = ref<string>('');
  const profileImage = ref<string | null>(null);
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  async function fetchUserData() {
    if (user.value?.email) {
      const { data, error } = await client
        .from('User')
        .select('username, picture')
        .eq('email', user.value.email);

      if (error) {
        console.error('Error fetching user data:', error.message);
      } else if (data && data.length > 0) {
        username.value = data[0].username;
        profileImage.value = data[0].picture|| null;
      }
    }
  }

  return { username, profileImage, fetchUserData };
});