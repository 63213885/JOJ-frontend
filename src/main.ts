import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import * as monaco from "monaco-editor";
import { loader } from "@guolao/vue-monaco-editor";
import { initTheme } from "./utils/theme";

loader.config({ monaco });

initTheme();

createApp(App).use(store).use(router).mount("#app");
