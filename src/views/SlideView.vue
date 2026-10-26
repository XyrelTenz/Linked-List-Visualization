<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDeckStore } from '../stores/deck'
import { sound } from '../utils/sound'

import Slide1Title from '../components/slides/Slide1Title.vue'
import Slide2Anatomy from '../components/slides/Slide2Anatomy.vue'
import Slide3HowItWorks from '../components/slides/Slide3HowItWorks.vue'
import Slide4Types from '../components/slides/Slide4Types.vue'
import Slide5Operations from '../components/slides/Slide5Operations.vue'
import Slide6Benchmark from '../components/slides/Slide6Benchmark.vue'
import Slide7ProsCons from '../components/slides/Slide7ProsCons.vue'
import Slide8Applications from '../components/slides/Slide8Applications.vue'
import Slide9Complexity from '../components/slides/Slide9Complexity.vue'
import Slide10Summary from '../components/slides/Slide10Summary.vue'

const props = defineProps<{
  slideId: number
}>()

const router = useRouter()
const deckStore = useDeckStore()

const slideComponents: Record<number, any> = {
  1: Slide1Title,
  2: Slide2Anatomy,
  3: Slide3HowItWorks,
  4: Slide4Types,
  5: Slide5Operations,
  6: Slide6Benchmark,
  7: Slide7ProsCons,
  8: Slide8Applications,
  9: Slide9Complexity,
  10: Slide10Summary
}

const currentComponent = computed(() => {
  return slideComponents[props.slideId] || Slide1Title
})

// Sync URL param with Pinia Store
watch(
  () => props.slideId,
  (newId) => {
    const targetIdx = Math.max(0, Math.min(newId - 1, deckStore.totalSlides - 1))
    if (deckStore.currentSlideIndex !== targetIdx) {
      deckStore.setSlide(targetIdx, false)
    }
  },
  { immediate: true }
)

// When deckStore slide number changes (e.g. from Autoplay timer), sync Vue Router
watch(
  () => deckStore.currentSlideNumber,
  (newSlideNum) => {
    if (props.slideId !== newSlideNum) {
      router.push(`/slide/${newSlideNum}`)
    }
  }
)

// Keyboard navigation listener
function handleKeyDown(e: KeyboardEvent) {
  // Ignore keyboard shortcuts while the loading screen is active
  if (deckStore.isLoading) {
    return
  }

  // Ignore if user is currently typing in an input or textarea
  const target = e.target as HTMLElement
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
    return
  }

  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault()
    if (deckStore.nextSlide()) {
      router.push(`/slide/${deckStore.currentSlideNumber}`)
    }
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault()
    if (deckStore.prevSlide()) {
      router.push(`/slide/${deckStore.currentSlideNumber}`)
    }
  } else if (e.key === 'Home') {
    e.preventDefault()
    deckStore.setSlide(0)
    router.push('/slide/1')
  } else if (e.key === 'End') {
    e.preventDefault()
    deckStore.setSlide(deckStore.totalSlides - 1)
    router.push(`/slide/${deckStore.totalSlides}`)
  } else if (e.key === 'm' || e.key === 'M') {
    e.preventDefault()
    deckStore.toggleOverview()
  } else if (e.key === 'f' || e.key === 'F') {
    e.preventDefault()
    deckStore.togglePresentationMode()
  } else if (e.key === 'l' || e.key === 'L') {
    e.preventDefault()
    deckStore.toggleLaser()
  } else if (e.key === 'q' || e.key === 'Q') {
    e.preventDefault()
    sound.play('click')
    router.push('/quiz/1')
  } else if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    if (deckStore.isOverviewOpen) {
      deckStore.closeOverview()
      // If in presentation mode and browser dropped fullscreen, seamlessly restore it
      if (deckStore.isPresentationMode && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {})
      }
      return
    }
    if (deckStore.isPresentationMode) {
      deckStore.togglePresentationMode()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <main
    class="w-full mx-auto transition-all duration-300"
    :class="[
      deckStore.isCircleNavigating ? 'circle-slide-reveal' : '',
      deckStore.isPresentationMode
        ? 'ppt-stage max-w-[1480px] px-3 sm:px-8 py-2 sm:py-4 w-full my-auto'
        : 'max-w-6xl 2xl:max-w-7xl pb-28 pt-4 sm:pt-6 px-3 sm:px-6 min-h-[calc(100vh-3.5rem)]'
    ]"
    :style="deckStore.isCircleNavigating ? {
      '--circle-origin-x': `${deckStore.circleOrigin.x}px`,
      '--circle-origin-y': `${deckStore.circleOrigin.y}px`
    } : {}"
  >
    <!-- Active Slide Animated Container -->
    <transition
      name="slide-fade"
      mode="out-in"
    >
      <component :is="currentComponent" :key="slideId" />
    </transition>
  </main>
</template>

<style scoped>
/* Sidebar Circle Expand Transition for Slide Page */
.circle-slide-reveal {
  animation: circle-reveal-clip 0.58s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  will-change: clip-path;
}

@keyframes circle-reveal-clip {
  0% {
    clip-path: circle(0px at var(--circle-origin-x, 80%) var(--circle-origin-y, 50%));
  }
  100% {
    clip-path: circle(160vmax at var(--circle-origin-x, 80%) var(--circle-origin-y, 50%));
  }
}

/* PPT Presentation Mode: Responsive scaling to fill widescreen stage */
.ppt-stage {
  width: 100%;
}

@media (min-width: 1440px) and (min-height: 960px) {
  .ppt-stage {
    zoom: 1.08;
  }
}

@media (min-width: 1920px) and (min-height: 1080px) {
  .ppt-stage {
    zoom: 1.16;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
