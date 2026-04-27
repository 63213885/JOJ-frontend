<template>
  <div class="md-editor-container">
    <!-- 左侧渲染区 -->
    <div
      class="md-preview custom-scroll markdown-body"
      v-html="htmlContent"
    ></div>

    <!-- 右侧编辑区 -->
    <div class="md-editor custom-scroll">
      <textarea
        class="md-textarea"
        :value="modelValue"
        @input="onInput"
        :placeholder="placeholder"
      ></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
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
  name: "MdEditor",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "请输入 Markdown 内容...",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const htmlContent = computed(() => {
      return md.render(props.modelValue || "");
    });

    const onInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      emit("update:modelValue", target.value);
    };

    return {
      htmlContent,
      onInput,
    };
  },
});
</script>

<style scoped>
.md-editor-container {
  display: flex;
  height: 100%;
  min-height: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.6);
}

.md-preview {
  flex: 1;
  padding: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  color: #f8fafc;
  background: rgba(30, 41, 59, 0.3);
}

.md-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.md-textarea {
  flex: 1;
  width: 100%;
  background: transparent;
  border: none;
  padding: 20px;
  color: #f8fafc;
  font-family: "Fira Code", monospace, source-code-pro, Menlo, Consolas;
  font-variant-ligatures: none;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.md-textarea::placeholder {
  color: #475569;
}

/* Custom Scrollbar for editor and preview */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.custom-scroll::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Basic Markdown Body Styles mimicking GitHub a bit */
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 {
  font-size: 2em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.markdown-body h2 {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-family: "Fira Code", monospace, source-code-pro, Menlo, Consolas;
  font-size: 85%;
  background-color: rgba(110, 118, 129, 0.4);
  border-radius: 6px;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-family: "Fira Code", monospace, source-code-pro, Menlo, Consolas;
  font-size: 85%;
  line-height: 1.45;
  background-color: #161b22;
  border-radius: 6px;
  margin-bottom: 16px;
}

.markdown-body pre code {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: #8b949e;
  border-left: 0.25em solid #30363d;
  margin-top: 0;
  margin-bottom: 16px;
}
</style>
