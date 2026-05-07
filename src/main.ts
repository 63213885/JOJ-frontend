import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import * as monaco from "monaco-editor";
import { loader } from "@guolao/vue-monaco-editor";

loader.config({ monaco });

createApp(App).use(store).use(router).mount("#app");
