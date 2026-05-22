<template>
  <Teleport to="body">
    <TransitionGroup
      name="notif"
      tag="div"
      class="global-notification-container"
    >
      <div
        v-for="item in items"
        :key="item.id"
        :class="['global-notification', `type-${item.type}`]"
        @click="close(item.id)"
      >
        <span class="notif-icon">{{ iconMap[item.type] }}</span>
        <span class="notif-message">{{ item.message }}</span>
        <button class="notif-close" @click.stop="close(item.id)">×</button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotification } from "@/composables/useNotification";

const { items, close } = useNotification();

const iconMap: Record<string, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};
</script>

<style>
/* Global (not scoped) so Teleport works correctly */
.global-notification-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
}

.global-notification {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  pointer-events: auto;
  cursor: pointer;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.06) inset;
  user-select: none;
  max-width: 90vw;
}

.global-notification.type-success {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.92),
    rgba(22, 163, 74, 0.92)
  );
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
}

.global-notification.type-error {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.92),
    rgba(220, 38, 38, 0.92)
  );
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
}

.global-notification.type-info {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.92),
    rgba(37, 99, 235, 0.92)
  );
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
}

.global-notification.type-warning {
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.92),
    rgba(217, 119, 6, 0.92)
  );
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;
}

.notif-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.notif-message {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notif-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  cursor: pointer;
  padding: 0 0 0 4px;
  line-height: 1;
  transition: color 0.2s;
  flex-shrink: 0;
}

.notif-close:hover {
  color: #fff;
}

/* Transition animations */
.notif-enter-active {
  transition: all 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.notif-leave-active {
  transition: all 0.25s cubic-bezier(0.06, 0.71, 0.55, 1);
}

.notif-enter-from {
  transform: translateY(-30px);
  opacity: 0;
}

.notif-leave-to {
  transform: translateY(-20px) scale(0.95);
  opacity: 0;
}

.notif-move {
  transition: transform 0.3s ease;
}
</style>
