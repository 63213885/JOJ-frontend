<template>
  <div class="profile-body-wrapper private-info-wrapper">
    <div class="card basic-info-card">
      <div class="card-header"><h3 class="card-title">基本信息</h3></div>
      <div class="card-body">
        <div class="private-info-grid" v-if="privateInfo">
          <div class="p-item">
            <div class="p-content">
              <span class="p-label">手机号：</span>
              <span class="p-value">{{ privateInfo.phone || "未设置" }}</span>
            </div>
            <button class="action-btn" @click="handleAction('phone')">
              修改手机号
            </button>
          </div>
          <div class="p-item">
            <div class="p-content">
              <span class="p-label">邮箱：</span>
              <span class="p-value">{{ privateInfo.email || "未设置" }}</span>
            </div>
            <button class="action-btn" @click="handleAction('email')">
              修改邮箱
            </button>
          </div>
          <div class="p-item">
            <div class="p-content">
              <span class="p-label">密码：</span>
              <span class="p-value">{{
                privateInfo.passwordHash ? "已设置" : "未设置"
              }}</span>
            </div>
            <button class="action-btn" @click="handleAction('password')">
              修改密码
            </button>
          </div>
        </div>
        <div v-else class="error-msg">
          无法加载敏感信息，请确认您是否有权限。
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div
      v-if="notification.show"
      class="notification-toast"
      :class="`type-${notification.type}`"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, reactive, Ref } from "vue";
import type { UserDetailVO } from "../../../../generated/models/UserDetailVO";

const privateInfo = inject<Ref<UserDetailVO | null>>("privateInfo");

const notification = reactive({
  show: false,
  message: "",
  type: "info",
});

const showNotification = (
  msg: string,
  type: "error" | "success" | "info" = "info"
) => {
  notification.message = msg;
  notification.type = type;
  notification.show = true;
  setTimeout(() => {
    notification.show = false;
  }, 3000);
};

const handleAction = (type: string) => {
  showNotification(`预留功能开发中: ${type}`, "info");
};
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

.private-info-wrapper {
  padding-bottom: 0;
}

.card {
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border: none !important;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  padding: 0 !important;
  color: #f8fafc;
}

.card-header {
  width: 100%;
  text-align: center;
  padding: 0 !important;
}

.card-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.private-info-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.03);
  padding: 24px 32px;
  border-radius: 12px;
  margin-top: 15px;
  width: 100%;
  max-width: 500px;
}

.p-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #f8fafc;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  padding-bottom: 16px;
}

.p-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.p-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.p-label {
  color: #94a3b8;
  width: 70px;
}

.action-btn {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
}

.error-msg {
  color: #94a3b8;
  margin-top: 20px;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  z-index: 10000;
  animation: slideDownToast 0.3s ease;
  white-space: nowrap;
}

.notification-toast.type-success {
  background: rgba(34, 197, 94, 0.9);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.notification-toast.type-error {
  background: rgba(239, 68, 68, 0.9);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.notification-toast.type-info {
  background: rgba(59, 130, 246, 0.9);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

@keyframes slideDownToast {
  from {
    transform: translate(-50%, -20px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style>
