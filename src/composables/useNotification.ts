import { reactive, readonly } from "vue";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationItem {
  id: number;
  message: string;
  type: NotificationType;
  duration: number;
}

interface NotificationState {
  items: NotificationItem[];
}

const state = reactive<NotificationState>({
  items: [],
});

let nextId = 0;

/**
 * Global notification composable.
 * Supports stacking multiple notifications, auto-dismiss, and manual close.
 */
export function useNotification() {
  const show = (
    message: string,
    type: NotificationType = "info",
    duration = 3000
  ) => {
    const id = nextId++;
    state.items.push({ id, message, type, duration });

    if (duration > 0) {
      setTimeout(() => {
        close(id);
      }, duration);
    }
  };

  const close = (id: number) => {
    const index = state.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      state.items.splice(index, 1);
    }
  };

  const success = (message: string, duration?: number) =>
    show(message, "success", duration);
  const error = (message: string, duration?: number) =>
    show(message, "error", duration);
  const info = (message: string, duration?: number) =>
    show(message, "info", duration);
  const warning = (message: string, duration?: number) =>
    show(message, "warning", duration);

  return {
    items: readonly(state).items,
    show,
    close,
    success,
    error,
    info,
    warning,
  };
}
