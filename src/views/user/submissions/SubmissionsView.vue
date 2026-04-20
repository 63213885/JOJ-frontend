<template>
  <div class="submissions-container">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="content">
      <h2>{{ account }} 的提交记录</h2>
      <!-- 提交记录内容区域 -->
      <div class="placeholder">暂无提交记录展示（需按需开发）</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const account = ref("");
const loading = ref(false);

onMounted(() => {
  account.value = (route.params.account as string) || "";
});
</script>

<style scoped>
.submissions-container {
  padding: 40px;
  color: #f8fafc;
  background-color: #0f172a;
  min-height: 100vh;
}

.loading {
  text-align: center;
  color: #94a3b8;
}

.placeholder {
  margin-top: 20px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  text-align: center;
  color: #94a3b8;
}
</style>
