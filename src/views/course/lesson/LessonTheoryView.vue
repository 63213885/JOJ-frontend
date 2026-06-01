<template>
  <div class="theory-view">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载章节信息中...</p>
    </div>
    <div v-else-if="lesson" class="lesson-content">
      <!-- Custom Video Player -->
      <div
        class="video-container"
        ref="videoContainer"
        :class="{
          'is-fullscreen': isFullscreen,
          'controls-visible': controlsVisible,
          'is-playing': isPlaying,
        }"
        @mousemove="showControls"
        @mouseleave="scheduleHideControls"
        @click.self="togglePlay"
        tabindex="0"
        @keydown="handleKeydown"
      >
        <!-- Video Element -->
        <video
          v-if="videoUrl"
          ref="videoPlayer"
          class="video-player"
          preload="metadata"
          @error="onVideoError"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @play="onPlay"
          @pause="onPause"
          @ended="onEnded"
          @waiting="onWaiting"
          @canplay="onCanPlay"
          @volumechange="onVolumeChange"
          @progress="onProgress"
          @click="togglePlay"
        >
          您的浏览器不支持视频播放
        </video>

        <!-- Loading placeholder -->
        <div
          v-else-if="lesson.videoFileId && videoLoading"
          class="video-placeholder"
        >
          <div class="video-loading">
            <div class="loading-spinner"></div>
            <p>正在获取视频播放地址...</p>
          </div>
        </div>

        <!-- Error placeholder -->
        <div
          v-else-if="lesson.videoFileId && videoError"
          class="video-placeholder"
        >
          <div class="video-error">
            <span class="icon-error">⚠</span>
            <p>{{ videoError }}</p>
            <button class="retry-btn" @click="loadVideoUrl">重新加载</button>
          </div>
        </div>

        <!-- No video placeholder -->
        <div v-else class="video-placeholder">
          <div class="no-video">
            <span class="icon-no-video">🎬</span>
            <p>该章节暂无视频</p>
          </div>
        </div>

        <!-- Center Play Button (large, shown when paused) -->
        <transition name="fade">
          <div
            v-if="videoUrl && !isPlaying && !isBuffering"
            class="center-play-btn"
            @click="togglePlay"
          >
            <svg viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="23"
                fill="rgba(0,0,0,0.55)"
                stroke="rgba(255,255,255,0.2)"
                stroke-width="1"
              />
              <path d="M19 14L35 24L19 34V14Z" fill="white" />
            </svg>
          </div>
        </transition>

        <!-- Buffering Indicator -->
        <transition name="fade">
          <div v-if="isBuffering" class="buffering-indicator">
            <div class="buffering-spinner"></div>
          </div>
        </transition>

        <!-- Seek Tooltip (shows ±5s on arrow key press) -->
        <transition name="fade-fast">
          <div
            v-if="seekTooltip.visible"
            class="seek-tooltip"
            :class="seekTooltip.direction"
          >
            <svg
              v-if="seekTooltip.direction === 'backward'"
              viewBox="0 0 24 24"
              fill="white"
              width="28"
              height="28"
            >
              <path :d="SVG_PATHS.seekBackward" />
              <text
                x="12"
                y="15.5"
                text-anchor="middle"
                font-size="7"
                fill="white"
                font-weight="bold"
              >
                5
              </text>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="white" width="28" height="28">
              <path :d="SVG_PATHS.seekForward" />
              <text
                x="12"
                y="15.5"
                text-anchor="middle"
                font-size="7"
                fill="white"
                font-weight="bold"
              >
                5
              </text>
            </svg>
          </div>
        </transition>

        <!-- Custom Controls Bar -->
        <div v-if="videoUrl" class="controls-bar" @click.stop>
          <!-- Progress Bar -->
          <div
            class="progress-bar-wrapper"
            ref="progressBar"
            @mousedown="startProgressDrag"
            @mousemove="onProgressHover"
            @mouseleave="progressHoverPos = -1"
          >
            <!-- Buffered range -->
            <div
              class="progress-buffered"
              :style="{ width: bufferedPercent + '%' }"
            ></div>
            <!-- Played range -->
            <div
              class="progress-played"
              :style="{ width: playedPercent + '%' }"
            >
              <div class="progress-thumb"></div>
            </div>
            <!-- Hover preview time -->
            <div
              v-if="progressHoverPos >= 0"
              class="progress-hover-tooltip"
              :style="{ left: progressHoverPos + 'px' }"
            >
              {{ hoverTimeText }}
            </div>
          </div>

          <div class="controls-main">
            <!-- Left controls -->
            <div class="controls-left">
              <!-- Play / Pause -->
              <button
                class="ctrl-btn"
                @click="togglePlay"
                :title="isPlaying ? '暂停 (空格)' : '播放 (空格)'"
              >
                <svg
                  v-if="isPlaying"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="22"
                  height="22"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="22"
                  height="22"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              <!-- Time display -->
              <span class="time-display">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
              </span>
            </div>

            <!-- Right controls -->
            <div class="controls-right">
              <!-- Volume -->
              <div
                class="volume-control"
                @mouseenter="showVolumeSlider = true"
                @mouseleave="showVolumeSlider = false"
              >
                <button
                  class="ctrl-btn"
                  @click="toggleMute"
                  :title="isMuted ? '取消静音' : '静音'"
                >
                  <svg
                    v-if="isMuted || volume === 0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path :d="SVG_PATHS.volumeMuted" />
                  </svg>
                  <svg
                    v-else-if="volume < 0.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"
                    />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="20"
                    height="20"
                  >
                    <path :d="SVG_PATHS.volumeHigh" />
                  </svg>
                </button>
                <transition name="slide-up">
                  <div v-if="showVolumeSlider" class="volume-slider-popup">
                    <div
                      class="volume-slider-track"
                      ref="volumeSlider"
                      @mousedown="startVolumeDrag"
                    >
                      <div
                        class="volume-slider-fill"
                        :style="{ height: volume * 100 + '%' }"
                      >
                        <div class="volume-slider-thumb"></div>
                      </div>
                    </div>
                    <span class="volume-value">{{
                      Math.round(volume * 100)
                    }}</span>
                  </div>
                </transition>
              </div>

              <!-- Playback Speed -->
              <div
                class="speed-control"
                @mouseenter="showSpeedMenu = true"
                @mouseleave="showSpeedMenu = false"
              >
                <button
                  class="ctrl-btn speed-btn"
                  :title="'倍速 (' + playbackSpeed + 'x)'"
                >
                  {{ playbackSpeed === 1 ? "倍速" : playbackSpeed + "x" }}
                </button>
                <transition name="slide-up">
                  <div v-if="showSpeedMenu" class="speed-menu">
                    <div
                      v-for="speed in speedOptions"
                      :key="speed"
                      class="speed-option"
                      :class="{ active: playbackSpeed === speed }"
                      @click="setPlaybackSpeed(speed)"
                    >
                      {{ speed }}x
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Fullscreen -->
              <button
                class="ctrl-btn"
                @click="toggleFullscreen"
                :title="isFullscreen ? '退出全屏 (F)' : '全屏 (F)'"
              >
                <svg
                  v-if="!isFullscreen"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                  />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="lesson-details">
        <h2 class="lesson-title">{{ lesson.title }}</h2>
        <div class="lesson-desc">{{ lesson.description || "暂无描述" }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  computed,
} from "vue";
import { useRoute } from "vue-router";
import Hls from "hls.js";

// --- Pure JS SHA-256 (works without HTTPS / crypto.subtle) ---
function rotr(x: number, n: number): number {
  return (x >>> n) | (x << (32 - n));
}

/* eslint-disable max-len */
// prettier-ignore
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

/* eslint-enable max-len */

function sha256(message: Uint8Array): Uint8Array {
  let h0 = 0x6a09e667,
    h1 = 0xbb67ae85,
    h2 = 0x3c6ef372,
    h3 = 0xa54ff53a;
  let h4 = 0x510e527f,
    h5 = 0x9b05688c,
    h6 = 0x1f83d9ab,
    h7 = 0x5be0cd19;

  const msgLen = message.length;
  const padLen = (msgLen + 9 + 63) & ~63;
  const padded = new Uint8Array(padLen);
  padded.set(message);
  padded[msgLen] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padLen - 4, msgLen * 8, false);

  const w = new Uint32Array(64);
  for (let offset = 0; offset < padLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = dv.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let wa = h0,
      wb = h1,
      wc = h2,
      wd = h3;
    let we = h4,
      wf = h5,
      wg = h6,
      wh = h7;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(we, 6) ^ rotr(we, 11) ^ rotr(we, 25);
      const ch = (we & wf) ^ (~we & wg);
      const t1 = (wh + S1 + ch + SHA256_K[i] + w[i]) | 0;
      const S0 = rotr(wa, 2) ^ rotr(wa, 13) ^ rotr(wa, 22);
      const maj = (wa & wb) ^ (wa & wc) ^ (wb & wc);
      const t2 = (S0 + maj) | 0;
      wh = wg;
      wg = wf;
      wf = we;
      we = (wd + t1) | 0;
      wd = wc;
      wc = wb;
      wb = wa;
      wa = (t1 + t2) | 0;
    }
    h0 = (h0 + wa) | 0;
    h1 = (h1 + wb) | 0;
    h2 = (h2 + wc) | 0;
    h3 = (h3 + wd) | 0;
    h4 = (h4 + we) | 0;
    h5 = (h5 + wf) | 0;
    h6 = (h6 + wg) | 0;
    h7 = (h7 + wh) | 0;
  }

  const result = new Uint8Array(32);
  const rv = new DataView(result.buffer);
  rv.setUint32(0, h0, false);
  rv.setUint32(4, h1, false);
  rv.setUint32(8, h2, false);
  rv.setUint32(12, h3, false);
  rv.setUint32(16, h4, false);
  rv.setUint32(20, h5, false);
  rv.setUint32(24, h6, false);
  rv.setUint32(28, h7, false);
  return result;
}

// --- HLS Key Deobfuscation ---
function buildKeyMask(token: string): Uint8Array {
  const text = token + ":joj:hls:key:mask:v1";
  const encoded = new TextEncoder().encode(text);
  return sha256(encoded).slice(0, 16);
}

function deobfuscateKey(arrayBuffer: ArrayBuffer, token: string): ArrayBuffer {
  const obfuscatedKey = new Uint8Array(arrayBuffer);
  if (obfuscatedKey.length !== 16) {
    throw new Error(
      `Invalid HLS key length: expected 16, got ${obfuscatedKey.length}`
    );
  }
  const mask = buildKeyMask(token);
  const realKey = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    realKey[i] = obfuscatedKey[i] ^ mask[i];
  }
  return realKey.buffer;
}

function getTokenFromUrl(url: string): string | null {
  const parsedUrl = new URL(url, window.location.origin);
  return parsedUrl.searchParams.get("token");
}

import {
  CourseLessonControllerService,
  CourseLessonVideoControllerService,
  CourseLessonVO,
} from "../../../../generated/course";

export default defineComponent({
  name: "LessonTheoryView",
  setup() {
    const route = useRoute();
    const lessonId = Number(route.params.lessonId);

    // --- Lesson data ---
    const loading = ref(true);
    const lesson = ref<CourseLessonVO | null>(null);

    // --- Video source ---
    const videoUrl = ref<string>("");
    const videoLoading = ref(false);
    const videoError = ref<string>("");
    const videoPlayer = ref<HTMLVideoElement | null>(null);
    const videoContainer = ref<HTMLElement | null>(null);

    // --- Playback state ---
    const isPlaying = ref(false);
    const isBuffering = ref(false);
    const currentTime = ref(0);
    const duration = ref(0);
    const volume = ref(1);
    const isMuted = ref(false);
    const playbackSpeed = ref(1);
    const isFullscreen = ref(false);
    const controlsVisible = ref(true);
    const showVolumeSlider = ref(false);
    const showSpeedMenu = ref(false);
    const bufferedPercent = ref(0);

    // --- Progress bar ---
    const progressBar = ref<HTMLElement | null>(null);
    const volumeSlider = ref<HTMLElement | null>(null);
    const progressHoverPos = ref(-1);
    const hoverTimeText = ref("0:00");
    const isDraggingProgress = ref(false);
    const isDraggingVolume = ref(false);

    // --- Seek tooltip ---
    const seekTooltip = ref({
      visible: false,
      direction: "forward" as "forward" | "backward",
    });
    let seekTooltipTimer: ReturnType<typeof setTimeout> | null = null;

    // --- Speed options ---
    const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0];

    // --- SVG icon paths (extracted to avoid template max-len) ---
    /* eslint-disable max-len */
    // prettier-ignore
    const SVG_PATHS = {
      seekBackward: "M12.5 3C7.25 3 3 7.25 3 12.5S7.25 22 12.5 22 22 17.75 22 12.5h-2c0 4.14-3.36 7.5-7.5 7.5S5 16.64 5 12.5 8.36 5 12.5 5v3l4.5-4L12.5 0v3z",
      seekForward: "M11.5 3C16.75 3 21 7.25 21 12.5S16.75 22 11.5 22 2 17.75 2 12.5h2c0 4.14 3.36 7.5 7.5 7.5S19 16.64 19 12.5 15.64 5 11.5 5v3L7 4l4.5-4v3z",
      volumeMuted: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z",
      volumeHigh: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
    };
    /* eslint-enable max-len */

    // --- Controls auto-hide ---
    let controlsTimer: ReturnType<typeof setTimeout> | null = null;
    let hlsInstance: Hls | null = null;

    // Computed
    const playedPercent = computed(() => {
      if (duration.value === 0) return 0;
      return (currentTime.value / duration.value) * 100;
    });

    // --- Lesson & Video loading ---
    const loadLesson = async () => {
      loading.value = true;
      try {
        const res = await CourseLessonControllerService.getLessonUsingGet(
          lessonId
        );
        if (res.code === 0 && res.data) {
          lesson.value = res.data;
          loading.value = false;
          if (res.data.videoFileId) {
            await loadVideoUrl();
          }
        }
      } catch (err) {
        console.error("加载章节失败", err);
      } finally {
        loading.value = false;
      }
    };

    const loadVideoUrl = async () => {
      videoLoading.value = true;
      videoError.value = "";
      try {
        const res =
          await CourseLessonVideoControllerService.getVideoPlayInfoUsingGet(
            lessonId
          );
        if (res.code === 0 && res.data && res.data.url) {
          videoUrl.value = res.data.url;
          await nextTick();
          initHlsPlayer(res.data.url);
        } else {
          videoError.value = "获取视频播放地址失败";
        }
      } catch (err) {
        console.error("获取视频播放地址失败", err);
        videoError.value = "获取视频播放地址失败，请稍后重试";
      } finally {
        videoLoading.value = false;
      }
    };

    const initHlsPlayer = (url: string) => {
      const videoEl = videoPlayer.value;
      if (!videoEl) return;

      destroyHls();

      if (Hls.isSupported()) {
        // Extract token from the m3u8 source URL as a fallback
        const sourceToken = getTokenFromUrl(url);

        // Create loader class with token access via closure
        const DefaultLoader = Hls.DefaultConfig.loader;

        class JojHlsLoader extends DefaultLoader {
          load(context: any, config: any, callbacks: any): void {
            const originalOnSuccess = callbacks.onSuccess;

            callbacks.onSuccess = (
              response: any,
              stats: any,
              ctx: any,
              networkDetails: any
            ) => {
              try {
                if (ctx.url && ctx.url.includes("/video/hls/key")) {
                  const token = getTokenFromUrl(ctx.url) || sourceToken;
                  if (!token) {
                    throw new Error("Missing HLS play token");
                  }
                  response.data = deobfuscateKey(response.data, token);
                }
                originalOnSuccess(response, stats, ctx, networkDetails);
              } catch (error: any) {
                console.error("[HLS Key] deobfuscate failed:", error);
                callbacks.onError(
                  {
                    code: 500,
                    text: error.message || "HLS key deobfuscate failed",
                  },
                  ctx,
                  networkDetails
                );
              }
            };

            super.load(context, config, callbacks);
          }
        }

        const hls = new Hls({
          debug: false,
          loader: JojHlsLoader,
          xhrSetup(xhr: XMLHttpRequest) {
            xhr.withCredentials = true;
          },
        });
        hls.loadSource(url);
        hls.attachMedia(videoEl);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest parsed, ready to play");
        });

        // Track network retry count to avoid infinite retry loops
        let networkRetryCount = 0;
        const MAX_NETWORK_RETRIES = 3;

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!data.fatal) return;

          // Check if this is a key-loading related error
          const isKeyError =
            data.details === Hls.ErrorDetails.KEY_LOAD_ERROR ||
            data.details === Hls.ErrorDetails.KEY_LOAD_TIMEOUT ||
            (data.response &&
              data.response.text &&
              data.response.text.includes("deobfuscate"));

          if (isKeyError) {
            console.error("HLS 密钥加载失败", data);
            destroyHls();
            videoError.value = "视频密钥验证失败，请刷新页面后重试";
            videoUrl.value = "";
            return;
          }

          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (networkRetryCount < MAX_NETWORK_RETRIES) {
                networkRetryCount++;
                console.warn(
                  `HLS 网络错误，第 ${networkRetryCount} 次重试...`,
                  data
                );
                hls.startLoad();
              } else {
                console.error("HLS 网络错误，重试次数已用尽", data);
                destroyHls();
                videoError.value = "视频加载失败，请检查网络连接后重试";
                videoUrl.value = "";
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              if (networkRetryCount < MAX_NETWORK_RETRIES) {
                networkRetryCount++;
                console.warn(
                  `HLS 媒体错误，第 ${networkRetryCount} 次尝试恢复...`,
                  data
                );
                hls.recoverMediaError();
              } else {
                console.error("HLS 媒体错误，恢复失败", data);
                destroyHls();
                videoError.value = "视频播放出错，请尝试重新加载";
                videoUrl.value = "";
              }
              break;
            default:
              console.error("HLS 致命错误，无法恢复", data);
              destroyHls();
              videoError.value = "视频播放出错，请尝试重新加载";
              videoUrl.value = "";
              break;
          }
        });

        hlsInstance = hls;
      } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
        videoEl.src = url;
      } else {
        videoError.value = "您的浏览器不支持 HLS 视频播放";
        videoUrl.value = "";
      }
    };

    const destroyHls = () => {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    };

    // --- Playback controls ---
    const togglePlay = () => {
      const videoEl = videoPlayer.value;
      if (!videoEl) return;
      if (videoEl.paused) {
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // AbortError is expected when play() is interrupted by a new load
            if (err.name !== "AbortError") {
              console.error("播放失败", err);
            }
          });
        }
      } else {
        videoEl.pause();
      }
    };

    const seek = (seconds: number) => {
      const videoEl = videoPlayer.value;
      if (!videoEl) return;
      const newTime = Math.max(
        0,
        Math.min(videoEl.duration || 0, videoEl.currentTime + seconds)
      );
      videoEl.currentTime = newTime;

      // Show seek tooltip
      seekTooltip.value = {
        visible: true,
        direction: seconds > 0 ? "forward" : "backward",
      };
      if (seekTooltipTimer) clearTimeout(seekTooltipTimer);
      seekTooltipTimer = setTimeout(() => {
        seekTooltip.value.visible = false;
      }, 600);
    };

    const setPlaybackSpeed = (speed: number) => {
      const videoEl = videoPlayer.value;
      if (!videoEl) return;
      videoEl.playbackRate = speed;
      playbackSpeed.value = speed;
      showSpeedMenu.value = false;
    };

    const toggleMute = () => {
      const videoEl = videoPlayer.value;
      if (!videoEl) return;
      videoEl.muted = !videoEl.muted;
      isMuted.value = videoEl.muted;
    };

    const toggleFullscreen = async () => {
      const container = videoContainer.value;
      if (!container) return;
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        isFullscreen.value = true;
      } else {
        await document.exitFullscreen();
        isFullscreen.value = false;
      }
    };

    // --- Video events ---
    const onTimeUpdate = () => {
      const videoEl = videoPlayer.value;
      if (!videoEl || isDraggingProgress.value) return;
      currentTime.value = videoEl.currentTime;
    };

    const onLoadedMetadata = () => {
      const videoEl = videoPlayer.value;
      if (!videoEl) return;
      duration.value = videoEl.duration;
    };

    const onPlay = () => {
      isPlaying.value = true;
      scheduleHideControls();
    };
    const onPause = () => {
      isPlaying.value = false;
      showControls();
    };
    const onEnded = () => {
      isPlaying.value = false;
      showControls();
    };
    const onWaiting = () => {
      isBuffering.value = true;
    };
    const onCanPlay = () => {
      isBuffering.value = false;
    };
    const onVolumeChange = () => {
      const videoEl = videoPlayer.value;
      if (!videoEl) return;
      volume.value = videoEl.volume;
      isMuted.value = videoEl.muted;
    };
    const onProgress = () => {
      const videoEl = videoPlayer.value;
      if (!videoEl || !videoEl.buffered.length) return;
      const end = videoEl.buffered.end(videoEl.buffered.length - 1);
      bufferedPercent.value = (end / (videoEl.duration || 1)) * 100;
    };

    const onVideoError = () => {
      const videoEl = videoPlayer.value;
      // Ignore non-fatal errors (e.g. play() interrupted by new load request)
      if (videoEl?.error) {
        const code = videoEl.error.code;
        // MEDIA_ERR_ABORTED (1) is typically the "play() interrupted" case
        if (code === MediaError.MEDIA_ERR_ABORTED) {
          console.warn("视频加载被中断，忽略此错误");
          return;
        }
      }
      videoError.value = "视频播放出错，请尝试重新加载";
      videoUrl.value = "";
      destroyHls();
    };

    // --- Controls visibility ---
    const showControls = () => {
      controlsVisible.value = true;
      if (controlsTimer) clearTimeout(controlsTimer);
      if (isPlaying.value) {
        controlsTimer = setTimeout(() => {
          controlsVisible.value = false;
        }, 3000);
      }
    };

    const scheduleHideControls = () => {
      if (controlsTimer) clearTimeout(controlsTimer);
      if (isPlaying.value) {
        controlsTimer = setTimeout(() => {
          controlsVisible.value = false;
        }, 3000);
      }
    };

    // --- Progress bar interactions ---
    const getProgressPercent = (e: MouseEvent): number => {
      const bar = progressBar.value;
      if (!bar) return 0;
      const rect = bar.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    };

    const startProgressDrag = (e: MouseEvent) => {
      isDraggingProgress.value = true;
      updateProgressFromMouse(e);

      const onMove = (ev: MouseEvent) => {
        updateProgressFromMouse(ev);
      };
      const onUp = () => {
        isDraggingProgress.value = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    const updateProgressFromMouse = (e: MouseEvent) => {
      const pct = getProgressPercent(e);
      const videoEl = videoPlayer.value;
      if (!videoEl) return;
      const newTime = pct * (videoEl.duration || 0);
      videoEl.currentTime = newTime;
      currentTime.value = newTime;
    };

    const onProgressHover = (e: MouseEvent) => {
      const bar = progressBar.value;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      progressHoverPos.value = x;
      hoverTimeText.value = formatTime(pct * duration.value);
    };

    // --- Volume slider interactions ---
    const startVolumeDrag = (e: MouseEvent) => {
      isDraggingVolume.value = true;
      updateVolumeFromMouse(e);

      const onMove = (ev: MouseEvent) => {
        updateVolumeFromMouse(ev);
      };
      const onUp = () => {
        isDraggingVolume.value = false;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    const updateVolumeFromMouse = (e: MouseEvent) => {
      const slider = volumeSlider.value;
      if (!slider) return;
      const rect = slider.getBoundingClientRect();
      // Volume slider is vertical: bottom = 0, top = 1
      const pct = Math.max(
        0,
        Math.min(1, (rect.bottom - e.clientY) / rect.height)
      );
      const videoEl = videoPlayer.value;
      if (!videoEl) return;
      videoEl.volume = pct;
      videoEl.muted = false;
      volume.value = pct;
      isMuted.value = false;
    };

    // --- Keyboard shortcuts ---
    const handleKeydown = (e: KeyboardEvent) => {
      // Prevent page scroll
      if (
        [
          "Space",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "KeyF",
          "KeyM",
        ].includes(e.code)
      ) {
        e.preventDefault();
      }

      switch (e.code) {
        case "Space":
          togglePlay();
          break;
        case "ArrowLeft":
          seek(-5);
          break;
        case "ArrowRight":
          seek(5);
          break;
        case "ArrowUp": {
          const videoEl = videoPlayer.value;
          if (videoEl) {
            videoEl.volume = Math.min(1, videoEl.volume + 0.05);
            videoEl.muted = false;
          }
          break;
        }
        case "ArrowDown": {
          const videoEl = videoPlayer.value;
          if (videoEl) {
            videoEl.volume = Math.max(0, videoEl.volume - 0.05);
          }
          break;
        }
        case "KeyF":
          toggleFullscreen();
          break;
        case "KeyM":
          toggleMute();
          break;
      }
      showControls();
    };

    // --- Fullscreen change listener ---
    const onFullscreenChange = () => {
      isFullscreen.value = !!document.fullscreenElement;
    };

    // --- Format time ---
    const formatTime = (seconds: number): string => {
      if (!seconds || isNaN(seconds)) return "0:00";
      const s = Math.floor(seconds);
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      if (h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${sec
          .toString()
          .padStart(2, "0")}`;
      }
      return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    // --- Lifecycle ---
    onMounted(() => {
      loadLesson();
      document.addEventListener("fullscreenchange", onFullscreenChange);
    });

    onBeforeUnmount(() => {
      destroyHls();
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (controlsTimer) clearTimeout(controlsTimer);
      if (seekTooltipTimer) clearTimeout(seekTooltipTimer);
    });

    return {
      lesson,
      loading,
      SVG_PATHS,
      videoUrl,
      videoLoading,
      videoError,
      videoPlayer,
      videoContainer,
      progressBar,
      volumeSlider,
      isPlaying,
      isBuffering,
      currentTime,
      duration,
      volume,
      isMuted,
      playbackSpeed,
      isFullscreen,
      controlsVisible,
      showVolumeSlider,
      showSpeedMenu,
      bufferedPercent,
      playedPercent,
      progressHoverPos,
      hoverTimeText,
      seekTooltip,
      speedOptions,
      loadVideoUrl,
      togglePlay,
      toggleMute,
      toggleFullscreen,
      setPlaybackSpeed,
      showControls,
      scheduleHideControls,
      startProgressDrag,
      onProgressHover,
      startVolumeDrag,
      handleKeydown,
      onTimeUpdate,
      onLoadedMetadata,
      onPlay,
      onPause,
      onEnded,
      onWaiting,
      onCanPlay,
      onVolumeChange,
      onProgress,
      onVideoError,
      formatTime,
    };
  },
});
</script>

<style scoped>
/* ===== Base Layout ===== */
.theory-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: #f8fafc;
  background-color: #0f172a;
  overflow-y: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 100px;
  color: #94a3b8;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lesson-content {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== Video Container ===== */
.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.04);
  cursor: pointer;
  outline: none;
  user-select: none;
}

.video-container.is-fullscreen {
  border-radius: 0;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
}

/* Hide native controls */
.video-player::-webkit-media-controls {
  display: none !important;
}

/* ===== Placeholders ===== */
.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b, #0f172a);
}

.video-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #94a3b8;
}

.video-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #f87171;
}

.icon-error {
  font-size: 2.5rem;
}

.icon-no-video {
  font-size: 2.5rem;
  opacity: 0.6;
}

.retry-btn {
  margin-top: 8px;
  padding: 8px 24px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.no-video {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
}

/* ===== Center Play Button ===== */
.center-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  cursor: pointer;
  z-index: 5;
  transition: transform 0.15s ease;
}

.center-play-btn:hover {
  transform: translate(-50%, -50%) scale(1.12);
}

.center-play-btn svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
}

/* ===== Buffering Indicator ===== */
.buffering-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.buffering-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.15);
  border-top-color: #00aeec;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ===== Seek Tooltip ===== */
.seek-tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 50%;
  pointer-events: none;
}

/* ===== Controls Bar ===== */
.controls-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    transparent,
    rgba(0, 0, 0, 0.75) 30%,
    rgba(0, 0, 0, 0.88)
  );
  padding: 20px 12px 8px;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  cursor: default;
}

.controls-visible .controls-bar,
.video-container:hover .controls-bar {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Progress Bar ===== */
.progress-bar-wrapper {
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: height 0.15s ease;
}

.progress-bar-wrapper:hover {
  height: 7px;
}

.progress-buffered {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  pointer-events: none;
}

.progress-played {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #00aeec, #00d4ff);
  border-radius: 2px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.progress-thumb {
  width: 14px;
  height: 14px;
  background: #00aeec;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 174, 236, 0.5);
  transform: translateX(50%) scale(0);
  transition: transform 0.15s ease;
}

.progress-bar-wrapper:hover .progress-thumb {
  transform: translateX(50%) scale(1);
}

.progress-hover-tooltip {
  position: absolute;
  top: -32px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}

/* ===== Controls Main ===== */
.controls-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ===== Control Buttons ===== */
.ctrl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
  padding: 0;
}

.ctrl-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.speed-btn {
  width: auto;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

/* ===== Time Display ===== */
.time-display {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.75);
  margin-left: 8px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  letter-spacing: 0.03em;
}

/* ===== Volume Control ===== */
.volume-control {
  position: relative;
}

.volume-slider-popup {
  position: absolute;
  bottom: 42px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 10px 8px;
  background: rgba(20, 20, 25, 0.94);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.volume-slider-track {
  width: 6px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
}

.volume-slider-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, #00aeec, #00d4ff);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.volume-slider-thumb {
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  transform: translateY(-50%);
  flex-shrink: 0;
}

.volume-value {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-variant-numeric: tabular-nums;
}

/* ===== Speed Menu ===== */
.speed-control {
  position: relative;
}

.speed-menu {
  position: absolute;
  bottom: 42px;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 6px 0;
  background: rgba(20, 20, 25, 0.94);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  min-width: 90px;
  overflow: hidden;
}

.speed-option {
  padding: 8px 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  text-align: center;
  transition: all 0.12s ease;
  white-space: nowrap;
}

.speed-option:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.speed-option.active {
  color: #00aeec;
  font-weight: 600;
}

/* ===== Lesson Details ===== */
.lesson-details {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
}

.lesson-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #f8fafc;
}

.lesson-desc {
  color: #cbd5e1;
  line-height: 1.6;
}

/* ===== Transitions ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.15s ease;
}

.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(6px) translateX(-50%);
}

/* Volume slider needs different transform origin */
.volume-slider-popup.slide-up-enter-from,
.volume-slider-popup.slide-up-leave-to {
  transform: translateX(-50%) translateY(6px);
}

.speed-menu.slide-up-enter-from,
.speed-menu.slide-up-leave-to {
  transform: translateY(6px);
}

/* ===== Cursor auto-hide in fullscreen ===== */
.video-container.is-fullscreen:not(.controls-visible) {
  cursor: none;
}
</style>
