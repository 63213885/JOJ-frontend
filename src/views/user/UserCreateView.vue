<template>
  <div class="user-create-wrapper">
    <div class="form-container glass-panel">
      <div class="form-header">
        <h2 class="form-title">创建新用户</h2>
        <p class="form-subtitle">添加新用户到平台</p>
      </div>

      <form @submit.prevent="handleSubmit" class="create-form">
        <div class="form-group">
          <label for="account">账号</label>
          <input
            type="text"
            id="account"
            v-model="formData.account"
            placeholder="请输入账号"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="passwordHash">密码</label>
          <input
            type="password"
            id="passwordHash"
            v-model="formData.passwordHash"
            placeholder="请输入密码"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="phone">手机号</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            placeholder="请输入手机号"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            placeholder="请输入邮箱"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="bio">个人简介</label>
          <textarea
            id="bio"
            v-model="formData.bio"
            placeholder="请输入个人简介"
            class="form-input form-textarea"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="school">学校</label>
          <input
            type="text"
            id="school"
            v-model="formData.school"
            placeholder="请输入学校"
            class="form-input"
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="submitting">
          {{ submitting ? "提交中..." : "创建用户" }}
        </button>
      </form>
    </div>

    <!-- Notification Toast -->
    <div v-if="showToast" :class="['notification-toast', toastType]">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import {
  CreateUserRequest,
  UserControllerService,
} from "../../../generated/user";

export default defineComponent({
  name: "UserCreateView",
  setup() {
    const router = useRouter();
    const submitting = ref(false);

    const formData = reactive<CreateUserRequest>({
      account: undefined as any,
      passwordHash: undefined as any,
      phone: undefined as any,
      email: undefined as any,
      bio: undefined as any,
      school: undefined as any,
    });

    const showToast = ref(false);
    const toastMessage = ref("");
    const toastType = ref("");

    const triggerToast = (msg: string, type: "success" | "error") => {
      toastMessage.value = msg;
      toastType.value = "type-" + type;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    const handleSubmit = async () => {
      if (submitting.value) return;

      submitting.value = true;
      try {
        // 将空字符串转换为 undefined 或忽略，避免将空字符串传给后端
        const payload: any = {};
        for (const [key, value] of Object.entries(formData)) {
          if (value !== "" && value !== undefined && value !== null) {
            payload[key] = value;
          }
        }

        const res = await UserControllerService.createUserUsingPost(
          payload as CreateUserRequest
        );
        if (res.code === 0) {
          triggerToast("用户创建成功", "success");
          setTimeout(() => {
            router.push("/user/list");
          }, 1000);
        } else {
          triggerToast("创建失败：" + res.msg, "error");
        }
      } catch (err: any) {
        triggerToast(err.msg || err.message || "请求出错，请重试", "error");
      } finally {
        submitting.value = false;
      }
    };

    return {
      formData,
      submitting,
      handleSubmit,
      showToast,
      toastMessage,
      toastType,
    };
  },
});
</script>

<style scoped>
.user-create-wrapper {
  min-height: calc(100vh - 64px);
  background-color: #0f172a;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.glass-panel {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.form-container {
  width: 100%;
  max-width: 600px;
  padding: 40px;
}

.form-header {
  margin-bottom: 30px;
  text-align: center;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #94a3b8;
  font-size: 1rem;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  color: #cbd5e1;
  font-size: 0.95rem;
  font-weight: 500;
}

.form-input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-input::placeholder {
  color: #475569;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.status-group {
  margin-top: 10px;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #f8fafc;
}

.radio-label input[type="radio"] {
  accent-color: #3b82f6;
  width: 16px;
  height: 16px;
}

.btn-submit {
  margin-top: 20px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  padding: 14px 24px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
