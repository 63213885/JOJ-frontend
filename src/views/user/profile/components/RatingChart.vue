<template>
  <div class="rating-chart-container">
    <div ref="chartRef" class="chart" style="width: 100%; height: 350px"></div>
  </div>
</template>

<script setup lang="ts">
/* global defineProps */
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps<{
  userAccount: string;
  rating: number;
}>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const initChart = () => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);

  // Random data generation for demonstration
  const baseDate = new Date();
  const data = [];
  let currentRating = 1200;

  for (let i = 0; i < 20; i++) {
    const date = new Date(
      baseDate.getTime() - (20 - i) * 7 * 24 * 60 * 60 * 1000
    );
    // Random fluctuation
    currentRating += Math.floor(Math.random() * 100) - 40;
    if (i === 19) currentRating = props.rating; // Last point is current rating

    data.push([echarts.format.formatTime("yyyy-MM-dd", date), currentRating]);
  }

  const option = {
    title: {
      text: "Rating 变化曲线",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "normal",
        color: "#f8fafc",
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      textStyle: {
        color: "#f8fafc",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLabel: {
        color: "#94a3b8",
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      min: (value: any) => Math.max(0, value.min - 200),
      max: (value: any) => value.max + 200,
      axisLabel: {
        color: "#94a3b8",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
    series: [
      {
        name: "Rating",
        type: "line",
        data: data,
        smooth: true,
        lineStyle: {
          color: "#3b82f6",
          width: 3,
        },
        itemStyle: {
          color: "#3b82f6",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(59, 130, 246, 0.4)" },
            { offset: 1, color: "rgba(59, 130, 246, 0.05)" },
          ]),
        },
        markPoint: {
          data: [{ type: "max", name: "Max" }],
        },
      },
    ],
  };

  chartInstance.setOption(option);
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    chartInstance?.resize();
  });
});

watch(
  () => props.rating,
  () => {
    initChart();
  }
);
</script>

<style scoped>
.rating-chart-container {
  width: 100%;
}
</style>
