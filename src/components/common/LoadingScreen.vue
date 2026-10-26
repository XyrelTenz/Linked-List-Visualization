<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { sound } from '../../utils/sound'
import { FastForward, Sparkles, RefreshCw } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'finished'): void
}>()

const DURATION_MS = 5000
const startTime = ref<number>(Date.now())
const progress = ref<number>(0)
const elapsedMs = ref<number>(0)
const isVisible = ref<boolean>(true)
let animationFrameId: number | null = null

const activeNode = computed<'node1' | 'node2'>(() => {
  const cycle = Math.floor(elapsedMs.value / 625) % 2
  return cycle === 0 ? 'node1' : 'node2'
})

const remainingSeconds = computed(() => {
  const left = Math.max(0, (DURATION_MS - elapsedMs.value) / 1000)
  return left.toFixed(1)
})

let lastCycle = -1

function updateLoop() {
  const now = Date.now()
  elapsedMs.value = Math.min(DURATION_MS, now - startTime.value)
  progress.value = Math.min(100, Math.round((elapsedMs.value / DURATION_MS) * 100))

  // Play subtle tactile blip on each circular jump (1 -> 2 -> 1)
  const currentCycle = Math.floor(elapsedMs.value / 625)
  if (currentCycle !== lastCycle) {
    lastCycle = currentCycle
    sound.play('step')
  }

  if (elapsedMs.value < DURATION_MS) {
    animationFrameId = requestAnimationFrame(updateLoop)
  } else {
    sound.play('success')
    setTimeout(() => {
      finishLoading()
    }, 200)
  }
}

function finishLoading() {
  if (!isVisible.value) return
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  isVisible.value = false
  emit('finished')
}

function handleSkip() {
  sound.play('click')
  finishLoading()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    e.stopPropagation()
    handleSkip()
  }
}

onMounted(() => {
  startTime.value = Date.now()
  animationFrameId = requestAnimationFrame(updateLoop)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="loading-fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 bg-[#fdf9f0]/95 backdrop-blur-[2px] candy-grid-bg flex items-center justify-center p-4 select-none"
    >
      <!-- Compact, Centered Neubrutal Card -->
      <div
        class="w-full max-w-lg bg-white border-3 border-[#111111] shadow-[8px_8px_0px_#111111] p-5 sm:p-7 relative overflow-hidden"
      >
        <!-- Top bar inside card: Skip button -->
        <div class="flex items-center justify-end pb-2 mb-2">
          <button
            type="button"
            class="brutal-btn bg-[#fdf9f0] hover:bg-[#ffd23f] px-2.5 py-1 text-[11px] font-mono font-bold border border-black shadow-[2px_2px_0_#111] flex items-center gap-1"
            title="Skip loading (Space / Esc)"
            @click="handleSkip"
          >
            <span>SKIP</span>
            <FastForward class="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        <!-- 2-Node Circular Loop Visual Area -->
        <div class="py-5 flex flex-col items-center justify-center">
          <!-- Live Cycle Banner -->
          <div
            class="mb-4 font-mono text-[11px] text-neutral-600 font-bold flex items-center gap-1.5"
          >
            <RefreshCw class="w-3 h-3 animate-spin text-[#ff3d81]" />
            <span>
              POINTER:
              <strong class="text-black bg-[#ffd23f] px-1 border border-black">
                {{ activeNode === 'node1' ? 'NODE 1 ➔ NODE 2' : 'NODE 2 ➔ NODE 1' }}
              </strong>
            </span>
          </div>

          <!-- The Two Circular Nodes Diagram -->
          <div class="flex items-center justify-center gap-3 sm:gap-6 relative py-2">
            <!-- NODE 1 -->
            <div
              class="flex flex-col items-center transition-all duration-200"
              :class="activeNode === 'node1' ? '-translate-y-1 scale-105' : 'opacity-85'"
            >
              <div class="h-5 flex items-center">
                <span
                  class="font-mono text-[10px] font-black px-1.5 py-0.2 border border-black shadow-[1px_1px_0_#000]"
                  :class="
                    activeNode === 'node1'
                      ? 'bg-[#3ddc97] text-black animate-bounce'
                      : 'bg-neutral-100 text-neutral-600'
                  "
                >
                  NODE 1
                </span>
              </div>

              <!-- Node Box (Pink Data + Yellow Next) -->
              <div
                class="flex border-2 border-black shadow-[4px_4px_0_#111] bg-white overflow-hidden transition-all"
                :class="activeNode === 'node1' ? 'ring-2 ring-[#ff3d81]' : ''"
              >
                <!-- Data compartment -->
                <div
                  class="px-3 py-2 bg-[#ff3d81] text-black font-display text-lg sm:text-xl border-r-2 border-black flex items-center justify-center min-w-[42px]"
                >
                  42
                </div>
                <!-- Next pointer compartment -->
                <div class="px-2.5 py-2 bg-[#ffd23f] flex items-center justify-center min-w-[34px]">
                  <span
                    class="w-3 h-3 rounded-full bg-black transition-transform"
                    :class="activeNode === 'node1' ? 'scale-125 bg-black ring-2 ring-white' : ''"
                  ></span>
                </div>
              </div>
              <span class="font-mono text-[10px] text-neutral-600 mt-1 font-bold">0x10A</span>
            </div>

            <!-- Two-Way Circular Pointers Between 1 and 2 -->
            <div class="flex flex-col items-center justify-center gap-2 px-1">
              <!-- Top Forward Arrow (1 -> 2) -->
              <div
                class="flex items-center gap-1 transition-all duration-150"
                :class="
                  activeNode === 'node1'
                    ? 'text-[#ff3d81] scale-110 font-black'
                    : 'text-neutral-400 opacity-60'
                "
              >
                <span class="text-[9px] font-mono font-bold hidden sm:inline">next ➔</span>
                <svg class="w-10 sm:w-14 h-5" viewBox="0 0 50 16" fill="none">
                  <line
                    x1="2"
                    y1="8"
                    x2="42"
                    y2="8"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    :stroke-dasharray="activeNode === 'node1' ? 'none' : '4,3'"
                  />
                  <polygon points="40,3 49,8 40,13" fill="currentColor" />
                </svg>
              </div>

              <!-- Bottom Return Arrow (2 -> 1, Circular Loop) -->
              <div
                class="flex items-center gap-1 transition-all duration-150"
                :class="
                  activeNode === 'node2'
                    ? 'text-[#3ddc97] scale-110 font-black'
                    : 'text-neutral-400 opacity-60'
                "
              >
                <svg class="w-10 sm:w-14 h-5" viewBox="0 0 50 16" fill="none">
                  <line
                    x1="48"
                    y1="8"
                    x2="8"
                    y2="8"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    :stroke-dasharray="activeNode === 'node2' ? 'none' : '4,3'"
                  />
                  <polygon points="10,3 1,8 10,13" fill="currentColor" />
                </svg>
                <span class="text-[9px] font-mono font-bold hidden sm:inline">⟲ loop</span>
              </div>
            </div>

            <!-- NODE 2 -->
            <div
              class="flex flex-col items-center transition-all duration-200"
              :class="activeNode === 'node2' ? '-translate-y-1 scale-105' : 'opacity-85'"
            >
              <div class="h-5 flex items-center">
                <span
                  class="font-mono text-[10px] font-black px-1.5 py-0.2 border border-black shadow-[1px_1px_0_#000]"
                  :class="
                    activeNode === 'node2'
                      ? 'bg-[#3ddc97] text-black animate-bounce'
                      : 'bg-neutral-100 text-neutral-600'
                  "
                >
                  NODE 2
                </span>
              </div>

              <!-- Node Box (Lilac Data + Yellow Next) -->
              <div
                class="flex border-2 border-black shadow-[4px_4px_0_#111] bg-white overflow-hidden transition-all"
                :class="activeNode === 'node2' ? 'ring-2 ring-[#c8a2ff]' : ''"
              >
                <!-- Data compartment -->
                <div
                  class="px-3 py-2 bg-[#c8a2ff] text-black font-display text-lg sm:text-xl border-r-2 border-black flex items-center justify-center min-w-[42px]"
                >
                  88
                </div>
                <!-- Next pointer compartment -->
                <div class="px-2.5 py-2 bg-[#ffd23f] flex items-center justify-center min-w-[34px]">
                  <span
                    class="w-3 h-3 rounded-full bg-black transition-transform"
                    :class="activeNode === 'node2' ? 'scale-125 bg-black ring-2 ring-white' : ''"
                  ></span>
                </div>
              </div>
              <span class="font-mono text-[10px] text-neutral-600 mt-1 font-bold">0x3F2</span>
            </div>
          </div>
        </div>

        <!-- Sleek 5-Second Progress Bar -->
        <div class="mt-2 pt-3 border-t-2 border-[#111111]">
          <div class="flex items-center justify-between font-mono text-[11px] mb-1.5 font-bold">
            <span class="text-neutral-700">
              BUFFERING DECK: <span class="text-black">{{ progress }}%</span>
            </span>
            <span class="bg-[#ffd23f] px-1.5 py-0.2 border border-black text-[10px]">
              {{ remainingSeconds }}s
            </span>
          </div>

          <!-- Progress track -->
          <div
            class="w-full h-3.5 bg-[#fdf9f0] border-2 border-black shadow-[2px_2px_0_#111] overflow-hidden"
          >
            <div
              class="h-full bg-[#ff3d81] border-r-2 border-black transition-all duration-75 ease-linear"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Subtitle hint -->
        <div class="mt-3 text-center font-mono text-[10px] text-neutral-500">
          <kbd class="px-1 py-0.2 bg-white border border-black text-black">SPACE</kbd> to skip
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-fade-leave-active {
  transition:
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.loading-fade-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-6px);
}
</style>
