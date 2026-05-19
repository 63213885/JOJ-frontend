<template>
  <div class="user-list-wrapper">
    <section class="page-header">
      <div class="header-content">
        <div class="header-title-group">
          <h1 class="page-title">全部用户</h1>
          <p class="page-subtitle">查看和管理平台用户</p>
        </div>
        <div class="header-actions" v-if="isAdmin">
          <router-link to="/user/create" class="btn-create-user">
            + 添加用户
          </router-link>
        </div>
      </div>
    </section>

    <div class="list-container">
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else-if="users.length === 0" class="empty-state">暂无用户数据</div>
      <table v-else class="user-table">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-avatar">头像</th>
            <th class="col-account">账号</th>
            <th class="col-school">学校</th>
            <th class="col-rating">rating</th>
            <th class="col-solved">解题数</th>
            <th class="col-role">角色</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="user-row">
            <td class="col-id">{{ user.id }}</td>
            <td class="col-avatar">
              <img
                :src="user.avatarUrl || defaultAvatar"
                alt="Avatar"
                class="avatar-img"
              />
            </td>
            <td class="col-account">
              <router-link
                :to="`/profile/${user.account}`"
                class="user-account"
              >
                {{ user.account }}
              </router-link>
            </td>
            <td class="col-school">{{ user.school || "-" }}</td>
            <td class="col-rating">{{ user.rating ?? 0 }}</td>
            <td class="col-solved">{{ user.solvedCount ?? 0 }}</td>
            <td class="col-role">
              <span
                :class="[
                  'role-badge',
                  user.role === 'admin' || user.role === 'ADMIN'
                    ? 'admin'
                    : 'user',
                ]"
              >
                {{ user.role }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && total > 0" class="pagination-wrapper">
        <div class="pagination-container">
          <button
            :disabled="current <= 1"
            @click="goToPage(1)"
            class="btn-page btn-nav"
          >
            首页
          </button>
          <button
            :disabled="current <= 1"
            @click="goToPage(current - 1)"
            class="btn-page btn-nav"
          >
            上一页
          </button>

          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="['btn-page', { active: page === current }]"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="current >= totalPages"
            @click="goToPage(current + 1)"
            class="btn-page btn-nav"
          >
            下一页
          </button>
          <button
            :disabled="current >= totalPages"
            @click="goToPage(totalPages)"
            class="btn-page btn-nav"
          >
            末页
          </button>
        </div>
        <div class="pagination-info">
          共 {{ total }} 行数据 / 共 {{ totalPages }} 页
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { UserControllerService, UserVO } from "../../../generated/user";

export default defineComponent({
  name: "UserListView",
  setup() {
    const store = useStore();
    const users = ref<UserVO[]>([]);
    const loading = ref(true);
    const current = ref(1);
    const total = ref(0);
    const pageSize = 50;
    const defaultAvatar =
      "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";

    const currentUser = computed(() => store.getters.currentUser);

    const isAdmin = computed(() => {
      const role = currentUser.value?.role;
      return role === "admin" || role === "ADMIN";
    });

    const totalPages = computed(() => Math.ceil(total.value / pageSize));

    const visiblePages = computed(() => {
      const currentVal = current.value;
      const totalVal = totalPages.value;
      const pages = [];
      let start = Math.max(1, currentVal - 2);
      let end = Math.min(totalVal, currentVal + 2);

      if (end - start + 1 < 5) {
        if (start === 1) {
          end = Math.min(totalVal, start + 4);
        } else if (end === totalVal) {
          start = Math.max(1, end - 4);
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages.value && page !== current.value) {
        current.value = page;
        loadData();
      }
    };

    const loadData = async () => {
      loading.value = true;
      try {
        const res = await UserControllerService.listUserPageUsingGet(
          current.value,
          pageSize,
          "id",
          "ascend"
        );

        if (res.code === 0 && res.data) {
          users.value = res.data.records || [];
          total.value = res.data.total ? Number(res.data.total) : 0;
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error("获取用户列表失败:", err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      currentUser,
      isAdmin,
      users,
      loading,
      current,
      total,
      pageSize,
      defaultAvatar,
      totalPages,
      visiblePages,
      goToPage,
    };
  },
});
</script>

<style scoped>
.user-list-wrapper {
  min-height: calc(100vh - 64px);
  background-color: #0f172a;
  padding: 40px 20px;
  color: #f8fafc;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 30px;
  text-align: center;
}

.header-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-title-group {
  text-align: center;
}

.header-actions {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 1rem;
}

.btn-create-user {
  display: inline-block;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
}

.btn-create-user:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.list-container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #94a3b8;
  font-size: 1.1rem;
}

.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.user-table th {
  text-align: left;
  padding: 16px;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-row:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.user-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

.col-id {
  width: 80px;
  color: #cbd5e1;
}

.col-avatar {
  width: 80px;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.col-account {
  min-width: 150px;
}

.user-account {
  color: #f8fafc;
  font-weight: 500;
  font-size: 1.05rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.user-account:hover {
  color: #3b82f6;
}

.col-school {
  color: #cbd5e1;
  min-width: 120px;
}

.col-rating {
  color: #fbbf24;
  font-weight: 600;
}

.col-solved {
  color: #cbd5e1;
}

.col-role {
  width: 100px;
}

.role-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.role-badge.admin {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.role-badge.user {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.pagination-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.pagination-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-numbers {
  display: flex;
  gap: 6px;
  margin: 0 8px;
}

.btn-page {
  background: rgba(15, 23, 42, 0.6);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-page:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #f8fafc;
  background: rgba(59, 130, 246, 0.1);
}

.btn-page.active {
  background: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-page:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: rgba(15, 23, 42, 0.4);
}

.btn-nav {
  padding: 0 16px;
}

.pagination-info {
  color: #64748b;
  font-size: 0.85rem;
}
</style>
