<template>
  <div class="course-list-wrapper">
    <section class="page-header">
      <div class="header-content">
        <div class="header-title-group">
          <h1 class="page-title">课程列表</h1>
          <p class="page-subtitle">发现精品课程，提升你的实力</p>
        </div>
        <div
          class="header-actions"
          v-if="currentUser?.role === 'admin' || currentUser?.role === 'ADMIN'"
        >
          <router-link to="/course/create" class="btn-create-course">
            + 创建课程
          </router-link>
        </div>
      </div>
    </section>

    <div class="list-container">
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else-if="courses.length === 0" class="empty-state">
        暂无课程数据
      </div>
      <table v-else class="course-table">
        <thead>
          <tr>
            <th class="col-id">#</th>
            <th class="col-cover">封面</th>
            <th class="col-title">课程名称</th>
            <th class="col-price">价格</th>
            <th class="col-sales">销量</th>
            <th class="col-action" v-if="isAdmin">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id" class="course-row">
            <td
              class="col-id"
              @click="goToDetail(course.id)"
              style="cursor: pointer"
            >
              {{ course.id }}
            </td>
            <td
              class="col-cover"
              @click="goToDetail(course.id)"
              style="cursor: pointer"
            >
              <img
                :src="course.coverUrl"
                alt="Cover"
                class="course-cover"
                v-if="course.coverUrl"
              />
              <div v-else class="course-cover-placeholder">无封面</div>
            </td>
            <td
              class="col-title"
              @click="goToDetail(course.id)"
              style="cursor: pointer"
            >
              <span class="course-name">{{ course.title }}</span>
              <span v-if="course.status === 0" class="status-hidden">隐藏</span>
              <div class="course-desc">{{ course.description }}</div>
            </td>
            <td
              class="col-price"
              @click="goToDetail(course.id)"
              style="cursor: pointer"
            >
              <span class="current-price">￥{{ course.price }}</span>
              <span
                class="original-price"
                v-if="
                  course.originalPrice && course.originalPrice > course.price
                "
                >￥{{ course.originalPrice }}</span
              >
            </td>
            <td class="col-sales">{{ course.saleCount || 0 }}</td>
            <td class="col-action" v-if="isAdmin">
              <button class="btn-modify" @click.stop="goToEdit(course.id)">
                修改
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { CourseControllerService, CourseVO } from "../../../generated/course";

export default defineComponent({
  name: "CourseListView",
  setup() {
    const store = useStore();
    const router = useRouter();
    const courses = ref<CourseVO[]>([]);
    const loading = ref(true);

    const currentUser = computed(() => store.getters.currentUser);

    const isAdmin = computed(() => {
      const role = currentUser.value?.role;
      return role === "admin" || role === "ADMIN";
    });

    const loadData = async () => {
      loading.value = true;
      try {
        const res = await CourseControllerService.listOnlineCoursesUsingGet();
        if (res.code === 0 && res.data) {
          courses.value = res.data || [];
        }
      } catch (err) {
        console.error("获取课程列表失败:", err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadData();
    });

    const goToEdit = (id?: number) => {
      if (id) {
        router.push(`/course/edit/${id}`);
      }
    };

    const goToDetail = (id?: number) => {
      if (id) {
        router.push(`/course/${id}`);
      }
    };

    return {
      currentUser,
      isAdmin,
      courses,
      loading,
      goToEdit,
      goToDetail,
    };
  },
});
</script>

<style scoped>
.course-list-wrapper {
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

.btn-create-course {
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

.btn-create-course:hover {
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

.course-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.course-table th {
  text-align: left;
  padding: 16px;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.course-row:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.course-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

.col-id {
  width: 80px;
  color: #cbd5e1;
}

.col-cover {
  width: 120px;
}

.course-cover {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
}

.course-cover-placeholder {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #94a3b8;
  font-size: 0.8rem;
}

.col-title {
  min-width: 300px;
}

.course-name {
  color: #f8fafc;
  font-weight: 500;
  font-size: 1.05rem;
  display: inline-block;
  margin-bottom: 4px;
}

.status-hidden {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  font-size: 0.75rem;
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 4px;
  vertical-align: middle;
}

.course-desc {
  color: #94a3b8;
  font-size: 0.85rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.col-price {
  width: 150px;
}

.current-price {
  color: #f59e0b;
  font-weight: 600;
  font-size: 1.1rem;
  margin-right: 8px;
}

.original-price {
  color: #64748b;
  font-size: 0.85rem;
  text-decoration: line-through;
}

.col-sales {
  width: 100px;
  color: #cbd5e1;
}

th.col-action,
td.col-action {
  width: 100px;
  text-align: center;
  white-space: nowrap;
}

.btn-modify {
  background: transparent;
  color: #f59e0b;
  border: 1px solid #f59e0b;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.btn-modify:hover {
  background: #f59e0b;
  color: #ffffff;
}
</style>
