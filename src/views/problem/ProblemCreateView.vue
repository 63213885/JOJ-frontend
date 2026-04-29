<template>
  <div class="problem-create-wrapper">
    <div class="form-container glass-panel">
      <div class="form-header">
        <h2 class="form-title">创建新题目</h2>
        <p class="form-subtitle">发布你的算法挑战，考验大家的实力</p>
      </div>

      <form @submit.prevent="handleSubmit" class="create-form">
        <div class="form-group">
          <label for="title">题目标题</label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            placeholder="请输入题目标题"
            required
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="timeLimit">时间限制 (ms)</label>
            <input
              type="number"
              id="timeLimit"
              v-model="formData.timeLimit"
              placeholder="1000"
              required
              class="form-input"
            />
          </div>
          <div class="form-group half">
            <label for="memoryLimit">内存限制 (MB)</label>
            <input
              type="number"
              id="memoryLimit"
              v-model="formData.memoryLimit"
              placeholder="256"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="tags">标签 (逗号分隔)</label>
            <input
              type="text"
              id="tags"
              v-model="tagsInput"
              placeholder="例如: 动态规划, 图论, DFS"
              class="form-input"
            />
          </div>
          <div class="form-group half">
            <label for="source">来源 (逗号分隔)</label>
            <input
              type="text"
              id="source"
              v-model="sourceInput"
              placeholder="例如: LeetCode, Codeforces"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="content">题目描述</label>
          <MdEditor
            v-model="formData.content"
            placeholder="请详细描述题意... 支持 Markdown 语法与数学公式"
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="inputDesc">输入描述</label>
            <MdEditor
              v-model="formData.inputDesc"
              placeholder="描述输入格式 支持 Markdown"
            />
          </div>
          <div class="form-group half">
            <label for="outputDesc">输出描述</label>
            <MdEditor
              v-model="formData.outputDesc"
              placeholder="描述输出格式 支持 Markdown"
            />
          </div>
        </div>

        <div class="form-group samples-group">
          <div class="samples-header">
            <label>样例数据</label>
            <button type="button" class="btn-add-sample" @click="addSample">
              + 添加样例
            </button>
          </div>

          <div
            v-for="(sample, index) in formData.samples"
            :key="index"
            class="sample-item"
          >
            <div class="sample-title">
              样例 {{ index + 1 }}
              <button
                type="button"
                class="btn-remove-sample"
                @click="removeSample(index)"
                v-if="formData.samples && formData.samples.length > 1"
              >
                移除
              </button>
            </div>
            <div class="form-row">
              <div class="form-group half">
                <textarea
                  v-model="sample.input"
                  placeholder="样例输入"
                  class="form-input textarea-small code-font"
                ></textarea>
              </div>
              <div class="form-group half">
                <textarea
                  v-model="sample.output"
                  placeholder="样例输出"
                  class="form-input textarea-small code-font"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group status-group">
          <label>题目状态</label>
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

        <button type="submit" class="btn-submit" :disabled="submitting">
          {{ submitting ? "提交中..." : "创建题目" }}
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
import { defineComponent, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ProblemControllerService } from "../../../generated/services/ProblemControllerService";
import type { CreateProblemRequest } from "../../../generated/models/CreateProblemRequest";
import type { Sample_1 } from "../../../generated/models/Sample_1";
import MdEditor from "../../components/MdEditor.vue";

export default defineComponent({
  name: "ProblemCreateView",
  components: {
    MdEditor,
  },
  setup() {
    const router = useRouter();
    const submitting = ref(false);
    const tagsInput = ref("");
    const sourceInput = ref("");

    const formData = reactive<CreateProblemRequest>({
      title: "",
      timeLimit: 1000,
      memoryLimit: 256,
      content: "",
      inputDesc: "",
      outputDesc: "",
      tags: [],
      source: [],
      samples: [{ input: "", output: "" }],
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

    const addSample = () => {
      if (formData.samples) {
        formData.samples.push({ input: "", output: "" });
      } else {
        formData.samples = [{ input: "", output: "" }];
      }
    };

    const removeSample = (index: number) => {
      if (formData.samples) {
        formData.samples.splice(index, 1);
      }
    };

    const handleSubmit = async () => {
      if (submitting.value) return;

      // Process tags
      const currentTags = tagsInput.value
        .split(/[，,]/)
        .map((t) => t.trim())
        .filter((t) => t !== "");
      formData.tags = currentTags;

      // Process source
      const currentSource = sourceInput.value
        .split(/[，,]/)
        .map((s) => s.trim())
        .filter((s) => s !== "");
      formData.source = currentSource;

      submitting.value = true;
      try {
        const res = await ProblemControllerService.createProblemUsingPost(
          formData as any
        );
        if (res.code === 0) {
          triggerToast("题目创建成功", "success");
          setTimeout(() => {
            router.push("/problem/list");
          }, 1000);
        } else {
          triggerToast("创建失败：" + res.msg, "error");
        }
      } catch (err: any) {
        triggerToast(err.msg || err.message || "请求出错，请重试", "error");
      } finally {
        submitting.value = false;
      }
    };

    return {
      formData,
      tagsInput,
      sourceInput,
      submitting,
      addSample,
      removeSample,
      handleSubmit,
      showToast,
      toastMessage,
      toastType,
    };
  },
});
</script>

<style scoped>
.problem-create-wrapper {
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

.create-form {
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

.textarea-medium {
  min-height: 120px;
  resize: vertical;
}

.textarea-small {
  min-height: 80px;
  resize: vertical;
}

.code-font {
  font-family: "Fira Code", monospace, source-code-pro, Menlo, Monaco, Consolas;
  font-size: 0.9rem;
}

.samples-group {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.samples-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 12px;
}

.btn-add-sample {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.btn-add-sample:hover {
  background: rgba(59, 130, 246, 0.2);
}

.sample-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
}

.sample-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.sample-title {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-remove-sample {
  background: transparent;
  color: #ef4444;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.btn-remove-sample:hover {
  background: rgba(239, 68, 68, 0.1);
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

.notification-toast.type-success {
  background: rgba(34, 197, 94, 0.9);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.notification-toast.type-error {
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
