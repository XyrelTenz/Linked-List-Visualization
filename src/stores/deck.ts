import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SlideMeta } from '../types/deck'
import { sound } from '../utils/sound'

export const SLIDES: SlideMeta[] = [
  {
    id: 1,
    slug: 'intro',
    title: 'I. INTRODUCTION',
    shortTitle: 'I. Introduction',
    badge: 'FOUNDATION',
    color: 'pink',
    description: 'Definition, Scavenger Hunt Analogy & Dynamic Heap'
  },
  {
    id: 2,
    slug: 'anatomy',
    title: 'II. BASIC COMPONENTS',
    shortTitle: 'II. Basic Components',
    badge: 'ARCHITECTURE',
    color: 'yellow',
    description: 'Node, Data, Pointer, Head, Tail & Null explained'
  },
  {
    id: 3,
    slug: 'how-it-works',
    title: 'III. HOW IT WORKS',
    shortTitle: 'III. How It Works',
    badge: 'MEMORY MODEL',
    color: 'mint',
    description: 'Node chain, non-contiguous heap & step traversal'
  },
  {
    id: 4,
    slug: 'types',
    title: 'IV. TYPES OF LINKED LISTS',
    shortTitle: 'IV. Types of Lists',
    badge: 'TAXONOMY',
    color: 'lilac',
    description: 'Singly, Doubly, Circular Singly & Circular Doubly'
  },
  {
    id: 5,
    slug: 'operations',
    title: 'V. BASIC OPERATIONS',
    shortTitle: 'V. Operations Lab',
    badge: 'INTERACTIVE LAB',
    color: 'coral',
    description: 'Traversal, Insertion, Deletion, Search, Update & Reverse'
  },
  {
    id: 6,
    slug: 'benchmark',
    title: 'VI. LINKED LIST VS ARRAY',
    shortTitle: 'VI. List vs Array',
    badge: 'PERFORMANCE',
    color: 'pink',
    description: 'Memory allocation, index access & cache locality'
  },
  {
    id: 7,
    slug: 'pros-cons',
    title: 'VII. PROS & CONS',
    shortTitle: 'VII. Pros & Cons',
    badge: 'EVALUATION',
    color: 'mint',
    description: 'Advantages vs Disadvantages in modern engineering'
  },
  {
    id: 8,
    slug: 'applications',
    title: 'VIII. APPLICATIONS',
    shortTitle: 'VIII. Applications',
    badge: 'PRACTICE',
    color: 'yellow',
    description: 'Music queues, browser history, undo/redo & OS freelists'
  },
  {
    id: 9,
    slug: 'complexity',
    title: 'IX. TIME COMPLEXITY',
    shortTitle: 'IX. Time Complexity',
    badge: 'BIG-O MATRIX',
    color: 'lilac',
    description: 'Time & space bounds for all operations and pointers'
  },
  {
    id: 10,
    slug: 'summary',
    title: 'X. CONCLUSION',
    shortTitle: 'X. Conclusion',
    badge: 'MASTERY',
    color: 'coral',
    description: 'Summary, DSA importance & when to choose linked lists'
  }
]

function checkInitialLoading(): boolean {
  if (typeof window === 'undefined') return false

  try {
    // If the app has already completed initial loading in this browser session, do not show again on reload
    if (sessionStorage.getItem('visual_linkedlist_loaded') === 'true') {
      return false
    }

    // If the user directly navigates to or reloads a specific route (e.g. /slide/5, /quiz, etc.),
    // bypass the loading screen so the route is rendered immediately.
    const path = window.location.pathname.replace(/\/+$/, '')
    if (path && path !== '' && path !== '/' && path !== '/slide/1') {
      sessionStorage.setItem('visual_linkedlist_loaded', 'true')
      return false
    }
  } catch {
    // fallback if sessionStorage is inaccessible
  }

  return true
}

export const useDeckStore = defineStore('deck', () => {
  const slides = ref<SlideMeta[]>(SLIDES)
  const currentSlideIndex = ref<number>(0)
  const isOverviewOpen = ref<boolean>(false)
  const isQuizOpen = ref<boolean>(false)
  const isAutoPlaying = ref<boolean>(false)
  const autoPlayTimer = ref<ReturnType<typeof setInterval> | null>(null)
  const autoPlaySeconds = ref<number>(5)
  const autoPlayCountdown = ref<number>(5)
  const soundEnabled = ref<boolean>(true)
  const isFullscreen = ref<boolean>(false)
  const isPresentationMode = ref<boolean>(false)
  const isLaserActive = ref<boolean>(false)
  const isLoading = ref<boolean>(checkInitialLoading())
  const isHudVisible = ref<boolean>(true)

  // Sidebar circle expand navigation transition state
  const isCircleNavigating = ref<boolean>(false)
  const circleOrigin = ref<{ x: number; y: number }>({ x: 0, y: 0 })
  const circleColor = ref<string>('#ffd23f')
  const circleSlideNumber = ref<number>(1)
  let circleNavTimer: ReturnType<typeof setTimeout> | null = null

  // Listen to native browser fullscreen changes
  if (typeof document !== 'undefined') {
    document.addEventListener('fullscreenchange', () => {
      isFullscreen.value = !!document.fullscreenElement
      // Do NOT exit presentation mode if the sidebar overview or quiz is open!
      // When Esc is pressed while overview/quiz is open, it should only close overview/quiz.
      if (!document.fullscreenElement && isPresentationMode.value) {
        if (isOverviewOpen.value || isQuizOpen.value) {
          return
        }
        isPresentationMode.value = false
      }
    })
  }

  const totalSlides = computed(() => slides.value.length)
  const currentSlide = computed(() => slides.value[currentSlideIndex.value] || slides.value[0])
  const currentSlideNumber = computed(() => currentSlideIndex.value + 1)
  const progressPercent = computed(() => ((currentSlideIndex.value + 1) / totalSlides.value) * 100)

  function setSlide(index: number, playAudio = true) {
    if (index >= 0 && index < totalSlides.value) {
      if (currentSlideIndex.value !== index && playAudio) {
        sound.play('whoosh')
      }
      currentSlideIndex.value = index
    }
  }

  function nextSlide() {
    if (currentSlideIndex.value < totalSlides.value - 1) {
      setSlide(currentSlideIndex.value + 1)
      return true
    }
    return false
  }

  function prevSlide() {
    if (currentSlideIndex.value > 0) {
      setSlide(currentSlideIndex.value - 1)
      return true
    }
    return false
  }

  function toggleOverview() {
    isOverviewOpen.value = !isOverviewOpen.value
    sound.play('click')
  }

  function closeOverview() {
    isOverviewOpen.value = false
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    sound.setEnabled(soundEnabled.value)
    if (soundEnabled.value) {
      sound.play('success')
    }
  }

  function toggleAutoPlay() {
    isAutoPlaying.value = !isAutoPlaying.value
    sound.play('click')
    if (isAutoPlaying.value) {
      startAutoPlay()
    } else {
      stopAutoPlay()
    }
  }

  function startAutoPlay() {
    stopAutoPlay()
    isAutoPlaying.value = true
    autoPlayCountdown.value = autoPlaySeconds.value
    autoPlayTimer.value = setInterval(() => {
      if (autoPlayCountdown.value > 1) {
        autoPlayCountdown.value--
      } else {
        autoPlayCountdown.value = autoPlaySeconds.value
        const moved = nextSlide()
        if (!moved) {
          // loop back to slide 1
          setSlide(0)
        }
      }
    }, 1000)
  }

  function stopAutoPlay() {
    if (autoPlayTimer.value) {
      clearInterval(autoPlayTimer.value)
      autoPlayTimer.value = null
    }
    isAutoPlaying.value = false
    autoPlayCountdown.value = autoPlaySeconds.value
  }

  function togglePresentationMode() {
    sound.play('click')
    isPresentationMode.value = !isPresentationMode.value

    if (isPresentationMode.value) {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          isFullscreen.value = true
        }).catch(() => {})
      }
    } else {
      isLaserActive.value = false
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('laser-active')
      }
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          isFullscreen.value = false
        }).catch(() => {})
      }
    }
  }

  function toggleLaser() {
    sound.play('click')
    isLaserActive.value = !isLaserActive.value
  }

  function triggerCircleNav(idx: number, x: number, y: number, color = '#ffd23f') {
    if (circleNavTimer) clearTimeout(circleNavTimer)

    setSlide(idx, false)
    sound.play('whoosh')

    circleOrigin.value = { x, y }
    circleColor.value = color
    circleSlideNumber.value = idx + 1
    isCircleNavigating.value = true

    circleNavTimer = setTimeout(() => {
      isCircleNavigating.value = false
      circleNavTimer = null
    }, 620)
  }

  function toggleFullscreen() {
    togglePresentationMode()
  }

  function toggleQuiz() {
    isQuizOpen.value = !isQuizOpen.value
    if (isQuizOpen.value) {
      sound.play('tada')
    } else {
      sound.play('click')
    }
  }

  function openQuiz() {
    isQuizOpen.value = true
    sound.play('tada')
  }

  function closeQuiz() {
    isQuizOpen.value = false
    sound.play('click')
  }

  return {
    slides,
    currentSlideIndex,
    currentSlide,
    currentSlideNumber,
    totalSlides,
    progressPercent,
    isOverviewOpen,
    isQuizOpen,
    isAutoPlaying,
    autoPlaySeconds,
    autoPlayCountdown,
    soundEnabled,
    isFullscreen,
    isPresentationMode,
    isLaserActive,
    isLoading,
    isHudVisible,
    isCircleNavigating,
    circleOrigin,
    circleColor,
    circleSlideNumber,
    triggerCircleNav,
    setSlide,
    nextSlide,
    prevSlide,
    toggleOverview,
    closeOverview,
    toggleQuiz,
    openQuiz,
    closeQuiz,
    toggleSound,
    toggleAutoPlay,
    stopAutoPlay,
    toggleFullscreen,
    togglePresentationMode,
    toggleLaser
  }
})
