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
    path: "/problem/list",
    name: "problemList",
    component: () => import("../views/problem/ProblemListView.vue"),
  },
  {
    path: "/problem/create",
    name: "problemCreate",
    component: () => import("../views/problem/ProblemCreateView.vue"),
  },
  {
    path: "/problem/edit/:id",
    name: "problemEdit",
    component: () => import("../views/problem/ProblemEditView.vue"),
  },
  {
    path: "/problem/:id",
    name: "problemDetail",
    component: () => import("../views/problem/ProblemDetailView.vue"),
  },
  {
    path: "/user-layout",
    component: () => import("../views/user/profile/ProfileView.vue"),
    children: [
      {
        path: "/profile/settings",
        name: "profileSettings",
        component: () =>
          import("../views/user/profile/ProfileSettingsView.vue"),
      },
      {
        path: "/profile/:account",
        name: "userProfile",
        component: () => import("../views/user/profile/ProfileHomeView.vue"),
      },
      {
        path: "/courses/:account",
        name: "userCourses",
        component: () => import("../views/user/profile/ProfileCoursesView.vue"),
      },
      {
        path: "/submissions/:account",
        name: "userSubmissions",
        component: () =>
          import("../views/user/profile/ProfileSubmissionsView.vue"),
      },
      {
        path: "/contests/with/:account",
        name: "userContests",
        component: () =>
          import("../views/user/profile/ProfileContestsView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
