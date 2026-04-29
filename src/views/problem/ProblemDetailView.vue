<template>
  <div class="problem-detail-wrapper">
    <div
      class="problem-detail-container"
      :class="{ 'is-mobile': isMobile }"
      ref="containerRef"
    >
      <!-- 左侧题目信息 -->
      <div class="left-pane custom-scroll" :style="leftPaneStyle">
        <!-- 选项卡导航 -->
        <div class="pane-tabs">
          <div
            class="pane-tab"
            :class="{ active: activeTab === 'problem' }"
            @click="activeTab = 'problem'"
          >
            题目
          </div>
          <div
            class="pane-tab"
            :class="{ active: activeTab === 'solution' }"
            @click="activeTab = 'solution'"
          >
            题解
          </div>
          <div
            class="pane-tab"
            :class="{ active: activeTab === 'submissions' }"
            @click="activeTab = 'submissions'"
          >
            提交记录
          </div>
        </div>

        <!-- 题目内容 -->
        <div class="tab-content" v-show="activeTab === 'problem'">
          <div class="problem-header">
            <h1 class="problem-title">{{ problem?.title }}</h1>
            <div class="problem-meta">
              <span class="meta-item">
                <i class="icon-time"></i> 时间限制: {{ problem?.timeLimit }} ms
              </span>
              <span class="meta-item">
                <i class="icon-memory"></i> 内存限制:
                {{ problem?.memoryLimit }} MB
              </span>
            </div>
          </div>

          <div class="problem-content-section" v-if="problem?.content">
            <h3>题目描述</h3>
            <div
              class="markdown-body"
              v-html="renderMd(problem?.content)"
            ></div>
          </div>

          <div class="problem-content-section" v-if="problem?.inputDesc">
            <h3>输入描述</h3>
            <div
              class="markdown-body"
              v-html="renderMd(problem?.inputDesc)"
            ></div>
          </div>

          <div class="problem-content-section" v-if="problem?.outputDesc">
            <h3>输出描述</h3>
            <div
              class="markdown-body"
              v-html="renderMd(problem?.outputDesc)"
            ></div>
          </div>

          <div class="samples-section" v-if="samples.length > 0">
            <h3>样例数据</h3>
            <div
              class="sample-item"
              v-for="(sample, index) in samples"
              :key="index"
            >
              <div class="sample-box">
                <div class="sample-box-title">
                  <span>输入样例 {{ index + 1 }}</span>
                  <button
                    class="btn-copy"
                    @click="copyToClipboard(sample.input)"
                  >
                    复制
                  </button>
                </div>
                <pre class="sample-content">{{ sample.input }}</pre>
              </div>
              <div class="sample-box">
                <div class="sample-box-title">
                  <span>输出样例 {{ index + 1 }}</span>
                  <button
                    class="btn-copy"
                    @click="copyToClipboard(sample.output)"
                  >
                    复制
                  </button>
                </div>
                <pre class="sample-content">{{ sample.output }}</pre>
              </div>
            </div>
          </div>

          <div class="problem-footer">
            <div
              class="footer-row"
              v-if="problem?.source && problem.source.length > 0"
            >
              <span class="footer-label">来源:</span>
              <span v-for="s in problem.source" :key="s" class="source-tag">{{
                s
              }}</span>
            </div>
            <div
              class="footer-row"
              v-if="problem?.tags && problem.tags.length > 0"
            >
              <span class="footer-label">标签:</span>
              <span class="toggle-tags-btn" @click="showTags = !showTags">
                {{ showTags ? "隐藏标签" : "显示标签" }}
              </span>
              <div v-if="showTags" class="tags-container">
                <span
                  v-for="tag in problem.tags"
                  :key="tag"
                  class="problem-tag"
                  >{{ tag }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 题解内容 -->
        <div class="tab-content empty-content" v-if="activeTab === 'solution'">
          <div class="empty-placeholder">
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
              />
            </svg>
            <p>题解功能开发中...</p>
          </div>
        </div>

        <!-- 提交记录内容 -->
        <div
          class="tab-content"
          v-if="activeTab === 'submissions'"
          :class="{ 'empty-content': submissions.length === 0 }"
        >
          <div v-if="submissions.length === 0" class="empty-placeholder">
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p>暂无提交记录</p>
          </div>
          <div v-else class="submissions-list">
            <div
              v-for="sub in submissions"
              :key="sub.id"
              class="submission-item-modern"
              @click="openSubmissionDetail(sub.id)"
            >
              <div class="status-badge" :class="sub.status?.toLowerCase()">
                <span class="status-dot"></span>
                {{ sub.status || "Unknown" }}
              </div>
              <div class="sub-details">
                <div class="detail-block">
                  <span class="detail-label">执行用时</span>
                  <span class="detail-value">{{ sub.timeUsed ?? 0 }} ms</span>
                </div>
                <div class="detail-block">
                  <span class="detail-label">消耗内存</span>
                  <span class="detail-value">{{ sub.memoryUsed ?? 0 }} MB</span>
                </div>
                <div class="detail-block">
                  <span class="detail-label">语言</span>
                  <span class="detail-value">{{ sub.language }}</span>
                </div>
              </div>
              <div class="sub-time-modern">
                {{ new Date(sub.submitTime ?? "").toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 拖拽分隔线 -->
      <div class="resizer" @mousedown="startResize" v-if="!isMobile"></div>

      <!-- 右侧代码编辑区 -->
      <div class="right-pane" :style="rightPaneStyle">
        <!-- 拖拽时遮罩层，防止 iframe/monaco 吞噬鼠标事件 -->
        <div v-if="isResizing" class="drag-overlay"></div>
        <div class="editor-header">
          <div class="header-left">
            <div class="lang-selector">
              <label>语言: </label>
              <select v-model="codeLang">
                <option
                  v-for="lang in supportedLanguages"
                  :key="lang"
                  :value="lang"
                >
                  {{ lang }}
                </option>
              </select>
            </div>
          </div>
          <div class="header-center">
            <div class="editor-actions">
              <button
                class="btn btn-secondary btn-icon"
                @click="handleSelfTest"
                data-tooltip="运行"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </button>

              <button
                class="btn btn-primary btn-icon-text"
                @click="handleSubmit"
                data-tooltip="提交"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M4 14.899A7 7 0 1 1 15.71 8h1.79
                       a4.5 4.5 0 0 1 2.5 8.242"
                  />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
                <span class="btn-text">提交</span>
              </button>

              <button
                class="btn btn-magic btn-icon"
                @click="handleAIExplain"
                data-tooltip="AI 讲解"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12
                       l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21
                       l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12
                       l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
                  />
                  <path d="M5 3v4M3 5h4" />
                </svg>
              </button>
            </div>
          </div>
          <div class="header-right"></div>
        </div>

        <div class="editor-container">
          <vue-monaco-editor
            v-model:value="codeValue"
            :language="monacoLang"
            theme="vs-dark"
            :options="editorOptions"
            @mount="handleEditorMount"
          />
        </div>

        <!-- 实时评测结果面板 -->
        <div class="result-panel" v-if="showResultPanel">
          <div class="result-header">
            <h3>评测结果</h3>
            <button class="btn-close" @click="showResultPanel = false">
              ×
            </button>
          </div>
          <div class="result-content">
            <div v-if="!currentSubmissionResult" class="evaluating-state">
              <div class="spinner"></div>
              正在提交并初始化评测...
            </div>
            <div v-else class="eval-result">
              <div
                class="result-status"
                :class="currentSubmissionResult.status?.toLowerCase()"
                style="display: flex; align-items: center; gap: 8px"
              >
                <div class="spinner" v-if="isEvaluating"></div>
                {{ currentSubmissionResult.status || "Pending" }}
              </div>
              <div class="result-details">
                <div class="detail-item">
                  <span class="label">执行用时：</span>
                  <span class="value"
                    >{{ currentSubmissionResult.timeUsed ?? 0 }} ms</span
                  >
                </div>
                <div class="detail-item">
                  <span class="label">消耗内存：</span>
                  <span class="value"
                    >{{ currentSubmissionResult.memoryUsed ?? 0 }} MB</span
                  >
                </div>
                <div class="detail-item">
                  <span class="label">评测语言：</span>
                  <span class="value">{{
                    currentSubmissionResult.language
                  }}</span>
                </div>
                <div class="detail-item" v-if="currentSubmissionResult.score">
                  <span class="label">评测得分：</span>
                  <span class="value">{{ currentSubmissionResult.score }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交记录详情弹窗 -->
      <submission-detail-modal
        v-model:visible="showSubmissionModal"
        :submission-id="selectedSubmissionId"
        :problem-title="problem?.title"
      />

      <!-- 提示消息 -->
      <div v-if="showToast" :class="['toast', toastType]">
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { ProblemControllerService } from "../../../generated/services/ProblemControllerService";
import { SubmissionControllerService } from "../../../generated/services/SubmissionControllerService";
import type { ProblemVO } from "../../../generated/models/ProblemVO";
import type { SubmissionVO } from "../../../generated/models/SubmissionVO";
import VueMonacoEditor from "@guolao/vue-monaco-editor";
import SubmissionDetailModal from "@/components/SubmissionDetailModal.vue";
import MarkdownIt from "markdown-it";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mk from "@iktakahiro/markdown-it-katex";
import "katex/dist/katex.min.css";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(mk);

export default defineComponent({
  name: "ProblemDetailView",
  components: {
    VueMonacoEditor,
    SubmissionDetailModal,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const problemId = Number(route.params.id);
    const problem = ref<ProblemVO | null>(null);
    const samples = ref<any[]>([]);
    const showTags = ref(false);
    const activeTab = ref("problem");

    // Toast
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

    // Resize & Mobile Layout
    const isMobile = ref(window.innerWidth <= 1024);
    const leftPaneWidth = ref(50);
    const isResizing = ref(false);
    const containerRef = ref<HTMLElement | null>(null);

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 1024;
    };

    const startResize = () => {
      isResizing.value = true;
      document.body.style.userSelect = "none";
    };

    const doResize = (e: MouseEvent) => {
      if (!isResizing.value || isMobile.value || !containerRef.value) return;
      const rect = containerRef.value.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      let newWidth = (offsetX / rect.width) * 100;
      if (newWidth >= 20 && newWidth <= 80) {
        leftPaneWidth.value = newWidth;
      }
    };

    const stopResize = () => {
      if (isResizing.value) {
        isResizing.value = false;
        document.body.style.userSelect = "";
      }
    };

    const leftPaneStyle = computed(() => {
      return isMobile.value
        ? {}
        : {
            width: `${leftPaneWidth.value}%`,
            flex: `0 0 ${leftPaneWidth.value}%`,
          };
    });

    const rightPaneStyle = computed(() => {
      return isMobile.value
        ? {}
        : {
            flex: `1 1 0%`,
          };
    });

    // Copy Content
    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        triggerToast("复制成功", "success");
      } catch (err) {
        triggerToast("复制失败", "error");
      }
    };

    // Code Editor
    const supportedLanguages = ref<string[]>(["cpp", "java", "python", "go"]);
    const codeLang = ref("cpp");
    const codeValue = ref("");
    const editorOptions = {
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: "'Fira Code', monospace, Consolas, 'Courier New', monospace",
      scrollBeyondLastLine: false,
    };

    const monacoLang = computed(() => {
      const lang = codeLang.value.toLowerCase();
      if (lang === "c++" || lang === "c/c++") return "cpp";
      if (lang === "c#") return "c";
      if (lang === "python3") return "python";
      if (lang === "golang") return "go";
      if (lang === "javascript") return "javascript";
      if (lang === "typescript") return "typescript";
      return lang;
    });

    const getMonacoLang = (langVal: string) => {
      const lang = langVal.toLowerCase();
      if (lang === "c++" || lang === "c/c++") return "cpp";
      if (lang === "c#") return "c";
      if (lang === "python3") return "python";
      if (lang === "golang") return "go";
      if (lang === "javascript") return "javascript";
      if (lang === "typescript") return "typescript";
      return lang;
    };

    const handleEditorMount = (editor: any) => {
      // 可在这里获取编辑器实例
    };

    const renderMd = (text?: string) => {
      if (!text) return "";
      return md.render(text);
    };

    const loadProblem = async () => {
      if (!problemId) return;
      try {
        const res = await ProblemControllerService.getProblemByIdUsingGet(
          problemId
        );
        if (res.code === 0 && res.data) {
          const d = res.data;
          problem.value = d;

          // Parse samples safely
          let rawSamples: any = d.samples;
          let parsedSamples = rawSamples;
          if (typeof rawSamples === "string") {
            try {
              parsedSamples = JSON.parse(rawSamples);
            } catch (e) {
              if (rawSamples.startsWith("[") && rawSamples.endsWith("]")) {
                const regex = /\{input=(.*?), output=(.*?)\}/gi;
                let match;
                const arr = [];
                while ((match = regex.exec(rawSamples)) !== null) {
                  arr.push({ input: match[1], output: match[2] });
                }
                if (arr.length > 0) parsedSamples = arr;
              }
            }
          }
          if (Array.isArray(parsedSamples)) {
            samples.value = parsedSamples.map((s: any) => {
              if (typeof s === "string") {
                try {
                  s = JSON.parse(s);
                } catch (e) {
                  /* ignore */
                }
              }
              return {
                input: s?.input ?? s?.Input ?? s?.INPUT ?? "",
                output: s?.output ?? s?.Output ?? s?.OUTPUT ?? "",
              };
            });
          }

          // Parse tags safely
          let rawTags: any = d.tags;
          if (typeof rawTags === "string") {
            try {
              problem.value.tags = JSON.parse(rawTags);
            } catch (e) {
              /* ignore */
            }
          }

          // Parse source safely
          let rawSource: any = d.source;
          if (typeof rawSource === "string") {
            try {
              problem.value.source = JSON.parse(rawSource);
            } catch (e) {
              /* ignore */
            }
          }
        } else {
          triggerToast("获取题目失败：" + res.msg, "error");
        }
      } catch (err: any) {
        triggerToast("获取题目出错", "error");
      }
    };

    const loadLanguages = async () => {
      try {
        const res =
          await SubmissionControllerService.listSupportedLanguagesUsingGet();
        if (res.code === 0 && res.data) {
          supportedLanguages.value = res.data;
          if (res.data.length > 0) {
            codeLang.value = res.data[0];
          }
        }
      } catch (err: any) {
        console.error("加载语言失败", err);
      }
    };

    const submissions = ref<SubmissionVO[]>([]);
    const loadSubmissions = async () => {
      const userId = store.getters.currentUser?.id;
      if (!userId) return;
      try {
        const res = await SubmissionControllerService.listSubmissionsUsingGet(
          undefined,
          undefined,
          20,
          0,
          problemId,
          undefined,
          userId
        );
        if (res.code === 0 && res.data) {
          submissions.value = res.data;
        }
      } catch (e) {
        console.error("获取提交记录失败", e);
      }
    };

    watch(activeTab, (val) => {
      if (val === "submissions") loadSubmissions();
    });

    // 评测结果相关状态
    const showResultPanel = ref(false);
    const isEvaluating = ref(false);
    const currentSubmissionResult = ref<SubmissionVO | null>(null);
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const stopPolling = () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    };

    const pollSubmissionStatus = (submissionId: string | number) => {
      stopPolling();
      isEvaluating.value = true;
      showResultPanel.value = true;
      currentSubmissionResult.value = null;

      let pollCount = 0;
      const maxPoll = 120; // 最多轮询约1分钟 (120 * 500ms)

      pollInterval = setInterval(async () => {
        pollCount++;
        try {
          const res = await SubmissionControllerService.getSubmissionUsingGet(
            submissionId as any
          );
          if (res.code === 0 && res.data) {
            currentSubmissionResult.value = res.data;
            // 每轮询一次，如果有在提交记录列表页面，直接刷新列表以展示实时变更
            if (activeTab.value === "submissions") loadSubmissions();

            const status = res.data.status?.toLowerCase() || "";
            // 如果状态不再是判断中/等待中，则停止轮询
            if (
              !status.includes("waiting") &&
              !status.includes("pending") &&
              !status.includes("judging")
            ) {
              isEvaluating.value = false;
              stopPolling();
              // 再最后刷新一遍保证是最终结果
              if (activeTab.value === "submissions") loadSubmissions();
            }
          }
        } catch (e) {
          console.error("轮询评测状态出错", e);
        }

        if (pollCount >= maxPoll) {
          isEvaluating.value = false;
          stopPolling();
          triggerToast("评测超时未返回结果", "error");
        }
      }, 500);
    };

    onMounted(() => {
      loadProblem();
      loadLanguages();
      window.addEventListener("resize", checkMobile);
      window.addEventListener("mousemove", doResize);
      window.addEventListener("mouseup", stopResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
      stopPolling();
    });

    const handleSelfTest = () => {
      triggerToast("功能开发中: 自测运行代码...", "success");
      console.log("Code:", codeValue.value);
    };

    const handleSubmit = async () => {
      if (!codeValue.value) {
        triggerToast("代码不能为空", "error");
        return;
      }
      const userId = store.getters.currentUser?.id;
      if (!userId) {
        triggerToast("请先登录", "error");
        return;
      }
      try {
        const res = await SubmissionControllerService.submitCodeUsingPost({
          code: codeValue.value,
          language: codeLang.value,
          problemId: problemId,
        });
        if (res.code === 0) {
          triggerToast("提交成功", "success");

          if (activeTab.value === "submissions") {
            loadSubmissions(); // 立刻刷新出新提交
          }

          // 不再跳转到 submissions tab
          const submissionId = res.data;
          if (submissionId !== undefined && submissionId !== null) {
            pollSubmissionStatus(submissionId as any);
          } else {
            // 如果后端直接在这里就不返回 ID，我们给个保底提示并切回提交记录
            activeTab.value = "submissions";
            loadSubmissions();
          }
        } else {
          triggerToast("提交失败: " + res.msg, "error");
        }
      } catch (err: any) {
        triggerToast("提交出错", "error");
      }
    };

    const handleAIExplain = () => {
      triggerToast("功能开发中: AI 讲解...", "success");
    };

    // 提交详情 Modal 相关逻辑
    const showSubmissionModal = ref(false);
    const selectedSubmissionId = ref<number | undefined>(undefined);

    const openSubmissionDetail = (subId?: number) => {
      if (!subId) return;
      selectedSubmissionId.value = subId;
      showSubmissionModal.value = true;
    };

    return {
      containerRef,
      isMobile,
      activeTab,
      startResize,
      doResize,
      stopResize,
      leftPaneStyle,
      rightPaneStyle,
      copyToClipboard,
      problem,
      samples,
      showTags,
      supportedLanguages,
      codeLang,
      codeValue,
      monacoLang,
      getMonacoLang,
      editorOptions,
      handleEditorMount,
      renderMd,
      handleSelfTest,
      handleSubmit,
      handleAIExplain,
      showToast,
      toastMessage,
      toastType,
      submissions,
      showResultPanel,
      isEvaluating,
      currentSubmissionResult,
      showSubmissionModal,
      selectedSubmissionId,
      openSubmissionDetail,
    };
  },
});
</script>

<style scoped>
.problem-detail-wrapper {
  padding: 16px 5%;
  height: calc(100vh - 64px);
  background-color: #0f172a;
  box-sizing: border-box;
}

.problem-detail-container {
  display: flex;
  height: 100%;
  color: #e2e8f0;
  overflow: hidden;
  border-radius: 8px;
}

.left-pane {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
  background-color: #1e293b;
}

.pane-tabs {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: #0f172a;
}

.pane-tab {
  padding: 12px 20px;
  font-size: 14px;
  color: #94a3b8;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  user-select: none;
}

.pane-tab:hover {
  color: #cbd5e1;
}

.pane-tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  font-weight: 500;
  background: rgba(59, 130, 246, 0.05);
}

.tab-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.tab-content.empty-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-placeholder {
  text-align: center;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-placeholder p {
  margin: 0;
  font-size: 15px;
}

.right-pane {
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  min-width: 0;
}

.resizer {
  width: 6px;
  background-color: #0f172a;
  cursor: col-resize;
  z-index: 10;
  transition: background-color 0.2s;
}

.resizer:hover,
.resizer:active {
  background-color: #3b82f6;
}

.drag-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  cursor: col-resize;
  background: transparent;
}

/* 移动端适配 */
@media (max-width: 1024px) {
  .problem-detail-wrapper {
    padding: 8px;
    height: auto;
    min-height: calc(100vh - 64px);
  }

  .problem-detail-container {
    flex-direction: column;
    overflow-y: visible;
    border-radius: 0;
  }

  .left-pane {
    height: auto;
    overflow-y: visible;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .right-pane {
    height: 80vh;
    min-height: 500px;
    border-right: none;
  }

  .resizer {
    display: none;
  }
}

/* 滚动条 */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 左侧样式 */
.problem-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px;
  color: #f8fafc;
}

.problem-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #94a3b8;
}

.problem-content-section {
  margin-bottom: 24px;
}

.problem-content-section h3,
.samples-section h3 {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 12px;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

/* Markdown 基本样式适配 */
.markdown-body {
  font-size: 15px;
  line-height: 1.6;
  color: #cbd5e1;
}

:deep(.markdown-body pre) {
  background-color: #1e293b;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: "Fira Code", monospace;
}

:deep(.markdown-body code) {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: "Fira Code", monospace;
}

/* 样例样式 */
.samples-section {
  margin-bottom: 24px;
}

.sample-item {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.sample-box {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.sample-box-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 13px;
  color: #cbd5e1;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-copy {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #94a3b8;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sample-content {
  margin: 0;
  padding: 12px;
  font-family: "Fira Code", monospace;
  font-size: 14px;
  color: #e2e8f0;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 底部标签与来源 */
.problem-footer {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.footer-row {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.footer-label {
  font-weight: 500;
  color: #94a3b8;
  margin-right: 8px;
}

.source-tag {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.toggle-tags-btn {
  font-size: 13px;
  color: #3b82f6;
  cursor: pointer;
}

.toggle-tags-btn:hover {
  text-decoration: underline;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.problem-tag {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* 右侧代码编辑区样式 */
.editor-header {
  padding: 12px 16px;
  background: #252526;
  border-bottom: 1px solid #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 10;
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.editor-actions {
  display: flex;
  gap: 12px;
}

.lang-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #ccc;
}

.lang-selector select {
  background: #3c3c3c;
  color: #fff;
  border: 1px solid #454545;
  border-radius: 4px;
  padding: 4px 8px;
  outline: none;
}

.editor-container {
  flex: 1;
  position: relative;
  min-height: 0;
  overflow: hidden;
}

.result-panel {
  height: 250px;
  flex-shrink: 0;
  background: #1e1e1e;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.result-header h3 {
  margin: 0;
  font-size: 15px;
  color: #e2e8f0;
  font-weight: 600;
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

.result-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  color: #e2e8f0;
}

.evaluating-state {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #3b82f6;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.eval-result {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-status {
  font-size: 20px;
  font-weight: bold;
}

.result-status.accepted {
  color: #10b981;
}

.result-status.wrong_answer,
.result-status.error {
  color: #ef4444;
}

.result-details {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item .label {
  font-size: 13px;
  color: #94a3b8;
}

.detail-item .value {
  font-size: 16px;
  font-weight: 500;
  font-family: "Fira Code", monospace;
}

.evaluating-error {
  color: #ef4444;
}

/* Modal 样式已被提取到专门的组件内，这里删除废弃部分 */

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.submission-item-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px 20px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.submission-item-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px 20px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.submission-item-modern:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  width: 140px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #64748b;
}

.status-badge.accepted {
  color: #10b981;
}

.status-badge.accepted .status-dot {
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.status-badge.wrong_answer,
.status-badge.error,
.status-badge.time_limit_exceeded,
.status-badge.memory_limit_exceeded {
  color: #ef4444;
}

.status-badge.wrong_answer .status-dot,
.status-badge.error .status-dot,
.status-badge.time_limit_exceeded .status-dot,
.status-badge.memory_limit_exceeded .status-dot {
  background-color: #ef4444;
  box-shadow: 0 0 8px #ef4444;
}

.status-badge.waiting,
.status-badge.pending,
.status-badge.judging {
  color: #3b82f6;
}

.status-badge.waiting .status-dot,
.status-badge.pending .status-dot,
.status-badge.judging .status-dot {
  background-color: #3b82f6;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.sub-details {
  display: flex;
  gap: 32px;
  flex: 1;
  padding-left: 24px;
}

.detail-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #64748b;
}

.detail-value {
  font-size: 14px;
  color: #e2e8f0;
  font-family: "Fira Code", monospace;
}

.sub-time-modern {
  font-size: 13px;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .submission-item-modern {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .sub-details {
    padding-left: 0;
    width: 100%;
    justify-content: space-between;
  }
}

.editor-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.btn {
  padding: 8px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-icon,
.btn-icon-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-icon {
  padding: 10px;
  width: 40px;
  height: 40px;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-magic {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
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
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.3s ease;
}

.type-success {
  background-color: #10b981;
}

.type-error {
  background-color: #ef4444;
}

@keyframes slideDown {
  from {
    top: -50px;
    opacity: 0;
  }
  to {
    top: 24px;
    opacity: 1;
  }
}

/* Instant CSS Tooltip */
.btn[data-tooltip] {
  position: relative;
  overflow: visible;
}

.btn[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  top: calc(100% + 8px); /* Place below the button */
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(30, 41, 59, 0.95);
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: none; /* Instant display */
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn[data-tooltip]::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent rgba(30, 41, 59, 0.95) transparent;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: none; /* Instant display */
  z-index: 1000;
}

.btn[data-tooltip]:hover::before,
.btn[data-tooltip]:hover::after {
  opacity: 1;
  visibility: visible;
}
</style>
