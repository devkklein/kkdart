import { useUserStore } from "~/store/user"
import { useOffline_X01_GameStore } from "~/store/offline_X01_Games"
export default defineNuxtRouteMiddleware((to, from) => {

    const userStore = useUserStore();
    const offline_X01_GameStore = useOffline_X01_GameStore();
    if(!userStore.id) {
       return navigateTo('/'); 
    }
    else {
        const game = offline_X01_GameStore.getGameByCreator(userStore.id);
        if(game?.creatorId !== userStore.id) {
            return navigateTo('/');
        }
    }
})
