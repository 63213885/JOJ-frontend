<template>
  <div class="lesson-create-wrapper">
    <div class="form-container glass-panel">
      <div class="form-header">
        <h2 class="form-title">修改章节</h2>
        <p class="form-subtitle">更新课程内容</p>
      </div>

      <div v-if="loading" class="loading-state">加载中...</div>
      <form v-else @submit.prevent="handleSubmit" class="create-form">
        <div class="form-group">
          <label for="title">章节标题</label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            placeholder="请输入章节标题"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="description">章节描述</label>
          <textarea
            v-model="formData.description"
            placeholder="请详细描述章节内容..."
            class="form-input textarea-large"
          ></textarea>
        </div>

        <div class="form-group">
          <label>课程视频</label>

          <!-- Current video status -->
          <div
            v-if="formData.videoFileId && uploadProgress !== 100"
            class="video-status-card"
          >
            <div class="video-status-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="4"
                  width="15"
                  height="16"
                  rx="2"
                  stroke="#3b82f6"
                  stroke-width="1.5"
                />
                <path
                  d="M17 9.5L21.5 7V17L17 14.5"
                  stroke="#3b82f6"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="video-status-info">
              <span class="video-status-label">已关联视频</span>
              <span class="video-status-id"
                >视频文件 ID: {{ formData.videoFileId }}</span
              >
            </div>
            <div class="video-status-badge">
              <span class="badge-dot"></span>
              已上传
            </div>
          </div>

          <div
            v-else-if="!formData.videoFileId && uploadProgress !== 100"
            class="video-status-card video-status-empty"
          >
            <div class="video-status-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="4"
                  width="15"
                  height="16"
                  rx="2"
                  stroke="#475569"
                  stroke-width="1.5"
                />
                <path
                  d="M17 9.5L21.5 7V17L17 14.5"
                  stroke="#475569"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <line
                  x1="6"
                  y1="9"
                  x2="13"
                  y2="15"
                  stroke="#475569"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <line
                  x1="13"
                  y1="9"
                  x2="6"
                  y2="15"
                  stroke="#475569"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div class="video-status-info">
              <span class="video-status-label empty-label">暂无视频</span>
              <span class="video-status-id">请上传视频文件</span>
            </div>
          </div>

          <!-- Upload input -->
          <label class="upload-area">
            <input
              type="file"
              accept="video/*"
              @change="onFileChange"
              class="file-input-hidden"
            />
            <div class="upload-area-content">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 16V8M12 8L9 11M12 8L15 11"
                  stroke="#94a3b8"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4 17V19C4 20.1046 4.89543 21 6 21H18"
                  stroke="#94a3b8"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M18 21C19.1046 21 20 20.1046 20 19V17"
                  stroke="#94a3b8"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <span>{{
                formData.videoFileId ? "重新上传视频" : "选择视频文件"
              }}</span>
            </div>
          </label>

          <!-- Upload progress -->
          <div
            v-if="uploadProgress > 0 && uploadProgress < 100"
            class="progress-bar-container"
          >
            <div
              class="progress-bar"
              :style="{ width: uploadProgress + '%' }"
            ></div>
            <span class="progress-text"
              >{{ uploadProgress.toFixed(1) }}% ({{ uploadStatus }})</span
            >
          </div>
          <div v-if="uploadProgress === 100" class="upload-success">
            ✅ 视频上传完成！
          </div>
        </div>

        <button
          type="submit"
          class="btn-submit"
          :disabled="submitting || isUploading"
        >
          {{
            submitting
              ? "提交中..."
              : isUploading
              ? "视频上传中..."
              : "保存修改"
          }}
        </button>
      </form>
    </div>

    <!-- Notification Toast -->
    <div v-if="showToast" :class="['notification-toast', toastType]">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import SparkMD5 from "spark-md5";
import axios from "axios";
import {
  CourseLessonUpdateRequest,
  CourseLessonControllerService,
} from "../../../../generated/course";
import {
  LargeFileUploadControllerService,
  InitUploadRequest,
} from "../../../../generated/media";

export default defineComponent({
  name: "CourseLessonEditView",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const courseId = Number(route.params.courseId);
    const lessonId = Number(route.params.lessonId);

    const loading = ref(true);
    const submitting = ref(false);
    const isUploading = ref(false);

    const formData = reactive<CourseLessonUpdateRequest>({
      id: lessonId,
      courseId: courseId,
      title: "",
      description: "",
      status: 0,
      videoFileId: undefined,
    });

    const fileToUpload = ref<File | null>(null);
    const uploadProgress = ref(0);
    const uploadStatus = ref("");

    const showToast = ref(false);
    const toastMessage = ref("");
    const toastType = ref("");

    const triggerToast = (msg: string, type: "success" | "error") => {
      toastMessage.value = msg;
      toastType.value = "type-" + type;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    onMounted(async () => {
      try {
        const res = await CourseLessonControllerService.getLessonUsingGet(
          lessonId
        );
        if (res.code === 0 && res.data) {
          formData.title = res.data.title;
          formData.description = res.data.description;
          formData.status = res.data.status;
          formData.videoFileId = res.data.videoFileId;
        }
      } catch (err) {
        triggerToast("加载章节信息失败", "error");
      } finally {
        loading.value = false;
      }
    });

    const calculateMD5 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const blobSlice = File.prototype.slice;
        const chunkSize = 5242880; // 5MB
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
          if (e.target?.result) {
            spark.append(e.target.result as ArrayBuffer);
          }
          currentChunk++;
          if (currentChunk < chunks) {
            loadNext();
          } else {
            resolve(spark.end());
          }
        };

        fileReader.onerror = () => reject("文件读取错误");

        const loadNext = () => {
          const start = currentChunk * chunkSize;
          const end =
            start + chunkSize >= file.size ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        };

        loadNext();
      });
    };

    const uploadVideo = async (file: File): Promise<number | undefined> => {
      uploadStatus.value = "计算MD5中...";
      const md5 = await calculateMD5(file);
      uploadStatus.value = "初始化上传...";

      const chunkSize = 5 * 1024 * 1024; // 5MB
      const chunkCount = Math.ceil(file.size / chunkSize);

      const initReq: InitUploadRequest = {
        chunkSize: chunkSize,
        chunkCount: chunkCount,
        contentType: file.type,
        fileSize: file.size,
        md5: md5,
        originalFilename: file.name,
      };

      const initRes =
        await LargeFileUploadControllerService.initUploadUsingPost(initReq);
      if (initRes.code !== 0 || !initRes.data) {
        throw new Error(initRes.message || initRes.msg || "初始化上传失败");
      }

      const uploadInfo = initRes.data;
      if (uploadInfo.finished && uploadInfo.mediaFileId) {
        uploadProgress.value = 100;
        return uploadInfo.mediaFileId;
      }

      const taskId = uploadInfo.taskId;
      const actualChunkSize = uploadInfo.chunkSize || chunkSize;
      const totalPartCount = uploadInfo.chunkCount || chunkCount;
      const uploadedParts = uploadInfo.uploadedPartNumbers || [];

      for (let partNum = 1; partNum <= totalPartCount; partNum++) {
        if (uploadedParts.includes(partNum)) {
          uploadProgress.value = (partNum / totalPartCount) * 100;
          continue;
        }

        uploadStatus.value = `上传分片 ${partNum}/${totalPartCount}`;

        // request upload URL
        const urlRes =
          await LargeFileUploadControllerService.getPartUploadUrlUsingGet(
            partNum,
            taskId
          );
        if (urlRes.code !== 0 || !urlRes.data?.uploadUrl) {
          throw new Error(`获取分片${partNum}上传地址失败`);
        }

        const uploadUrl = urlRes.data.uploadUrl;
        const start = (partNum - 1) * actualChunkSize;
        const end = Math.min(file.size, start + actualChunkSize);
        const chunk = file.slice(start, end);

        // Upload chunk
        const axiosRes = await axios.put(uploadUrl, chunk, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });

        // MinIO returns "ETag" or "etag" in headers
        let etag = axiosRes.headers["etag"] || axiosRes.headers["ETag"];
        if (etag && etag.startsWith('"') && etag.endsWith('"')) {
          etag = etag.substring(1, etag.length - 1);
        }

        if (!etag) {
          console.warn(`未获取到分片${partNum}的ETag，尝试继续`);
        }

        // Record part
        await LargeFileUploadControllerService.recordPartUsingPost({
          etag: etag,
          partNumber: partNum,
          partSize: chunk.size,
          taskId: taskId,
        });

        uploadProgress.value = (partNum / totalPartCount) * 100;
      }

      uploadStatus.value = "完成上传...";
      const completeRes =
        await LargeFileUploadControllerService.completeUploadUsingPost({
          taskId: taskId,
        });

      if (completeRes.code !== 0 || !completeRes.data) {
        throw new Error("合并文件失败");
      }

      return completeRes.data;
    };

    const onFileChange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        fileToUpload.value = target.files[0];
        uploadProgress.value = 0;
        uploadStatus.value = "";
        isUploading.value = true;
        try {
          const videoFileId = await uploadVideo(target.files[0]);
          if (videoFileId) {
            formData.videoFileId = videoFileId;
          }
        } catch (err: any) {
          triggerToast(err.message || "视频上传失败", "error");
          uploadStatus.value = "上传失败";
          uploadProgress.value = 0;
        } finally {
          isUploading.value = false;
        }
      } else {
        fileToUpload.value = null;
      }
    };

    const handleSubmit = async () => {
      if (submitting.value) return;
      if (isUploading.value) {
        triggerToast("请等待视频上传完成", "error");
        return;
      }
      submitting.value = true;

      try {
        const res = await CourseLessonControllerService.updateLessonUsingPut(
          formData
        );
        if (res.code === 0) {
          triggerToast("章节修改成功", "success");
          setTimeout(() => {
            router.push(`/course/${courseId}`);
          }, 1000);
        } else {
          triggerToast("修改失败：" + res.msg, "error");
        }
      } catch (err: any) {
        triggerToast(err.msg || err.message || "请求出错，请重试", "error");
      } finally {
        submitting.value = false;
      }
    };

    return {
      formData,
      loading,
      submitting,
      isUploading,
      handleSubmit,
      showToast,
      toastMessage,
      toastType,
      onFileChange,
      uploadProgress,
      uploadStatus,
    };
  },
});
</script>

<style scoped>
.lesson-create-wrapper {
  min-height: calc(100vh - 64px);
  background-color: #0f172a;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.glass-panel {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.form-container {
  width: 100%;
  max-width: 900px;
  padding: 40px;
}

.form-header {
  margin-bottom: 30px;
  text-align: center;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 8px;
}

.form-subtitle {
  color: #94a3b8;
  font-size: 1rem;
}

.loading-state {
  text-align: center;
  color: #94a3b8;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  color: #cbd5e1;
  font-size: 0.95rem;
  font-weight: 500;
}

.form-input {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-input::placeholder {
  color: #475569;
}

.textarea-large {
  min-height: 200px;
  resize: vertical;
}

.progress-bar-container {
  margin-top: 10px;
  height: 20px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: #f8fafc;
  font-weight: 600;
}

.upload-success {
  margin-top: 10px;
  color: #10b981;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Video Status Card */
.video-status-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.video-status-card:hover {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
}

.video-status-empty {
  background: rgba(71, 85, 105, 0.1);
  border-color: rgba(71, 85, 105, 0.2);
}

.video-status-empty:hover {
  background: rgba(71, 85, 105, 0.15);
  border-color: rgba(71, 85, 105, 0.3);
}

.video-status-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 10px;
}

.video-status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.video-status-label {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
}

.empty-label {
  color: #94a3b8;
}

.video-status-id {
  font-size: 0.8rem;
  color: #64748b;
  font-family: monospace;
}

.video-status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 20px;
  color: #10b981;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* Upload Area */
.upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 2px dashed rgba(148, 163, 184, 0.25);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 4px;
}

.upload-area:hover {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.05);
}

.upload-area-content {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #94a3b8;
  font-size: 0.9rem;
}

.file-input-hidden {
  display: none;
}

.btn-submit {
  margin-top: 20px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  padding: 14px 24px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  z-index: 10000;
  animation: slideDownToast 0.3s ease;
  white-space: nowrap;
}

:global(.notification-toast.type-success) {
  background: rgba(34, 197, 94, 0.9);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

:global(.notification-toast.type-error) {
  background: rgba(239, 68, 68, 0.9);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

@keyframes slideDownToast {
  from {
    transform: translate(-50%, -20px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .form-container {
    padding: 20px;
  }
}
</style>
