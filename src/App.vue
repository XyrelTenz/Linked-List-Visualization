<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDeckStore } from './stores/deck'
import HeaderBar from './components/HeaderBar.vue'
import BottomControls from './components/BottomControls.vue'
import OverviewDrawer from './components/OverviewDrawer.vue'
import LoadingScreen from './components/common/LoadingScreen.vue'
import PresenterHUD from './components/PresenterHUD.vue'

const route = useRoute()
const deckStore = useDeckStore()

const isQuizRoute = computed(() => route.path.startsWith('/quiz'))

watch(
  () => deckStore.isLaserActive,
  (active) => {
    if (typeof document !== 'undefined') {
      if (active) {
        document.documentElement.classList.add('laser-active')
      } else {
        document.documentElement.classList.remove('laser-active')
      }
    }
  },
  { immediate: true }
)

function onLoadingFinished() {
  try {
    sessionStorage.setItem('visual_linkedlist_loaded', 'true')
  } catch {}
  setTimeout(() => {
    deckStore.isLoading = false
  }, 100)
}
</script>

<template>
  <div
    class="min-h-screen candy-grid-bg text-[#111111] flex flex-col font-body selection:bg-[#ff3d81] selection:text-white relative"
  >
    <LoadingScreen v-if="deckStore.isLoading" @finished="onLoadingFinished" />

    <HeaderBar v-if="!deckStore.isPresentationMode && !isQuizRoute" />

    <div
      class="flex-1 w-full transition-all duration-300"
      :class="[
        isQuizRoute
          ? 'overflow-x-hidden'
          : deckStore.isPresentationMode
            ? [
                'flex flex-col items-center px-2 sm:px-6 select-none h-screen overflow-y-auto overflow-x-hidden',
                deckStore.isHudVisible ? 'pb-28 sm:pb-32 pt-3 sm:pt-6' : 'pb-8 sm:pb-12 pt-3 sm:pt-6'
              ]
            : 'overflow-x-hidden'
      ]"
    >
      <router-view />
    </div>

    <div
      v-if="deckStore.isCircleNavigating"
      class="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
    >
      <div
        class="circle-nav-ring absolute rounded-full"
        :style="{
          left: `${deckStore.circleOrigin.x}px`,
          top: `${deckStore.circleOrigin.y}px`,
          '--ring-accent': deckStore.circleColor
        }"
      ></div>

      <div
        class="circle-nav-badge absolute font-display uppercase border-2 border-black shadow-[3px_3px_0px_#111] px-3 py-1 text-xs sm:text-sm tracking-wider"
        :style="{
          left: `${deckStore.circleOrigin.x}px`,
          top: `${deckStore.circleOrigin.y}px`,
          backgroundColor: deckStore.circleColor
        }"
      >
        SLIDE {{ String(deckStore.circleSlideNumber).padStart(2, '0') }}
      </div>
    </div>

    <BottomControls v-if="!deckStore.isPresentationMode && !isQuizRoute" />

    <PresenterHUD v-if="deckStore.isPresentationMode && !isQuizRoute" />

    <OverviewDrawer />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #fdf9f0;
}

html.laser-active,
html.laser-active *,
body.laser-active,
body.laser-active * {
  cursor: none !important;
}

.circle-nav-ring {
  transform: translate(-50%, -50%);
  border: 4px solid #111111;
  box-shadow:
    0 0 0 6px var(--ring-accent, #ffd23f),
    0 0 0 10px #111111,
    0 0 40px rgba(0, 0, 0, 0.35);
  animation: circle-ring-expand 0.58s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  will-change: width, height, opacity;
  pointer-events: none;
}

@keyframes circle-ring-expand {
  0% {
    width: 0px;
    height: 0px;
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    width: 320vmax;
    height: 320vmax;
    opacity: 0;
  }
}

.circle-nav-badge {
  transform: translate(-50%, -50%);
  animation: circle-badge-pop 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  will-change: transform, opacity;
  pointer-events: none;
}

@keyframes circle-badge-pop {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 0;
  }
  30% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 1;
  }
  65% {
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}
</style>
