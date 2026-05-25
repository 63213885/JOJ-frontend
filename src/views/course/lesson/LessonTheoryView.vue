<template>
  <div class="theory-view">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载章节信息中...</p>
    </div>
    <div v-else-if="lesson" class="lesson-content">
      <div class="video-container">
        <!-- 有视频且已获取播放地址 -->
        <video
          v-if="videoUrl"
          ref="videoPlayer"
          class="video-player"
          :src="videoUrl"
          controls
          controlslist="nodownload"
          preload="metadata"
          @error="onVideoError"
        >
          您的浏览器不支持视频播放
        </video>

        <!-- 有视频但正在加载播放地址 -->
        <div
          v-else-if="lesson.videoFileId && videoLoading"
          class="video-placeholder"
        >
          <div class="video-loading">
            <div class="loading-spinner"></div>
            <p>正在获取视频播放地址...</p>
          </div>
        </div>

        <!-- 有视频但加载失败 -->
        <div
          v-else-if="lesson.videoFileId && videoError"
          class="video-placeholder"
        >
          <div class="video-error">
            <span class="icon-error">⚠</span>
            <p>{{ videoError }}</p>
            <button class="retry-btn" @click="loadVideoUrl">重新加载</button>
          </div>
        </div>

        <!-- 无视频 -->
        <div v-else class="video-placeholder">
          <div class="no-video">
            <span class="icon-no-video">🎬</span>
            <p>该章节暂无视频</p>
          </div>
        </div>
      </div>

      <div class="lesson-details">
        <h2 class="lesson-title">{{ lesson.title }}</h2>
        <div class="lesson-desc">{{ lesson.description || "暂无描述" }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import {
  CourseLessonControllerService,
  CourseLessonVO,
} from "../../../../generated/course";

export default defineComponent({
  name: "LessonTheoryView",
  setup() {
    const route = useRoute();
    const lessonId = Number(route.params.lessonId);

    const loading = ref(true);
    const lesson = ref<CourseLessonVO | null>(null);

    const videoUrl = ref<string>("");
    const videoLoading = ref(false);
    const videoError = ref<string>("");
    const videoPlayer = ref<HTMLVideoElement | null>(null);

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    const loadLesson = async () => {
      loading.value = true;
      try {
        const res = await CourseLessonControllerService.getLessonUsingGet(
          lessonId
        );
        if (res.code === 0 && res.data) {
          lesson.value = res.data;
          // 如果有视频则加载播放地址
          if (res.data.videoFileId) {
            await loadVideoUrl();
          }
        }
      } catch (err) {
        console.error("加载章节失败", err);
      } finally {
        loading.value = false;
      }
    };

    const loadVideoUrl = async () => {
      videoLoading.value = true;
      videoError.value = "";
      try {
        const res = await CourseLessonControllerService.getVideoPlayUrlUsingGet(
          lessonId
        );
        if (res.code === 0 && res.data && res.data.playUrl) {
          videoUrl.value = res.data.playUrl;

          // 设置定时器，在 URL 过期前自动刷新
          if (res.data.expireSeconds && res.data.expireSeconds > 0) {
            // 提前 60 秒刷新，确保不会中途断链
            const refreshDelay =
              Math.max(res.data.expireSeconds - 60, 30) * 1000;
            clearRefreshTimer();
            refreshTimer = setTimeout(() => {
              refreshVideoUrl();
            }, refreshDelay);
          }
        } else {
          videoError.value = "获取视频播放地址失败";
        }
      } catch (err) {
        console.error("获取视频播放地址失败", err);
        videoError.value = "获取视频播放地址失败，请稍后重试";
      } finally {
        videoLoading.value = false;
      }
    };

    const refreshVideoUrl = async () => {
      try {
        const res = await CourseLessonControllerService.getVideoPlayUrlUsingGet(
          lessonId
        );
        if (res.code === 0 && res.data && res.data.playUrl) {
          // 记录当前播放进度
          const player = videoPlayer.value;
          const currentTime = player ? player.currentTime : 0;
          const wasPaused = player ? player.paused : true;

          videoUrl.value = res.data.playUrl;

          // 恢复播放进度
          if (player) {
            player.addEventListener(
              "loadedmetadata",
              () => {
                player.currentTime = currentTime;
                if (!wasPaused) {
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  player.play().catch(() => {});
                }
              },
              { once: true }
            );
          }

          // 设置下一次刷新
          if (res.data.expireSeconds && res.data.expireSeconds > 0) {
            const refreshDelay =
              Math.max(res.data.expireSeconds - 60, 30) * 1000;
            clearRefreshTimer();
            refreshTimer = setTimeout(() => {
              refreshVideoUrl();
            }, refreshDelay);
          }
        }
      } catch (err) {
        console.error("刷新视频地址失败", err);
      }
    };

    const onVideoError = () => {
      videoError.value = "视频播放出错，请尝试重新加载";
      videoUrl.value = "";
    };

    const clearRefreshTimer = () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }
    };

    onMounted(() => {
      loadLesson();
    });

    onBeforeUnmount(() => {
      clearRefreshTimer();
    });

    return {
      lesson,
      loading,
      videoUrl,
      videoLoading,
      videoError,
      videoPlayer,
      loadVideoUrl,
      onVideoError,
    };
  },
});
</script>

<style scoped>
.theory-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: #f8fafc;
  background-color: #0f172a;
  overflow-y: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 100px;
  color: #94a3b8;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lesson-content {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b, #0f172a);
}

.video-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #94a3b8;
}

.video-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #f87171;
}

.icon-error {
  font-size: 2.5rem;
}

.icon-no-video {
  font-size: 2.5rem;
  opacity: 0.6;
}

.retry-btn {
  margin-top: 8px;
  padding: 8px 24px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.no-video {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
}

.lesson-details {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
}

.lesson-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #f8fafc;
}

.lesson-desc {
  color: #cbd5e1;
  line-height: 1.6;
}
</style>
