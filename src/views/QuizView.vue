<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDeckStore } from '../stores/deck'
import { sound } from '../utils/sound'
import confetti from 'canvas-confetti'
import { QUIZ_QUESTIONS, type QuizQuestion } from '../data/quizQuestions'
import BrutalBadge from '../components/common/BrutalBadge.vue'
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  X,
  Clock,
  AlertTriangle,
  HelpCircle,
  Maximize2,
  Minimize2,
  Award,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-vue-next'

const props = defineProps<{
  questionId: number
}>()

const router = useRouter()
const route = useRoute()
const deckStore = useDeckStore()

// Fullscreen state
const isFullscreen = ref<boolean>(false)

function checkFullscreen() {
  isFullscreen.value = !!document.fullscreenElement
}

function toggleFullscreen() {
  sound.play('click')
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch(() => {})
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen.value = false
      }).catch(() => {})
    }
  }
}

// Current Question ID (reactive from route and props, 1..15)
const currentId = computed<number>(() => {
  const paramVal = parseInt(route.params.id as string, 10)
  const val = !isNaN(paramVal) && paramVal > 0 ? paramVal : Number(props.questionId) || 1
  return Math.max(1, Math.min(val, QUIZ_QUESTIONS.length))
})

const question = computed(() => {
  return (QUIZ_QUESTIONS[currentId.value - 1] || QUIZ_QUESTIONS[0]) as QuizQuestion
})

// 20-Second Countdown Timer
const TIMER_START = 20
const timeLeft = ref<number>(TIMER_START)
// When opening quiz, it should NOT start directly; starts in paused / start mode
const isPaused = ref<boolean>(true)
const hasStartedQuiz = ref<boolean>(false)
let timerInterval: ReturnType<typeof setInterval> | null = null

// Animated "QUIZ TIME!" Splash on trigger (Exact replica of earlier animation)
const showSplash = ref<boolean>(false)
let splashTimeout: ReturnType<typeof setTimeout> | null = null

function triggerQuizTimeSplash() {
  showSplash.value = true
  sound.play('tada')

  try {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#ff3d81', '#ffd23f', '#3ddc97', '#c8a2ff', '#111111']
    })
  } catch {
    // fallback if confetti fails
  }

  if (splashTimeout) clearTimeout(splashTimeout)
  splashTimeout = setTimeout(() => {
    showSplash.value = false
  }, 1700)
}

function dismissSplash() {
  showSplash.value = false
  if (splashTimeout) clearTimeout(splashTimeout)
}

// Ending / Time's Up Modal Animation when all 15 questions complete
const showEndingModal = ref<boolean>(false)
const showAnswerKey = ref<boolean>(false)

function triggerEndingModal() {
  stopTimer()
  showEndingModal.value = true
  sound.play('tada')

  try {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.4 },
      colors: ['#3ddc97', '#ffd23f', '#ff3d81', '#c8a2ff', '#111111']
    })
  } catch {}
}

function closeEndingModal() {
  showEndingModal.value = false
}

function restartQuiz() {
  sound.play('click')
  showEndingModal.value = false
  hasStartedQuiz.value = false
  isPaused.value = true
  goToQuestion(1)
  resetTimer()
}

// Timer Controls
function startTimer() {
  stopTimer()
  timerInterval = setInterval(() => {
    if (isPaused.value) return

    if (timeLeft.value > 1) {
      timeLeft.value--
      if (timeLeft.value <= 5) {
        sound.play('tick')
      }
    } else if (timeLeft.value === 1) {
      timeLeft.value = 0
      sound.play('buzzer')
      stopTimer()

      // When time's up for question, proceed directly to next slide!
      if (currentId.value === QUIZ_QUESTIONS.length) {
        setTimeout(() => {
          triggerEndingModal()
        }, 500)
      } else {
        setTimeout(() => {
          handleNext()
        }, 500)
      }
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function resetTimer() {
  sound.play('click')
  timeLeft.value = TIMER_START
  if (hasStartedQuiz.value) {
    isPaused.value = false
    startTimer()
  } else {
    isPaused.value = true
  }
}

function togglePause() {
  sound.play('click')
  isPaused.value = !isPaused.value
  if (!isPaused.value) {
    hasStartedQuiz.value = true
    startTimer()
  }
}

// Pagination refs & auto-focus / auto-scroll
const paginationRefs = ref<Record<number, HTMLElement>>({})

function scrollToActivePagination() {
  nextTick(() => {
    const btn = paginationRefs.value[currentId.value]
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      btn.focus({ preventScroll: true })
    }
  })
}

// Reset timer & scroll pagination whenever question changes
watch(
  () => currentId.value,
  () => {
    timeLeft.value = TIMER_START
    // If quiz has started, continue countdown automatically on next question;
    // If not started yet (initial load), stay paused in ready state!
    if (hasStartedQuiz.value) {
      isPaused.value = false
      startTimer()
    } else {
      isPaused.value = true
    }
    scrollToActivePagination()
  },
  { immediate: true }
)

// Navigation
function goToQuestion(id: number) {
  if (id >= 1 && id <= QUIZ_QUESTIONS.length && id !== currentId.value) {
    sound.play('whoosh')
    router.push(`/quiz/${id}`)
  }
}

function handlePrev() {
  if (currentId.value > 1) {
    goToQuestion(currentId.value - 1)
  }
}

function handleNext() {
  if (currentId.value < QUIZ_QUESTIONS.length) {
    goToQuestion(currentId.value + 1)
  } else if (currentId.value === QUIZ_QUESTIONS.length) {
    // On question 15, Next triggers the ending celebration modal!
    triggerEndingModal()
  }
}

function exitQuiz() {
  sound.play('click')
  // Return to the presentation slide where user came from
  router.push(`/slide/${deckStore.currentSlideNumber}`)
}

// Global Keyboard Handler for Quiz Presentation
function handleKeyDown(e: KeyboardEvent) {
  const target = e.target as HTMLElement
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
    return
  }

  // Dismiss splash on any key press
  if (showSplash.value) {
    dismissSplash()
    return
  }

  if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    if (showEndingModal.value) {
      closeEndingModal()
      exitQuiz()
      return
    }
    exitQuiz()
  } else if (e.key === 'f' || e.key === 'F') {
    e.preventDefault()
    toggleFullscreen()
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault()
    handlePrev()
  } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
    e.preventDefault()
    handleNext()
  } else if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
    e.preventDefault()
    togglePause()
  } else if (e.key === 'r' || e.key === 'R') {
    e.preventDefault()
    resetTimer()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  document.addEventListener('fullscreenchange', checkFullscreen)
  checkFullscreen()

  // Trigger the animated "QUIZ TIME" earlier splash on initial mount
  if (currentId.value === 1) {
    triggerQuizTimeSplash()
  }

  scrollToActivePagination()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('fullscreenchange', checkFullscreen)
  stopTimer()
  if (splashTimeout) clearTimeout(splashTimeout)
})

// Progress percentage for 20-second timer
const timerProgressPercent = computed(() => {
  return (timeLeft.value / TIMER_START) * 100
})

// Quick answers map for the Ending Modal
const answersMap = [
  { id: 1, type: 'MC', prompt: 'What is a linked list?', ans: 'A. A linear data structure made of connected nodes' },
  { id: 2, type: 'MC', prompt: 'Points to first node?', ans: 'B. Head' },
  { id: 3, type: 'MC', prompt: 'Forward & backward traversal?', ans: 'C. Doubly linked list' },
  { id: 4, type: 'MC', prompt: 'What is traversal?', ans: 'D. Visiting nodes one by one' },
  { id: 5, type: 'MC', prompt: 'Last node points to?', ans: 'B. NULL' },
  { id: 6, type: 'ID', prompt: 'Information stored inside a node', ans: 'Data (or Value / Payload)' },
  { id: 7, type: 'ID', prompt: 'Removes node and adjusts links', ans: 'Deletion (or Delete / Remove)' },
  { id: 8, type: 'ID', prompt: 'Finds whether value exists', ans: 'Searching (or Linear Search)' },
  { id: 9, type: 'ID', prompt: 'Changes direction so last becomes first', ans: 'Reversing (or Reverse)' },
  { id: 10, type: 'ID', prompt: 'Work grows as nodes increase', ans: 'Time Complexity (or Big-O)' },
  { id: 11, type: 'T/F', prompt: 'Must be stored in consecutive memory?', ans: 'FALSE (Non-contiguous heap)' },
  { id: 12, type: 'T/F', prompt: 'Doubly list links to prev & next?', ans: 'TRUE' },
  { id: 13, type: 'T/F', prompt: 'Circular singly points back to first?', ans: 'TRUE' },
  { id: 14, type: 'T/F', prompt: 'Faster direct index access than arrays?', ans: 'FALSE (Arrays O(1), Lists O(n))' },
  { id: 15, type: 'T/F', prompt: 'Can implement stacks & queues?', ans: 'TRUE' }
]
</script>

<template>
  <div class="min-h-screen candy-grid-bg text-[#111111] flex flex-col font-body select-none relative pb-6 sm:pb-8">
    <!-- "QUIZ TIME" HIGH-ENERGY EARLIER SPLASH ANIMATION OVERLAY -->
    <Transition name="splash-fade">
      <div
        v-if="showSplash"
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#ffd23f]/95 cursor-pointer backdrop-blur-[6px]"
        @click="dismissSplash"
      >
        <div
          class="quiz-splash-card bg-[#ffffff] border-4 border-[#111111] p-6 sm:p-10 shadow-[10px_10px_0px_#111111] max-w-lg w-full text-center relative overflow-hidden"
        >
          <!-- Top Badges -->
          <div class="flex items-center justify-center gap-2 mb-3">
            <span class="px-2.5 py-0.5 bg-[#ff3d81] text-white border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0_#000]">
              LINKED LISTS DSA
            </span>
            <span class="px-2.5 py-0.5 bg-[#3ddc97] text-black border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0_#000]">
              15 QUESTIONS
            </span>
          </div>

          <!-- Staggered Animated QUIZ TIME Text with Individual Color Jumps -->
          <div class="py-2">
            <h1 class="quiz-time-heading font-display text-4xl sm:text-6xl uppercase tracking-tight text-[#111111] leading-none mb-1 flex items-center justify-center gap-1.5 flex-wrap">
              <span class="letter-bounce text-[#ff3d81]" style="--delay: 0.05s">Q</span>
              <span class="letter-bounce text-[#111111]" style="--delay: 0.1s">U</span>
              <span class="letter-bounce text-[#ffd23f]" style="--delay: 0.15s">I</span>
              <span class="letter-bounce text-[#3ddc97]" style="--delay: 0.2s">Z</span>
              <span class="letter-bounce text-[#111111]" style="--delay: 0.25s">&nbsp;</span>
              <span class="letter-bounce text-[#c8a2ff]" style="--delay: 0.3s">T</span>
              <span class="letter-bounce text-[#111111]" style="--delay: 0.35s">I</span>
              <span class="letter-bounce text-[#ff6b5e]" style="--delay: 0.4s">M</span>
              <span class="letter-bounce text-[#ff3d81]" style="--delay: 0.45s">E</span>
              <span class="letter-bounce text-[#ffd23f]" style="--delay: 0.5s">!</span>
            </h1>
          </div>

          <p class="font-mono text-xs sm:text-sm text-neutral-800 font-bold mt-2">
            Test I (MC) • Test II (ID) • Test III (T/F)
          </p>

          <div class="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-neutral-600 bg-[#fdf9f0] px-3 py-1 border border-black shadow-[1px_1px_0_#000]">
            <span>Press</span>
            <kbd class="px-1.5 py-0.5 bg-white border border-black font-bold text-black shadow-[1px_1px_0_#000]">Q</kbd>
            <span>or click anywhere to begin</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Top Presentation Header Bar -->
    <header class="w-full bg-[#ffffff] border-b-2 sm:border-b-4 border-[#111111] shadow-[0_3px_0_#111111] sticky top-0 z-40">
      <!-- 20-Second Progress Line -->
      <div class="w-full bg-[#111111]/15 h-2 relative overflow-hidden">
        <div
          class="h-full transition-all duration-1000 ease-linear"
          :class="[
            timeLeft > 5
              ? 'bg-[#3ddc97]'
              : timeLeft > 0
                ? 'bg-[#ff3d81] animate-pulse'
                : 'bg-red-600'
          ]"
          :style="{ width: `${timerProgressPercent}%` }"
        ></div>
      </div>

      <div class="max-w-7xl mx-auto px-2 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4 overflow-x-auto sm:overflow-visible">
        <!-- Left: Quiz Badge & Test Section (Hidden on small screen for compact mobile header) -->
        <div class="hidden sm:flex items-center gap-1.5 sm:gap-3 min-w-0 shrink-0">
          <button
            type="button"
            class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-[#ff3d81] text-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-display text-xs sm:text-sm tracking-wider shrink-0 cursor-pointer hover:bg-[#ff1e6d]"
            title="Replay Quiz Time Intro"
            @click="triggerQuizTimeSplash"
          >
            <Sparkles class="w-3.5 h-3.5 fill-white shrink-0" />
            <span class="font-black">QUIZ TIME</span>
          </button>

          <div class="hidden md:flex items-center gap-2 border-l-2 border-[#111111] pl-3">
            <BrutalBadge :variant="question.sectionColor" size="md">
              {{ question.sectionBadge }}
            </BrutalBadge>
            <span class="font-mono text-xs text-neutral-600 font-bold truncate">
              {{ question.section }}
            </span>
          </div>
        </div>

        <!-- Center: 20-Second Countdown Display & Start/Pause Controls -->
        <div class="flex items-center gap-1 sm:gap-2.5 shrink-0">
          <div
            class="px-2 sm:px-3.5 py-1 sm:py-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] sm:shadow-[3px_3px_0px_#111111] font-mono flex items-center gap-1 sm:gap-2 shrink-0 transition-all"
            :class="[
              timeLeft === 0
                ? 'bg-[#ff6b5e] text-white animate-bounce'
                : timeLeft <= 5
                  ? 'bg-[#ff3d81] text-white animate-pulse'
                  : isPaused
                    ? 'bg-[#fff0a6] text-[#111111]'
                    : 'bg-[#ffd23f] text-[#111111]'
            ]"
          >
            <Clock v-if="timeLeft > 0" class="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
            <AlertTriangle v-else class="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />

            <span class="font-black text-xs sm:text-base md:text-lg tracking-wider whitespace-nowrap">
              {{ String(timeLeft).padStart(2, '0') }}s
            </span>

            <span
              v-if="timeLeft === 0"
              class="hidden sm:inline text-xs font-black bg-black text-[#ffd23f] px-1.5 py-0.5 border border-white"
            >
              TIME'S UP!
            </span>
            <span
              v-else-if="isPaused"
              class="hidden sm:inline text-[10px] font-bold bg-white text-black px-1.5 py-0.5 border border-black"
            >
              {{ timeLeft === TIMER_START ? 'READY' : 'PAUSED' }}
            </span>
          </div>

          <button
            type="button"
            class="brutal-btn px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-mono font-bold flex items-center gap-1 sm:gap-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] whitespace-nowrap shrink-0 transition-all cursor-pointer"
            :class="isPaused ? 'bg-[#3ddc97] text-black font-black ring-2 ring-black' : 'bg-white hover:bg-neutral-100 text-black'"
            :title="isPaused ? 'Start / Resume Timer (Space / P)' : 'Pause Timer (Space / P)'"
            @click="togglePause"
          >
            <component :is="isPaused ? Play : Pause" class="w-3.5 h-3.5 stroke-[2.5] shrink-0" :class="isPaused ? 'fill-black' : ''" />
            <span class="font-black">{{ isPaused ? (timeLeft === TIMER_START ? 'START' : 'RESUME') : 'PAUSE' }}</span>
            <span v-if="isPaused && timeLeft === TIMER_START" class="hidden md:inline font-black">&nbsp;TIMER</span>
          </button>

          <!-- Reset 20s Timer Button -->
          <button
            type="button"
            class="brutal-btn bg-white hover:bg-[#ffd23f] p-1 sm:px-2.5 sm:py-1.5 text-xs font-mono font-bold flex items-center gap-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0 cursor-pointer"
            title="Reset to 20s (R)"
            @click="resetTimer"
          >
            <RotateCcw class="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
            <span class="hidden lg:inline">RESET</span>
          </button>
        </div>

        <!-- Right: Fullscreen (F), Question Counter & Exit Button -->
        <div class="flex items-center gap-1 sm:gap-2 shrink-0">
          <!-- Fullscreen Toggle Button (F) -->
          <button
            type="button"
            class="brutal-btn p-1 sm:px-2.5 sm:py-1.5 text-xs font-mono font-bold flex items-center gap-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0 cursor-pointer"
            :class="isFullscreen ? 'bg-[#ffd23f]' : 'bg-white hover:bg-[#ffd23f]'"
            title="Toggle Fullscreen (F)"
            @click="toggleFullscreen"
          >
            <component :is="isFullscreen ? Minimize2 : Maximize2" class="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
            <span class="hidden xl:inline font-bold">{{ isFullscreen ? 'WINDOW' : 'PPT (F)' }}</span>
          </button>

          <!-- Question Counter (Hidden on small screen for compact mobile header) -->
          <div class="hidden sm:block px-2 sm:px-3 py-1 bg-[#111111] text-[#ffd23f] font-mono font-black text-xs sm:text-sm border-2 border-black shadow-[2px_2px_0_#000] whitespace-nowrap shrink-0">
            Q {{ String(currentId).padStart(2, '0') }} / 15
          </div>

          <!-- Exit Quiz Button (Q / ESC) -->
          <button
            type="button"
            class="brutal-btn bg-[#ff6b5e] text-black px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-mono font-bold flex items-center gap-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0 cursor-pointer"
            title="Exit Quiz to Presentation (Q / ESC)"
            @click="exitQuiz"
          >
            <X class="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
            <span class="hidden sm:inline">EXIT (Q)</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Quiz Presentation Slide Stage -->
    <main class="flex-1 max-w-5xl 2xl:max-w-6xl w-full mx-auto px-3 sm:px-8 py-4 sm:py-8 flex flex-col justify-center">
      <!-- Outer Question Slide Neubrutalist Frame -->
      <div
        class="bg-[#ffffff] border-3 sm:border-4 border-[#111111] shadow-[8px_8px_0px_#111111] p-4 sm:p-8 relative transition-all"
        :class="[
          timeLeft === 0 ? 'ring-4 ring-[#ff6b5e]' : ''
        ]"
      >
        <!-- Section Tag & Time Limit -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 sm:mb-6 border-b-2 border-[#111111]">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs sm:text-sm font-black tracking-wider uppercase text-neutral-800">
              {{ question.section }}
            </span>
          </div>

          <div class="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-neutral-600 font-bold">
            <span class="inline-flex items-center gap-1.5 bg-[#fdf9f0] border border-black px-2 py-0.5">
              <Clock class="w-3 h-3 text-black stroke-[2.5]" />
              <span>20s LIMIT</span>
            </span>
          </div>
        </div>

        <!-- Question Title & Prompt -->
        <div class="mb-6 sm:mb-8">
          <div class="flex items-start gap-3 sm:gap-4">
            <!-- Big Question Number Stamp -->
            <div
              class="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center font-display text-lg sm:text-2xl font-black border-2 sm:border-3 border-[#111111] shadow-[3px_3px_0px_#111111]"
              :class="question.sectionColor === 'pink' ? 'bg-[#ff3d81] text-white' : question.sectionColor === 'yellow' ? 'bg-[#ffd23f] text-black' : 'bg-[#3ddc97] text-black'"
            >
              #{{ currentId }}
            </div>

            <div class="flex-1">
              <h2 class="font-display text-xl sm:text-3xl md:text-4xl text-[#111111] leading-tight font-black">
                {{ question.question }}
              </h2>
              <p
                v-if="question.instructions"
                class="font-mono text-xs sm:text-sm text-neutral-600 font-semibold mt-2 flex items-center gap-1.5"
              >
                <HelpCircle class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff3d81] stroke-[2.5]" />
                <span>{{ question.instructions }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Question Body / Layout per Type (Read-Only) -->

        <!-- 1. MULTIPLE CHOICE (Questions 1 - 5) -->
        <div
          v-if="question.type === 'mc' && question.options"
          class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 my-2"
        >
          <div
            v-for="opt in question.options"
            :key="opt.key"
            class="bg-[#fdf9f0] border-2 sm:border-3 border-[#111111] shadow-[4px_4px_0px_#111111] p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4 hover:bg-[#fff9e6] transition-all"
          >
            <!-- Letter Badge -->
            <div class="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 bg-[#ffffff] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-display text-sm sm:text-base font-black flex items-center justify-center">
              {{ opt.key }}
            </div>

            <!-- Option Text -->
            <div class="flex-1 text-sm sm:text-base font-body font-semibold text-[#111111] leading-snug pt-0.5">
              {{ opt.text }}
            </div>
          </div>
        </div>

        <!-- 2. IDENTIFICATION (Questions 6 - 10) -->
        <div
          v-else-if="question.type === 'identification'"
          class="my-4 sm:my-8"
        >
          <div class="bg-[#fdf9f0] border-2 sm:border-3 border-[#111111] shadow-[5px_5px_0px_#111111] p-5 sm:p-8">
            <div class="flex items-center gap-2 mb-3 font-mono text-xs font-bold text-neutral-700">
              <span class="w-2.5 h-2.5 rounded-full bg-[#ffd23f] border border-black"></span>
              <span>IDENTIFICATION PROMPT • WRITE DOWN YOUR ANSWER:</span>
            </div>

            <!-- Stylized Neubrutalist Worksheet Response Box -->
            <div class="bg-[#ffffff] border-2 border-dashed border-[#111111] p-5 sm:p-8 text-center shadow-inner">
              <div class="font-mono text-sm sm:text-lg text-neutral-400 font-bold tracking-widest uppercase">
                [ Write your answer on your paper ]
              </div>
              <p class="font-mono text-xs text-neutral-500 mt-2">
                This question will be checked manually at the end of the quiz.
              </p>
            </div>
          </div>
        </div>

        <!-- 3. TRUE OR FALSE (Questions 11 - 15) -->
        <div
          v-else-if="question.type === 'tf' && question.options"
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-4 sm:my-6"
        >
          <div
            v-for="opt in question.options"
            :key="opt.key"
            class="bg-[#fdf9f0] border-3 sm:border-4 border-[#111111] shadow-[6px_6px_0px_#111111] p-4 sm:p-6 flex items-center gap-4 hover:bg-[#e8fdf2] transition-all"
          >
            <!-- Badge -->
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-display text-base sm:text-lg font-black flex items-center justify-center"
              :class="opt.text === 'TRUE' ? 'bg-[#3ddc97] text-black' : 'bg-[#ff6b5e] text-black'"
            >
              {{ opt.key }}
            </div>

            <div class="flex-1 font-display text-lg sm:text-2xl font-black tracking-tight text-[#111111]">
              {{ opt.text }}
            </div>
          </div>
        </div>

        <div
          v-if="timeLeft === 0"
          class="mt-6 p-3 bg-[#ff6b5e] text-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex items-center justify-between font-mono text-xs sm:text-sm font-bold animate-pulse"
        >
          <div class="flex items-center gap-2">
            <AlertTriangle class="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>TIME'S UP FOR QUESTION #{{ currentId }}! Advancing directly...</span>
          </div>
        </div>
      </div>

      <!-- Question Pagination Navigation Strip -->
      <div class="mt-4 sm:mt-6 bg-[#ffffff] border-2 sm:border-3 border-[#111111] shadow-[4px_4px_0px_#111111] p-3 sm:p-4 overflow-x-auto scrollbar-thin">
        <div class="flex items-center justify-between gap-1.5 sm:gap-2 min-w-[620px] sm:min-w-0 px-1 py-1">
          <button
            v-for="q in QUIZ_QUESTIONS"
            :key="q.id"
            :ref="(el) => { if (el) paginationRefs[q.id] = el as HTMLElement }"
            type="button"
            class="flex-1 py-1.5 sm:py-2 px-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-mono text-xs font-black transition-colors flex items-center justify-center min-w-[36px] cursor-pointer focus:outline-none"
            :class="[
              Number(currentId) === q.id
                ? 'bg-[#111111] text-[#ffd23f]'
                : q.sectionColor === 'pink'
                  ? 'bg-white hover:bg-[#ff3d81]/20 text-[#111111]'
                  : q.sectionColor === 'yellow'
                    ? 'bg-white hover:bg-[#ffd23f]/30 text-[#111111]'
                    : 'bg-white hover:bg-[#3ddc97]/30 text-[#111111]'
            ]"
            :title="`Jump to Question #${q.id} (${q.sectionBadge})`"
            @click="goToQuestion(q.id)"
          >
            <span>{{ String(q.id).padStart(2, '0') }}</span>
          </button>
        </div>
      </div>

      <!-- Navigation Bar -->
      <div class="mt-3 sm:mt-4 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
        <button
          type="button"
          :disabled="currentId === 1"
          class="brutal-btn bg-[#ffd23f] px-3 sm:px-5 py-2 text-xs sm:text-sm font-mono font-bold flex items-center gap-1.5 border-2 border-[#111111] shadow-[3px_3px_0px_#111111] disabled:opacity-30 disabled:cursor-not-allowed"
          title="Previous Question (Left Arrow)"
          @click="handlePrev"
        >
          <ArrowLeft class="w-4 h-4 stroke-[2.5]" />
          <span>PREV QUESTION</span>
        </button>

        <div class="hidden md:flex items-center gap-2 font-mono text-[11px] text-neutral-600 bg-white px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_#000]">
          <span><kbd class="px-1 bg-neutral-200 border border-black font-bold">←</kbd> / <kbd class="px-1 bg-neutral-200 border border-black font-bold">→</kbd> Navigate</span>
          <span>•</span>
          <span><kbd class="px-1 bg-neutral-200 border border-black font-bold">SPACE</kbd> Start/Pause</span>
          <span>•</span>
          <span><kbd class="px-1 bg-neutral-200 border border-black font-bold">R</kbd> Reset 20s</span>
          <span>•</span>
          <span><kbd class="px-1 bg-neutral-200 border border-black font-bold">F</kbd> Fullscreen</span>
          <span>•</span>
          <span><kbd class="px-1 bg-[#ff6b5e] text-black border border-black font-bold">Q</kbd> Exit</span>
        </div>

        <button
          type="button"
          class="brutal-btn px-3 sm:px-5 py-2 text-xs sm:text-sm font-mono font-bold flex items-center gap-1.5 border-2 border-[#111111] shadow-[3px_3px_0px_#111111]"
          :class="currentId === QUIZ_QUESTIONS.length ? 'bg-[#ff3d81] text-white' : 'bg-[#3ddc97] text-black'"
          :title="currentId === QUIZ_QUESTIONS.length ? 'Finish Quiz & View Results' : 'Next Question (Right Arrow / Space)'"
          @click="handleNext"
        >
          <span>{{ currentId === QUIZ_QUESTIONS.length ? 'FINISH QUIZ' : 'NEXT QUESTION' }}</span>
          <ArrowRight class="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </main>

    <!-- QUIZ COMPLETED / TIME'S UP ENDING CELEBRATION MODAL -->
    <Transition name="splash-fade">
      <div
        v-if="showEndingModal"
        class="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none overflow-y-auto"
        @click.self="closeEndingModal"
      >
        <div class="ending-card bg-white border-4 border-[#111111] shadow-[10px_10px_0px_#111111] max-w-2xl w-full p-5 sm:p-8 relative my-auto">
          <!-- Top Badge & Close button -->
          <div class="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
            <div class="flex items-center gap-2">
              <span class="w-3.5 h-3.5 bg-[#3ddc97] border border-black inline-block"></span>
              <span class="font-mono text-xs sm:text-sm font-black tracking-widest text-[#111111] uppercase">
                LINKED LISTS PRESENTATION COMPLETE
              </span>
            </div>
            <button
              type="button"
              class="brutal-btn bg-[#ff6b5e] p-1 border-2 border-black shadow-[2px_2px_0_#000]"
              @click="closeEndingModal"
            >
              <X class="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <!-- Celebration Banner -->
          <div class="text-center py-2 sm:py-4">
            <div class="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#ffd23f] border-3 border-black shadow-[4px_4px_0_#000] mb-3">
              <Award class="w-8 h-8 sm:w-10 sm:h-10 text-black stroke-[2.5]" />
            </div>

            <h2 class="font-display text-2xl sm:text-4xl text-[#111111] uppercase tracking-tight font-black">
              TIME'S UP — QUIZ FINISHED!
            </h2>
            <p class="font-mono text-xs sm:text-sm text-neutral-600 font-bold mt-1 max-w-md mx-auto">
              All 15 questions have been presented. Ready for manual answer checking with the class!
            </p>
          </div>

          <!-- Section Completion Badges -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 my-4">
            <div class="bg-[#fdf9f0] border-2 border-black p-2.5 shadow-[2px_2px_0_#000] text-center">
              <span class="font-mono text-[10px] font-bold text-neutral-500">TEST I</span>
              <div class="font-display text-xs sm:text-sm font-black text-[#ff3d81]">MULTIPLE CHOICE</div>
              <div class="font-mono text-[11px] text-neutral-700 font-bold">5 Questions (1 - 5)</div>
            </div>

            <div class="bg-[#fdf9f0] border-2 border-black p-2.5 shadow-[2px_2px_0_#000] text-center">
              <span class="font-mono text-[10px] font-bold text-neutral-500">TEST II</span>
              <div class="font-display text-xs sm:text-sm font-black text-[#ffd23f]">IDENTIFICATION</div>
              <div class="font-mono text-[11px] text-neutral-700 font-bold">5 Questions (6 - 10)</div>
            </div>

            <div class="bg-[#fdf9f0] border-2 border-black p-2.5 shadow-[2px_2px_0_#000] text-center">
              <span class="font-mono text-[10px] font-bold text-neutral-500">TEST III</span>
              <div class="font-display text-xs sm:text-sm font-black text-[#3ddc97]">TRUE OR FALSE</div>
              <div class="font-mono text-[11px] text-neutral-700 font-bold">5 Questions (11 - 15)</div>
            </div>
          </div>

          <div class="border-2 border-black bg-[#fdf9f0] mb-4 overflow-hidden">
            <button
              type="button"
              class="w-full px-3 py-2 bg-white hover:bg-[#fff9e6] flex items-center justify-between font-mono text-xs font-black border-b border-black text-[#111111]"
              @click="showAnswerKey = !showAnswerKey"
            >
              <div class="flex items-center gap-1.5">
                <FileText class="w-3.5 h-3.5 text-[#ff3d81]" />
                <span>{{ showAnswerKey ? 'HIDE ANSWER KEY' : 'REVEAL ANSWER KEY FOR MANUAL CHECKING (ANSWER.MD)' }}</span>
              </div>
              <component :is="showAnswerKey ? ChevronUp : ChevronDown" class="w-4 h-4 stroke-[2.5]" />
            </button>

            <div v-if="showAnswerKey" class="p-2 sm:p-3 max-h-60 overflow-y-auto space-y-2 font-mono text-xs">
              <div
                v-for="item in answersMap"
                :key="item.id"
                class="p-2 bg-white border-2 border-black/30 shadow-[1px_1px_0_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span class="font-black px-1.5 py-0.5 bg-black text-white text-[10px] flex-shrink-0">
                    #{{ String(item.id).padStart(2, '0') }}
                  </span>
                  <span class="text-neutral-800 font-bold text-xs truncate">
                    {{ item.prompt }}
                  </span>
                </div>

                <div class="text-[#ff3d81] font-black bg-[#ff3d81]/10 px-2 py-0.5 border border-[#ff3d81]/40 text-xs break-words sm:text-right flex-shrink-0 sm:max-w-[55%]">
                  {{ item.ans }}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between gap-2 pt-2.5 border-t-2 border-black">
            <button
              type="button"
              class="brutal-btn flex-1 bg-[#ffd23f] px-2.5 sm:px-4 py-2 font-mono font-bold text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0_#000] flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer"
              title="Restart Quiz (R)"
              @click="restartQuiz"
            >
              <RotateCcw class="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
              <span>RESTART<span class="hidden sm:inline">&nbsp;QUIZ (R)</span></span>
            </button>

            <button
              type="button"
              class="brutal-btn flex-1 bg-[#ff6b5e] text-black px-2.5 sm:px-4 py-2 font-mono font-bold text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0_#000] flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer"
              title="Return to Presentation (Q)"
              @click="exitQuiz"
            >
              <span><span class="hidden sm:inline">RETURN TO </span>PRESENTATION<span class="hidden sm:inline">&nbsp;(Q)</span></span>
              <ArrowRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Splash Animation mirroring earlier implementation */
.splash-fade-enter-active {
  transition: opacity 0.3s ease;
}
.splash-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.quiz-splash-card {
  animation: quiz-pop-bounce 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes quiz-pop-bounce {
  0% {
    opacity: 0;
    transform: scale(0.4) rotate(-8deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.08) rotate(3deg);
  }
  85% {
    transform: scale(0.96) rotate(-2deg);
  }
  100% {
    transform: scale(1) rotate(-1.5deg);
  }
}

.letter-bounce {
  display: inline-block;
  animation: letter-jump 0.75s ease-in-out infinite alternate;
  animation-delay: var(--delay, 0s);
}

@keyframes letter-jump {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-8px);
  }
}

.ending-card {
  animation: ending-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes ending-pop {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
