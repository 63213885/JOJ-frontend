<template>
  <div class="heatmap-container">
    <div class="heatmap">
      <div v-for="(week, wIndex) in heatmapData" :key="wIndex" class="week">
        <div
          v-for="(day, dIndex) in week"
          :key="dIndex"
          class="day"
          :class="getColorClass(day.count)"
          :title="day.date + ': ' + day.count + ' submissions'"
        ></div>
      </div>
    </div>
    <div class="legend">
      <span>Less</span>
      <div class="day level-0"></div>
      <div class="day level-1"></div>
      <div class="day level-2"></div>
      <div class="day level-3"></div>
      <div class="day level-4"></div>
      <span>More</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface HeatmapDay {
  date: string;
  count: number;
}

const heatmapData = ref<HeatmapDay[][]>([]);

// Generate 52 weeks of dummy data
const generateData = () => {
  const data: HeatmapDay[][] = [];
  const today = new Date();

  for (let w = 0; w < 52; w++) {
    const week: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(
        today.getTime() - ((51 - w) * 7 + (6 - d)) * 24 * 60 * 60 * 1000
      );

      // Randomly populate submission counts
      // Higher chance of 0, else 1-10
      let count = 0;
      if (Math.random() > 0.6) {
        count = Math.floor(Math.random() * 10) + 1;
      }

      week.push({
        date: date.toISOString().split("T")[0],
        count,
      });
    }
    data.push(week);
  }
  heatmapData.value = data;
};

// Map count to color class
const getColorClass = (count: number) => {
  if (count === 0) return "level-0";
  if (count <= 2) return "level-1";
  if (count <= 5) return "level-2";
  if (count <= 8) return "level-3";
  return "level-4";
};

onMounted(() => {
  generateData();
});
</script>

<style scoped>
.heatmap-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: auto;
  padding-bottom: 10px;
}

.heatmap {
  display: flex;
  gap: 3px;
}

.week {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.day {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.05); /* Match dark mode empty block */
}

.level-0 {
  background-color: rgba(255, 255, 255, 0.05);
}
.level-1 {
  background-color: #0e4429;
}
.level-2 {
  background-color: #006d32;
}
.level-3 {
  background-color: #26a641;
}
.level-4 {
  background-color: #39d353;
}

.legend {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #86868b;
  font-weight: 500;
}

.legend span {
  margin: 0 4px;
}
</style>
