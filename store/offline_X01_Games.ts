import { defineStore } from "pinia";
import type { OfflineGame } from "~/types/interface";

const games = ref<OfflineGame[]>([]);

export const useOffline_X01_GameStore = defineStore("offline_X01_Games", () => {
  function createGame(game: OfflineGame) {
    // Suche ein existierendes Spiel vom selben Ersteller
    const index = games.value.findIndex((g) => g.creatorId === game.creatorId);
    if (index !== -1) {
      // Überschreibe existierendes Spiel
      games.value[index] = game;
    } else {
      games.value.push(game);
    }
  }

  function getGameById(id: string): OfflineGame | undefined {
    return games.value.find((game) => game.id === id);
  }

  function getGameByCreator(creatorId: number): OfflineGame | undefined {
    return games.value.find((game) => game.creatorId === creatorId);
  }

  return { games, createGame, getGameById, getGameByCreator };
});
