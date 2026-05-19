<template>
  <div class="submission-list-wrapper">
    <section class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">全部提交</h1>
          <p class="page-subtitle">查看平台所有提交记录</p>
        </div>
      </div>
    </section>

    <div class="list-container">
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else-if="submissions.length === 0" class="empty-state">
        暂无提交数据
      </div>
      <table v-else class="submission-table">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-user">用户</th>
            <th class="col-problem">题目</th>
            <th class="col-status">状态</th>
            <th class="col-score">得分</th>
            <th class="col-time">耗时</th>
            <th class="col-memory">内存</th>
            <th class="col-language">语言</th>
            <th class="col-submit-time">提交时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sub in submissions" :key="sub.id" class="submission-row">
            <td class="col-id">
              <span
                class="link-text actionable"
                @click="openSubmissionDetail(sub)"
              >
                {{ sub.id }}
              </span>
            </td>
            <td class="col-user">
              <router-link
                :to="`/profile/${sub.user?.account}`"
                class="link-text"
                v-if="sub.user?.account"
              >
                {{ sub.user.account }}
              </router-link>
              <span v-else>-</span>
            </td>
            <td class="col-problem">
              <router-link
                :to="`/problem/${sub.problem?.id}`"
                class="link-text"
                v-if="sub.problem?.id"
              >
                {{ sub.problem.id }} - {{ sub.problem.title || "未知题目" }}
              </router-link>
              <span v-else>-</span>
            </td>
            <td class="col-status">
              <span
                :class="[
                  'status-badge',
                  getStatusClass(sub.status),
                  'actionable',
                ]"
                @click="openSubmissionDetail(sub)"
              >
                {{ sub.status || "Unknown" }}
              </span>
            </td>
            <td class="col-score">
              <span class="actionable" @click="openSubmissionDetail(sub)">
                {{ sub.score ?? 0 }}
              </span>
            </td>
            <td class="col-time">
              {{
                sub.timeUsed !== undefined && sub.timeUsed !== null
                  ? sub.timeUsed + " ms"
                  : "-"
              }}
            </td>
            <td class="col-memory">
              {{
                sub.memoryUsed !== undefined && sub.memoryUsed !== null
                  ? Math.round(sub.memoryUsed / 1024) + " MB"
                  : "-"
              }}
            </td>
            <td class="col-language">{{ sub.language || "-" }}</td>
            <td class="col-submit-time">
              <span class="actionable" @click="openSubmissionDetail(sub)">
                {{ formatDate(sub.submitTime) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading" class="pagination-wrapper">
        <div class="pagination-container">
          <button
            :disabled="current <= 1"
            @click="goToPage(1)"
            class="btn-page btn-nav"
            v-if="total > 0"
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
            v-if="total > 0"
          >
            末页
          </button>
        </div>
        <div class="pagination-info">
          <span v-if="total > 0"
            >共 {{ total }} 行数据 / 共 {{ totalPages }} 页</span
          >
          <span v-else>第 {{ current }} 页</span>
        </div>
      </div>
    </div>

    <SubmissionDetailModal
      v-model:visible="modalVisible"
      :submissionId="selectedSubmission?.id"
      :problemTitle="selectedSubmission?.problem?.title"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { SubmissionControllerService } from "../../../generated/problem/services/SubmissionControllerService";
import type { SubmissionVO } from "../../../generated/problem/models/SubmissionVO";
import SubmissionDetailModal from "../../components/SubmissionDetailModal.vue";

export default defineComponent({
  name: "SubmissionListView",
  components: {
    SubmissionDetailModal,
  },
  setup() {
    const submissions = ref<SubmissionVO[]>([]);
    const loading = ref(true);
    const current = ref(1);
    const total = ref(0);
    const pageSize = 50;
    const hasNextPage = ref(false);

    const modalVisible = ref(false);
    const selectedSubmission = ref<SubmissionVO | null>(null);

    const totalPages = computed(() => {
      if (total.value > 0) return Math.ceil(total.value / pageSize);
      return current.value + (hasNextPage.value ? 1 : 0);
    });

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

    const loadData = async () => {
      loading.value = true;
      try {
        const res = await SubmissionControllerService.listSubmissionsUsingGet(
          undefined, // contestId
          current.value, // current
          undefined, // language
          pageSize, // pageSize
          undefined, // problemId
          "id", // sortField
          "descend", // sortOrder
          undefined, // status
          undefined // userId
        );
        if (res.code === 0 && res.data) {
          submissions.value = res.data.records || [];
          total.value = res.data.total ? Number(res.data.total) : 0;
          hasNextPage.value = submissions.value.length === pageSize;
        }
      } catch (err: any) {
        console.error("获取提交列表失败:", err);
      } finally {
        loading.value = false;
      }
    };

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages.value && page !== current.value) {
        current.value = page;
        loadData();
      }
    };

    onMounted(() => {
      loadData();
    });

    const getStatusClass = (status?: string) => {
      if (!status) return "default";
      const s = status.toUpperCase();
      if (s === "AC" || s === "ACCEPTED") return "success";
      if (s === "WA" || s === "WRONG_ANSWER") return "danger";
      if (s === "RE" || s === "RUNTIME_ERROR") return "warning";
      if (s === "TLE" || s === "TIME_LIMIT_EXCEEDED") return "warning";
      if (s === "MLE" || s === "MEMORY_LIMIT_EXCEEDED") return "warning";
      if (s === "CE" || s === "COMPILE_ERROR") return "warning";
      return "default";
    };

    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    const openSubmissionDetail = (sub: SubmissionVO) => {
      selectedSubmission.value = sub;
      modalVisible.value = true;
    };

    return {
      submissions,
      loading,
      current,
      total,
      pageSize,
      totalPages,
      visiblePages,
      modalVisible,
      selectedSubmission,
      goToPage,
      getStatusClass,
      formatDate,
      openSubmissionDetail,
    };
  },
});
</script>

<style scoped>
.submission-list-wrapper {
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
  display: flex;
  justify-content: center;
  align-items: center;
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

.submission-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.submission-table th {
  text-align: left;
  padding: 16px;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.submission-row:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.submission-table td {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

.col-id {
  width: 80px;
  color: #cbd5e1;
}

.col-user {
  min-width: 120px;
}

.col-problem {
  min-width: 200px;
}

.col-status {
  width: 160px;
}

.col-score {
  width: 80px;
  color: #fbbf24;
  font-weight: 600;
}

.col-time {
  width: 100px;
  color: #cbd5e1;
}

.col-memory {
  width: 100px;
  color: #cbd5e1;
}

.col-language {
  width: 100px;
  color: #cbd5e1;
}

.col-submit-time {
  width: 180px;
  color: #94a3b8;
  font-size: 0.9rem;
}

.actionable {
  cursor: pointer;
}

.col-id .actionable {
  color: #3b82f6;
}

.col-score .actionable {
  color: #fbbf24;
}

.col-score .actionable:hover {
  text-decoration: underline;
}

.link-text {
  color: #f8fafc;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.link-text:hover {
  color: #3b82f6;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-badge.danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.status-badge.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-badge.default {
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.2);
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
