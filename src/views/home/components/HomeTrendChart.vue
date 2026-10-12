<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { init, use, type ECharts, type EChartsOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

import { usePreferencesStore } from '@/stores/preferences';

use([CanvasRenderer, GridComponent, LineChart, TooltipComponent]);

const { t } = useI18n();
const preferences = usePreferencesStore();
const chartRef = ref<HTMLElement>();

let chart: ECharts | undefined;
let resizeObserver: ResizeObserver | undefined;

const trendLabels = computed(() => [
  t('home.dashboard.trend.days.mon'),
  t('home.dashboard.trend.days.tue'),
  t('home.dashboard.trend.days.wed'),
  t('home.dashboard.trend.days.thu'),
  t('home.dashboard.trend.days.fri'),
  t('home.dashboard.trend.days.sat'),
]);

function getToken(name: string) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function createOptions(): EChartsOption {
  const brandBlue = getToken('--brand-blue');
  const brandBlueLight = getToken('--brand-blue-light');
  const textPrimary = getToken('--Font-Black-Gy1');
  const textMuted = getToken('--Font-Black-Gy4');
  const border = getToken('--component-stroke');
  const container = getToken('--bg-color-container');

  return {
    animationDuration: 700,
    backgroundColor: 'transparent',
    grid: {
      bottom: 22,
      containLabel: false,
      left: 10,
      right: 14,
      top: 12,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: container,
      borderColor: border,
      borderWidth: 1,
      confine: true,
      textStyle: {
        color: textPrimary,
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendLabels.value,
      axisLine: {
        lineStyle: {
          color: border,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: textMuted,
        margin: 12,
      },
    },
    yAxis: {
      type: 'value',
      min: 40,
      max: 100,
      splitNumber: 3,
      axisLabel: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: border,
          type: 'dashed',
        },
      },
    },
    series: [
      {
        type: 'line',
        data: [58, 66, 63, 80, 76, 92],
        smooth: true,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: {
          color: brandBlue,
          width: 3,
        },
        itemStyle: {
          borderColor: brandBlue,
          borderWidth: 2,
          color: container,
        },
        areaStyle: {
          color: brandBlueLight,
          opacity: 0.82,
        },
      },
    ],
  };
}

function renderChart() {
  if (!chartRef.value) return;

  chart ??= init(chartRef.value, undefined, { renderer: 'canvas' });
  chart.setOption(createOptions(), true);
  chart.resize();
}

onMounted(() => {
  renderChart();
  resizeObserver = new ResizeObserver(() => chart?.resize());
  if (chartRef.value) resizeObserver.observe(chartRef.value);
});

watch([trendLabels, () => preferences.resolvedTheme], () => {
  void nextTick(renderChart);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chart?.dispose();
});
</script>

<template>
  <div ref="chartRef" class="home-trend-chart" />
</template>

<style scoped>
@reference "../../../styles/index.css";

.home-trend-chart {
  @apply h-full min-h-32 w-full;
}
</style>

