<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDeckStore } from '../stores/deck'
import { sound } from '../utils/sound'
import {
  ArrowLeft,
  ArrowRight,
  ListFilter,
  Minimize2,
  Sparkles,
  Radio
} from 'lucide-vue-next'

const router = useRouter()
const deckStore = useDeckStore()

const mouseX = ref(-100)
const mouseY = ref(-100)

let idleTimeout: ReturnType<typeof setTimeout> | null = null
const showEntryToast = ref(true)

function handleMouseMove(e: MouseEvent) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY

  deckStore.isHudVisible = true
  if (idleTimeout) clearTimeout(idleTimeout)
  idleTimeout = setTimeout(() => {
    deckStore.isHudVisible = false
  }, 3500)
}

function onHudMouseEnter() {
  if (idleTimeout) clearTimeout(idleTimeout)
  deckStore.isHudVisible = true
}

function onHudMouseLeave() {
  if (idleTimeout) clearTimeout(idleTimeout)
  idleTimeout = setTimeout(() => {
    deckStore.isHudVisible = false
  }, 3000)
}

function handlePrev() {
  if (deckStore.prevSlide()) {
    router.push(`/slide/${deckStore.currentSlideNumber}`)
  }
}

function handleNext() {
  if (deckStore.nextSlide()) {
    router.push(`/slide/${deckStore.currentSlideNumber}`)
  }
}

function goToQuiz() {
  sound.play('click')
  router.push('/quiz/1')
}

const formattedIndex = computed(() => {
  const cur = String(deckStore.currentSlideNumber).padStart(2, '0')
  const tot = String(deckStore.totalSlides).padStart(2, '0')
  return `${cur} / ${tot}`
})

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove, { capture: true })
  setTimeout(() => {
    showEntryToast.value = false
  }, 3800)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove, { capture: true })
  if (idleTimeout) clearTimeout(idleTimeout)
  deckStore.isHudVisible = true
  deckStore.isLaserActive = false
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('laser-active')
  }
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
    <!-- Laser Pointer Dot teleported to body so it stays on top of drawers and modals -->
    <Teleport to="body">
      <div
        v-if="deckStore.isLaserActive"
        class="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[100000] transition-transform duration-75 select-none"
        :style="{ left: `${mouseX}px`, top: `${mouseY}px` }"
      >
        <div class="relative flex items-center justify-center pointer-events-none">
          <div class="absolute w-8 h-8 rounded-full bg-[#ff3d81] opacity-40 blur-md animate-ping pointer-events-none"></div>
          <div class="w-4 h-4 rounded-full bg-[#ff3d81] border-2 border-white shadow-[0_0_12px_#ff3d81] pointer-events-none"></div>
        </div>
      </div>
    </Teleport>

    <Transition name="toast-fade">
      <div
        v-if="showEntryToast"
        class="fixed top-3 left-1/2 -translate-x-1/2 pointer-events-auto bg-[#111111] text-[#ffffff] px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-white shadow-[3px_3px_0px_#111111] flex items-center justify-center gap-1.5 sm:gap-2.5 font-mono text-xs max-w-[calc(100vw-1.5rem)] text-center z-[1000]"
      >
        <span class="font-bold text-[#ffd23f] whitespace-nowrap">PRESENTATION MODE</span>
        <span class="text-neutral-300 hidden md:inline">|</span>
        <span class="text-neutral-300 text-[10px] sm:text-xs hidden sm:inline">
          Press <kbd class="px-1 py-0.5 bg-neutral-800 border border-neutral-600 text-white font-bold text-[10px]">F</kbd> or <kbd class="px-1 py-0.5 bg-neutral-800 border border-neutral-600 text-white font-bold text-[10px]">ESC</kbd> to exit • <kbd class="px-1 py-0.5 bg-neutral-800 border border-neutral-600 text-white font-bold text-[10px]">Q</kbd> for quiz
        </span>
      </div>
    </Transition>

    <Transition name="hud-slide">
      <div
        v-if="deckStore.isHudVisible"
        class="fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 pointer-events-auto z-[999] max-w-[calc(100vw-1rem)]"
        @mouseenter="onHudMouseEnter"
        @mouseleave="onHudMouseLeave"
      >
        <div
          class="bg-[#ffffff] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] px-2 sm:px-2.5 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-2 flex-nowrap"
        >
          <button
            type="button"
            :disabled="deckStore.currentSlideIndex === 0"
            class="brutal-btn bg-[#ffd23f] p-1.5 sm:px-3 sm:py-1.5 text-xs font-mono font-bold flex items-center gap-1 disabled:opacity-30 whitespace-nowrap flex-shrink-0"
            title="Previous Slide (Left Arrow)"
            @click="handlePrev"
          >
            <ArrowLeft class="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span class="hidden sm:inline">PREV</span>
          </button>

          <div class="px-2 sm:px-3 py-1 bg-[#111111] text-[#ffd23f] font-mono font-black text-xs sm:text-sm tracking-wider border border-black shadow-[1px_1px_0_#000] whitespace-nowrap flex-shrink-0">
            {{ formattedIndex }}
          </div>

          <button
            type="button"
            :disabled="deckStore.currentSlideIndex === deckStore.totalSlides - 1"
            class="brutal-btn bg-[#3ddc97] p-1.5 sm:px-3 sm:py-1.5 text-xs font-mono font-bold flex items-center gap-1 disabled:opacity-30 whitespace-nowrap flex-shrink-0"
            title="Next Slide (Right Arrow / Space)"
            @click="handleNext"
          >
            <span class="hidden sm:inline">NEXT</span>
            <ArrowRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>

          <div class="w-0.5 h-5 sm:h-6 bg-[#111111] mx-0.5 flex-shrink-0"></div>

          <button
            type="button"
            class="brutal-btn p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-mono font-bold flex items-center gap-1 transition-colors whitespace-nowrap flex-shrink-0"
            :class="deckStore.isLaserActive ? 'bg-[#ff3d81] text-white' : 'bg-white hover:bg-neutral-100'"
            title="Toggle Laser Pointer (L)"
            @click="deckStore.toggleLaser"
          >
            <Radio class="w-3.5 h-3.5" :class="deckStore.isLaserActive ? 'animate-pulse' : ''" />
            <span class="hidden md:inline">LASER</span>
          </button>

          <button
            type="button"
            class="brutal-btn bg-white hover:bg-[#ffd23f] p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-mono font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0"
            title="Open Slide Menu (M)"
            @click="deckStore.toggleOverview"
          >
            <ListFilter class="w-3.5 h-3.5" />
            <span class="hidden md:inline">MENU</span>
          </button>

          <button
            type="button"
            class="hidden sm:flex brutal-btn bg-[#ff3d81] text-white p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-mono font-bold items-center gap-1 whitespace-nowrap flex-shrink-0"
            title="Take Linked List Quiz (Q)"
            @click="goToQuiz"
          >
            <Sparkles class="w-3.5 h-3.5 fill-white text-white" />
            <span class="hidden md:inline">QUIZ</span>
          </button>

          <button
            type="button"
            class="brutal-btn bg-[#ff6b5e] text-black p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-mono font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0"
            title="Exit Presentation Mode (F / ESC)"
            @click="deckStore.togglePresentationMode"
          >
            <Minimize2 class="w-3.5 h-3.5 stroke-[2.5]" />
            <span class="hidden sm:inline">EXIT PPT</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}

.hud-slide-enter-active,
.hud-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.hud-slide-enter-from,
.hud-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 15px);
}
</style>
