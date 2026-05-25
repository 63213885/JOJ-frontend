import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "../store";

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
    meta: { requireAdmin: true },
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
    path: "/submission/list",
    name: "submissionList",
    component: () => import("../views/submission/SubmissionListView.vue"),
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
        path: "/profile/:account/courses",
        name: "userCourses",
        component: () => import("../views/user/profile/ProfileCoursesView.vue"),
      },
      {
        path: "/profile/:account/submissions",
        name: "userSubmissions",
        component: () =>
          import("../views/user/profile/ProfileSubmissionsView.vue"),
      },
      {
        path: "/profile/:account/contests",
        name: "userContests",
        component: () =>
          import("../views/user/profile/ProfileContestsView.vue"),
      },
    ],
  },
  {
    path: "/user/list",
    name: "userList",
    component: () => import("../views/user/UserListView.vue"),
  },
  {
    path: "/user/create",
    name: "userCreate",
    component: () => import("../views/user/UserCreateView.vue"),
    meta: { requireAdmin: true },
  },
  {
    path: "/course/list",
    name: "courseList",
    component: () => import("../views/course/CourseListView.vue"),
  },
  {
    path: "/course/create",
    name: "courseCreate",
    component: () => import("../views/course/CourseCreateView.vue"),
    meta: { requireAdmin: true },
  },
  {
    path: "/course/edit/:id",
    name: "courseEdit",
    component: () => import("../views/course/CourseEditView.vue"),
    meta: { requireAdmin: true },
  },
  {
    path: "/course/:id",
    name: "courseDetail",
    component: () => import("../views/course/CourseDetailView.vue"),
  },
  {
    path: "/course/:courseId/lesson/create",
    name: "courseLessonCreate",
    component: () =>
      import("../views/course/lesson/CourseLessonCreateView.vue"),
    meta: { requireAdmin: true },
  },
  {
    path: "/course/:courseId/lesson/edit/:lessonId",
    name: "courseLessonEdit",
    component: () => import("../views/course/lesson/CourseLessonEditView.vue"),
    meta: { requireAdmin: true },
  },
  {
    path: "/course/:courseId/lesson/:lessonId",
    component: () => import("../views/course/lesson/LessonWorkspaceView.vue"),
    children: [
      {
        path: "theory",
        name: "lessonTheory",
        component: () => import("../views/course/lesson/LessonTheoryView.vue"),
      },
      {
        path: "practice",
        name: "lessonPractice",
        component: () =>
          import("../views/course/lesson/LessonPracticeView.vue"),
      },
    ],
  },
  {
    path: "/no-auth",
    name: "noAuth",
    component: () => import("../views/error/NoAuthView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("../views/error/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (store.getters.isInitializing) {
    await store.dispatch("fetchCurrentUser");
  }

  if (to.meta.requireAdmin) {
    const user = store.getters.currentUser;
    if (user && (user.role === "admin" || user.role === "ADMIN")) {
      next();
    } else {
      next("/no-auth");
    }
  } else {
    next();
  }
});

export default router;
