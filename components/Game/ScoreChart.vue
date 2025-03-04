<template>
  <div class="w-full h-full">
    <div
      ref="chartContainer"
      class="chart-container"
      style="width: 100%; height: 300px"
    ></div>
    <div class="flex justify-center space-x-4 mt-2">
      <div
        v-for="(leg, index) in Object.keys(selectedLegData)"
        :key="index"
        @click="selectLeg(Number(leg))"
        class="cursor-pointer px-3 py-1 rounded-md"
        :class="
          selectedLeg === Number(leg)
            ? 'bg-primary text-white'
            : 'bg-secondary-300 hover:bg-secondary'
        "
      >
        Leg {{ Number(leg) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";
import type { Player } from "~/types/websocket";

const props = defineProps<{
  player: Player;
}>();

const chartContainer = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;
const selectedLeg = ref(0);
const lastLegWatched = ref<number | null>(null);
const chartInitialized = ref(false);

// Berechne die verfügbaren Legs aus dem Spielerobjekt
const selectedLegData = computed(() => {
  return props.player?.scores?.legScores || {};
});

function selectLeg(legIndex: number) {
  selectedLeg.value = legIndex;
  updateChart();
}

const initializeSelectedLeg = () => {
  if (Object.keys(selectedLegData.value).length > 0) {
    // Nimm das höchste Leg (das neueste)
    const legKeys = Object.keys(selectedLegData.value)
      .map(Number)
      .sort((a, b) => b - a);
    if (legKeys.length > 0) {
      selectedLeg.value = legKeys[0];
    }
  }
};

// Prüft, ob eine Runde vollständig ist (alle 3 Darts geworfen wurden)
function isRoundComplete(roundData: any): boolean {
  return (
    roundData &&
    roundData.scores &&
    roundData.scores.length === 3 &&
    roundData.scores.every((score: number | undefined) => score !== undefined)
  );
}

// Holen nur der Rundenpunktzahlen mit vollständigen Daten
function getRoundScoresData() {
  if (!props.player?.scores?.legScores?.[selectedLeg.value]) {
    return {
      rounds: [],
      roundScores: [],
    };
  }

  const legData = props.player.scores.legScores[selectedLeg.value];

  if (!legData || !legData.roundScores) {
    return {
      rounds: [],
      roundScores: [],
    };
  }

  // Sortiere die Round-Keys numerisch
  const roundKeys = Object.keys(legData.roundScores)
    .map(Number)
    .sort((a, b) => a - b);

  const rounds: number[] = [];
  const roundScores: number[] = [];

  // Nur vollständige Runden mit allen 3 Darts hinzufügen
  roundKeys.forEach((roundIndex) => {
    const roundData = legData.roundScores[roundIndex];

    // Prüfen, ob alle 3 Darts geworfen wurden
    if (isRoundComplete(roundData)) {
      const roundScore = roundData.scores.reduce(
        (sum, score) => sum + (score || 0),
        0
      );
      rounds.push(roundIndex);
      roundScores.push(roundScore);
    }
  });

  return { rounds, roundScores };
}

function initChart() {
  try {
    if (!chartContainer.value) {
      console.warn(
        "Chart container element not found, deferring initialization"
      );
      return;
    }

    // Dispose of existing chart if there is one
    if (chart) {
      chart.dispose();
      chart = null;
    }

    // Create new chart
    chart = echarts.init(chartContainer.value);
    chartInitialized.value = true;

    // Initial render
    initializeSelectedLeg();
    updateChart();
  } catch (error) {
    console.error("Error initializing chart:", error);
    chartInitialized.value = false;
  }
}

function updateChart() {
  try {
    if (!chart || !chartInitialized.value) {
      console.warn("Cannot update chart: chart not initialized");
      return;
    }

    const { rounds, roundScores } = getRoundScoresData();

    // Set empty chart with waiting message if no data
    if (rounds.length === 0) {
      chart.setOption(
        {
          title: {
            text: `Waiting for scores...`,
            textStyle: {
              color: "#ffffff",
              fontWeight: "normal",
            },
            left: "center",
          },
          grid: {
            left: "5%",
            right: "5%",
            bottom: "10%",
            top: "15%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: [],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              type: "line",
              data: [],
            },
          ],
        },
        true
      );
      return;
    }

    // Set chart with data
    const option = {
      title: {
        text: `Scores - ${props.player.username} - Leg ${selectedLeg.value}`,
        textStyle: {
          color: "#ffffff",
          fontWeight: "normal",
        },
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          const roundIndex = params[0].dataIndex;
          const score = params[0].value;

          return `Round ${rounds[roundIndex]}<br/>Score: ${score}`;
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: "10%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: rounds.map((r) => r.toString()),
        name: "Round",
        nameLocation: "middle",
        nameGap: 25,
        nameTextStyle: {
          color: "#aaaaaa",
        },
        axisLine: {
          lineStyle: {
            color: "#555555",
          },
        },
        axisLabel: {
          color: "#bbbbbb",
        },
      },
      yAxis: {
        type: "value",
        name: "Points per round",
        nameLocation: "middle",
        nameGap: 40,
        nameTextStyle: {
          color: "#aaaaaa",
        },
        min: 0,
        max: 180, // Maximale mögliche Punktzahl pro Runde (3x T20)
        axisLine: {
          lineStyle: {
            color: "#555555",
          },
        },
        axisLabel: {
          color: "#bbbbbb",
        },
        splitLine: {
          lineStyle: {
            color: "#333333",
          },
        },
      },
      series: [
        {
          name: "Score",
          data: roundScores,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: "#192a56",
          },
          itemStyle: {
            color: "#192a56",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(25, 42, 86, 0.6)" },
              { offset: 1, color: "rgba(25, 42, 86, 0.1)" },
            ]),
          },
        },
      ],
    };

    chart.setOption(option, true);
  } catch (error) {
    console.error("Error updating chart:", error);
  }
}

// Better resize handling
let resizeHandler: (() => void) | null = null;

// Überwachen, ob ein neues Leg hinzugefügt wurde
watch(
  () => Object.keys(selectedLegData.value).length,
  async (newCount, oldCount) => {
    if (newCount > oldCount) {
      // Ein neues Leg wurde hinzugefügt, warte ein bisschen und aktualisiere dann
      await nextTick();
      initializeSelectedLeg();
      updateChart();
    }
  }
);

// Beobachten der Rundendaten und nur bei vollständigen Runden aktualisieren
watch(
  () => {
    if (!props.player?.scores?.legScores?.[selectedLeg.value]?.roundScores)
      return null;

    const roundScores =
      props.player.scores.legScores[selectedLeg.value].roundScores;

    // Zähle nur Runden, bei denen alle 3 Darts geworfen wurden
    const completeRoundsFingerprint = Object.keys(roundScores)
      .filter((key) => {
        const round = roundScores[Number(key)];
        return isRoundComplete(round);
      })
      .join(",");

    // Wenn sich das Leg geändert hat, speichern wir das aktuelle Leg
    if (lastLegWatched.value !== selectedLeg.value) {
      lastLegWatched.value = selectedLeg.value;
    }

    return completeRoundsFingerprint; // Gibt einen eindeutigen Wert zurück, der sich nur ändert, wenn eine neue vollständige Runde vorliegt
  },
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      updateChart();
    }
  }
);

// Bei Leg-Änderungen aktualisieren
watch(
  () => selectedLeg.value,
  () => {
    updateChart();
  }
);

// Initialisieren bei Komponenten-Mount mit mehr Sicherheit
onMounted(async () => {
  try {
    await nextTick();

    // Stellen sicher, dass DOM vollständig gerendert ist
    setTimeout(() => {
      initChart();

      // Setup resize handler
      if (!resizeHandler) {
        resizeHandler = () => {
          if (chart) {
            chart.resize();
          }
        };
        window.addEventListener("resize", resizeHandler);
      }
    }, 100);
  } catch (error) {
    console.error("Error in mounted hook:", error);
  }
});

// Aufräumen bei Unmount
onUnmounted(() => {
  try {
    if (chart) {
      chart.dispose();
      chart = null;
    }

    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
      resizeHandler = null;
    }
  } catch (error) {
    console.error("Error in unmounted hook:", error);
  }
});
</script>

<style>
.chart-container {
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  padding: 10px;
  border: 2px solid var(--color-primary, #222222);
}
</style>
