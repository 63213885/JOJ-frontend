<template>
  <div class="profile-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="user" class="profile-content">
      <!-- Upper Section: Banner & Header -->
      <div class="profile-header-section">
        <div class="profile-banner"></div>
        <div class="profile-header-info">
          <div class="header-left">
            <div class="avatar-wrapper">
              <img
                :src="user.avatarUrl || defaultAvatar"
                alt="Avatar"
                class="avatar"
              />
            </div>
            <div class="user-main-info">
              <div class="name-edit-wrapper">
                <h2 :class="getRankColor(user.rating || 1500)" class="username">
                  {{ user.account }}
                </h2>
                <div class="header-edit-row desktop-btn">
                  <button type="button" class="header-edit-btn">
                    编辑资料
                  </button>
                </div>
              </div>
              <div class="info-row user-bio" v-if="user.bio">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  ></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>{{ user.bio }}</span>
              </div>
              <div class="info-row user-bio empty-bio" v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  ></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>这个人很懒，什么都没留下~</span>
              </div>
              <div class="info-row user-school" v-if="user.school">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                <span>{{ user.school }}</span>
              </div>
              <div class="info-row user-location" v-if="user.lastLoginIp">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                  ></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{{ user.lastLoginIp }}</span>
              </div>
              <div class="info-row user-status">
                <span class="status-dot offline"></span>
                <span class="status-text">离线</span>
                <div class="custom-tooltip">
                  上次登录: {{ formatDate(user.lastLoginTime) }}
                </div>
              </div>
            </div>
          </div>

          <div class="header-right">
            <div class="header-edit-row mobile-btn">
              <button type="button" class="header-edit-btn">编辑资料</button>
            </div>
            <div class="header-stats">
              <div class="header-stat">
                <div class="stat-label">Rating</div>
                <div
                  class="stat-value"
                  :class="getRankColor(user.rating || 1500)"
                >
                  {{ user.rating || 1500 }}
                </div>
              </div>
              <div class="header-stat">
                <div class="stat-label">关注</div>
                <div class="stat-value">{{ user.followingCount || 0 }}</div>
              </div>
              <div class="header-stat">
                <div class="stat-label">粉丝</div>
                <div class="stat-value">{{ user.followerCount || 0 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="profile-body-wrapper">
        <div class="card chart-card">
          <div class="card-header">
            <h3 class="card-title">Rating 变化</h3>
          </div>
          <div class="card-body">
            <div class="chart-inner">
              <RatingChart
                :user-account="user.account || ''"
                :rating="user.rating || 1500"
              />
            </div>
          </div>
        </div>

        <div class="card heatmap-card">
          <div class="card-header">
            <h3 class="card-title">做题日历</h3>
          </div>
          <div class="card-body">
            <ActivityHeatmap />

            <div class="stats-overview-inline">
              <div class="stat-item">
                <div class="stat-value text-success">
                  {{ user.solvedCount || 0 }}
                </div>
                <div class="stat-label">解决</div>
              </div>
              <div class="stat-item">
                <div class="stat-value text-success">
                  {{ user.acceptedCount || 0 }}
                </div>
                <div class="stat-label">通过</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ user.submitCount || 0 }}</div>
                <div class="stat-label">提交</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { ProfileControllerService } from "../../../../generated/services/ProfileControllerService";
import type { UserVO } from "../../../../generated/models/UserVO";
import RatingChart from "./components/RatingChart.vue";
import ActivityHeatmap from "./components/ActivityHeatmap.vue";

const route = useRoute();
const user = ref<UserVO | null>(null);
const loading = ref(true);
const error = ref("");
const defaultAvatar = "https://picsum.photos/200";

const getRankColor = (rating: number) => {
  if (rating >= 2400) return "color-red";
  if (rating >= 2100) return "color-orange";
  if (rating >= 1900) return "color-purple";
  if (rating >= 1600) return "color-blue";
  if (rating >= 1400) return "color-cyan";
  if (rating >= 1200) return "color-green";
  return "color-gray";
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleString();
};

const fetchUserProfile = async (account: string) => {
  loading.value = true;
  error.value = "";
  try {
    const res = await ProfileControllerService.getPublicProfileUsingGet(
      account
    );
    if (res.code === 0 && res.data) {
      user.value = res.data;
    } else {
      error.value = res.message || "获取用户信息失败";
    }
  } catch (err: any) {
    error.value = err.message || "网络错误";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const account = route.params.account as string;
  if (account) {
    fetchUserProfile(account);
  }
});

watch(
  () => route.params.account,
  (newAccount) => {
    if (newAccount) {
      fetchUserProfile(newAccount as string);
    }
  }
);
</script>

<style scoped>
.profile-container {
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #0f172a;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  box-sizing: border-box;
  color: #f8fafc;
  overflow: hidden;
  position: relative;
}

/* 背景光效：参考 HomeView 保持整体系统UI一致性 */
.profile-container::before {
  content: "";
  position: fixed;
  top: -200px;
  right: -100px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: linear-gradient(to bottom left, #3b82f6, #8b5cf6);
  filter: blur(100px);
  z-index: 0;
  opacity: 0.15;
  animation: floatOrb 10s ease-in-out infinite alternate;
}

.profile-container::after {
  content: "";
  position: fixed;
  bottom: -100px;
  left: -200px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: linear-gradient(to top right, #ec4899, #8b5cf6);
  filter: blur(100px);
  z-index: 0;
  opacity: 0.15;
  animation: floatOrbReverse 12s ease-in-out infinite alternate;
}

@keyframes floatOrb {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(-30px, 40px) scale(1.1);
  }
}

@keyframes floatOrbReverse {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(40px, -30px) scale(1.1);
  }
}

.profile-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* Header & Banner */
.profile-header-section {
  width: 100%;
  background-color: transparent;
  padding-top: 25px;
}

/* 隐藏原有 banner 逻辑 */
.profile-banner,
.profile-banner::before,
.profile-banner::after {
  display: none;
}

.profile-header-info {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 40px 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: flex-end;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  padding-bottom: 8px;
}

.header-edit-row {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.header-edit-btn {
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.4);
  color: #cbd5e1;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-edit-btn:hover {
  color: #f8fafc;
  border-color: rgba(148, 163, 184, 0.7);
  background: rgba(30, 41, 59, 0.6);
}

.header-stats {
  display: flex;
  gap: 28px;
}

.header-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.header-stat .stat-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.header-stat .stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
  text-align: center;
}

.avatar-wrapper {
  position: relative;
  z-index: 2;
  margin-right: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #0f172a;
  background-color: #0f172a;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.user-main-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 8px;
  z-index: 2;
}

.name-edit-wrapper {
  display: flex;
  align-items: center;
  margin: 0 0 6px 0;
}

.username {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
  color: #f8fafc;
}

.desktop-btn {
  position: absolute;
  right: 40px;
}

.mobile-btn {
  display: none;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #94a3b8;
  margin-top: 6px;
}

.info-row svg {
  opacity: 0.8;
  flex-shrink: 0;
}

.user-bio {
  line-height: 1.5;
  max-width: 450px;
}

.empty-bio {
  color: #64748b;
  font-style: italic;
}

.user-status {
  cursor: default;
  position: relative;
}

.custom-tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #334155;
  transition: opacity 0.1s ease;
}

.user-status:hover .custom-tooltip {
  visibility: visible;
  opacity: 1;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 3px;
  margin-right: 3px;
}

.status-dot.offline {
  background-color: #64748b;
}

.status-dot.online {
  background-color: #34c759;
}

/* Body Layout */
.profile-body-wrapper {
  width: 100%;
  max-width: 980px; /* 【核心改动】缩小统一容器到 980px，让上方支持100%宽度的 Rating 曲线自适应收缩到底侧做题日历真实的原生宽度，做到完美物理对齐 */
  margin: 0 auto;
  padding: 20px 40px 80px;
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
  box-sizing: border-box;
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

/* 移除所有 scale 和变形代码，直接让其按本来 1.0 的大小居中显示 */
:deep(.heatmap-container),
:deep(.v-calendar) {
  width: 100%;
  justify-content: center;
  display: flex;
}

.heatmap-card :deep(.heatmap-container) {
  transform: scale(1.1);
  transform-origin: top center;
}

/* 恢复默认正常边距即可 */
.heatmap-card .card-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 24px;
}

.stats-overview-inline {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
  padding-top: 0;
  border-top: none;
}

/* Card General Style */
.card {
  background: transparent;
  border: none;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 0;
}

.card:hover {
  transform: none;
  box-shadow: none;
  background: transparent;
}

.card-header {
  padding: 0 0 30px 0;
  width: 100%;
  text-align: center;
}

.card-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 2px;
}

.card-title::before {
  display: none;
}

.card-body {
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-success {
  color: #34c759 !important;
}

.color-red {
  color: #ff453a !important;
}

.color-orange {
  color: #ff9f0a !important;
}

.color-purple {
  color: #bf5af2 !important;
}

.color-blue {
  color: #0a84ff !important;
}

.color-cyan {
  color: #64d2ff !important;
}

.color-green {
  color: #30d158 !important;
}

.color-gray {
  color: #98989d !important;
}

.loading,
.error {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  font-weight: 500;
  color: #94a3b8;
}

.error {
  color: #ff453a;
}

@media (max-width: 1100px) {
  .profile-body-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .profile-header-info {
    flex-direction: column;
    align-items: center;
    padding: 0 20px 20px;
    text-align: center;
  }

  .header-left {
    flex-direction: column;
    align-items: center;
  }

  .avatar-wrapper {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .header-right {
    margin-top: 30px;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .mobile-btn {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 12px;
  }

  .desktop-btn {
    display: none;
  }

  .header-stats {
    justify-content: center;
    width: 100%;
  }

  .profile-body-wrapper {
    padding: 20px 16px;
  }

  .heatmap-card :deep(.heatmap-container) {
    transform: scale(1);
  }
}

.detail-item .value {
  color: #f8fafc;
  font-weight: 500;
  text-align: right;
  max-width: 65%;
  word-break: break-all;
}

/* Stats overview */
.stats-overview-inline .stat-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: background 0.3s;
  min-width: 120px;
}

.stats-overview-inline .stat-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #f8fafc;
}

.stat-label {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}
</style>
