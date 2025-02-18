import { defineStore } from "pinia";

export const useStatsStore = defineStore("stasts", () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const matches_played = ref<number>(0);
  const matches_won = ref<number>(0);
  const matches_lost = ref<number>(0);
  const winrate = ref<number>(0.0);
  const average = ref<number>(0.0);
  const first9avg = ref<number>(0.0);
  const checkout = ref<number>(0.0);
  const score_60 = ref<number>(0);
  const score_100 = ref<number>(0);
  const score_140 = ref<number>(0);
  const score_180 = ref<number>(0);

  async function fetchStatsData() {
    if (user.value?.id) {
      console.log(user.value.id);
      const { data, error } = await client
        .from("Statistics")
        .select(
          "avg, first9_avg, checkout, matches_played, matches_won, matches_lost, winrate, score_60, score_100, score_140, score_180"
        )
        .eq("User_id", user.value.id);

      if (error) {
        console.error("Error fetching user data:", error.message);
      } else if (data && data.length > 0) {
        
        matches_played.value = data[0].matches_played;
        matches_won.value = data[0].matches_won;
        matches_lost.value = data[0].matches_lost;
        winrate.value = data[0].winrate;
        average.value = data[0].avg;
        first9avg.value = data[0].first9_avg;
        checkout.value = data[0].checkout;
        score_60.value = data[0].score_60;
        score_100.value = data[0].score_100;
        score_140.value = data[0].score_140;
        score_180.value = data[0].score_180;
      }
    }
  }
  return {
    matches_played,
    matches_won,
    matches_lost,
    winrate,
    average,
    first9avg,
    checkout,
    score_60,
    score_100,
    score_140,
    score_180,
    fetchStatsData,
  };
});
