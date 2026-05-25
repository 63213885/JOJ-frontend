<template>
  <div class="course-edit-wrapper">
    <div class="form-container glass-panel">
      <div class="form-header">
        <h2 class="form-title">修改课程</h2>
        <p class="form-subtitle">更新课程信息，优化学习体验</p>
      </div>

      <div v-if="loading" class="loading-state">正在加载课程信息...</div>
      <form v-else @submit.prevent="handleSubmit" class="edit-form">
        <div class="form-group">
          <label for="title">课程名称</label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            placeholder="请输入课程名称"
            required
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="price">现价 (分)</label>
            <input
              type="number"
              id="price"
              v-model="formData.price"
              placeholder="0"
              required
              step="0.01"
              class="form-input"
            />
          </div>
          <div class="form-group half">
            <label for="originalPrice">原价 (分)</label>
            <input
              type="number"
              id="originalPrice"
              v-model="formData.originalPrice"
              placeholder="0"
              required
              step="0.01"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="cover">课程封面</label>
          <div class="cover-uploader">
            <input
              type="file"
              id="cover"
              accept="image/*"
              @change="handleFileUpload"
              class="form-input file-input"
              style="display: none"
              ref="fileInput"
            />
            <div
              class="cover-preview"
              v-if="currentCoverUrl"
              @click="triggerUpload"
            >
              <img :src="currentCoverUrl" alt="Cover" />
              <div class="upload-mask">点击更换封面</div>
            </div>
            <div class="cover-placeholder" v-else @click="triggerUpload">
              <span v-if="uploading">上传中...</span>
              <span v-else>+ 点击上传封面</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="description">课程描述</label>
          <textarea
            v-model="formData.description"
            placeholder="请详细描述课程内容..."
            class="form-input textarea-large"
          ></textarea>
        </div>

        <div class="form-group status-group">
          <label>课程状态</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="formData.status" :value="1" />
              公开
            </label>
            <label class="radio-label">
              <input type="radio" v-model="formData.status" :value="0" />
              隐藏
            </label>
          </div>
        </div>

        <button
          type="submit"
          class="btn-submit"
          :disabled="submitting || uploading"
        >
          {{ submitting ? "提交中..." : "保存修改" }}
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
import { useRoute, useRouter } from "vue-router";
import {
  CourseUpdateRequest,
  CourseControllerService,
} from "../../../generated/course";

export default defineComponent({
  name: "CourseEditView",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const courseId = Number(route.params.id);

    const loading = ref(true);
    const submitting = ref(false);
    const uploading = ref(false);
    const fileInput = ref<HTMLInputElement | null>(null);

    const currentCoverUrl = ref("");

    const formData = reactive<CourseUpdateRequest>({
      id: courseId,
      title: "",
      description: "",
      price: 0,
      originalPrice: 0,
      sort: -1,
      status: 0,
    });

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

    const loadCourse = async () => {
      try {
        const res = await CourseControllerService.getCourseUsingGet(courseId);
        if (res.code === 0 && res.data) {
          currentCoverUrl.value = res.data.coverUrl || "";
          Object.assign(formData, {
            id: res.data.id,
            title: res.data.title,
            description: res.data.description,
            price: res.data.price,
            originalPrice: res.data.originalPrice,
            sort: res.data.sort ?? -1,
            status: res.data.status,
          });
        } else {
          triggerToast("获取课程信息失败", "error");
        }
      } catch (err) {
        triggerToast("获取课程信息出错", "error");
      } finally {
        loading.value = false;
      }
    };

    const triggerUpload = () => {
      fileInput.value?.click();
    };

    const handleFileUpload = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];

        // upload using uploadCoverUsingPost
        uploading.value = true;
        try {
          const res = await CourseControllerService.uploadCoverUsingPost(
            file,
            courseId
          );
          if (res.code === 0 && res.data) {
            currentCoverUrl.value = res.data;
            triggerToast("封面上传成功", "success");
          } else {
            triggerToast("封面上传失败: " + res.msg, "error");
          }
        } catch (err: any) {
          triggerToast("封面上传出错", "error");
        } finally {
          uploading.value = false;
          // reset input
          if (fileInput.value) {
            fileInput.value.value = "";
          }
        }
      }
    };

    const handleSubmit = async () => {
      if (submitting.value) return;
      submitting.value = true;

      // Filter out undefined and empty string fields manually
      const payload: any = {};
      for (const [k, v] of Object.entries(formData)) {
        if (v !== undefined && v !== null) {
          payload[k] = v;
        }
      }

      try {
        const res = await CourseControllerService.updateCourseUsingPut(
          payload as CourseUpdateRequest
        );
        if (res.code === 0) {
          triggerToast("课程修改成功", "success");
          setTimeout(() => {
            router.push("/course/list");
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

    onMounted(() => {
      loadCourse();
    });

    return {
      formData,
      currentCoverUrl,
      loading,
      submitting,
      uploading,
      fileInput,
      handleSubmit,
      handleFileUpload,
      triggerUpload,
      showToast,
      toastMessage,
      toastType,
    };
  },
});
</script>

<style scoped>
.course-edit-wrapper {
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
  padding: 50px 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.half {
  flex: 1;
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

.cover-uploader {
  width: 180px;
  height: 180px;
  cursor: pointer;
}

.cover-preview {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-preview:hover .upload-mask {
  opacity: 1;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.cover-placeholder:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.status-group {
  margin-top: 10px;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  accent-color: #3b82f6;
  width: 16px;
  height: 16px;
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
  .form-row {
    flex-direction: column;
    gap: 24px;
  }

  .form-container {
    padding: 20px;
  }
}
</style>
