<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="register-card glass-card">
        <h2 class="title">Join <span class="gradient-text">JOJ</span></h2>

        <div class="tabs">
          <button
            :class="['tab-btn', { active: registerType === 'phone' }]"
            @click="registerType = 'phone'"
          >
            手机注册
          </button>
          <button
            :class="['tab-btn', { active: registerType === 'email' }]"
            @click="registerType = 'email'"
          >
            邮箱注册
          </button>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <input
              type="text"
              v-model="form.account"
              placeholder="请输入账号"
              required
              class="cyber-input"
              autocomplete="off"
            />
          </div>

          <div class="form-group">
            <input
              type="password"
              v-model="form.password"
              placeholder="请输入密码"
              required
              class="cyber-input"
              autocomplete="new-password"
            />
          </div>

          <div class="form-group">
            <input
              type="password"
              v-model="form.confirmPassword"
              placeholder="请确认密码"
              required
              class="cyber-input"
              autocomplete="new-password"
            />
          </div>

          <div class="form-group">
            <input
              v-if="registerType === 'phone'"
              type="tel"
              v-model="form.phone"
              placeholder="请输入手机号"
              required
              class="cyber-input"
              autocomplete="off"
            />
            <input
              v-else
              type="email"
              v-model="form.email"
              placeholder="请输入邮箱"
              required
              class="cyber-input"
              autocomplete="off"
            />
          </div>

          <div class="form-group code-group">
            <input
              type="text"
              v-model="form.code"
              placeholder="验证码"
              required
              class="cyber-input code-input"
              autocomplete="off"
            />
            <button
              type="button"
              class="send-code-btn"
              @click="sendCode"
              :disabled="counting"
            >
              {{ counting ? `${countDown}s 后重发` : "获取验证码" }}
            </button>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span class="btn-text">{{
              loading ? "注册中..." : "立即注册"
            }}</span>
            <div class="btn-glow"></div>
          </button>
        </form>

        <!-- Notification Toast -->
        <div
          v-if="notification.show"
          :class="['notification', notification.type]"
        >
          {{ notification.message }}
        </div>

        <div class="links">
          <span class="has-account" @click="goToLogin"
            >已有账号？<span class="login-link">立即登录</span></span
          >
        </div>
      </div>
    </div>

    <!-- Background Elements -->
    <div class="bg-grid"></div>
    <div class="glow-bg top-right"></div>
    <div class="glow-bg bottom-left"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { AuthControllerService } from "../../../../generated/services/AuthControllerService";
import { SendCodeRequest } from "../../../../generated";
import scene = SendCodeRequest.scene;

export default defineComponent({
  name: "RegisterView",
  setup() {
    const router = useRouter();
    const registerType = ref("phone");
    const loading = ref(false);
    const counting = ref(false);
    const countDown = ref(60);

    const notification = reactive({
      show: false,
      message: "",
      type: "error", // 'error' or 'success'
    });

    const showNotification = (
      message: string,
      type: "error" | "success" = "error"
    ) => {
      notification.message = message;
      notification.type = type;
      notification.show = true;
      setTimeout(() => {
        notification.show = false;
      }, 3000);
    };

    const form = reactive({
      account: "",
      password: "",
      confirmPassword: "",
      phone: "",
      email: "",
      code: "",
    });

    const sendCode = async () => {
      try {
        counting.value = true;
        // 先发送请求获取倒计时时间，而不是先开启定时器
        const res = await AuthControllerService.sendCodeUsingPost({
          identifier: registerType.value === "phone" ? form.phone : form.email,
          identifierType: registerType.value as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          scene: scene.REGISTER,
        });

        if (res.code !== 0) {
          throw new Error(res.msg || "验证码发送失败");
        }

        showNotification("验证码已发送", "success");

        // 成功后再根据后端返回的有效期设置倒计时
        // res.data.expireSeconds 如果没有就默认用 60
        countDown.value = res.data?.expireSeconds || 60;

        let timer = setInterval(() => {
          countDown.value--;
          if (countDown.value <= 0) {
            clearInterval(timer);
            counting.value = false;
            countDown.value = 60; // 倒计时结束重置为默认值
          }
        }, 1000);
      } catch (err: any) {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error(err);
        showNotification(err.body?.message || err.message || "发送失败");
        counting.value = false;
        countDown.value = 60;
      }
    };

    const handleRegister = async () => {
      try {
        loading.value = true;
        const res = await AuthControllerService.registerUsingPost({
          account: form.account,
          password: form.password,
          checkPassword: form.confirmPassword,
          identifierType: registerType.value as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          identifier: registerType.value === "phone" ? form.phone : form.email,
          code: form.code,
          agreeTerms: true, // Add agree terms if needed by backend, assuming true for now
        });

        if (res.code !== 0) {
          throw new Error(res.msg || "注册失败");
        }

        showNotification("注册成功！", "success");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
      } catch (err: any) {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error(err);
        showNotification(err.body?.message || err.message || "注册失败");
      } finally {
        loading.value = false;
      }
    };

    const goToLogin = () => {
      router.push("/auth/login");
    };

    return {
      registerType,
      form,
      loading,
      counting,
      countDown,
      notification,
      sendCode,
      handleRegister,
      goToLogin,
    };
  },
});
</script>

<style scoped>
.register-wrapper {
  position: relative;
  min-height: calc(100vh - 64px); /* Adjust based on navbar height */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: transparent;
  overflow: hidden;
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: 50px 50px;
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  z-index: 0;
  pointer-events: none;
}

.glow-bg {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  opacity: 0.15;
  pointer-events: none;
}

.top-right {
  top: -200px;
  right: -100px;
  background: linear-gradient(to bottom left, #3b82f6, #ec4899);
}

.bottom-left {
  bottom: -100px;
  left: -200px;
  background: linear-gradient(to top right, #8b5cf6, #3b82f6);
}

.register-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
}

.glass-card {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 32px;
  letter-spacing: -0.5px;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tabs {
  display: flex;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
}

.tab-btn {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  color: #94a3b8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: #1e293b;
  color: #f8fafc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cyber-input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #f8fafc;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.cyber-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(30, 41, 59, 0.6);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.cyber-input::placeholder {
  color: #64748b;
}

.code-group {
  display: flex;
  gap: 12px;
}

.code-input {
  flex: 1;
}

.send-code-btn {
  white-space: nowrap;
  padding: 0 20px;
  border: 1px solid rgba(59, 130, 246, 0.4);
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-code-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  color: #93c5fd;
}

.send-code-btn:disabled {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(30, 41, 59, 0.4);
  color: #64748b;
  cursor: not-allowed;
}

.submit-btn {
  margin-top: 12px;
  padding: 16px;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px -10px rgba(59, 130, 246, 0.5);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px -10px rgba(59, 130, 246, 0.6);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: rgba(59, 130, 246, 0.5);
  cursor: not-allowed;
}

.btn-text {
  position: relative;
  z-index: 10;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
  z-index: 5;
}

.submit-btn:hover:not(:disabled) .btn-glow {
  animation: glow 1.5s infinite;
}

@keyframes glow {
  100% {
    transform: translateX(100%);
  }
}

.notification {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  z-index: 100;
  animation: slideDown 0.3s ease;
  white-space: nowrap;
}

.notification.error {
  background: rgba(239, 68, 68, 0.9);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.notification.success {
  background: rgba(34, 197, 94, 0.9);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

@keyframes slideDown {
  from {
    transform: translate(-50%, -20px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.links {
  margin-top: 32px;
  text-align: center;
}

.has-account {
  font-size: 14px;
  color: #94a3b8;
}

.login-link {
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #60a5fa;
  text-decoration: underline;
}
</style>
