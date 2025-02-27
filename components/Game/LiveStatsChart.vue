<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="stat-card">
      <div ref="checkoutRadial" class="h-40"></div>
    </div>
    <div class="stat-card">
      <div ref="first9Radial" class="h-40"></div>
    </div>
    <div class="stat-card">
      <div ref="averageRadial" class="h-40"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  player: Object
});

const checkoutRadial = ref(null);
const first9Radial = ref(null);
const averageRadial = ref(null);
let charts = [];

function initializeCharts() {
  if (checkoutRadial.value && first9Radial.value && averageRadial.value) {
    const checkoutChart = echarts.init(checkoutRadial.value);
    const first9Chart = echarts.init(first9Radial.value);
    const averageChart = echarts.init(averageRadial.value);
    
    charts = [checkoutChart, first9Chart, averageChart];
    
    updateCharts();
    
    window.addEventListener('resize', () => {
      charts.forEach(chart => chart.resize());
    });
  }
}

function updateCharts() {
  if (charts.length !== 3) return;
  
  // Checkout Radial
  charts[0].setOption({
    title: {
      text: 'Checkout %',
      left: 'center',
      top: '4%',
      textStyle: {
        color: '#cccccc',
        fontSize: 14
      }
    },
    series: [{
      type: 'pie',
      radius: ['65%', '80%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      emphasis: {
        scale: false
      },
      labelLine: {
        show: false
      },
      hoverAnimation: false,
      data: [
        {
          value: props.player?.stats?.checkoutPercentage || 0,
          name: 'Checkout',
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
        {
          value: 100 - (props.player?.stats?.checkoutPercentage || 0),
          name: 'Remaining',
          itemStyle: { color: 'rgba(255, 255, 255, 0.05)' }
        }
      ]
    }],
    graphic: {
      elements: [{
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: `${props.player?.stats?.checkoutPercentage || 0}%`,
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#ffffff'
        }
      }]
    }
  });
  
  // First9 Radial
  charts[1].setOption({
    title: {
      text: 'First 9 AVG',
      left: 'center',
      top: '4%',
      textStyle: {
        color: '#cccccc',
        fontSize: 14
      }
    },
    series: [{
      type: 'pie',
      radius: ['65%', '80%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      emphasis: {
        scale: false
      },
      labelLine: {
        show: false
      },
      hoverAnimation: false,
      data: [
        {
          value: props.player?.stats?.first9Average || 0,
          name: 'First 9',
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
        {
          value: 100 - (props.player?.stats?.first9Average || 0),
          name: 'Remaining',
          itemStyle: { color: 'rgba(255, 255, 255, 0.05)' }
        }
      ]
    }],
    graphic: {
      elements: [{
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: props.player?.stats?.first9Average?.toString() || '0',
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#ffffff'
        }
      }]
    }
  });
  
  // Average Radial
  charts[2].setOption({
    title: {
      text: 'Average',
      left: 'center',
      top: '4%',
      textStyle: {
        color: '#cccccc',
        fontSize: 14
      }
    },
    series: [{
      type: 'pie',
      radius: ['65%', '80%'],
      avoidLabelOverlap: false,
      label: {
        show: false
      },
      emphasis: {
        scale: false
      },
      labelLine: {
        show: false
      },
      hoverAnimation: false,
      data: [
        {
          value: props.player?.stats?.average || 0,
          name: 'Average',
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
        {
          value: 100 - (props.player?.stats?.average || 0),
          name: 'Remaining',
          itemStyle: { color: 'rgba(255, 255, 255, 0.05)' }
        }
      ]
    }],
    graphic: {
      elements: [{
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: props.player?.stats?.average?.toString() || '0',
          fontSize: 24,
          fontWeight: 'bold',
          fill: '#ffffff'
        }
      }]
    }
  });
}

onMounted(() => {
  initializeCharts();
});

watch(() => props.player?.stats, () => {
  updateCharts();
}, { deep: true });

onUnmounted(() => {
  charts.forEach(chart => chart.dispose());
  window.removeEventListener('resize', () => {
    charts.forEach(chart => chart.resize());
  });
});
</script>

<style>
.stat-card {
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  padding: 16px;
  border: 2px solid var(--color-primary, #4facfe);
}
</style>