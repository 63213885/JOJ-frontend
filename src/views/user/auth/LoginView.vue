<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-card glass-card">
        <h2 class="title">
          Welcome Back to <span class="gradient-text">JOJ</span>
        </h2>

        <div class="tabs">
          <button
            :class="['tab-btn', { active: loginType === 'account' }]"
            @click="loginType = 'account'"
          >
            密码登录
          </button>
          <button
            :class="['tab-btn', { active: loginType === 'code' }]"
            @click="loginType = 'code'"
          >
            验证码登录
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Account Password Login -->
          <template v-if="loginType === 'account'">
            <div class="form-group">
              <input
                type="text"
                v-model="form.account"
                placeholder="请输入账号"
                required
                class="cyber-input"
                autocomplete="username"
              />
            </div>

            <div class="form-group">
              <input
                type="password"
                v-model="form.password"
                placeholder="请输入密码"
                required
                class="cyber-input"
                autocomplete="current-password"
              />
            </div>
          </template>

          <!-- Email/Phone Verification Code Login -->
          <template v-else>
            <div class="form-group">
              <input
                type="text"
                v-model="form.identifier"
                placeholder="请输入手机号或邮箱"
                required
                class="cyber-input"
                autocomplete="username"
              />
            </div>

            <div class="form-group code-group">
              <input
                type="text"
                v-model="form.code"
                placeholder="请输入验证码"
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
          </template>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span class="btn-text">{{
              loading ? "登录中..." : "立即登录"
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
          <span class="has-account"
            >还没账号？<span class="register-link" @click="goToRegister"
              >立即注册</span
            ></span
          >
          <span class="has-account"
            >忘记密码？<span class="forgot-link" @click="goToReset"
              >立即重置</span
            ></span
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
import { defineComponent, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { AuthControllerService } from "../../../../generated/services/AuthControllerService";
import { SendCodeRequest, LoginRequest } from "../../../../generated";
import scene = SendCodeRequest.scene;

export default defineComponent({
  name: "LoginView",
  setup() {
    const router = useRouter();
    const store = useStore();

    const loginType = ref("account"); // 'account' or 'code'
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
      identifier: "",
      code: "",
    });

    const isEmail = computed(() => {
      // 简单判断是否包含@来区分邮箱和手机号
      return form.identifier.includes("@");
    });

    const sendCode = async () => {
      if (!form.identifier) {
        showNotification("请输入手机号或邮箱");
        return;
      }

      try {
        counting.value = true;

        const res = await AuthControllerService.sendCodeUsingPost({
          identifier: form.identifier,
          identifierType: isEmail.value
            ? SendCodeRequest.identifierType.EMAIL
            : SendCodeRequest.identifierType.PHONE,
          scene: scene.LOGIN,
        });

        if (res.code !== 0) {
          throw new Error(res.msg || "验证码发送失败");
        }

        showNotification("验证码已发送", "success");
        countDown.value = res.data?.expireSeconds || 60;

        let timer = setInterval(() => {
          countDown.value--;
          if (countDown.value <= 0) {
            clearInterval(timer);
            counting.value = false;
            countDown.value = 60;
          }
        }, 1000);
      } catch (err: any) {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error(err);
        showNotification(err.body?.msg || err.message || "发送失败");
        counting.value = false;
        countDown.value = 60;
      }
    };

    const handleLogin = async () => {
      try {
        loading.value = true;

        let loginRequest: LoginRequest = {};

        if (loginType.value === "account") {
          loginRequest = {
            account: form.account,
            password: form.password,
          };
        } else {
          loginRequest = {
            identifier: form.identifier,
            code: form.code,
            identifierType: isEmail.value
              ? LoginRequest.identifierType.EMAIL
              : LoginRequest.identifierType.PHONE,
          };
        }

        const res = await AuthControllerService.loginUsingPost(loginRequest);

        if (res.code !== 0) {
          throw new Error(res.msg || "登录失败");
        }

        // 保存用户信息到 Vuex
        if (res.data) {
          store.commit("setUser", res.data);
        }

        showNotification("登录成功！", "success");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (err: any) {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error(err);
        showNotification(err.body?.msg || err.message || "登录失败");
      } finally {
        loading.value = false;
      }
    };

    const goToRegister = () => {
      router.push("/auth/register");
    };

    const goToReset = () => {
      router.push("/auth/reset");
    };

    return {
      loginType,
      form,
      loading,
      counting,
      countDown,
      notification,
      sendCode,
      handleLogin,
      goToRegister,
      goToReset,
    };
  },
});
</script>

<style scoped>
.login-wrapper {
  position: relative;
  min-height: calc(100vh - 64px);
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

.login-container {
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

.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.login-form {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.has-account {
  font-size: 14px;
  color: #94a3b8;
}

.forgot-link {
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #60a5fa;
  text-decoration: underline;
}

.register-link {
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #60a5fa;
  text-decoration: underline;
}
</style>
