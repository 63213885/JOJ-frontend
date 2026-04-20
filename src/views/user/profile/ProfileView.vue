<template>
  <div class="profile-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="user" class="profile-content">
      <div class="profile-header-section">
        <div class="profile-header-info">
          <div class="header-left">
            <div
              class="avatar-wrapper"
              @click="isOwner ? triggerAvatarUpload() : null"
              :class="{ clickable: isOwner }"
              title="点击修改头像"
            >
              <img
                :src="user.avatarUrl || defaultAvatar"
                alt="Avatar"
                class="avatar"
              />
              <input
                type="file"
                ref="fileInput"
                @change="onAvatarChange"
                accept="image/*"
                style="display: none"
              />
              <div v-if="isOwner" class="avatar-overlay">更换头像</div>
            </div>

            <div class="user-main-info">
              <div class="name-edit-wrapper">
                <h2 :class="getRankColor(user.rating || 1500)" class="username">
                  {{ user.account }}
                </h2>
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
            </div>
          </div>

          <div class="header-right">
            <div class="header-edit-row desktop-btn" v-if="isOwner">
              <button
                type="button"
                class="header-edit-btn"
                @click="openEditModal"
              >
                编辑资料
              </button>
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

        <div class="profile-tabs-wrapper">
          <div class="profile-tabs">
            <router-link
              :to="`/profile/${routeAccount}`"
              class="tab-item"
              :class="{ active: $route.name === 'userProfile' }"
            >
              我的主页
            </router-link>
            <router-link
              :to="`/courses/${routeAccount}`"
              class="tab-item"
              :class="{ active: $route.name === 'userCourses' }"
            >
              我的课程
            </router-link>
            <router-link
              :to="`/submissions/${routeAccount}`"
              class="tab-item"
              :class="{ active: $route.name === 'userSubmissions' }"
            >
              我的提交
            </router-link>
            <router-link
              :to="`/contests/with/${routeAccount}`"
              class="tab-item"
              :class="{ active: $route.name === 'userContests' }"
            >
              我的比赛
            </router-link>
            <router-link
              v-if="isOwner"
              to="/profile/settings"
              class="tab-item"
              :class="{ active: $route.name === 'profileSettings' }"
            >
              设置
            </router-link>
          </div>
        </div>
      </div>

      <!-- Main Layout via router-view -->
      <div class="router-view-container">
        <router-view></router-view>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditing" class="modal-overlay" @click.self="isEditing = false">
      <div class="modal-content">
        <h3 class="modal-title">编辑个人资料</h3>
        <div class="form-group">
          <label>用户名</label>
          <input
            v-model="editForm.account"
            class="edit-input"
            placeholder="输入新的用户名"
          />
        </div>
        <div class="form-group">
          <label>个人简介</label>
          <textarea
            v-model="editForm.bio"
            class="edit-input edit-textarea"
            placeholder="介绍一下自己吧~"
          ></textarea>
        </div>
        <div class="form-group">
          <label>学校</label>
          <input
            v-model="editForm.school"
            class="edit-input"
            placeholder="所在学校"
          />
        </div>
        <div class="modal-actions">
          <button class="cancel-btn modal-btn" @click="isEditing = false">
            取消
          </button>
          <button class="save-btn modal-btn" @click="saveProfile">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ProfileControllerService } from "../../../../generated/services/ProfileControllerService";
import type { UserVO } from "../../../../generated/models/UserVO";
import type { UserDetailVO } from "../../../../generated/models/UserDetailVO";
import type { UpdateProfileDTO } from "../../../../generated/models/UpdateProfileDTO";

const route = useRoute();
const router = useRouter();
const store = useStore();

const user = ref<UserVO | null>(null);
const privateInfo = ref<UserDetailVO | null>(null);
provide("profileUser", user);
provide("privateInfo", privateInfo);

const loading = ref(true);
const error = ref("");
const defaultAvatar = "https://picsum.photos/200";

const fileInput = ref<HTMLInputElement | null>(null);

const routeAccount = computed(() => {
  // If it's settings page and no account parameter, we fallback to logged in user
  if (route.name === "profileSettings") {
    return store.state.user?.account || "";
  }
  return (route.params.account as string) || store.state.user?.account || "";
});

const isOwner = computed(() => {
  if (!store.state.user) return false;
  return store.state.user.account === routeAccount.value;
});

const isEditing = ref(false);
const editForm = ref<UpdateProfileDTO>({
  account: "",
  bio: "",
  school: "",
});

const openEditModal = () => {
  if (user.value) {
    editForm.value = {
      account: user.value.account,
      bio: user.value.bio,
      school: user.value.school,
    };
  }
  isEditing.value = true;
};

const getRankColor = (rating: number) => {
  if (rating >= 2400) return "color-red";
  if (rating >= 2100) return "color-orange";
  if (rating >= 1900) return "color-purple";
  if (rating >= 1600) return "color-blue";
  if (rating >= 1400) return "color-cyan";
  if (rating >= 1200) return "color-green";
  return "color-gray";
};

const triggerAvatarUpload = () => {
  fileInput.value?.click();
};

const onAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    try {
      const res = await ProfileControllerService.uploadAvatarUsingPut(file);
      if (res.code === 0) {
        fetchUserProfile(routeAccount.value);
        alert("头像修改成功");
      } else {
        alert("上传失败: " + res.message);
      }
    } catch (err: any) {
      alert("网络错误: " + err.message);
    }
    target.value = "";
  }
};

const saveProfile = async () => {
  try {
    const res = await ProfileControllerService.updateProfileUsingPut(
      editForm.value
    );
    if (res.code === 0) {
      isEditing.value = false;
      fetchUserProfile(editForm.value.account || routeAccount.value);
    } else {
      alert("更新失败: " + res.message);
    }
  } catch (err: any) {
    alert("网络错误: " + err.message);
  }
};

const fetchUserProfile = async (account: string) => {
  if (!account) return;
  loading.value = true;
  error.value = "";
  try {
    const res = await ProfileControllerService.getPublicProfileUsingGet(
      account
    );
    if (res.code === 0 && res.data) {
      user.value = res.data;
      editForm.value = {
        account: user.value.account,
        bio: user.value.bio,
        school: user.value.school,
      };
    } else {
      error.value = res.message || "获取用户信息失败";
    }

    if (store.state.user && store.state.user.account === account) {
      const pRes = await ProfileControllerService.getPrivateProfileUsingGet();
      if (pRes.code === 0 && pRes.data) {
        privateInfo.value = pRes.data;
      }
    }
  } catch (err: any) {
    error.value = err.message || "网络错误";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserProfile(routeAccount.value);
});

watch(routeAccount, (newAccount) => {
  if (newAccount) {
    fetchUserProfile(newAccount);
    isEditing.value = false;
  }
});
</script>

<style scoped>
.profile-container {
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #0f172a;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #f8fafc;
  overflow: hidden;
  position: relative;
}

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
  position: relative;
  z-index: 1;
}

.profile-header-section {
  padding-top: 15px;
}

.profile-header-info {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 40px 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-left {
  display: flex;
  align-items: flex-end;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  position: relative;
  padding-bottom: 8px;
}

.header-edit-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
}

.header-edit-btn {
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.4);
  color: #cbd5e1;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.header-edit-btn:hover {
  color: #f8fafc;
  border-color: rgba(148, 163, 184, 0.7);
  background: rgba(30, 41, 59, 0.6);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 300px;
}

.edit-input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #334155;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  outline: none;
}

.edit-textarea {
  resize: vertical;
  min-height: 60px;
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.save-btn,
.cancel-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.save-btn {
  background: #3b82f6;
  color: white;
}

.cancel-btn {
  background: #475569;
  color: white;
}

.header-stats {
  display: flex;
  gap: 24px;
}

.header-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
}

.avatar-wrapper {
  position: relative;
  margin-right: 20px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-wrapper.clickable {
  cursor: pointer;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0f172a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  font-size: 11px;
  text-align: center;
  color: white;
  padding: 4px 0;
  opacity: 0;
  transition: 0.3s;
}

.avatar-wrapper.clickable:hover .avatar-overlay {
  opacity: 1;
}

.user-main-info {
  display: flex;
  flex-direction: column;
  padding-bottom: 4px;
}

.name-edit-wrapper {
  display: flex;
  align-items: center;
  margin: 0 0 6px 0;
}

.username {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #94a3b8;
  margin-top: 6px;
}

/* New TABS layout styling */
.profile-tabs-wrapper {
  width: 100%;
  max-width: 1080px;
  margin: 20px auto 0;
  padding: 0 40px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  display: flex;
  justify-content: center;
}

.profile-tabs {
  display: flex;
  gap: 40px;
  justify-content: center;
}

.tab-item {
  color: #94a3b8;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 10px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  cursor: pointer;
}

.tab-item:hover {
  color: #f8fafc;
}

.tab-item.active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

.router-view-container {
  width: 100%;
  min-height: 500px;
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
  color: #94a3b8;
}

.error {
  color: #ff453a;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  width: 400px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #f8fafc;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 13px;
  color: #94a3b8;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}
.modal-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
}
</style>
