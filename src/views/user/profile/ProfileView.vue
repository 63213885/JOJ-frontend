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
              <div v-if="avatarUploading" class="avatar-uploading-overlay">
                <div class="avatar-spinner"></div>
              </div>
              <input
                type="file"
                ref="fileInput"
                @change="onAvatarChange"
                accept="image/jpeg,image/png,image/gif,image/webp"
                style="display: none"
              />
              <div v-if="isOwner && !avatarUploading" class="avatar-overlay">
                更换头像
              </div>
            </div>

            <div class="user-main-info">
              <div class="name-edit-wrapper">
                <h2 :class="getRankColor(user.rating || 1500)" class="username">
                  {{ user.account }}
                </h2>
                <div
                  v-if="!isOwner && store.state.user"
                  class="relation-actions"
                >
                  <button
                    class="relation-btn"
                    :class="{ following: relationStatus.isFollowing }"
                    @mouseenter="isHoveringRelBtn = true"
                    @mouseleave="isHoveringRelBtn = false"
                    @click="toggleFollow"
                  >
                    {{ relationDisplayContent }}
                  </button>
                  <button class="message-btn" @click="handleMessage">
                    私信
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
              <div
                class="header-stat clickable"
                @click="openRelationModal('following')"
              >
                <div class="stat-label">关注</div>
                <div class="stat-value">{{ user.followingCount || 0 }}</div>
              </div>
              <div
                class="header-stat clickable"
                @click="openRelationModal('followers')"
              >
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
              {{ isOwner ? "我的主页" : "他的主页" }}
            </router-link>
            <router-link
              :to="`/profile/${routeAccount}/courses`"
              class="tab-item"
              :class="{ active: $route.name === 'userCourses' }"
            >
              {{ isOwner ? "我的课程" : "他的课程" }}
            </router-link>
            <router-link
              :to="`/profile/${routeAccount}/submissions`"
              class="tab-item"
              :class="{ active: $route.name === 'userSubmissions' }"
            >
              {{ isOwner ? "我的提交" : "他的提交" }}
            </router-link>
            <router-link
              :to="`/profile/${routeAccount}/contests`"
              class="tab-item"
              :class="{ active: $route.name === 'userContests' }"
            >
              {{ isOwner ? "我的比赛" : "他的比赛" }}
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
          <button class="save-btn modal-btn" @click="submitEdit">保存</button>
        </div>
      </div>
    </div>

    <!-- Relation Modal -->
    <div
      v-if="showRelationModal"
      class="modal-overlay"
      @click.self="closeRelationModal"
    >
      <div class="relation-modal-content">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ relationModalType === "followers" ? "粉丝列表" : "关注列表" }}
          </h3>
          <button class="close-icon-btn" @click="closeRelationModal">×</button>
        </div>
        <div class="relation-list" v-if="relationList.length > 0">
          <div
            class="relation-item"
            v-for="relUser in relationList"
            :key="relUser.id"
            @click="goToProfile(relUser.account)"
            style="cursor: pointer"
          >
            <img
              :src="relUser.avatarUrl || defaultAvatar"
              alt="Avatar"
              class="rel-avatar"
            />
            <div class="rel-info">
              <div
                class="rel-name"
                :class="getRankColor(relUser.rating || 1500)"
              >
                {{ relUser.account }}
              </div>
              <div class="rel-bio" v-if="relUser.bio">{{ relUser.bio }}</div>
            </div>
          </div>
        </div>
        <div class="relation-empty" v-else>暂无数据</div>
        <div class="relation-pagination" v-if="relationTotal > 0">
          <button
            :disabled="relationCurrent === 1"
            @click="changeRelationPage(1)"
          >
            首页
          </button>
          <button
            :disabled="relationCurrent === 1"
            @click="changeRelationPage(relationCurrent - 1)"
          >
            上一页
          </button>

          <button
            v-for="page in paginationPages"
            :key="page"
            :class="{ active: relationCurrent === page }"
            @click="changeRelationPage(page)"
          >
            {{ page }}
          </button>

          <button
            :disabled="relationCurrent >= relationTotalPages"
            @click="changeRelationPage(relationCurrent + 1)"
          >
            下一页
          </button>
          <button
            :disabled="relationCurrent >= relationTotalPages"
            @click="changeRelationPage(relationTotalPages)"
          >
            末页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, provide } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useNotification } from "@/composables/useNotification";
import {
  ProfileControllerService,
  RelationControllerService,
  UpdateProfileDTO,
  UserDetailVO,
  UserVO,
} from "../../../../generated/user";

const route = useRoute();
const store = useStore();

const user = ref<UserVO | null>(null);
const privateInfo = ref<UserDetailVO | null>(null);
provide("profileUser", user);
provide("privateInfo", privateInfo);

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

const fileInput = ref<HTMLInputElement | null>(null);
const avatarUploading = ref(false);

const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2MB
const AVATAR_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const AVATAR_ALLOWED_EXTENSIONS = "JPG、PNG、JPEG、WebP";

const triggerAvatarUpload = () => {
  if (avatarUploading.value) return;
  if (fileInput.value) {
    fileInput.value.value = ""; // Reset to allow re-selecting same file
    fileInput.value.click();
  }
};

const onAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];

  // Validate file type
  if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
    showNotification(`仅支持 ${AVATAR_ALLOWED_EXTENSIONS} 格式的图片`, "error");
    return;
  }

  // Validate file size
  if (file.size > AVATAR_MAX_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    showNotification(`图片大小 ${sizeMB}MB 超过限制（最大 2MB）`, "error");
    return;
  }

  avatarUploading.value = true;
  try {
    const res = await ProfileControllerService.uploadAvatarUsingPut(file);
    if (res.code === 0) {
      showNotification("头像更新成功", "success");
      // Refresh profile to get new avatar URL
      await fetchUserProfile(routeAccount.value);
      // Also update the store's user avatar if it's the owner
      if (store.state.user && res.data) {
        store.commit("updateUser", { avatarUrl: res.data });
      }
    } else {
      showNotification(
        "头像上传失败：" + ((res as any).msg || "未知错误"),
        "error"
      );
    }
  } catch (err: any) {
    showNotification(
      "头像上传异常：" + (err.body?.msg || err.message || "网络错误"),
      "error"
    );
  } finally {
    avatarUploading.value = false;
  }
};

const { show: showNotification } = useNotification();

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
const submittingEdit = ref(false);
const editForm = ref<UpdateProfileDTO>({
  account: undefined as any,
  bio: undefined as any,
  school: undefined as any,
});

const relationStatus = ref<{ isFollowing: boolean; isFollower: boolean }>({
  isFollowing: false,
  isFollower: false,
});

const isHoveringRelBtn = ref(false);

const relationDisplayContent = computed(() => {
  if (relationStatus.value.isFollowing && relationStatus.value.isFollower) {
    return isHoveringRelBtn.value ? "取消关注" : "互相关注";
  } else if (relationStatus.value.isFollowing) {
    return isHoveringRelBtn.value ? "取消关注" : "已���注";
  }
  return "+关注";
});

const fetchRelationStatus = async (toUserId: number) => {
  if (!store.state.user) return;
  try {
    const res = await RelationControllerService.statusUsingGet(toUserId);
    if (res.code === 0 && res.data) {
      // The backend returns keys: "following", "followedBy", "mutual"
      relationStatus.value.isFollowing = (res.data as any).following || false;
      relationStatus.value.isFollower = (res.data as any).followedBy || false;
    }
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch relation status:", err);
  }
};

const toggleFollow = async () => {
  const targetId = Number(user.value?.id);
  if (!targetId) return;
  if (!store.state.user) {
    showNotification("请先登录", "info");
    return;
  }

  try {
    if (relationStatus.value.isFollowing) {
      const res = await RelationControllerService.unfollowUsingPost(targetId);
      if (res.code === 0) {
        relationStatus.value.isFollowing = false;
        if (user.value) {
          user.value.followerCount = Math.max(
            0,
            (user.value.followerCount || 0) - 1
          );
        }
      } else {
        showNotification("操作失败：" + (res as any).msg, "error");
      }
    } else {
      const res = await RelationControllerService.followUsingPost(targetId);
      if (res.code === 0) {
        relationStatus.value.isFollowing = true;
        if (user.value) {
          user.value.followerCount = (user.value.followerCount || 0) + 1;
        }
      } else {
        showNotification("操作失败：" + (res as any).msg, "error");
      }
    }
  } catch (err: any) {
    showNotification(
      "操作异常：" + (err.body?.msg || err.message || "未知错误"),
      "error"
    );
  }
};

const handleMessage = () => {
  showNotification("私信功能开发中", "info");
};

const showRelationModal = ref(false);
const relationModalType = ref<"following" | "followers">("followers");
const relationList = ref<UserVO[]>([]);
const relationCurrent = ref(1);
const relationTotal = ref(0);

const relationTotalPages = computed(() => Math.ceil(relationTotal.value / 10));

const paginationPages = computed(() => {
  const pages = [];
  const total = relationTotalPages.value;
  const current = relationCurrent.value;
  const maxPagesToShow = 5;

  let start = Math.max(1, current - 2);
  let end = Math.min(total, start + maxPagesToShow - 1);

  if (end - start + 1 < maxPagesToShow) {
    start = Math.max(1, end - maxPagesToShow + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

import { useRouter } from "vue-router";

const router = useRouter();

const goToProfile = (account?: string) => {
  if (account) {
    showRelationModal.value = false;
    router.push(`/profile/${account}`);
  }
};

const openRelationModal = async (type: "following" | "followers", page = 1) => {
  showRelationModal.value = true;
  relationModalType.value = type;
  relationCurrent.value = page;
  relationList.value = [];
  const targetId = user.value?.id ? Number(user.value.id) : undefined;
  if (!targetId) return;
  try {
    let res;
    if (type === "followers") {
      res = await RelationControllerService.followersUsingGet(
        targetId,
        page,
        10,
        "update_time",
        "descend"
      );
    } else {
      res = await RelationControllerService.followingUsingGet(
        targetId,
        page,
        10,
        "update_time",
        "descend"
      );
    }
    if (res.code === 0 && res.data) {
      relationList.value = res.data.records || [];
      relationTotal.value = res.data.total || 0;
    }
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch relation list:", err);
  }
};

const changeRelationPage = (page: number) => {
  openRelationModal(relationModalType.value, page);
};

const closeRelationModal = () => {
  showRelationModal.value = false;
};

const openEditModal = () => {
  if (privateInfo.value) {
    editForm.value = {
      account: privateInfo.value.account,
      bio: privateInfo.value.bio,
      school: privateInfo.value.school,
    };
  } else if (user.value) {
    editForm.value = {
      account: user.value.account,
      bio: user.value.bio,
      school: user.value.school,
    };
  }
  isEditing.value = true;
};

const submitEdit = async () => {
  if (submittingEdit.value) return;
  submittingEdit.value = true;
  try {
    const payload: any = {};
    for (const [k, v] of Object.entries(editForm.value)) {
      if (v !== "" && v !== undefined && v !== null) {
        payload[k] = v;
      }
    }
    const res = await ProfileControllerService.updateProfileUsingPut(
      payload as UpdateProfileDTO
    );
    if (res.code === 0) {
      showNotification("资料已更新", "success");
      await fetchUserProfile(user.value?.account || "");
      isEditing.value = false;
    } else {
      showNotification("更新失败: " + (res as any).msg, "error");
    }
  } catch (err: any) {
    showNotification("网络错误: " + (err.body?.msg || err.message), "error");
  } finally {
    submittingEdit.value = false;
  }
};

const fetchUserProfile = async (account: string) => {
  if (!account) return;
  loading.value = true;
  error.value = "";
  relationStatus.value = {
    isFollowing: false,
    isFollower: false,
  };
  isHoveringRelBtn.value = false;
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
      const targetId = Number(user.value.id);
      if (
        store.state.user &&
        store.state.user.account !== account &&
        targetId
      ) {
        await fetchRelationStatus(targetId);
      }
    } else {
      error.value = (res as any).msg || "获取用户信息失败";
    }

    if (store.state.user && store.state.user.account === account) {
      const pRes = await ProfileControllerService.getPrivateProfileUsingGet();
      if (pRes.code === 0 && pRes.data) {
        privateInfo.value = pRes.data;
      }
    }
  } catch (err: any) {
    error.value = err.body?.msg || err.message || "网络错误";
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

watch(
  () => store.state.user,
  (newUser) => {
    if (newUser && user.value && newUser.account !== routeAccount.value) {
      const targetId = Number(user.value.id);
      if (targetId) {
        fetchRelationStatus(targetId);
      }
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

.header-stat.clickable {
  cursor: pointer;
  transition: opacity 0.2s;
}

.header-stat.clickable:hover {
  opacity: 0.8;
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

.avatar-uploading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  border-radius: 50%;
}

.avatar-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: avatarSpin 0.8s linear infinite;
}

@keyframes avatarSpin {
  to {
    transform: rotate(360deg);
  }
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
  gap: 16px;
}

.relation-actions {
  display: flex;
  gap: 8px;
}

.relation-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: #3b82f6;
  color: white;
  transition: all 0.2s;
  min-width: 82px;
  text-align: center;
}

.relation-btn.following {
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.relation-btn.following:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.relation-btn:not(.following):hover {
  opacity: 0.9;
}

.message-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: #f8fafc;
  transition: all 0.2s;
}

.message-btn:hover {
  background: rgba(255, 255, 255, 0.05);
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

/* Relation Modal */
.relation-modal-content {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.close-icon-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.relation-list {
  padding: 10px 0;
  overflow-y: auto;
  flex: 1;
}

.relation-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  gap: 12px;
  transition: background 0.2s;
}

.relation-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.rel-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.rel-info {
  display: flex;
  flex-direction: column;
}

.rel-name {
  font-weight: 600;
  font-size: 14px;
}

.rel-bio {
  font-size: 12px;
  color: #94a3b8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 250px;
}

.relation-empty {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

.relation-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  color: #94a3b8;
  font-size: 13px;
}

.relation-pagination button {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #334155;
  color: #f8fafc;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
}

.relation-pagination button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.relation-pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
