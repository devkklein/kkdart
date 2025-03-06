<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="h-full w-full overflow-y-auto bg-secondary-800 p-6">
      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex h-full items-center justify-center">
        <div class="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>

      <!-- Stats content -->
      <div v-else class="mx-auto max-w-7xl">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white">Statistics</h1>

        </div>

        <!-- Key Stats Cards -->
        <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl bg-secondary-300 border-2 border-primary  p-5 shadow-lg">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="font-medium text-gray-400">Matches</h3>
              <Icon name="mdi:controller" class="h-6 w-6 text-blue-400" />
            </div>
            <div class="flex items-baseline">
              <span class="text-3xl font-bold">{{ stats?.gamesPlayed || 0 }}</span>
              <span class="ml-2 text-sm text-gray-400">games</span>
            </div>
          </div>

          <div class="rounded-xl bg-secondary-300 border-2 border-primary  p-5 shadow-lg">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="font-medium text-gray-400">Win Rate</h3>
              <Icon name="mdi:trophy" class="h-6 w-6 text-amber-400" />
            </div>
            <div class="flex items-baseline">
              <span class="text-3xl font-bold">{{ stats?.winnrate || 0 }}</span>
              <span class="ml-2 text-sm text-gray-400">%</span>
            </div>
          </div>

          <div class="rounded-xl bg-secondary-300 border-2 border-primary  p-5 shadow-lg">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="font-medium text-gray-400">Average</h3>
              <Icon name="mdi:trending-up" class="h-6 w-6 text-green-400" />
            </div>
            <div class="flex items-baseline">
              <span class="text-3xl font-bold">{{ stats?.average || 0 }}</span>
            </div>
          </div>

          <div class="rounded-xl bg-secondary-300 border-2 border-primary  p-5 shadow-lg">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="font-medium text-gray-400">180s</h3>
              <Icon name="mdi:target" class="h-6 w-6 text-red-400" />
            </div>
            <div class="flex items-baseline">
              <span class="text-3xl font-bold">{{ stats?.score180 || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Win/Loss Chart -->
          <div class="rounded-xl bg-secondary-300 border-2 border-primary  p-5 shadow-lg">
            <h3 class="mb-4 text-xl font-bold">Win/Loss Ratio</h3>
            <div ref="winLossChartRef" class="h-64"></div>
          </div>

          <!-- High Scores Chart -->
          <div class="rounded-xl bg-secondary-300 border-2 border-primary  p-5 shadow-lg">
            <h3 class="mb-4 text-xl font-bold">High Scores</h3>
            <div ref="highScoresChartRef" class="h-64"></div>
          </div>
        </div>

        <!-- More Charts Row -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Average Gauge -->
          <div class="rounded-xl bg-secondary-300 border-2 border-primary  p-5 shadow-lg">
            <h3 class="mb-4 text-xl font-bold">Average Performance</h3>
            <div ref="averageChartRef" class="h-64"></div>
          </div>

          <!-- Checkout Gauge -->
          <div class="rounded-xl bg-secondary-300 border-2 border-primary  p-5 shadow-lg">
            <h3 class="mb-4 text-xl font-bold">Checkout Performance</h3>
            <div ref="checkoutChartRef" class="h-64"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import type { userStats } from '~/types/user';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

const user = useSupabaseUser();
const stats = ref<userStats | null>(null);
const isLoading = ref(true);

// Chart references
const winLossChartRef = ref<HTMLElement | null>(null);
const highScoresChartRef = ref<HTMLElement | null>(null);
const averageChartRef = ref<HTMLElement | null>(null);
const checkoutChartRef = ref<HTMLElement | null>(null);

// Chart instances
let charts: ECharts[] = [];

async function loadStats(id: string) {
  isLoading.value = true;
  try {
    const userStats = await loadUserOnlineStats(id);
    if (userStats) {
      stats.value = userStats;
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  } finally {
    isLoading.value = false;
  }
}

function initCharts() {
  nextTick(() => {
    // Clear any existing charts
    charts.forEach(chart => chart.dispose());
    charts = [];

    // Initialize all charts
    if (winLossChartRef.value) {
      const chart = echarts.init(winLossChartRef.value);
      charts.push(chart);
      renderWinLossChart(chart);
    }

    if (highScoresChartRef.value) {
      const chart = echarts.init(highScoresChartRef.value);
      charts.push(chart);
      renderHighScoresChart(chart);
    }

    if (averageChartRef.value) {
      const chart = echarts.init(averageChartRef.value);
      charts.push(chart);
      renderAverageGaugeChart(chart);
    }

    if (checkoutChartRef.value) {
      const chart = echarts.init(checkoutChartRef.value);
      charts.push(chart);
      renderCheckoutGaugeChart(chart);
    }
  });
}

function renderWinLossChart(chart: ECharts) {
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'bottom',
      textStyle: {
        color: '#cccccc'
      }
    },
    series: [
      {
        name: 'Match Results',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#222',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
            formatter: '{b}: {c} ({d}%)'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: stats.value?.gamesWon || 0, name: 'Wins', itemStyle: { color: '#4facfe' } },
          { value: stats.value?.gamesLost || 0, name: 'Losses', itemStyle: { color: '#fa709a' } }
        ]
      }
    ]
  };

  chart.setOption(option);
}

function renderHighScoresChart(chart: ECharts) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      show: false
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['60+', '100+', '140+', '180'],
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
        name: 'High Scores',
        type: 'bar',
        barWidth: '60%',
        emphasis: {
          focus: 'series'
        },
        data: [
          {
            value: stats.value?.score60 || 0,
            itemStyle: { color: '#3498db' }
          },
          {
            value: stats.value?.score100 || 0,
            itemStyle: { color: '#2ecc71' }
          },
          {
            value: stats.value?.score140 || 0,
            itemStyle: { color: '#f39c12' }
          },
          {
            value: stats.value?.score180 || 0,
            itemStyle: { color: '#e74c3c' }
          }
        ],
        label: {
          show: true,
          position: 'top',
          color: '#fff'
        }
      }
    ]
  };

  chart.setOption(option);
}

function renderAverageGaugeChart(chart: ECharts) {
  const average = stats.value?.average || 0;
  const first9average = stats.value?.first9Average || 0;

  const option = {
    tooltip: {
      formatter: '{a} <br/>{c}'
    },
    grid: [
      { left: '0%', top: '0%', width: '50%', height: '100%' },
      { left: '50%', top: '0%', width: '50%', height: '100%' }
    ],
    series: [
      {
        name: 'Average',
        type: 'gauge',
        center: ['25%', '50%'],
        radius: '80%',
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
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#00f2fe' }
              ]
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 20,
            color: [[1, '#272727']]
          }
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#fff',
          formatter: '{value}',
          offsetCenter: [0, 0]
        },
        title: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#999',
          offsetCenter: [0, '30%']
        },
        data: [
          {
            value: average,
            name: 'Average'
          }
        ]
      },
      {
        name: 'First 9 Average',
        type: 'gauge',
        center: ['75%', '50%'],
        radius: '80%',
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
                { offset: 0, color: '#43e97b' },
                { offset: 1, color: '#38f9d7' }
              ]
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 20,
            color: [[1, '#272727']]
          }
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#fff',
          formatter: '{value}',
          offsetCenter: [0, 0]
        },
        title: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#999',
          offsetCenter: [0, '30%']
        },
        data: [
          {
            value: first9average,
            name: 'First 9'
          }
        ]
      }
    ]
  };

  chart.setOption(option);
}

function renderCheckoutGaugeChart(chart: ECharts) {
  const checkout = stats.value?.checkoutPercentage || 0;

  const option = {
    series: [
      {
        name: 'Checkout Percentage',
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        radius: '80%',
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
                { offset: 0, color: '#fa709a' },
                { offset: 1, color: '#fee140' }
              ]
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 20,
            color: [[1, '#272727']]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#fff',
          formatter: '{value}%',
          offsetCenter: [0, 0]
        },
        title: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#999',
          offsetCenter: [0, '30%']
        },
        data: [
          {
            value: checkout,
            name: 'Checkout'
          }
        ]
      }
    ]
  };

  chart.setOption(option);
}

function handleResize() {
  charts.forEach(chart => chart.resize());
}

onMounted(async () => {
  if (user.value) {
    await loadStats(user.value.id);
    initCharts();
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  charts.forEach(chart => chart.dispose());
});
</script>
