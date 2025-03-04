<template>
  <div class="relative">
    <div
      class="relative flex items-center cursor-pointer justify-center hover:bg-primary p-2 rounded-full"
      @click.stop="toggleDropdown"
    >
      <Icon name="iconamoon:arrow-down-2-duotone" size="18" />
    </div>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-show="isDropdownOpen"
        class="absolute right-0 mt-3 w-36 bg-secondary-300 rounded-xl shadow-2xl py-2 px-1 z-50 border border-primary overflow-hidden"
        @click.stop
      >
        <NuxtLink
          to="/user/account"
          class="flex items-center px-4 py-2.5 text-sm text-white hover:bg-primary rounded transition-colors duration-200"
        >
          <Icon name="heroicons:user" class="mr-2" size="14" />
          <span>Account</span>
        </NuxtLink>
        <NuxtLink
          to="/user/profile"
          class="flex items-center px-4 py-2.5 text-sm text-white hover:bg-primary rounded transition-colors duration-200"
        >
          <Icon name="heroicons:identification" class="mr-2" size="14" />
          <span>Profile</span>
        </NuxtLink>
        <NuxtLink
          to="/user/settings"
          class="flex items-center px-4 py-2.5 text-sm text-white hover:bg-primary rounded transition-colors duration-200"
        >
          <Icon name="heroicons:cog-6-tooth" class="mr-2" size="14" />
          <span>Settings</span>
        </NuxtLink>
        <div class="border-t border-primary my-1"></div>
        <NuxtLink
          to="/"
          class="flex items-center justify-center px-4 py-2.5 text-sm text-white rounded hover:bg-red-500 transition-colors duration-200"
          @click="logout"
        >
          <Icon name="mdi:logout" size="18" class="scale-x-[-1] mr-2" />
          <span> </span>
        </NuxtLink>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  // Fixed to show the actual value
};

// Close dropdown when clicking outside
const closeDropdown = (e: MouseEvent) => {
  // No immediate action needed - the event will only reach here
  // for clicks outside the dropdown area due to stopPropagation
  isDropdownOpen.value = false;
};
const client = useSupabaseClient();
const router = useRouter();

async function logout() {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    router.push("/login");
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>

<style></style>
