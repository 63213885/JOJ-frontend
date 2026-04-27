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
          class="tab-content empty-content"
          v-if="activeTab === 'submissions'"
        >
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
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p>提交记录功能开发中...</p>
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
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
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
      </div>

      <!-- 提示消息 -->
      <div v-if="showToast" :class="['toast', toastType]">
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { ProblemControllerService } from "../../../generated/services/ProblemControllerService";
import type { ProblemVO } from "../../../generated/models/ProblemVO";
import VueMonacoEditor from "@guolao/vue-monaco-editor";
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
  },
  setup() {
    const route = useRoute();
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
      // 简单映射，目前值已经是一致的
      return codeLang.value;
    });

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

    onMounted(() => {
      loadProblem();
      window.addEventListener("resize", checkMobile);
      window.addEventListener("mousemove", doResize);
      window.addEventListener("mouseup", stopResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
    });

    const handleSelfTest = () => {
      triggerToast("功能开发中: 自测运行代码...", "success");
      console.log("Code:", codeValue.value);
    };

    const handleSubmit = () => {
      triggerToast("功能开发中: 提交评测...", "success");
      console.log("Language:", codeLang.value);
      console.log("Code:", codeValue.value);
    };

    const handleAIExplain = () => {
      triggerToast("功能开发中: AI 讲解...", "success");
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
      codeLang,
      codeValue,
      monacoLang,
      editorOptions,
      handleEditorMount,
      renderMd,
      handleSelfTest,
      handleSubmit,
      handleAIExplain,
      showToast,
      toastMessage,
      toastType,
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
