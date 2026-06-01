import { ref } from "vue";

export const themeSetting = ref(
  localStorage.getItem("theme-setting") || "dark"
);
export const currentTheme = ref("dark");

export function applyTheme(setting: string) {
  let isLight = false;
  if (setting === "system") {
    isLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    currentTheme.value = isLight ? "light" : "dark";
  } else {
    isLight = setting === "light";
    currentTheme.value = setting;
  }

  if (isLight) {
    document.documentElement.classList.add("theme-light");
  } else {
    document.documentElement.classList.remove("theme-light");
  }

  localStorage.setItem("theme-setting", setting);
  themeSetting.value = setting;
}

export function initTheme() {
  applyTheme(themeSetting.value);
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => {
      if (themeSetting.value === "system") {
        applyTheme("system");
      }
    });
}
