<template>
  <div class="app-layout">
    <header class="top-header">
      <div class="header-container">
        <div class="logo">
          <router-link to="/">JOJ</router-link>
        </div>

        <nav class="main-nav">
          <router-link to="/">首页</router-link>
          <router-link to="/courses">课程</router-link>
          <router-link to="/contests">竞赛</router-link>
          <router-link to="/problems">题库</router-link>
        </nav>

        <div class="auth-buttons">
          <router-link to="/user/login" class="btn btn-login">登录</router-link>
          <router-link to="/user/register" class="btn btn-register"
            >注册
          </router-link>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

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

/* Header Styles */
.top-header {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo a {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  letter-spacing: 1px;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.main-nav a {
  text-decoration: none;
  color: #94a3b8;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 6px;
  position: relative;
}

.main-nav a:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.05);
}

.main-nav a.router-link-exact-active {
  color: #3b82f6;
}

.main-nav a.router-link-exact-active::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background-color: #3b82f6;
  border-radius: 2px;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-login {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-register {
  color: #ffffff;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.btn-register:hover {
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  transform: translateY(-1px);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
<script setup lang="ts"></script>
