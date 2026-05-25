<template>
  <div class="practice-view">
    <div class="coming-soon">
      <div class="icon">💻</div>
      <h2>实践功能开发中</h2>
      <p>敬请期待，未来这里将提供代码编程实践环境...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LessonPracticeView",
});
</script>

<style scoped>
.practice-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #0f172a;
}

.coming-soon {
  text-align: center;
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 60px;
  max-width: 500px;
}

.icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

h2 {
  color: #f8fafc;
  font-size: 1.5rem;
  margin-bottom: 12px;
}

p {
  color: #94a3b8;
  line-height: 1.5;
}
</style>
