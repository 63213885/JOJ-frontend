import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/auth/register",
    name: "register",
    component: () => import("../views/user/auth/RegisterView.vue"),
  },
  {
    path: "/auth/login",
    name: "login",
    component: () => import("../views/user/auth/LoginView.vue"),
  },
  {
    path: "/auth/reset",
    name: "reset",
    component: () => import("../views/user/auth/ResetPasswordView.vue"),
  },
  {
    path: "/profile/:account",
    name: "userProfile",
    component: () => import("../views/user/profile/ProfileView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
