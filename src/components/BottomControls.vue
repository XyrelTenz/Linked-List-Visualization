<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDeckStore } from '../stores/deck'
import { ArrowLeft, ArrowRight, Grid } from 'lucide-vue-next'

const router = useRouter()
const deckStore = useDeckStore()

const formattedIndex = computed(() => {
  const cur = String(deckStore.currentSlideNumber).padStart(2, '0')
  const tot = String(deckStore.totalSlides).padStart(2, '0')
  return `${cur} / ${tot}`
})

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

function handleGoTo(idx: number) {
  deckStore.setSlide(idx)
  router.push(`/slide/${deckStore.currentSlideNumber}`)
}
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 z-30 pointer-events-none pb-4 pt-2">
    <div class="max-w-5xl mx-auto px-4 pointer-events-auto">
      <div class="bg-white border-2 border-[#111111] shadow-[6px_6px_0px_#111111] p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:gap-4">
        <!-- Left: Previous Button -->
        <button
          type="button"
          :disabled="deckStore.currentSlideIndex === 0"
          class="brutal-btn bg-[#ffd23f] px-3 sm:px-5 py-2 flex items-center gap-2 text-xs sm:text-sm font-display uppercase disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          @click="handlePrev"
        >
          <ArrowLeft class="w-4 h-4 stroke-[2.5]" />
          <span class="hidden sm:inline">PREV</span>
        </button>

        <!-- Center: Slide Mini-Steps & Active Pill -->
        <div class="flex items-center gap-1.5 sm:gap-3 overflow-hidden">
          <!-- Active slide pill -->
          <div class="px-3 sm:px-4 py-1.5 bg-[#111111] text-[#ffffff] font-mono font-bold text-xs sm:text-sm tracking-widest border border-black shadow-[2px_2px_0px_#111]">
            <span class="text-[#ffd23f]">{{ formattedIndex }}</span>
          </div>

          <!-- 10 mini dot/block indicators (interactive) -->
          <div class="hidden md:flex items-center gap-1.5">
            <button
              v-for="(s, i) in deckStore.slides"
              :key="s.id"
              type="button"
              :title="`Jump to ${s.title}`"
              class="h-6 transition-all duration-150 border border-[#111111] cursor-pointer flex items-center justify-center font-mono text-[10px] font-bold"
              :class="[
                deckStore.currentSlideIndex === i
                  ? 'w-7 bg-[#ff3d81] text-white shadow-[2px_2px_0_#111]'
                  : 'w-4 bg-[#fdf9f0] text-[#111111]/70 hover:bg-[#ffd23f] hover:w-6'
              ]"
              @click="handleGoTo(i)"
            >
              <span v-if="deckStore.currentSlideIndex === i || deckStore.slides.length < 8">{{ i + 1 }}</span>
            </button>
          </div>
        </div>

        <!-- Right: Next / Complete Button -->
        <button
          type="button"
          :disabled="deckStore.currentSlideIndex === deckStore.totalSlides - 1"
          class="brutal-btn bg-[#3ddc97] px-3 sm:px-5 py-2 flex items-center gap-2 text-xs sm:text-sm font-display uppercase disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          @click="handleNext"
        >
          <span class="hidden sm:inline">{{ deckStore.currentSlideIndex === deckStore.totalSlides - 1 ? 'FINISHED' : 'NEXT' }}</span>
          <ArrowRight class="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  </footer>
</template>
