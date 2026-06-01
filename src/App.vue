<template>
  <div class="app-layout">
    <TopNavBar />
    <GlobalNotification />

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TopNavBar from "@/components/TopNavBar.vue";
import GlobalNotification from "@/components/GlobalNotification.vue";

export default defineComponent({
  name: "App",
  components: {
    TopNavBar,
    GlobalNotification,
  },
  setup() {
    // You can keep this empty or just remove onMounted entirely
  },
});
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #0f172a;
  color: #e2e8f0;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

html.theme-light {
  filter: invert(1) hue-rotate(180deg);
}

/* 恢复原本不应反转的元素 */
html.theme-light img,
html.theme-light video,
html.theme-light canvas,
html.theme-light iframe,
html.theme-light .avatar {
  filter: invert(1) hue-rotate(180deg);
}

html.theme-light .monaco-editor,
html.theme-light .bytemd {
  /* 如果有自己的主题可以尝试在这里反转回来或者单独配置 */
  filter: invert(1) hue-rotate(180deg);
}
</style>
