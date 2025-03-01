<template>
  <div class="match-summary">
    <div class="header">
      <h2 class="title">Match Summary</h2>
      <div class="match-result">
        <div class="player-result">
          <div class="player-name">{{ match.players[0].username }}</div>
          <div class="score">{{ match.players[0].scores.setsWon }}</div>
        </div>
        <div class="versus">vs</div>
        <div class="player-result">
          <div class="score">{{ match.players[1].scores.setsWon }}</div>
          <div class="player-name">{{ match.players[1].username }}</div>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <!-- Player Averages Comparison Chart -->
      <div class="stat-card">
        <h3>Averages</h3>
        <div ref="averagesChart" class="chart-container"></div>
      </div>

      <!-- Checkout Percentages -->
      <div class="stat-card">
        <h3>Checkout %</h3>
        <div class="checkout-grid">
          <div class="checkout-chart">
            <div ref="checkout1Chart" class="chart-container"></div>
            <div class="chart-label">{{ match.players[0].username }}</div>
          </div>
          <div class="checkout-chart">
            <div ref="checkout2Chart" class="chart-container"></div>
            <div class="chart-label">{{ match.players[1].username }}</div>
          </div>
        </div>
      </div>

      <!-- High Scores -->
      <div class="stat-card">
        <h3>High Scores</h3>
        <div ref="highScoresChart" class="chart-container"></div>
      </div>

      <!-- Leg Performance -->
      <div class="stat-card full-width">
        <h3>Leg Performance</h3>
        <div ref="legPerformanceChart" class="chart-container"></div>
      </div>

      <!-- Key Stats Table -->
      <div class="stat-card">
        <h3>Key Stats</h3>
        <table class="stats-table">
          <thead>
            <tr>
              <th>Stat</th>
              <th>{{ match.players[0].username }}</th>
              <th>{{ match.players[1].username }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Avg</td>
              <td>{{ match.players[0].stats?.average?.toFixed(1) || 0 }}</td>
              <td>{{ match.players[1].stats?.average?.toFixed(1) || 0 }}</td>
            </tr>
            <tr>
              <td>First 9 Avg</td>
              <td>{{ match.players[0].stats?.first9Average?.toFixed(1) || 0 }}</td>
              <td>{{ match.players[1].stats?.first9Average?.toFixed(1) || 0 }}</td>
            </tr>
            <tr>
              <td>180s</td>
              <td>{{ match.players[0].stats?.score180 || 0 }}</td>
              <td>{{ match.players[1].stats?.score180 || 0 }}</td>
            </tr>
            <tr>
              <td>140+</td>
              <td>{{ match.players[0].stats?.score140 || 0 }}</td>
              <td>{{ match.players[1].stats?.score140 || 0 }}</td>
            </tr>
            <tr>
              <td>100+</td>
              <td>{{ match.players[0].stats?.score100 || 0 }}</td>
              <td>{{ match.players[1].stats?.score100 || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Highlight Moments -->
      <div class="stat-card">
        <h3>Match Highlights</h3>
        <div class="highlights">
          <div class="highlight-item" v-for="(highlight, index) in matchHighlights" :key="index">
            <div class="highlight-icon" :class="highlight.type">
              <Icon :name="highlight.icon" size="24" />
            </div>
            <div class="highlight-content">
              <strong>{{ highlight.player }}</strong>
              <p>{{ highlight.description }}</p>
            </div>
          </div>
          <div v-if="matchHighlights.length === 0" class="no-highlights">
            No highlight moments in this match
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue';
import type { Ref } from 'vue';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';
import type { Match, Player } from '~/types/websocket';

const props = defineProps<{
  match: Match
}>();

// Chart references
const averagesChart = ref<HTMLElement | null>(null);
const checkout1Chart = ref<HTMLElement | null>(null);
const checkout2Chart = ref<HTMLElement | null>(null);
const highScoresChart = ref<HTMLElement | null>(null);
const legPerformanceChart = ref<HTMLElement | null>(null);

// Chart instances
let charts: ECharts[] = [];

// Generate highlight moments from match data
const matchHighlights = computed(() => {
  const highlights = [];
  const players = props.match.players;

  // Check for 180s
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    if (player.stats?.score180 && player.stats.score180 > 0) {
      highlights.push({
        player: player.username,
        type: 'score180',
        icon: 'mdi:target',
        description: `Hit ${player.stats.score180} 180s!`
      });
    }

    // High checkouts (over 100)
    if (player.stats?.checkouts) {
      // This would require tracking high checkouts in your data model
      // For now, just a placeholder based on having any checkout
      if (player.stats.checkouts > 0) {
        highlights.push({
          player: player.username,
          type: 'checkout',
          icon: 'mdi:bullseye-arrow',
          description: `${player.stats.checkouts} successful checkouts (${player.stats.checkoutPercentage}%)`
        });
      }
    }
  }

  return highlights;
});

// Initialize charts
function initializeCharts() {
  // Clean up any existing charts
  if (charts.length > 0) {
    charts.forEach(chart => chart.dispose());
    charts = [];
  }

  // Initialize all charts
  if (averagesChart.value) {
    const chart = echarts.init(averagesChart.value);
    charts.push(chart);
    renderAveragesChart(chart);
  }

  if (checkout1Chart.value) {
    const chart = echarts.init(checkout1Chart.value);
    charts.push(chart);
    renderCheckoutChart(chart, 0);
  }

  if (checkout2Chart.value) {
    const chart = echarts.init(checkout2Chart.value);
    charts.push(chart);
    renderCheckoutChart(chart, 1);
  }

  if (highScoresChart.value) {
    const chart = echarts.init(highScoresChart.value);
    charts.push(chart);
    renderHighScoresChart(chart);
  }

  if (legPerformanceChart.value) {
    const chart = echarts.init(legPerformanceChart.value);
    charts.push(chart);
    renderLegPerformanceChart(chart);
  }
}

// Render player averages comparison chart
function renderAveragesChart(chart: ECharts) {
  const players = [props.match.players[0].username, props.match.players[1].username];
  const avgData = [
    props.match.players[0].stats?.average || 0,
    props.match.players[1].stats?.average || 0
  ];
  const first9Data = [
    props.match.players[0].stats?.first9Average || 0,
    props.match.players[1].stats?.first9Average || 0
  ];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Average', 'First 9 Avg'],
      textStyle: {
        color: '#cccccc'
      },
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: players,
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: '#555'
          }
        },
        axisLabel: {
          color: '#ddd'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#555'
          }
        },
        axisLabel: {
          color: '#ddd'
        },
        splitLine: {
          lineStyle: {
            color: '#333'
          }
        }
      }
    ],
    series: [
      {
        name: 'Average',
        type: 'bar',
        barWidth: '30%',
        data: avgData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4facfe' },
            { offset: 1, color: '#00f2fe' }
          ])
        }
      },
      {
        name: 'First 9 Avg',
        type: 'bar',
        barWidth: '30%',
        data: first9Data,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fa709a' },
            { offset: 1, color: '#fee140' }
          ])
        }
      }
    ]
  };

  chart.setOption(option);
}

// Render checkout percentage chart
function renderCheckoutChart(chart: ECharts, playerIndex: number) {
  const player = props.match.players[playerIndex];
  const checkoutPercentage = player.stats?.checkoutPercentage || 0;

  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#8e2de2' },
                { offset: 1, color: '#4a00e0' }
              ]
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 15,
            color: [[1, 'rgba(255,255,255,0.1)']]
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        data: [
          {
            value: checkoutPercentage,
            name: '',
            title: {
              offsetCenter: ['0%', '0%']
            },
            detail: {
              valueAnimation: true,
              offsetCenter: ['0%', '0%']
            }
          }
        ],
        title: {
          fontSize: 14,
          color: '#ccc',
          offsetCenter: ['0%', '20%']
        },
        detail: {
          width: 50,
          height: 14,
          fontSize: 20,
          color: '#fff',
          backgroundColor: 'transparent',
          borderRadius: 20,
          formatter: '{value}%'
        }
      }
    ]
  };

  chart.setOption(option);
}

// Render high scores chart
function renderHighScoresChart(chart: ECharts) {
  const players = [props.match.players[0].username, props.match.players[1].username];
  const score180Data = [
    props.match.players[0].stats?.score180 || 0,
    props.match.players[1].stats?.score180 || 0
  ];
  const score140Data = [
    props.match.players[0].stats?.score140 || 0,
    props.match.players[1].stats?.score140 || 0
  ];
  const score100Data = [
    props.match.players[0].stats?.score100 || 0,
    props.match.players[1].stats?.score100 || 0
  ];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['180s', '140+', '100+'],
      textStyle: {
        color: '#cccccc'
      },
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: players,
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: '#555'
          }
        },
        axisLabel: {
          color: '#ddd'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#555'
          }
        },
        axisLabel: {
          color: '#ddd'
        },
        splitLine: {
          lineStyle: {
            color: '#333'
          }
        }
      }
    ],
    series: [
      {
        name: '180s',
        type: 'bar',
        stack: 'scores',
        emphasis: {
          focus: 'series'
        },
        data: score180Data,
        itemStyle: {
          color: '#e74c3c'
        }
      },
      {
        name: '140+',
        type: 'bar',
        stack: 'scores',
        emphasis: {
          focus: 'series'
        },
        data: score140Data,
        itemStyle: {
          color: '#f39c12'
        }
      },
      {
        name: '100+',
        type: 'bar',
        stack: 'scores',
        emphasis: {
          focus: 'series'
        },
        data: score100Data,
        itemStyle: {
          color: '#3498db'
        }
      }
    ]
  };

  chart.setOption(option);
}

// Render leg performance chart - average per leg
function renderLegPerformanceChart(chart: ECharts) {
  // Calculate leg averages for both players
  const legCount = props.match.settings.legCount;
  const player1LegAverages: number[] = Array(legCount).fill(0);
  const player2LegAverages: number[] = Array(legCount).fill(0);
  const legendData = [];

  // Process leg data - this would need to be adjusted based on your actual data structure
  // This is a simplified example assuming you can calculate leg averages
  for (let i = 0; i < legCount; i++) {
    // In a real implementation, you would calculate these values from the match data
    // For now, we'll put in sample data
    player1LegAverages[i] = calculateLegAverage(props.match.players[0], i);
    player2LegAverages[i] = calculateLegAverage(props.match.players[1], i);
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: [props.match.players[0].username, props.match.players[1].username],
      textStyle: {
        color: '#cccccc'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: Array.from({ length: legCount }, (_, i) => `Leg ${i + 1}`),
        axisLine: {
          lineStyle: {
            color: '#555'
          }
        },
        axisLabel: {
          color: '#ddd'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#555'
          }
        },
        axisLabel: {
          color: '#ddd'
        },
        splitLine: {
          lineStyle: {
            color: '#333'
          }
        }
      }
    ],
    series: [
      {
        name: props.match.players[0].username,
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3
        },
        showSymbol: true,
        emphasis: {
          focus: 'series'
        },
        data: player1LegAverages,
        itemStyle: {
          color: '#4facfe'
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(79, 172, 254, 0.8)'
            },
            {
              offset: 1,
              color: 'rgba(0, 242, 254, 0.1)'
            }
          ])
        }
      },
      {
        name: props.match.players[1].username,
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3
        },
        showSymbol: true,
        emphasis: {
          focus: 'series'
        },
        data: player2LegAverages,
        itemStyle: {
          color: '#fa709a'
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(250, 112, 154, 0.8)'
            },
            {
              offset: 1,
              color: 'rgba(254, 225, 64, 0.1)'
            }
          ])
        }
      }
    ]
  };

  chart.setOption(option);
}

// Helper function to calculate leg average (dummy implementation)
function calculateLegAverage(player: Player, legIndex: number): number {
  if (!player.scores.legScores[legIndex]) return 0;
  let total = 0;
  const rounds = player.scores.legScores[legIndex].roundScores;
  for (const roundIndex in rounds) {
    const roundScores = rounds[roundIndex].scores;
    total += roundScores.reduce((acc, score) => acc + score, 0);

  }
  const legDarts = player.scores.legDartsCount[legIndex];
  return total / legDarts * 3;

}

// Set up resize handler
let resizeHandler: (() => void) | null = null;



onMounted(async () => {
  await nextTick();

  // Initialize with small delay to ensure DOM is ready
  setTimeout(() => {
    initializeCharts();

    // Set up resize handler
    if (!resizeHandler) {
      resizeHandler = () => {
        charts.forEach(chart => chart?.resize());
      };
      window.addEventListener('resize', resizeHandler);
    }
  }, 100);
});

onUnmounted(() => {
  // Clean up
  charts.forEach(chart => chart?.dispose());
  charts = [];

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
});
</script>

<style scoped>
.match-summary {
  @apply bg-secondary-300 p-6 rounded-xl shadow-lg w-full;
}

.header {
  @apply mb-6;
}

.title {
  @apply text-2xl font-bold mb-4 text-center;
}

.match-result {
  @apply flex justify-center items-center space-x-4 mb-8;
}

.player-result {
  @apply flex items-center;
}

.player-name {
  @apply text-lg font-semibold px-3;
}

.score {
  @apply text-3xl font-bold px-4 py-2 bg-primary rounded-lg;
}

.versus {
  @apply text-xl font-bold text-gray-400 px-3;
}

.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.stat-card {
  @apply bg-secondary-300 p-4 rounded-lg shadow border border-primary;
}

.full-width {
  @apply md:col-span-2;
}

.chart-container {
  @apply h-64 w-full;
}

.checkout-grid {
  @apply flex justify-around items-center;
}

.checkout-chart {
  @apply flex flex-col items-center;
  width: 45%;
}

.chart-label {
  @apply text-sm text-gray-400 mt-2 truncate max-w-full;
}

.stats-table {
  @apply w-full mt-4;
}

.stats-table th,
.stats-table td {
  @apply px-2 py-2 text-center;
}

.stats-table th {
  @apply text-gray-400 text-sm font-semibold border-b border-gray-700;
}

.stats-table td:first-child {
  @apply text-left text-gray-400;
}

.highlights {
  @apply space-y-3 mt-4 max-h-72 overflow-y-auto pr-2;
}

.highlight-item {
  @apply flex items-center space-x-3 p-3 rounded-md bg-secondary-300 border border-gray-700;
}

.highlight-icon {
  @apply p-2 rounded-full flex items-center justify-center;
}

.highlight-icon.score180 {
  @apply bg-gradient-to-r from-red-500 to-orange-500;
}

.highlight-icon.checkout {
  @apply bg-gradient-to-r from-green-500 to-emerald-400;
}

.highlight-content p {
  @apply text-sm text-gray-400 mt-1;
}

.no-highlights {
  @apply text-center text-gray-500 py-6 italic;
}
</style>