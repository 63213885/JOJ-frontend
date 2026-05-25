<template>
  <div class="course-detail-wrapper">
    <div v-if="loading" class="loading-state">加载中...</div>
    <div v-else-if="course" class="course-container">
      <div class="course-header">
        <div class="cover-wrapper">
          <img
            v-if="course.coverUrl"
            :src="course.coverUrl"
            :alt="course.title"
          />
          <div v-else class="cover-placeholder">无封面</div>
        </div>
        <div class="course-info">
          <h1 class="course-title">{{ course.title }}</h1>
          <p class="course-desc">{{ course.description }}</p>
        </div>
      </div>

      <div class="course-lessons">
        <div class="section-title-wrap">
          <h2 class="section-title">课程章节</h2>
          <button
            v-if="isAdmin"
            class="btn btn-primary"
            @click="goToCreateLesson"
          >
            添加章节
          </button>
        </div>
        <div v-if="loadingLessons" class="loading-state">加载章节模块中...</div>
        <div v-else-if="lessons.length === 0" class="empty-state">
          暂无章节内容
        </div>
        <div class="lesson-list" v-else>
          <div
            v-for="(lesson, index) in lessons"
            :key="lesson.id"
            class="lesson-item"
          >
            <div class="lesson-info">
              <span class="lesson-index">章节 {{ index + 1 }}</span>
              <span class="lesson-title">{{ lesson.title }}</span>
            </div>
            <div class="lesson-actions">
              <button
                v-if="isAdmin"
                class="btn btn-edit"
                @click="goToEditLesson(lesson.id)"
              >
                修改
              </button>
              <button
                class="btn btn-theory"
                @click="goToLesson(lesson.id, 'theory')"
              >
                理论
              </button>
              <button
                class="btn btn-practice"
                @click="goToLesson(lesson.id, 'practice')"
              >
                实践
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  CourseControllerService,
  CourseLessonControllerService,
  CourseVO,
  CourseLessonVO,
} from "../../../generated/course";

export default defineComponent({
  name: "CourseDetailView",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const courseId = Number(route.params.id);

    const currentUser = computed(() => store.getters.currentUser);
    const isAdmin = computed(() => {
      const role = currentUser.value?.role;
      return role === "admin" || role === "ADMIN";
    });

    const loading = ref(true);
    const loadingLessons = ref(true);
    const course = ref<CourseVO | null>(null);
    const lessons = ref<CourseLessonVO[]>([]);

    const loadCourseData = async () => {
      loading.value = true;
      try {
        const res = await CourseControllerService.getCourseUsingGet(courseId);
        if (res.code === 0 && res.data) {
          course.value = res.data;
        }
      } catch (err) {
        console.error("加载课程信息失败", err);
      } finally {
        loading.value = false;
      }
    };

    const loadLessonsData = async () => {
      loadingLessons.value = true;
      try {
        const res = await CourseLessonControllerService.listLessonsUsingGet(
          courseId
        );
        if (res.code === 0 && res.data) {
          // Sort lessons by sort order
          lessons.value = (res.data || []).sort(
            (a, b) => (a.sort || 0) - (b.sort || 0)
          );
        }
      } catch (err) {
        console.error("加载章节列表失败", err);
      } finally {
        loadingLessons.value = false;
      }
    };

    const goToLesson = (
      lessonId: number | undefined,
      target: "theory" | "practice"
    ) => {
      if (lessonId) {
        router.push(`/course/${courseId}/lesson/${lessonId}/${target}`);
      }
    };

    const goToCreateLesson = () => {
      router.push(`/course/${courseId}/lesson/create`);
    };

    const goToEditLesson = (lessonId: number | undefined) => {
      if (lessonId) {
        router.push(`/course/${courseId}/lesson/edit/${lessonId}`);
      }
    };

    onMounted(() => {
      loadCourseData();
      loadLessonsData();
    });

    return {
      course,
      lessons,
      loading,
      loadingLessons,
      isAdmin,
      goToLesson,
      goToCreateLesson,
      goToEditLesson,
    };
  },
});
</script>

<style scoped>
.course-detail-wrapper {
  min-height: calc(100vh - 64px);
  background-color: #0f172a;
  padding: 40px 20px;
  color: #f8fafc;
}

.course-container {
  max-width: 1000px;
  margin: 0 auto;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.course-header {
  display: flex;
  gap: 30px;
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
}

.cover-wrapper {
  width: 240px;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.course-info {
  display: flex;
  flex-direction: column;
}

.course-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.course-desc {
  color: #94a3b8;
  line-height: 1.6;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  padding-left: 10px;
  border-left: 4px solid #3b82f6;
  margin: 0;
}

.section-title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 41, 59, 0.6);
  padding: 20px 25px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.lesson-item:hover {
  background: rgba(51, 65, 85, 0.6);
  transform: translateY(-2px);
}

.lesson-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.lesson-index {
  color: #3b82f6;
  font-weight: 600;
  min-width: 60px;
}

.lesson-title {
  font-size: 1.1rem;
}

.lesson-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-theory {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.btn-edit {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.btn-edit:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.5);
}

.btn-theory:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.btn-practice {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.btn-practice:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.5);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

@media (max-width: 768px) {
  .course-header {
    flex-direction: column;
  }
  .cover-wrapper {
    width: 100%;
    height: 200px;
  }
}
</style>
