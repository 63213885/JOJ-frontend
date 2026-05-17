<template>
  <div class="app-layout">
    <TopNavBar />

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import TopNavBar from "@/components/TopNavBar.vue";
import { AuthControllerService } from "../generated/user";

export default defineComponent({
  name: "App",
  components: {
    TopNavBar,
  },
  setup() {
    const store = useStore();

    onMounted(async () => {
      try {
        const res = await AuthControllerService.getLoginUserUsingGet();
        if (res.code === 0 && res.data) {
          store.commit("setUser", res.data);
        }
      } catch (error) {
        console.log("未登录或获取用户信息失败", error);
      } finally {
        store.commit("setInitialized");
      }
    });
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
</style>
