<template>
  <div class="problem-list-wrapper">
    <section class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">题库</h1>
          <p class="page-subtitle">探索、练习、提升你的算法能力</p>
        </div>
        <div
          class="header-actions"
          v-if="currentUser?.role === 'admin' || currentUser?.role === 'ADMIN'"
        >
          <router-link to="/problem/create" class="btn-create-problem">
            + 创建题目
          </router-link>
        </div>
      </div>
    </section>

    <div class="list-container">
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else-if="problems.length === 0" class="empty-state">
        暂无题目数据
      </div>
      <table v-else class="problem-table">
        <thead>
          <tr>
            <th class="col-id">#</th>
            <th class="col-title">题目名称</th>
            <th class="col-source">来源</th>
            <th class="col-tags">
              标签
              <span @click="toggleAllTags" class="tags-toggle-btn-header">
                {{ showAllTags ? "隐藏" : "显示" }}
              </span>
            </th>
            <th class="col-pass-rate">通过率</th>
            <th class="col-action" v-if="isAdmin">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="problem in problems" :key="problem.id" class="problem-row">
            <td class="col-id">{{ problem.id }}</td>
            <td class="col-title">
              <span class="problem-name" @click="doProblem(problem.id)">
                {{ problem.title }}
              </span>
              <span v-if="problem.status === 0" class="status-hidden"
                >隐藏</span
              >
            </td>
            <td class="col-source">
              <span v-for="s in problem.source" :key="s" class="source-tag">
                {{ s }}
              </span>
            </td>
            <td class="col-tags">
              <div v-if="showAllTags" class="tags-container">
                <span v-for="tag in problem.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
              <span v-else class="sub-text">已隐藏</span>
            </td>
            <td class="col-pass-rate">
              {{ getPassRate(problem.acceptedCount, problem.submitCount) }}
              <span class="sub-text"
                >({{ problem.acceptedCount || 0 }}/{{
                  problem.submitCount || 0
                }})</span
              >
            </td>
            <td class="col-action" v-if="isAdmin">
              <button class="btn-modify" @click="editProblem(problem.id)">
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
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ProblemControllerService } from "../../../generated/services/ProblemControllerService";
import type { ProblemVO } from "../../../generated/models/ProblemVO";

export default defineComponent({
  name: "ProblemListView",
  setup() {
    const router = useRouter();
    const store = useStore();
    const problems = ref<ProblemVO[]>([]);
    const loading = ref(true);
    const showAllTags = ref(false);

    const toggleAllTags = () => {
      showAllTags.value = !showAllTags.value;
    };

    const currentUser = computed(() => store.getters.currentUser);

    const isAdmin = computed(() => {
      const role = currentUser.value?.role;
      return role === "admin" || role === "ADMIN";
    });

    const loadData = async () => {
      loading.value = true;
      try {
        const res = await ProblemControllerService.getProblemListUsingGet(
          50,
          0
        );
        if (res.code === 0 && res.data) {
          problems.value = res.data;
        }
      } catch (err) {
        console.error("获取题目列表失败:", err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadData();
    });

    const getPassRate = (accepted?: number, submit?: number) => {
      if (!submit) return "0.00%";
      return (((accepted || 0) / submit) * 100).toFixed(2) + "%";
    };

    const doProblem = (id?: number) => {
      if (!id) return;
      router.push(`/problem/${id}`);
    };

    const editProblem = (id?: number) => {
      if (!id) return;
      router.push(`/problem/edit/${id}`);
    };

    return {
      currentUser,
      isAdmin,
      problems,
      loading,
      getPassRate,
      doProblem,
      editProblem,
      showAllTags,
      toggleAllTags,
    };
  },
});
</script>

<style scoped>
.problem-list-wrapper {
  min-height: calc(100vh - 64px);
  background-color: #0f172a;
  padding: 40px 20px;
  color: #f8fafc;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 30px;
  text-align: left;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.btn-create-problem {
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

.btn-create-problem:hover {
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

.problem-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.problem-table th {
  text-align: left;
  padding: 16px;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.problem-row:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.problem-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

.col-id {
  width: 80px;
  color: #cbd5e1;
}

.col-title {
  min-width: 300px;
}

.problem-name {
  color: #f8fafc;
  font-weight: 500;
  font-size: 1.05rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.problem-name:hover {
  color: #3b82f6;
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

.col-source {
  width: 150px;
}

.source-tag {
  display: inline-block;
  padding: 4px 10px;
  margin-right: 8px;
  margin-bottom: 4px;
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.col-tags {
  width: 300px;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  margin-right: 8px;
  margin-bottom: 4px;
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.col-pass-rate {
  width: 150px;
  color: #cbd5e1;
}

.sub-text {
  font-size: 0.8rem;
  color: #64748b;
  margin-left: 4px;
}

.tags-toggle-btn-header {
  cursor: pointer;
  color: #60a5fa;
  font-size: 0.85rem;
  padding: 2px 6px;
  margin-left: 8px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.tags-toggle-btn-header:hover {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
}

.col-action {
  width: 80px;
  text-align: right;
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
