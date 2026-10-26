<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useDeckStore } from '../stores/deck'
import { X, Sparkles } from 'lucide-vue-next'
import BrutalBadge from './common/BrutalBadge.vue'
import { sound } from '../utils/sound'

const router = useRouter()
const deckStore = useDeckStore()

const focusedIndex = ref<number>(deckStore.currentSlideIndex)
const slideItemRefs = ref<HTMLElement[]>([])

watch(
  () => deckStore.isOverviewOpen,
  (open) => {
    if (open) {
      focusedIndex.value = deckStore.currentSlideIndex
      nextTick(() => {
        scrollFocusedIntoView()
      })
    }
  },
)

function scrollFocusedIntoView() {
  const el = slideItemRefs.value[focusedIndex.value]
  if (el) {
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
}

function handleDrawerKeyDown(e: KeyboardEvent) {
  if (!deckStore.isOverviewOpen) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    focusedIndex.value = (focusedIndex.value + 1) % deckStore.slides.length
    sound.play('step')
    scrollFocusedIntoView()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    focusedIndex.value =
      (focusedIndex.value - 1 + deckStore.slides.length) % deckStore.slides.length
    sound.play('step')
    scrollFocusedIntoView()
  } else if (e.key === 'Enter') {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    selectSlide(focusedIndex.value)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleDrawerKeyDown, true) // capture phase
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleDrawerKeyDown, true)
})

function selectSlide(idx: number, event?: MouseEvent) {
  sound.play('click')

  // Calculate click coordinates for circular expanding page reveal
  let x = window.innerWidth * 0.8
  let y = window.innerHeight * 0.5
  if (event && event.clientX && event.clientY) {
    x = event.clientX
    y = event.clientY
  } else {
    // If selected via Enter key, use the focused item's position
    const el = slideItemRefs.value[idx]
    if (el) {
      const rect = el.getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }
  }

  const slide = deckStore.slides[idx]
  const colorMap: Record<string, string> = {
    pink: '#ff3d81',
    yellow: '#ffd23f',
    mint: '#3ddc97',
    lilac: '#c8a2ff',
    coral: '#ff6b5e',
  }
  const slideColor = slide ? colorMap[slide.color] || '#ffd23f' : '#ffd23f'

  deckStore.triggerCircleNav(idx, x, y, slideColor)
  router.push(`/slide/${idx + 1}`)
  deckStore.closeOverview()

  if (deckStore.isPresentationMode && !document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
  }
}

function handleClose() {
  sound.play('click')
  deckStore.closeOverview()
  if (deckStore.isPresentationMode && !document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
  }
}

function openQuizView() {
  sound.play('click')
  deckStore.closeOverview()
  router.push('/quiz/1')
}
</script>

<template>
  <Transition name="curtain-drawer">
    <div
      v-if="deckStore.isOverviewOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px] flex justify-end overflow-hidden"
      @click.self="handleClose"
    >
      <!-- Shadow wrapper so drop-shadow tracks the animated curtain boundary -->
      <div class="drawer-curtain-wrapper h-full w-full max-w-full md:max-w-md flex justify-end">
        <!-- Entire Sidebar Curtain Panel: Fullscreen without gaps on small screens, drawer on desktop -->
        <div
          class="drawer-panel w-full bg-[#fdf9f0] border-l-0 md:border-l-4 border-[#111111] h-full overflow-y-auto p-3.5 sm:p-5 flex flex-col select-none relative"
        >
          <!-- Top Header: Shortcuts on left + Close & Quiz buttons on right -->
          <div class="drawer-header flex items-center justify-between pb-2 mb-2 flex-shrink-0 border-b border-[#111111]/15">
            <!-- Desktop Keyboard Navigation Hints -->
            <div class="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-neutral-600">
              <span class="flex items-center gap-1">
                <kbd
                  class="px-1 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-[9px] font-bold text-black"
                  >↑</kbd
                >
                <kbd
                  class="px-1 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-[9px] font-bold text-black"
                  >↓</kbd
                >
                navigate
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <kbd
                  class="px-1 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-[9px] font-bold text-black"
                  >ENTER</kbd
                >
                select
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <kbd
                  class="px-1 py-0.5 bg-white border border-black shadow-[1px_1px_0_#000] text-[9px] font-bold text-black"
                  >ESC</kbd
                >
                close
              </span>
            </div>

            <div class="flex items-center gap-1.5 ml-auto">
              <!-- Quiz Button: ONLY shown on small screen, NEVER on large screen -->
              <button
                type="button"
                class="sm:hidden brutal-btn bg-[#ff3d81] text-white px-2.5 py-1 text-xs font-mono font-bold flex items-center gap-1 shadow-[2px_2px_0_#111]"
                title="Open Quiz (Q)"
                @click="openQuizView"
              >
                <Sparkles class="w-3.5 h-3.5 fill-white text-white" />
                <span>QUIZ</span>
              </button>

              <!-- Close Button with Neubrutal hover/active -->
              <button
                type="button"
                class="brutal-btn bg-[#ff6b5e] p-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_#111111]"
                title="Close Drawer (Esc)"
                @click="handleClose"
              >
                <X class="w-4 h-4 text-black stroke-[2.5]" />
              </button>
            </div>
          </div>

          <!-- Slide List: Allocates all remaining vertical space evenly -->
          <div class="flex-1 flex flex-col justify-between gap-1.5 sm:gap-2 min-h-0">
            <div
              v-for="(slide, index) in deckStore.slides"
              :key="slide.id"
              :ref="
                (el) => {
                  if (el) slideItemRefs[index] = el as HTMLElement
                }
              "
              class="slide-item border-2 border-[#111111] px-3 py-2 cursor-pointer transition-all flex items-center gap-2.5 select-none group flex-1 min-h-[44px]"
              :style="{ '--curtain-delay': `${(Math.abs(index - 4.5) * 0.045).toFixed(3)}s` }"
              :class="[
                focusedIndex === index
                  ? 'bg-[#ffd23f] shadow-[4px_4px_0px_#111111] translate-x-[-2px] translate-y-[-2px] ring-2 ring-black'
                  : deckStore.currentSlideIndex === index
                    ? 'bg-[#fff0a6] shadow-[3px_3px_0px_#111111] translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-white hover:bg-[#fff9e6] shadow-[2px_2px_0px_#111111] hover:shadow-[4px_4px_0px_#111111] hover:-translate-x-0.5',
              ]"
              @click="selectSlide(index, $event)"
              @mouseenter="focusedIndex = index"
            >
              <!-- Number badge -->
              <div
                class="w-7 h-7 flex-shrink-0 flex items-center justify-center font-display text-xs border-2 border-[#111111] shadow-[1px_1px_0px_#111]"
                :class="
                  focusedIndex === index || deckStore.currentSlideIndex === index
                    ? 'bg-[#ff3d81] text-white'
                    : 'bg-[#fdf9f0] text-black group-hover:bg-[#ffd23f]'
                "
              >
                {{ String(index + 1).padStart(2, '0') }}
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1 mb-0.5">
                  <h4 class="font-display text-xs sm:text-sm truncate uppercase leading-tight">
                    {{ slide.title }}
                  </h4>
                  <BrutalBadge :variant="slide.color" size="sm">
                    {{ slide.badge }}
                  </BrutalBadge>
                </div>
                <p class="font-body text-xs text-neutral-700 line-clamp-1">
                  {{ slide.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Backdrop fade animation */
.curtain-drawer-enter-active {
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.curtain-drawer-leave-active {
  transition: opacity 0.28s ease-in;
}

.curtain-drawer-enter-from,
.curtain-drawer-leave-to {
  opacity: 0;
}

/* Shadow wrapper: Drop shadow tracks the curtain contour on desktop */
@media (min-width: 768px) {
  .drawer-curtain-wrapper {
    filter: drop-shadow(-10px 0px 0px #111111);
  }
}

/* Whole Sidebar Curtain Animation (Middle leads first, top & bottom lag, then bounces) */
.curtain-drawer-enter-active .drawer-panel {
  animation: whole-sidebar-curtain-in 0.72s cubic-bezier(0.16, 0.9, 0.3, 1.1) both;
  transform-origin: right center;
  will-change: transform, clip-path;
}

.curtain-drawer-leave-active .drawer-panel {
  animation: whole-sidebar-curtain-out 0.3s cubic-bezier(0.55, 0, 0.1, 1) both;
  transform-origin: right center;
  will-change: transform, clip-path;
}

/* Whole-Sidebar Curtain Morph Keyframes */
@keyframes whole-sidebar-curtain-in {
  0% {
    transform: translateX(100%);
    clip-path: polygon(100% 0%, 100% 100%, 100% 100%, 100% 75%, 100% 50%, 100% 25%, 100% 0%);
  }
  30% {
    /* Middle shoots out FIRST to 0%, top and bottom are held back at 65% */
    transform: translateX(18%);
    clip-path: polygon(100% 0%, 100% 100%, 65% 100%, 35% 75%, 0% 50%, 35% 25%, 65% 0%);
  }
  50% {
    /* Middle overshoots to the left, top & bottom catch up rapidly */
    transform: translateX(-26px);
    clip-path: polygon(100% 0%, 100% 100%, 25% 100%, 8% 75%, 0% 50%, 8% 25%, 25% 0%);
  }
  70% {
    /* Top & bottom whip forward and bounce, middle rebounds */
    transform: translateX(12px);
    clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 75%, 3% 50%, 0% 25%, 0% 0%);
  }
  86% {
    /* Counter-bounce oscillation */
    transform: translateX(-4px);
    clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 75%, 0% 50%, 0% 25%, 0% 0%);
  }
  100% {
    /* Fully rectangular and settled */
    transform: translateX(0);
    clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 75%, 0% 50%, 0% 25%, 0% 0%);
  }
}

@keyframes whole-sidebar-curtain-out {
  0% {
    transform: translateX(0);
    clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 0% 75%, 0% 50%, 0% 25%, 0% 0%);
  }
  30% {
    /* Middle pulls back first into the curtain fold */
    transform: translateX(20%);
    clip-path: polygon(100% 0%, 100% 100%, 15% 100%, 35% 75%, 55% 50%, 35% 25%, 15% 0%);
  }
  100% {
    transform: translateX(105%);
    clip-path: polygon(100% 0%, 100% 100%, 100% 100%, 100% 75%, 100% 50%, 100% 25%, 100% 0%);
  }
}

/* Staggered cascade for internal items mirroring the curtain wave */
.curtain-drawer-enter-active .slide-item {
  animation: curtain-inner-bounce 0.52s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: calc(0.12s + var(--curtain-delay, 0s));
}

@keyframes curtain-inner-bounce {
  0% {
    opacity: 0;
    transform: translateX(65px);
  }
  55% {
    opacity: 1;
    transform: translateX(-16px);
  }
  78% {
    transform: translateX(6px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.curtain-drawer-enter-active .drawer-header {
  animation: curtain-inner-bounce 0.52s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: 0.32s;
}
</style>
