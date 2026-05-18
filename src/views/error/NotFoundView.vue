<template>
  <div class="error-wrapper">
    <div class="glass-panel">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面未找到</h2>
      <p class="error-subtitle">抱歉，您访问的页面不存在。</p>
      <router-link to="/" class="btn-home">返回首页</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFoundView",
});
</script>

<style scoped>
.error-wrapper {
  min-height: calc(100vh - 64px);
  background-color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.glass-panel {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.error-code {
  font-size: 6rem;
  font-weight: 800;
  color: #ef4444;
  margin: 0;
  line-height: 1;
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.error-title {
  font-size: 2rem;
  color: #f8fafc;
  margin: 20px 0 10px;
}

.error-subtitle {
  color: #94a3b8;
  margin-bottom: 30px;
}

.btn-home {
  display: inline-block;
  background: linear-gradient(135deg, #ef4444, #f97316);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.4);
}

.btn-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
}
</style>
