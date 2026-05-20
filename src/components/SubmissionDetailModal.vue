<template>
  <div class="modal-overlay" v-if="visible" @click="close">
    <div class="modal-content custom-scroll" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">
          #{{ submission?.id || submissionId }} |
          <router-link
            :to="`/profile/${submission?.user?.account || ''}`"
            class="header-link"
            @click="close"
          >
            {{ submission?.user?.account || "User" }}
          </router-link>
          's solution for [
          <router-link
            :to="`/problem/${submission?.problem?.id || ''}`"
            class="header-link"
            @click="close"
          >
            {{ problemTitle || submission?.problem?.title || "Problem" }}
          </router-link>
          ]
        </h3>
        <button class="btn-close" @click="close"></button>
      </div>
      <div class="modal-body custom-scroll" v-if="submission">
        <!-- 第2部分：详情 -->
        <div class="meta-section">
          <div class="meta-item">
            <span class="meta-label">评测结果</span>
            <span
              class="meta-value status-text"
              :class="submission.status?.toLowerCase().replace(/\s+/g, '_')"
            >
              {{ submission.status }}
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-label">执行用时</span>
            <span class="meta-value">{{ submission.timeUsed ?? 0 }} ms</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">内存</span>
            <span class="meta-value"
              >{{ Math.round((submission.memoryUsed ?? 0) / 1024) }} MB</span
            >
          </div>
          <div class="meta-item">
            <span class="meta-label">语言</span>
            <span class="meta-value">{{ submission.language }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">提交时间</span>
            <span class="meta-value">{{
              new Date(submission.submitTime ?? "").toLocaleString()
            }}</span>
          </div>
          <div class="meta-item meta-item-rejudge" v-if="isAdmin">
            <button
              class="btn-rejudge"
              :disabled="rejudging"
              @click="handleRejudge"
            >
              {{ rejudging ? "✈ 重测中..." : "↻ 重测" }}
            </button>
          </div>
        </div>

        <!-- 第3部分：代码展示 -->
        <div class="code-section">
          <div class="code-header">
            <div class="code-actions">
              <span class="code-lang">{{ submission.language }}</span>
              <button
                class="btn-copy-code"
                @click="copyToClipboard(submission.code || '')"
              >
                copy
              </button>
            </div>
          </div>
          <div class="code-viewer-container">
            <vue-monaco-editor
              :value="submission.code || '无代码数据'"
              :language="getMonacoLang(submission.language || '')"
              theme="vs-dark"
              :options="{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }"
            />
          </div>
        </div>
      </div>
      <div class="modal-body loading-body" v-else>加载中...</div>
    </div>
    <!-- 提示消息 -->
    <div v-if="showToast" :class="['toast', toastType]">
      {{ toastMessage }}
    </div>

    <!-- 确认弹窗 -->
    <div class="confirm-overlay" v-if="confirmVisible">
      <div class="confirm-dialog" @click.stop>
        <p class="confirm-message">{{ confirmMessage }}</p>
        <div class="confirm-actions">
          <button
            class="confirm-btn confirm-btn-cancel"
            @click="onConfirmCancel"
          >
            取消
          </button>
          <button class="confirm-btn confirm-btn-ok" @click="onConfirmOk">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import VueMonacoEditor from "@guolao/vue-monaco-editor";
import {
  SubmissionControllerService,
  SubmissionVO,
} from "../../generated/problem";
import { useStore } from "vuex";

export default defineComponent({
  name: "SubmissionDetailModal",
  components: {
    VueMonacoEditor,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    submissionId: {
      type: Number,
      required: false,
    },
    problemTitle: {
      type: String,
      default: "",
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const store = useStore();
    const currentUser = computed(() => store.getters.currentUser);
    const isAdmin = computed(() => {
      const role = currentUser.value?.role;
      return role === "admin" || role === "ADMIN";
    });

    const submission = ref<SubmissionVO | null>(null);

    const showToast = ref(false);
    const toastMessage = ref("");
    const toastType = ref("type-success");

    const triggerToast = (
      msg: string,
      type: "success" | "error" = "success"
    ) => {
      toastMessage.value = msg;
      toastType.value = "type-" + type;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    const loadSubmission = async () => {
      if (!props.submissionId) return;
      submission.value = null;
      try {
        const res = await SubmissionControllerService.getSubmissionUsingGet(
          props.submissionId
        );
        if (res.code === 0 && res.data) {
          submission.value = res.data;
        }
      } catch (e) {
        console.error("加载提交详情失败", e);
      }
    };

    watch(
      () => props.visible,
      (val) => {
        if (val) {
          loadSubmission();
        }
      }
    );

    const close = () => {
      emit("update:visible", false);
    };

    const rejudging = ref(false);

    // Custom confirm dialog state
    const confirmVisible = ref(false);
    const confirmMessage = ref("");
    let confirmResolve: ((value: boolean) => void) | null = null;

    const showConfirm = (message: string): Promise<boolean> => {
      return new Promise((resolve) => {
        confirmMessage.value = message;
        confirmVisible.value = true;
        confirmResolve = resolve;
      });
    };

    const onConfirmOk = () => {
      confirmVisible.value = false;
      if (confirmResolve) confirmResolve(true);
      confirmResolve = null;
    };

    const onConfirmCancel = () => {
      confirmVisible.value = false;
      if (confirmResolve) confirmResolve(false);
      confirmResolve = null;
    };

    const handleRejudge = async () => {
      if (!submission.value?.id) return;
      const confirmed = await showConfirm("确定要重测该提交吗？");
      if (!confirmed) return;
      rejudging.value = true;
      try {
        const res =
          await SubmissionControllerService.rejudgeSubmissionUsingPost(
            submission.value.id
          );
        if (res.code === 0) {
          triggerToast("重测请求已提交", "success");
          // Reload submission data after a short delay
          setTimeout(() => loadSubmission(), 1500);
        } else {
          triggerToast("重测失败: " + (res.message || "未知错误"), "error");
        }
      } catch (err: any) {
        console.error("重测失败:", err);
        triggerToast("重测请求失败", "error");
      } finally {
        rejudging.value = false;
      }
    };

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        triggerToast("复制成功", "success");
      } catch (err) {
        console.error(err);
        triggerToast("复制失败", "error");
      }
    };

    const getMonacoLang = (langVal: string) => {
      if (!langVal) return "plaintext";
      const lang = langVal.toLowerCase();
      if (lang.includes("c++") || lang.includes("cpp")) return "cpp";
      if (lang.includes("c#") || lang.includes("csharp")) return "csharp";
      if (lang.includes("py")) return "python";
      if (lang.includes("go")) return "go";
      if (
        lang.includes("java") &&
        !lang.includes("javascript") &&
        !lang.includes("js")
      )
        return "java";
      if (lang.includes("javascript") || lang.includes("js"))
        return "javascript";
      if (lang.includes("typescript") || lang.includes("ts"))
        return "typescript";
      if (lang === "c") return "c";
      if (lang.includes("rust")) return "rust";
      return lang;
    };

    return {
      submission,
      close,
      copyToClipboard,
      getMonacoLang,
      showToast,
      toastMessage,
      toastType,
      rejudging,
      handleRejudge,
      isAdmin,
      confirmVisible,
      confirmMessage,
      onConfirmOk,
      onConfirmCancel,
    };
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 90vw;
  max-width: 1000px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px 12px 0 0;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #cbd5e1;
}

.header-link {
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}

.header-link:hover {
  color: #60a5fa;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
}

.btn-close:hover {
  color: #fff;
}

.modal-body {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.loading-body {
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  height: 100%;
}

.meta-section {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  align-items: flex-end;
}

.meta-item-rejudge {
  margin-left: auto;
  display: flex;
  align-items: center;
  min-width: unset;
}

.btn-rejudge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-rejudge:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.btn-rejudge:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 100px;
}

.meta-label {
  font-size: 12px;
  color: #94a3b8;
}

.meta-value {
  font-size: 15px;
  color: #f8fafc;
  font-family: "Fira Code", monospace;
  font-weight: 500;
}

.status-text {
  font-weight: 600;
}

.status-text.accepted {
  color: #10b981;
}

.status-text.wrong_answer,
.status-text.error,
.status-text.compile_error,
.status-text.presentation_error,
.status-text.system_error,
.status-text.runtime_error {
  color: #ef4444;
}

.status-text.time_limit_exceeded,
.status-text.memory_limit_exceeded,
.status-text.output_limit_exceeded {
  color: #ffffff;
}

.status-text.compiling,
.status-text.running,
.status-text.pending,
.status-text.judging {
  color: #3b82f6;
}

.code-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  min-height: 400px;
}

.code-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.code-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.code-lang {
  font-size: 13px;
  font-weight: 500;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.btn-copy-code {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy-code:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.code-viewer-container {
  flex: 1;
  position: relative;
  min-height: 400px;
}

/* Toast */
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 11000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: slideDownToast 0.3s ease;
}

.type-success {
  background-color: #10b981;
}

.type-error {
  background-color: #ef4444;
}

@keyframes slideDownToast {
  from {
    top: -50px;
    opacity: 0;
  }
  to {
    top: 24px;
    opacity: 1;
  }
}

/* Confirm dialog */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 11001;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

.confirm-dialog {
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 28px 32px;
  min-width: 360px;
  max-width: 440px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.2s ease;
}

.confirm-message {
  font-size: 1rem;
  color: #f8fafc;
  margin: 0 0 24px;
  line-height: 1.6;
  text-align: center;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.confirm-btn {
  padding: 8px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.confirm-btn-cancel {
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.confirm-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #f8fafc;
}

.confirm-btn-ok {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.confirm-btn-ok:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
