<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import BrutalBadge from '../common/BrutalBadge.vue'
import BrutalButton from '../common/BrutalButton.vue'
import CodeSnippet from '../common/CodeSnippet.vue'
import { sound } from '../../utils/sound'
import { Play, Pause, RotateCcw, SkipForward, Cpu } from 'lucide-vue-next'

const nodes = [
  { val: 10, addr: '0x10A', nextAddr: '0x4F2', heapIndex: 1 },
  { val: 20, addr: '0x4F2', nextAddr: '0x88C', heapIndex: 5 },
  { val: 30, addr: '0x88C', nextAddr: 'null', heapIndex: 3 },
]

const currentStep = ref<number>(0)
const isAutoRunning = ref<boolean>(false)
let timer: ReturnType<typeof setInterval> | null = null

function stepForward() {
  sound.play('step')
  if (currentStep.value < nodes.length) {
    currentStep.value++
  } else {
    currentStep.value = 0
  }
}

function resetSimulation() {
  sound.play('click')
  stopAuto()
  currentStep.value = 0
}

function toggleAuto() {
  sound.play('click')
  if (isAutoRunning.value) {
    stopAuto()
  } else {
    isAutoRunning.value = true
    timer = setInterval(() => {
      if (currentStep.value < nodes.length) {
        stepForward()
      } else {
        stopAuto()
      }
    }, 1200)
  }
}

function stopAuto() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  isAutoRunning.value = false
}

onUnmounted(() => {
  stopAuto()
})

const traversalCode = `// Traversal Algorithm: O(n) Time, O(1) Space
let current = head;

while (current !== null) {
  console.log("Visiting value:", current.val);
  console.log("Memory address:", current.addr);
  current = current.next; // Advance pointer to next heap node
}`
</script>

<template>
  <div class="space-y-2.5 sm:space-y-3 w-full mx-auto">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111111] pb-2">
      <div>
        <div class="flex items-center gap-2">
          <BrutalBadge variant="mint" size="sm">TOPIC III</BrutalBadge>
          <span class="font-mono text-xs text-neutral-600 font-bold"
            >HEAP DYNAMICS & TRAVERSAL</span
          >
        </div>
        <h2 class="font-display text-xl sm:text-2xl uppercase tracking-tight mt-0.5">
          III. HOW A LINKED LIST WORKS
        </h2>
      </div>
      <div class="font-mono text-xs text-neutral-600 hidden sm:block text-right">
        <p>Non-Contiguous RAM Representation</p>
        <p class="text-[10px] text-neutral-500">Physical vs Logical Layout</p>
      </div>
    </div>

    <!-- Main Traversal Simulator Box -->
    <div class="border-2 border-[#111111] bg-white p-3 sm:p-3.5 shadow-[5px_5px_0px_#111111]">
      <div
        class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-[#111111] mb-2"
      >
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 bg-[#ff3d81] border border-black animate-pulse"></div>
          <span class="font-display text-xs sm:text-sm uppercase">LOGICAL SEQUENCE DIAGRAM</span>
        </div>

        <!-- Traversal Controls -->
        <div class="flex items-center gap-1.5">
          <BrutalButton variant="yellow" size="sm" @click="stepForward">
            <SkipForward class="w-3 h-3" />
            <span>STEP NEXT</span>
          </BrutalButton>

          <BrutalButton :variant="isAutoRunning ? 'coral' : 'mint'" size="sm" @click="toggleAuto">
            <component :is="isAutoRunning ? Pause : Play" class="w-3 h-3" />
            <span>{{ isAutoRunning ? 'PAUSE' : 'AUTO RUN' }}</span>
          </BrutalButton>

          <BrutalButton variant="white" size="sm" @click="resetSimulation">
            <RotateCcw class="w-3 h-3" />
            <span>RESET</span>
          </BrutalButton>
        </div>
      </div>

      <!-- Logical Diagram: Head -> [10 | •] -> [20 | •] -> [30 | null] -->
      <div
        class="pt-7 pb-4 sm:pt-8 sm:pb-5 flex items-center justify-start sm:justify-center overflow-x-auto gap-2 sm:gap-3 px-2 scrollbar-thin"
      >
        <!-- HEAD variable -->
        <div class="flex-shrink-0 flex flex-col items-center">
          <div class="h-7 flex items-center justify-center">
            <span
              v-if="currentStep === 0"
              class="font-mono text-[10px] font-black bg-[#ffd23f] border border-black px-1.5 py-0.5 animate-bounce shadow-[1px_1px_0_#000]"
            >
              start!
            </span>
          </div>
          <div
            class="px-3 py-2 bg-[#3ddc97] border-2 border-black font-mono font-bold text-xs shadow-[3px_3px_0_#111]"
          >
            HEAD
          </div>
          <span class="text-[10px] font-mono text-neutral-600 mt-1">holds 0x10A</span>
        </div>

        <svg class="w-8 h-6 flex-shrink-0 text-black" viewBox="0 0 40 24" fill="none">
          <line
            x1="2"
            y1="12"
            x2="32"
            y2="12"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
          <polygon points="30,7 39,12 30,17" fill="currentColor" />
        </svg>

        <!-- Node 1: 10 -->
        <div
          class="flex-shrink-0 flex flex-col items-center transition-all duration-300"
          :class="currentStep === 0 ? 'scale-105 -translate-y-1' : ''"
        >
          <div class="h-7 flex items-center justify-center">
            <span
              v-if="currentStep === 0"
              class="font-mono text-xs font-bold px-2 py-0.5 bg-[#ffd23f] border border-black shadow-[1px_1px_0_#000] animate-bounce whitespace-nowrap"
            >
              curr ⬇
            </span>
          </div>
          <div
            class="flex border-2 border-black shadow-[5px_5px_0_#111] overflow-hidden"
            :class="currentStep === 0 ? 'ring-4 ring-[#ff3d81] bg-[#ffeef4]' : 'bg-white'"
          >
            <div class="px-4 py-3 border-r-2 border-black font-display text-xl bg-[#ffd23f]">
              10
            </div>
            <div class="px-3 py-3 bg-[#fdf9f0] flex items-center justify-center font-mono text-xs">
              <span class="w-3 h-3 rounded-full bg-black"></span>
            </div>
          </div>
          <div class="font-mono text-[10px] text-neutral-600 mt-1">addr: 0x10A</div>
        </div>

        <svg class="w-8 h-6 flex-shrink-0 text-black" viewBox="0 0 40 24" fill="none">
          <line
            x1="2"
            y1="12"
            x2="32"
            y2="12"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
          <polygon points="30,7 39,12 30,17" fill="currentColor" />
        </svg>

        <!-- Node 2: 20 -->
        <div
          class="flex-shrink-0 flex flex-col items-center transition-all duration-300"
          :class="currentStep === 1 ? 'scale-105 -translate-y-1' : ''"
        >
          <div class="h-7 flex items-center justify-center">
            <span
              v-if="currentStep === 1"
              class="font-mono text-xs font-bold px-2 py-0.5 bg-[#ffd23f] border border-black shadow-[1px_1px_0_#000] animate-bounce whitespace-nowrap"
            >
              curr ⬇
            </span>
          </div>
          <div
            class="flex border-2 border-black shadow-[5px_5px_0_#111] overflow-hidden"
            :class="currentStep === 1 ? 'ring-4 ring-[#ff3d81] bg-[#ffeef4]' : 'bg-white'"
          >
            <div class="px-4 py-3 border-r-2 border-black font-display text-xl bg-[#c8a2ff]">
              20
            </div>
            <div class="px-3 py-3 bg-[#fdf9f0] flex items-center justify-center font-mono text-xs">
              <span class="w-3 h-3 rounded-full bg-black"></span>
            </div>
          </div>
          <div class="font-mono text-[10px] text-neutral-600 mt-1">addr: 0x4F2</div>
        </div>

        <svg class="w-8 h-6 flex-shrink-0 text-black" viewBox="0 0 40 24" fill="none">
          <line
            x1="2"
            y1="12"
            x2="32"
            y2="12"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
          <polygon points="30,7 39,12 30,17" fill="currentColor" />
        </svg>

        <!-- Node 3: 30 -->
        <div
          class="flex-shrink-0 flex flex-col items-center transition-all duration-300"
          :class="currentStep === 2 ? 'scale-105 -translate-y-1' : ''"
        >
          <div class="h-7 flex items-center justify-center">
            <span
              v-if="currentStep === 2"
              class="font-mono text-xs font-bold px-2 py-0.5 bg-[#ffd23f] border border-black shadow-[1px_1px_0_#000] animate-bounce whitespace-nowrap"
            >
              curr ⬇
            </span>
          </div>
          <div
            class="flex border-2 border-black shadow-[5px_5px_0_#111] overflow-hidden"
            :class="currentStep === 2 ? 'ring-4 ring-[#ff3d81] bg-[#ffeef4]' : 'bg-white'"
          >
            <div class="px-4 py-3 border-r-2 border-black font-display text-xl bg-[#3ddc97]">
              30
            </div>
            <div class="px-3 py-3 bg-[#fdf9f0] flex items-center justify-center font-mono text-xs">
              <span class="w-3 h-3 rounded-full bg-black"></span>
            </div>
          </div>
          <div class="font-mono text-[10px] text-neutral-600 mt-1">addr: 0x88C</div>
        </div>

        <svg class="w-8 h-6 flex-shrink-0 text-black" viewBox="0 0 40 24" fill="none">
          <line
            x1="2"
            y1="12"
            x2="32"
            y2="12"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
          <polygon points="30,7 39,12 30,17" fill="currentColor" />
        </svg>

        <!-- NULL -->
        <div
          class="flex-shrink-0 flex flex-col items-center transition-all duration-300"
          :class="currentStep === 3 ? 'scale-105 -translate-y-1' : ''"
        >
          <div class="h-7 flex items-center justify-center">
            <span
              v-if="currentStep === 3"
              class="font-mono text-xs font-bold px-2 py-0.5 bg-[#ff6b5e] border border-black shadow-[1px_1px_0_#000] text-black animate-bounce whitespace-nowrap"
            >
              STOP (null)
            </span>
          </div>
          <div
            class="px-3.5 py-3 border-2 border-black font-mono font-black text-base shadow-[4px_4px_0_#111]"
            :class="
              currentStep === 3
                ? 'bg-[#ff6b5e] text-black ring-4 ring-black'
                : 'bg-[#ffe4e1] text-black'
            "
          >
            null
          </div>
          <span class="text-[10px] font-mono text-neutral-500 mt-1">terminal</span>
        </div>
      </div>

      <!-- Live Pointer State Banner -->
      <div
        class="bg-[#fdf9f0] border-2 border-[#111111] p-2 shadow-[2px_2px_0px_#111111] grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-xs"
      >
        <div>
          <span class="text-neutral-500 block text-[9px]">CURRENT POINTER:</span>
          <span
            class="font-bold text-black bg-white px-1.5 py-0.5 border border-black inline-block mt-0.5 text-xs"
          >
            {{ nodes[currentStep]?.addr || 'null (0x0)' }}
          </span>
        </div>
        <div>
          <span class="text-neutral-500 block text-[9px]">CURRENT.VAL:</span>
          <span
            class="font-bold text-[#ff3d81] bg-white px-1.5 py-0.5 border border-black inline-block mt-0.5 text-xs"
          >
            {{ nodes[currentStep]?.val !== undefined ? nodes[currentStep]?.val : 'undefined' }}
          </span>
        </div>
        <div>
          <span class="text-neutral-500 block text-[9px]">CURRENT.NEXT:</span>
          <span
            class="font-bold text-[#3ddc97] bg-white px-1.5 py-0.5 border border-black inline-block mt-0.5 text-xs"
          >
            {{ nodes[currentStep]?.nextAddr || 'none' }}
          </span>
        </div>
        <div>
          <span class="text-neutral-500 block text-[9px]">TRAVERSAL STATUS:</span>
          <span
            class="font-bold px-1.5 py-0.5 border border-black inline-block mt-0.5 text-xs"
            :class="currentStep === 3 ? 'bg-[#ff6b5e] text-black' : 'bg-[#ffd23f] text-black'"
          >
            {{ currentStep === 3 ? 'TERMINATED' : `STEP ${currentStep + 1} OF 3` }}
          </span>
        </div>
      </div>
    </div>

    <!-- Heap Memory Reality vs Code Snippet (2 columns) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
      <!-- Physical Heap Layout (7 cols) -->
      <div
        class="lg:col-span-7 bg-white border-2 border-[#111111] p-2.5 sm:p-3 shadow-[4px_4px_0px_#111111] space-y-2"
      >
        <div class="flex items-center justify-between pb-1.5 border-b-2 border-[#111111]">
          <span class="font-display text-xs sm:text-sm uppercase flex items-center gap-1.5">
            <Cpu class="w-3.5 h-3.5 text-[#ff3d81]" />
            PHYSICAL RAM HEAP ALLOCATION (NON-CONTIGUOUS)
          </span>
          <BrutalBadge variant="pink" size="sm">SCATTERED</BrutalBadge>
        </div>

        <p class="font-body text-xs text-neutral-700">
          Unlike an array where all elements sit consecutively in memory, each linked list node is
          independently allocated in whatever free heap block is available:
        </p>

        <!-- Simulated RAM memory block grid -->
        <div
          class="grid grid-cols-6 gap-1.5 p-2 bg-[#fdf9f0] border-2 border-black font-mono text-[10px]"
        >
          <div class="border border-neutral-300 p-1.5 bg-neutral-100 text-neutral-400 text-center">
            0x100<br />[unused]
          </div>
          <div
            class="border-2 border-black p-1.5 bg-[#ffd23f] font-bold text-center shadow-[1px_1px_0_#111]"
          >
            0x10A<br />[10 | 0x4F2]
          </div>
          <div class="border border-neutral-300 p-1.5 bg-neutral-100 text-neutral-400 text-center">
            0x2A0<br />[OS cache]
          </div>
          <div
            class="border-2 border-black p-1.5 bg-[#3ddc97] font-bold text-center shadow-[1px_1px_0_#111]"
          >
            0x88C<br />[30 | null]
          </div>
          <div class="border border-neutral-300 p-1.5 bg-neutral-100 text-neutral-400 text-center">
            0x3B8<br />[unused]
          </div>
          <div
            class="border-2 border-black p-1.5 bg-[#c8a2ff] font-bold text-center shadow-[1px_1px_0_#111]"
          >
            0x4F2<br />[20 | 0x88C]
          </div>
        </div>

        <div
          class="p-2.5 bg-[#ffe066]/30 border border-black font-body text-xs text-neutral-800 flex items-start gap-2"
        >
          <span class="font-mono font-bold text-sm">💡</span>
          <div>
            <strong>Key Insight:</strong> The order of nodes in physical memory (0x10A → 0x88C →
            0x4F2) does <em>not</em> need to match the logical order (10 → 20 → 30). The
            <strong class="underline">pointer address</strong> provides the logical thread!
          </div>
        </div>
      </div>

      <!-- Traversal Code (5 cols) -->
      <div class="lg:col-span-5">
        <CodeSnippet :code="traversalCode" lang="javascript" title="POINTER TRAVERSAL" />
      </div>
    </div>
  </div>
</template>
