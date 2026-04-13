<template>
  <div class="home-wrapper">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">JOJ</span> 在线评测系统
        </h1>
        <p class="hero-subtitle">
          高效、稳定、极致的编程体验，带你开启算法巅峰之旅
        </p>
        <div class="hero-actions">
          <button class="btn-primary" @click="goToRegister">
            立即加入 <span class="arrow">→</span>
          </button>
          <button class="btn-secondary" @click="handleOk">测试连接</button>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="glow-bg top-right"></div>
      <div class="glow-bg bottom-left"></div>
    </section>

    <!-- Announcements Section -->
    <section class="announcements-section">
      <div class="section-header">
        <h2 class="section-title">最新动态</h2>
        <div class="title-line"></div>
      </div>

      <div class="announcement-grid">
        <div
          v-for="item in announcements"
          :key="item.id"
          class="glass-card announcement-card"
        >
          <div class="card-header">
            <h3 class="card-title">{{ item.title }}</h3>
            <span class="card-date">{{ item.date }}</span>
          </div>
          <p class="card-content">{{ item.content }}</p>
          <div class="card-footer">
            <span class="read-more">阅读详情</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { AuthControllerService } from "../../generated/services/AuthControllerService";

export default defineComponent({
  setup() {
    const router = useRouter();
    const announcements = ref([
      {
        id: 1,
        title: "JOJ 平台全新升级",
        date: "2026-04-10",
        content:
          "欢迎体验全新界面的 JOJ 系统！更快的评测速度，更稳定的服务体验。享受编码的乐趣吧！",
      },
      {
        id: 2,
        title: "2026春季巅峰赛报名开启",
        date: "2026-04-05",
        content:
          "年度重磅赛事来袭！百万奖金池等待各路高手挑战。比赛采用ACM赛制，速来组队！",
      },
      {
        id: 3,
        title: "新增 AI 代码助手功能",
        date: "2026-03-28",
        content:
          "做题遇到瓶颈？试试我们最新上线的 AI 助手功能，为你提供解题思路和代码优化建议。",
      },
    ]);

    const goToRegister = () => {
      router.push("/auth/register");
    };

    const handleOk = async () => {
      try {
        const res = await AuthControllerService.okUsingGet();
        alert("连接成功：" + JSON.stringify(res));
      } catch (err) {
        console.error(err);
        alert("连接失败，请检查网络");
      }
    };

    return {
      announcements,
      goToRegister,
      handleOk,
    };
  },
});
</script>

<style scoped>
.home-wrapper {
  min-height: 100vh;
  background-color: #0f172a;
  overflow: hidden;
  position: relative;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 120px 20px 80px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 800px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 24px;
  letter-spacing: -1px;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #94a3b8;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  padding: 14px 32px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 10px 20px -10px rgba(59, 130, 246, 0.5);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px -10px rgba(59, 130, 246, 0.6);
}

.btn-primary .arrow {
  transition: transform 0.3s ease;
}

.btn-primary:hover .arrow {
  transform: translateX(4px);
}

.btn-secondary {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 32px;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Background Effects */
.glow-bg {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 1;
  opacity: 0.15;
}

.top-right {
  top: -200px;
  right: -100px;
  background: linear-gradient(to bottom left, #3b82f6, #8b5cf6);
}

.bottom-left {
  bottom: -100px;
  left: -200px;
  background: linear-gradient(to top right, #ec4899, #8b5cf6);
}

/* Announcements Section */
.announcements-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  position: relative;
  z-index: 10;
}

.section-header {
  margin-bottom: 40px;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 12px;
}

.title-line {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  margin: 0 auto;
  border-radius: 2px;
}

.announcement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.glass-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.card-header {
  margin-bottom: 16px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 8px;
}

.card-date {
  font-size: 0.875rem;
  color: #64748b;
  display: inline-block;
  padding: 4px 10px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 20px;
}

.card-content {
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 16px;
}

.read-more {
  color: #3b82f6;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.read-more:hover {
  color: #60a5fa;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
  }
}
</style>
