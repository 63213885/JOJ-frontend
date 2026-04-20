<template>
  <div class="profile-body-wrapper">
    <div class="card">
      <div class="card-header"><h3 class="card-title">我的比赛</h3></div>
      <div class="card-body">
        <p>（比赛记录开发中... 用户：{{ user?.account }}）</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from "vue";
import type { UserVO } from "../../../../generated/models/UserVO";

const user = inject<Ref<UserVO | null>>("profileUser");
</script>

<style scoped>
.profile-body-wrapper {
  max-width: 980px;
  margin: 0 auto;
  padding: 20px 40px 60px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.card {
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.card-title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}
.card-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #94a3b8;
}
</style>
