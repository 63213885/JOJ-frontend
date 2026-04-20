<template>
  <div class="profile-body-wrapper">
    <!-- Main Layout -->
    <div class="card chart-card">
      <div class="card-header"><h3 class="card-title">Rating 变化</h3></div>
      <div class="card-body">
        <div class="chart-inner">
          <RatingChart
            :user-account="user?.account || ''"
            :rating="user?.rating || 1500"
          />
        </div>
      </div>
    </div>

    <div class="card heatmap-card">
      <div class="card-header"><h3 class="card-title">做题日历</h3></div>
      <div class="card-body">
        <div class="heatmap-scaled">
          <ActivityHeatmap />
        </div>
        <div class="stats-overview-inline">
          <div class="stat-item">
            <div class="stat-value text-success">
              {{ user?.solvedCount || 0 }}
            </div>
            <div class="stat-label">解决</div>
          </div>
          <div class="stat-item">
            <div class="stat-value text-success">
              {{ user?.acceptedCount || 0 }}
            </div>
            <div class="stat-label">通过</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ user?.submitCount || 0 }}</div>
            <div class="stat-label">提交</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from "vue";
import type { UserVO } from "../../../../generated/models/UserVO";
import RatingChart from "./components/RatingChart.vue";
import ActivityHeatmap from "./components/ActivityHeatmap.vue";

const user = inject<Ref<UserVO | null>>("profileUser");
</script>

<style scoped>
.profile-body-wrapper {
  max-width: 980px;
  margin: 0 auto;
  padding: 20px 40px 60px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.card {
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.card-title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}
.card-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.chart-inner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  margin: 0 auto;
}
.heatmap-scaled {
  transform: scale(1.15);
  transform-origin: top center;
  margin-bottom: 20px;
}
.stats-overview-inline {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}
.stat-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 100px;
}
.stat-value {
  font-size: 20px;
  font-weight: 700;
}
.stat-label {
  font-size: 14px;
  color: #94a3b8;
}
.text-success {
  color: #34c759;
}
</style>
