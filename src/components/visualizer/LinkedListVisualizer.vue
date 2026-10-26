<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useVisualizerStore } from '../../stores/visualizer'
import BrutalButton from '../common/BrutalButton.vue'
import BrutalBadge from '../common/BrutalBadge.vue'
import {
  PlusCircle,
  Trash2,
  Search,
  RotateCw,
  RefreshCw,
  ArrowRight,
  Terminal,
  Activity,
  Layers
} from 'lucide-vue-next'

const visualizer = useVisualizerStore()

const inputVal = ref<number>(50)
const inputIndex = ref<number>(1)
const searchInput = ref<number>(78)
const deleteInput = ref<number>(45)

const scrollContainerRef = ref<HTMLElement | null>(null)
const nodeRefs = ref<HTMLElement[]>([])

function scrollToTail() {
  nextTick(() => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.scrollTo({
        left: scrollContainerRef.value.scrollWidth,
        behavior: 'smooth'
      })
    }
  })
}

// Automatically scroll to active/focused node during traversal, search, or insertion
watch(
  () => visualizer.activeIndex,
  (idx) => {
    if (idx !== null && idx !== undefined && nodeRefs.value[idx]) {
      nodeRefs.value[idx].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    }
  }
)

// Auto-scroll to tail when new nodes are added
watch(
  () => visualizer.nodes.length,
  (newLen, oldLen) => {
    if (newLen > oldLen) {
      scrollToTail()
    }
  }
)

function handleInsertHead() {
  visualizer.insertHead(inputVal.value)
  inputVal.value = Math.floor(Math.random() * 89) + 10
  nextTick(() => {
    if (scrollContainerRef.value) {
      scrollContainerRef.value.scrollTo({ left: 0, behavior: 'smooth' })
    }
  })
}

async function handleInsertTail() {
  const val = inputVal.value
  inputVal.value = Math.floor(Math.random() * 89) + 10
  await visualizer.insertTail(val)
  scrollToTail()
}

function handleInsertAt() {
  visualizer.insertAt(inputIndex.value, inputVal.value)
  inputVal.value = Math.floor(Math.random() * 89) + 10
}

function handleSearch() {
  visualizer.searchVal(searchInput.value)
}

function handleDeleteVal() {
  visualizer.deleteVal(deleteInput.value)
}
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Visualizer Canvas & Node Chain -->
    <div class="border-2 border-[#111111] bg-white p-4 sm:p-6 shadow-[6px_6px_0px_#111111] relative overflow-hidden">
      <!-- Canvas Header Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-[#111111]">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-[#3ddc97] border border-black animate-pulse"></div>
          <span class="font-display text-sm tracking-wide">HEAP MEMORY POINTER MAP</span>
          <BrutalBadge variant="yellow" size="sm">
            NODES: {{ visualizer.nodes.length }}
          </BrutalBadge>
        </div>

        <!-- Presets -->
        <div class="flex items-center gap-1.5 text-xs font-mono">
          <span class="text-neutral-500 mr-1 hidden sm:inline">PRESETS:</span>
          <button
            type="button"
            class="px-2 py-0.5 border border-black bg-[#fdf9f0] hover:bg-[#ffd23f] transition-colors shadow-[1px_1px_0_#000] cursor-pointer"
            :disabled="visualizer.isAnimating"
            @click="visualizer.resetPreset('default')"
          >
            DEFAULT
          </button>
          <button
            type="button"
            class="px-2 py-0.5 border border-black bg-[#fdf9f0] hover:bg-[#ffd23f] transition-colors shadow-[1px_1px_0_#000] cursor-pointer"
            :disabled="visualizer.isAnimating"
            @click="visualizer.resetPreset('large')"
          >
            6-NODES
          </button>
          <button
            type="button"
            class="px-2 py-0.5 border border-black bg-[#fdf9f0] hover:bg-[#ff6b5e] hover:text-white transition-colors shadow-[1px_1px_0_#000] cursor-pointer"
            :disabled="visualizer.isAnimating"
            @click="visualizer.resetPreset('empty')"
          >
            CLEAR
          </button>
        </div>
      </div>

      <!-- Linked List Nodes Display Area -->
      <div
        ref="scrollContainerRef"
        class="min-h-[160px] py-6 overflow-x-auto flex items-center justify-start gap-1 sm:gap-2 px-2 scrollbar-thin scroll-smooth"
      >
        <!-- Empty list indicator -->
        <div
          v-if="visualizer.nodes.length === 0"
          class="w-full py-8 text-center flex flex-col items-center justify-center font-mono"
        >
          <div class="p-3 bg-[#fdf9f0] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] inline-block mb-2">
            HEAD → <span class="text-[#ff6b5e] font-bold">null</span> (List is empty!)
          </div>
          <p class="text-xs text-neutral-500">Click "+ Head" or "+ Tail" below to allocate your first node.</p>
        </div>

        <!-- Head indicator -->
        <div v-if="visualizer.nodes.length > 0" class="flex-shrink-0 flex flex-col items-center mr-1">
          <span class="font-mono text-[10px] font-black px-1.5 py-0.5 bg-[#3ddc97] border border-black shadow-[1px_1px_0_#000] mb-1">
            HEAD
          </span>
          <span class="font-mono text-xs font-bold">▶</span>
        </div>

        <!-- Nodes sequence -->
        <template v-for="(node, index) in visualizer.nodes" :key="node.id">
          <!-- The Node Card -->
          <div
            :ref="(el) => { if (el) nodeRefs[index] = el as HTMLElement }"
            class="flex-shrink-0 flex flex-col items-center transition-all duration-300 relative group"
            :class="[
              visualizer.activeIndex === index
                ? 'scale-105 -translate-y-2'
                : node.status === 'matched'
                ? 'scale-110 -translate-y-2'
                : ''
            ]"
          >
            <!-- Pointer indicator on top -->
            <div class="h-6 flex items-center justify-center font-mono text-[11px] font-bold">
              <span
                v-if="visualizer.activeIndex === index"
                class="bg-[#ffd23f] border border-black px-1.5 py-0.5 shadow-[1px_1px_0_#000] animate-bounce text-black"
              >
                curr ⬇
              </span>
              <span
                v-else-if="node.status === 'matched'"
                class="bg-[#3ddc97] border border-black px-1.5 py-0.5 shadow-[1px_1px_0_#000] text-black"
              >
                FOUND!
              </span>
              <span v-else-if="index === visualizer.nodes.length - 1" class="text-[10px] font-mono text-neutral-500">
                [tail]
              </span>
            </div>

            <!-- Atomic Node Box (Data | Next) -->
            <div
              class="flex border-2 border-[#111111] shadow-[4px_4px_0px_#111111] transition-colors overflow-hidden"
              :class="[
                visualizer.activeIndex === index
                  ? 'border-[#ff3d81] ring-2 ring-[#ff3d81] bg-[#ffeef4]'
                  : node.status === 'matched'
                  ? 'bg-[#d8fae9]'
                  : 'bg-white'
              ]"
            >
              <!-- Data compartment -->
              <div
                class="px-3.5 py-2.5 flex flex-col items-center justify-center border-r-2 border-[#111111]"
                :class="index === 0 ? 'bg-[#3ddc97]/20' : ''"
              >
                <span class="text-[9px] font-mono text-neutral-600 font-bold uppercase tracking-wider">val</span>
                <span class="font-display text-lg sm:text-xl text-[#111111]">{{ node.val }}</span>
              </div>

              <!-- Next Pointer compartment -->
              <div class="px-2.5 py-2.5 bg-[#fdf9f0] flex flex-col items-center justify-center min-w-[44px]">
                <span class="text-[9px] font-mono text-neutral-600 font-bold uppercase">next</span>
                <div class="w-3.5 h-3.5 rounded-full bg-[#111111] flex items-center justify-center mt-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#ffd23f]"></div>
                </div>
              </div>
            </div>

            <!-- Memory Address badge below node -->
            <div class="mt-2 text-center">
              <span class="font-mono text-[10px] px-1.5 py-0.5 bg-[#fdf9f0] border border-[#111111] text-neutral-700 shadow-[1px_1px_0_#000]">
                addr: <span class="font-bold text-black">{{ node.address }}</span>
              </span>
            </div>
          </div>

          <!-- Pointer Arrow to Next Node -->
          <div class="flex-shrink-0 flex items-center px-1">
            <svg class="w-7 h-6 sm:w-9 sm:h-6 text-[#111111]" viewBox="0 0 40 24" fill="none">
              <line x1="2" y1="12" x2="32" y2="12" stroke="#111111" stroke-width="3" stroke-linecap="round" />
              <polygon points="30,7 39,12 30,17" fill="#111111" />
            </svg>
          </div>
        </template>

        <!-- Final Null Node Box -->
        <div v-if="visualizer.nodes.length > 0" class="flex-shrink-0 flex flex-col items-center">
          <div class="h-6"></div>
          <div class="px-3 py-2.5 bg-[#ff6b5e] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] font-mono font-bold text-sm text-black flex items-center gap-1">
            <span>null</span>
            <span class="text-xs">∅</span>
          </div>
          <span class="mt-2 text-[10px] font-mono text-neutral-500">end</span>
        </div>
      </div>
    </div>

    <!-- Controls Panel & Terminal Split -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Interactive Action Buttons (8 cols) -->
      <div class="lg:col-span-7 bg-[#fdf9f0] border-2 border-[#111111] p-4 shadow-[5px_5px_0px_#111111] space-y-3">
        <div class="flex items-center justify-between pb-2 border-b-2 border-[#111111]">
          <span class="font-display text-xs sm:text-sm uppercase flex items-center gap-1.5">
            <Activity class="w-4 h-4 text-[#ff3d81]" />
            RUN OPERATIONS (MUTATE POINTERS)
          </span>
        </div>

        <!-- Input Row -->
        <div class="flex flex-wrap items-center gap-2 font-mono text-xs">
          <label class="flex items-center gap-1.5 bg-white border-2 border-[#111111] px-2.5 py-1.5 shadow-[2px_2px_0px_#111111]">
            <span class="font-bold text-neutral-600">VAL:</span>
            <input
              v-model.number="inputVal"
              type="number"
              class="w-14 font-mono font-bold text-sm outline-none bg-transparent"
              :disabled="visualizer.isAnimating"
            />
          </label>

          <label class="flex items-center gap-1.5 bg-white border-2 border-[#111111] px-2.5 py-1.5 shadow-[2px_2px_0px_#111111]">
            <span class="font-bold text-neutral-600">INDEX:</span>
            <input
              v-model.number="inputIndex"
              type="number"
              min="0"
              :max="visualizer.nodes.length"
              class="w-12 font-mono font-bold text-sm outline-none bg-transparent"
              :disabled="visualizer.isAnimating"
            />
          </label>
        </div>

        <!-- Operation Action Groups -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <!-- Insert Head O(1) -->
          <BrutalButton
            variant="mint"
            size="sm"
            :disabled="visualizer.isAnimating"
            class="justify-start text-xs"
            @click="handleInsertHead"
          >
            <PlusCircle class="w-3.5 h-3.5 flex-shrink-0" />
            <span>+ Head <span class="text-[10px] opacity-75 font-mono">O(1)</span></span>
          </BrutalButton>

          <!-- Insert Tail O(1) -->
          <BrutalButton
            variant="mint"
            size="sm"
            :disabled="visualizer.isAnimating"
            class="justify-start text-xs"
            @click="handleInsertTail"
          >
            <PlusCircle class="w-3.5 h-3.5 flex-shrink-0" />
            <span>+ Tail <span class="text-[10px] opacity-75 font-mono">O(1)</span></span>
          </BrutalButton>

          <!-- Insert At Index O(n) -->
          <BrutalButton
            variant="yellow"
            size="sm"
            :disabled="visualizer.isAnimating"
            class="justify-start text-xs"
            @click="handleInsertAt"
          >
            <PlusCircle class="w-3.5 h-3.5 flex-shrink-0" />
            <span>+ At Idx <span class="text-[10px] opacity-75 font-mono">O(n)</span></span>
          </BrutalButton>

          <!-- Delete Head O(1) -->
          <BrutalButton
            variant="coral"
            size="sm"
            :disabled="visualizer.isAnimating || visualizer.nodes.length === 0"
            class="justify-start text-xs"
            @click="visualizer.deleteHead"
          >
            <Trash2 class="w-3.5 h-3.5 flex-shrink-0" />
            <span>- Head <span class="text-[10px] opacity-75 font-mono">O(1)</span></span>
          </BrutalButton>

          <!-- Delete Tail O(n) -->
          <BrutalButton
            variant="coral"
            size="sm"
            :disabled="visualizer.isAnimating || visualizer.nodes.length === 0"
            class="justify-start text-xs"
            @click="visualizer.deleteTail"
          >
            <Trash2 class="w-3.5 h-3.5 flex-shrink-0" />
            <span>- Tail <span class="text-[10px] opacity-75 font-mono">O(n)</span></span>
          </BrutalButton>

          <!-- Reverse List O(n) -->
          <BrutalButton
            variant="lilac"
            size="sm"
            :disabled="visualizer.isAnimating || visualizer.nodes.length < 2"
            class="justify-start text-xs"
            @click="visualizer.reverseList"
          >
            <RotateCw class="w-3.5 h-3.5 flex-shrink-0" />
            <span>Reverse <span class="text-[10px] opacity-75 font-mono">O(n)</span></span>
          </BrutalButton>
        </div>

        <!-- Search & Delete Value Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <!-- Search linear traversal -->
          <div class="flex items-center gap-1.5 bg-white border-2 border-[#111111] p-1 shadow-[2px_2px_0px_#111111]">
            <input
              v-model.number="searchInput"
              type="number"
              placeholder="Search val"
              class="w-full font-mono text-xs px-2 py-1 outline-none bg-transparent"
              :disabled="visualizer.isAnimating"
            />
            <button
              type="button"
              class="brutal-btn bg-[#ffd23f] px-2.5 py-1 text-xs font-mono font-bold border border-black shadow-[1px_1px_0_#000] flex items-center gap-1"
              :disabled="visualizer.isAnimating"
              @click="handleSearch"
            >
              <Search class="w-3 h-3" />
              <span>FIND</span>
            </button>
          </div>

          <!-- Delete specific value -->
          <div class="flex items-center gap-1.5 bg-white border-2 border-[#111111] p-1 shadow-[2px_2px_0px_#111111]">
            <input
              v-model.number="deleteInput"
              type="number"
              placeholder="Delete val"
              class="w-full font-mono text-xs px-2 py-1 outline-none bg-transparent"
              :disabled="visualizer.isAnimating"
            />
            <button
              type="button"
              class="brutal-btn bg-[#ff6b5e] text-black px-2.5 py-1 text-xs font-mono font-bold border border-black shadow-[1px_1px_0_#000] flex items-center gap-1"
              :disabled="visualizer.isAnimating"
              @click="handleDeleteVal"
            >
              <Trash2 class="w-3 h-3" />
              <span>DEL</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Live Pointer Log Terminal (5 cols) -->
      <div class="lg:col-span-5 bg-[#111111] text-[#fdf9f0] border-2 border-[#111111] shadow-[5px_5px_0px_#111111] flex flex-col overflow-hidden">
        <div class="bg-[#222222] px-3 py-1.5 border-b-2 border-[#333333] flex items-center justify-between text-xs font-mono">
          <div class="flex items-center gap-1.5">
            <Terminal class="w-3.5 h-3.5 text-[#3ddc97]" />
            <span class="font-bold text-[#ffd23f]">POINTER OPERATIONS LOG</span>
          </div>
          <span class="text-[10px] text-neutral-400">HEAP_TRACE</span>
        </div>

        <div class="p-3 font-mono text-xs space-y-1.5 overflow-y-auto max-h-[160px] scrollbar-thin">
          <div
            v-for="log in visualizer.logs"
            :key="log.id"
            class="text-[11px] leading-tight pb-1 border-b border-[#222222]"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-neutral-500 text-[10px]">[{{ log.time }}]</span>
              <span
                class="font-bold text-[10px] px-1 border"
                :class="[
                  log.type === 'success'
                    ? 'bg-[#3ddc97] text-black border-black'
                    : log.type === 'warn'
                    ? 'bg-[#ff6b5e] text-black border-black'
                    : log.type === 'pointer'
                    ? 'bg-[#c8a2ff] text-black border-black'
                    : 'bg-[#ffd23f] text-black border-black'
                ]"
              >
                {{ log.action }}
              </span>
            </div>
            <p class="text-neutral-300 mt-0.5 pl-2">{{ log.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
