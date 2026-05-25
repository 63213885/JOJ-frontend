<template>
  <div class="workspace-wrapper">
    <div class="workspace-nav">
      <div class="nav-links">
        <!-- 理论 实践｜提交代码 提交记录 排名 -->
        <router-link
          :to="`/course/${courseId}/lesson/${lessonId}/theory`"
          class="nav-item"
          active-class="active"
          >理论</router-link
        >
        <router-link
          :to="`/course/${courseId}/lesson/${lessonId}/practice`"
          class="nav-item"
          active-class="active"
          >实践</router-link
        >

        <div class="nav-divider"></div>

        <div class="nav-item disabled" title="功能开发中">提交代码</div>
        <div class="nav-item disabled" title="功能开发中">提交记录</div>
        <div class="nav-item disabled" title="功能开发中">排名</div>
      </div>
      <div class="nav-actions">
        <button class="btn-back" @click="goBack">返回课程</button>
      </div>
    </div>
    <div class="workspace-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "LessonWorkspaceView",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const courseId = computed(() => route.params.courseId);
    const lessonId = computed(() => route.params.lessonId);

    const goBack = () => {
      router.push(`/course/${courseId.value}`);
    };

    return {
      courseId,
      lessonId,
      goBack,
    };
  },
});
</script>

<style scoped>
.workspace-wrapper {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px);
  background-color: #0f172a;
}

.workspace-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 0 20px;
  height: 50px;
  background-color: #1e293b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.nav-links {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 100%;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
}

.nav-item:hover:not(.disabled) {
  color: #f8fafc;
  background-color: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  color: #3b82f6;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #3b82f6;
}

.nav-item.disabled {
  color: #475569;
  cursor: not-allowed;
}

.nav-divider {
  width: 1px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0 8px;
}

.btn-back {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
}

.workspace-content {
  flex: 1;
  display: flex;
}
</style>
