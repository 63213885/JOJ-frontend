<template>
  <header class="top-header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">JOJ</router-link>
      </div>

      <nav class="main-nav">
        <router-link to="/">首页</router-link>
        <router-link to="/courses">课程</router-link>
        <router-link to="/contests">竞赛</router-link>
        <router-link to="/problems">题库</router-link>
      </nav>

      <div class="auth-placeholder" v-if="isInitializing">
        <!-- 占位符，防止页面加载时产生闪烁 -->
      </div>
      <div class="auth-buttons" v-else-if="!isLoggedIn">
        <router-link to="/user/login" class="btn btn-login">登录</router-link>
        <router-link to="/user/register" class="btn btn-register"
          >注册
        </router-link>
      </div>

      <div class="user-menu" v-else>
        <!-- Messages Icon -->
        <div class="icon-btn" title="私信">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            ></path>
          </svg>
        </div>

        <!-- Notifications Icon -->
        <div class="icon-btn" title="通知">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="badge"></span>
        </div>

        <!-- User Avatar Dropdown -->
        <div class="dropdown" v-click-outside="closeDropdown">
          <img
            :src="currentUser?.avatarUrl || defaultAvatar"
            alt="User Avatar"
            class="avatar"
            @click="toggleDropdown"
          />

          <transition name="slide-fade">
            <div
              v-show="dropdownOpen"
              class="dropdown-menu"
              @click="closeDropdown"
            >
              <div class="dropdown-header">
                <div class="user-name">
                  {{ currentUser?.account || "用户" }}
                </div>
                <div class="user-role" v-if="currentUser?.role">
                  {{ currentUser.role }}
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <router-link to="/user/profile" class="dropdown-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                个人主页
              </router-link>
              <router-link to="/user/settings" class="dropdown-item">
                <span class="icon-placeholder">⚙️</span>
                个人中心
              </router-link>
              <router-link to="/user/orders" class="dropdown-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
                我的订单
              </router-link>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item logout" @click="handleLogout">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                退出登录
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { AuthControllerService } from "../../generated/services/AuthControllerService";

// 简单的 click-outside 指令，用于点击外部关闭下拉菜单
const clickOutside = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeMount: (el: any, binding: any) => {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el == event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unmounted: (el: any) => {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

export default defineComponent({
  name: "TopNavBar",
  directives: {
    clickOutside,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const dropdownOpen = ref(false);
    const isInitializing = ref(true); // 添加一个初始化状态
    const defaultAvatar =
      "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"; // Element Plus 默认头像

    const isLoggedIn = computed(() => store.getters.isLoggedIn);
    const currentUser = computed(() => store.getters.currentUser);

    // 页面加载时自动获取一次当前用户，保持登录态
    const fetchCurrentUser = async () => {
      // 只有当前未登录时才请求
      if (!isLoggedIn.value) {
        try {
          const res = await AuthControllerService.getLoginUserUsingGet();
          if (res.code === 0 && res.data) {
            store.commit("setUser", res.data);
          }
        } catch (err) {
          // no action needed. user is naturally not logged in.
        }
      }
      isInitializing.value = false; // 无论请求成功还是失败，此时均已初始化完毕
    };

    onMounted(() => {
      fetchCurrentUser();
    });

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };

    const closeDropdown = () => {
      dropdownOpen.value = false;
    };

    const handleLogout = async () => {
      try {
        await AuthControllerService.logoutUsingPost();
      } catch (err) {
        console.error("登出失败", err);
      } finally {
        store.commit("clearUser");
        closeDropdown();
        router.push("/user/login");
      }
    };

    return {
      isLoggedIn,
      currentUser,
      dropdownOpen,
      isInitializing,
      defaultAvatar,
      toggleDropdown,
      closeDropdown,
      handleLogout,
    };
  },
});
</script>

<style scoped>
/* Header Styles */
.top-header {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo a {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  letter-spacing: 1px;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.main-nav a {
  text-decoration: none;
  color: #94a3b8;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 6px;
  position: relative;
}

.main-nav a:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.05);
}

.main-nav a.router-link-exact-active {
  color: #3b82f6;
}

.main-nav a.router-link-exact-active::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background-color: #3b82f6;
  border-radius: 2px;
}

.auth-placeholder {
  width: 130px; /* 大致预留出按钮或头像占位的宽度以防布局抖动 */
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-login {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-register {
  color: #ffffff;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.btn-register:hover {
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  transform: translateY(-1px);
}

/* User Menu Styles */
.user-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-btn {
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
}

.icon-btn:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
}

.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid #0f172a;
}

.dropdown {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.dropdown:hover .avatar {
  border-color: #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  width: 220px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-header {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
}

.user-name {
  color: #f8fafc;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
}

.user-role {
  color: #94a3b8;
  font-size: 12px;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #f8fafc;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
