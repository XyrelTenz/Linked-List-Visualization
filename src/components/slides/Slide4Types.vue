<script setup lang="ts">
import { ref } from 'vue'
import BrutalBadge from '../common/BrutalBadge.vue'
import { sound } from '../../utils/sound'
import { ArrowRight, ArrowLeftRight, Repeat, RotateCw, Sparkles } from 'lucide-vue-next'

type ListType = 'singly' | 'doubly' | 'circ-singly' | 'circ-doubly'

const activeType = ref<ListType>('singly')
const activeNodeIndex = ref<number>(0)

const listTypes = [
  {
    id: 'singly' as ListType,
    name: 'Singly Linked List',
    badge: 'UNIDIRECTIONAL',
    color: 'yellow' as const,
    nodes: [10, 20, 30],
    icon: ArrowRight,
    summary: 'Each node stores data and a single pointer to the next node.',
    pros: 'Minimal memory overhead (1 pointer per node), simple implementation.',
    cons: 'Cannot traverse backward; deleting a node requires finding its predecessor.',
    useCases: 'Stacks, simple queues, symbol tables, graph adjacency lists.',
  },
  {
    id: 'doubly' as ListType,
    name: 'Doubly Linked List',
    badge: 'BIDIRECTIONAL',
    color: 'mint' as const,
    nodes: [10, 20, 30],
    icon: ArrowLeftRight,
    summary: 'Each node stores data, a next pointer, AND a previous pointer.',
    pros: 'Two-way traversal; O(1) node deletion when node reference is already held.',
    cons: 'Increased memory usage (2 pointers per node); more complex pointer updates.',
    useCases: 'Browser back/forward history, LRU Cache, text editor cursors, undo/redo.',
  },
  {
    id: 'circ-singly' as ListType,
    name: 'Circular Singly Linked',
    badge: 'LOOPING',
    color: 'lilac' as const,
    nodes: [10, 20, 30],
    icon: Repeat,
    summary: 'Identical to singly, but the tail node points back to the head instead of null.',
    pros: 'Any node can be a starting point; uninterrupted circular traversal.',
    cons: 'Risk of infinite loops if termination condition is improperly coded.',
    useCases: 'Round-robin CPU task scheduling, multiplayer turn rotations, music playlists.',
  },
  {
    id: 'circ-doubly' as ListType,
    name: 'Circular Doubly Linked',
    badge: 'FULL CIRCLE',
    color: 'pink' as const,
    nodes: [10, 20, 30],
    icon: RotateCw,
    summary: 'Doubly linked where head.prev points to tail, and tail.next points to head.',
    pros: 'Instant access to both ends; seamless bidirectional cyclic navigation.',
    cons: 'Highest complexity and pointer management overhead.',
    useCases: 'Advanced Fibonacci Heaps, carousel carousels, audio workstation loop tracks.',
  },
]

function setType(type: ListType) {
  activeType.value = type
  activeNodeIndex.value = 0
  sound.play('click')
}

function stepForward() {
  sound.play('step')
  if (activeType.value === 'circ-singly' || activeType.value === 'circ-doubly') {
    activeNodeIndex.value = (activeNodeIndex.value + 1) % 3
  } else {
    if (activeNodeIndex.value < 2) {
      activeNodeIndex.value++
    } else {
      activeNodeIndex.value = 0
    }
  }
}

function stepBackward() {
  sound.play('step')
  if (activeType.value === 'doubly' || activeType.value === 'circ-doubly') {
    if (activeNodeIndex.value > 0) {
      activeNodeIndex.value--
    } else if (activeType.value === 'circ-doubly') {
      activeNodeIndex.value = 2
    }
  }
}
</script>

<template>
  <div class="space-y-2.5 sm:space-y-3 w-full mx-auto">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111111] pb-2">
      <div>
        <div class="flex items-center gap-2">
          <BrutalBadge variant="lilac" size="sm">TOPIC IV</BrutalBadge>
          <span class="font-mono text-xs text-neutral-600 font-bold">STRUCTURAL VARIATIONS</span>
        </div>
        <h2 class="font-display text-xl sm:text-2xl uppercase tracking-tight mt-0.5">
          IV. TYPES OF LINKED LISTS
        </h2>
      </div>
      <div class="font-mono text-xs text-neutral-600 hidden sm:block text-right">
        <p>4 Core Variants</p>
        <p class="text-[10px] text-neutral-500">Unidirectional vs Bidirectional vs Circular</p>
      </div>
    </div>

    <!-- Interactive Schematic Player (Top Hero) -->
    <div
      class="border-2 border-[#111111] bg-white p-3 sm:p-3.5 shadow-[5px_5px_0px_#111111] relative overflow-hidden"
    >
      <div
        class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-[#111111] mb-2"
      >
        <div class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-[#ff3d81]" />
          <span class="font-display text-xs sm:text-sm uppercase"
            >ACTIVE SCHEMATIC: {{ listTypes.find((t) => t.id === activeType)?.name }}</span
          >
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="activeType === 'doubly' || activeType === 'circ-doubly'"
            type="button"
            class="brutal-btn bg-[#ffd23f] px-2 py-0.5 text-xs font-mono font-bold flex items-center gap-1"
            @click="stepBackward"
          >
            <span>◀ PREV</span>
          </button>
          <button
            type="button"
            class="brutal-btn bg-[#3ddc97] px-2 py-0.5 text-xs font-mono font-bold flex items-center gap-1"
            @click="stepForward"
          >
            <span>NEXT ▶</span>
          </button>
        </div>
      </div>

      <!-- Schematic Diagram Area with SVG Pointers -->
      <div
        class="py-2 px-2 flex flex-col items-center justify-center min-h-[95px] relative overflow-x-auto"
      >
        <!-- SVG Canvas for circular links -->
        <svg
          v-if="activeType === 'circ-singly' || activeType === 'circ-doubly'"
          class="absolute inset-0 w-full h-full pointer-events-none"
        >
          <!-- Forward circular loop: tail to head (bottom arc) -->
          <path
            d="M 660 70 C 660 98, 240 98, 240 70"
            fill="none"
            stroke="#ff3d81"
            stroke-width="2.5"
            stroke-dasharray="5,3"
          />
          <polygon points="244,70 236,78 248,78" fill="#ff3d81" />

          <!-- Backward circular loop if circ-doubly: head to tail (top arc) -->
          <path
            v-if="activeType === 'circ-doubly'"
            d="M 240 25 C 240 2, 660 2, 660 25"
            fill="none"
            stroke="#3ddc97"
            stroke-width="2.5"
            stroke-dasharray="5,3"
          />
          <polygon points="656,25 664,17 652,17" fill="#3ddc97" />
        </svg>

        <!-- Nodes sequence -->
        <div class="flex items-center justify-center gap-2 sm:gap-4 relative z-10">
          <!-- HEAD Label -->
          <div class="flex flex-col items-center mr-1">
            <span
              class="font-mono text-[10px] font-black px-2 py-0.5 bg-[#3ddc97] border border-black shadow-[1px_1px_0_#111]"
            >
              HEAD
            </span>
          </div>

          <!-- NODE 1 -->
          <div
            class="flex flex-col items-center transition-all duration-200"
            :class="activeNodeIndex === 0 ? 'scale-105 -translate-y-1' : ''"
          >
            <span
              v-if="activeNodeIndex === 0"
              class="font-mono text-[9px] bg-[#ffd23f] border border-black px-1.5 py-0.2 mb-0.5 animate-bounce"
            >
              active
            </span>
            <div class="flex border-2 border-black shadow-[3px_3px_0_#111] bg-white">
              <!-- prev pointer box for doubly -->
              <div
                v-if="activeType === 'doubly' || activeType === 'circ-doubly'"
                class="px-1.5 py-1.5 bg-[#fdf9f0] border-r border-black font-mono text-[9px] flex items-center justify-center"
              >
                {{ activeType === 'circ-doubly' ? '⟲' : 'null' }}
              </div>
              <div class="px-2.5 py-1.5 font-display text-sm sm:text-base bg-[#ffd23f] border-r-2 border-black">
                10
              </div>
              <div
                class="px-2 py-1.5 bg-[#fdf9f0] flex items-center justify-center font-mono text-xs"
              >
                <span class="w-2 h-2 rounded-full bg-black"></span>
              </div>
            </div>
            <span class="text-[9px] font-mono text-neutral-500 mt-0.5">Node 0</span>
          </div>

          <!-- POINTER BETWEEN 1 AND 2 -->
          <div class="flex flex-col items-center px-0.5">
            <svg class="w-6 h-3 text-black" viewBox="0 0 32 16" fill="none">
              <line x1="2" y1="8" x2="26" y2="8" stroke="currentColor" stroke-width="2.5" />
              <polygon points="24,4 30,8 24,12" fill="currentColor" />
            </svg>
            <svg
              v-if="activeType === 'doubly' || activeType === 'circ-doubly'"
              class="w-6 h-3 text-[#3ddc97] -mt-1"
              viewBox="0 0 32 16"
              fill="none"
            >
              <line x1="6" y1="8" x2="30" y2="8" stroke="currentColor" stroke-width="2.5" />
              <polygon points="8,4 2,8 8,12" fill="currentColor" />
            </svg>
          </div>

          <!-- NODE 2 -->
          <div
            class="flex flex-col items-center transition-all duration-200"
            :class="activeNodeIndex === 1 ? 'scale-105 -translate-y-1' : ''"
          >
            <span
              v-if="activeNodeIndex === 1"
              class="font-mono text-[9px] bg-[#ffd23f] border border-black px-1.5 py-0.2 mb-0.5 animate-bounce"
            >
              active
            </span>
            <div class="flex border-2 border-black shadow-[3px_3px_0_#111] bg-white">
              <div
                v-if="activeType === 'doubly' || activeType === 'circ-doubly'"
                class="px-1.5 py-1.5 bg-[#fdf9f0] border-r border-black font-mono text-[9px] flex items-center justify-center"
              >
                {{ activeType === 'circ-doubly' ? '⟲' : 'Node 0' }}
              </div>
              <div class="px-2.5 py-1.5 font-display text-sm sm:text-base bg-[#c8a2ff] border-r-2 border-black">
                20
              </div>
              <div
                class="px-2 py-1.5 bg-[#fdf9f0] flex items-center justify-center font-mono text-xs"
              >
                <span class="w-2 h-2 rounded-full bg-black"></span>
              </div>
            </div>
            <span class="text-[9px] font-mono text-neutral-500 mt-0.5">Node 1</span>
          </div>

          <!-- POINTER BETWEEN 2 AND 3 -->
          <div class="flex flex-col items-center px-0.5">
            <svg class="w-6 h-3 text-black" viewBox="0 0 32 16" fill="none">
              <line x1="2" y1="8" x2="26" y2="8" stroke="currentColor" stroke-width="2.5" />
              <polygon points="24,4 30,8 24,12" fill="currentColor" />
            </svg>
            <svg
              v-if="activeType === 'doubly' || activeType === 'circ-doubly'"
              class="w-6 h-3 text-[#3ddc97] -mt-1"
              viewBox="0 0 32 16"
              fill="none"
            >
              <line x1="6" y1="8" x2="30" y2="8" stroke="currentColor" stroke-width="2.5" />
              <polygon points="8,4 2,8 8,12" fill="currentColor" />
            </svg>
          </div>

          <!-- NODE 3 (TAIL) -->
          <div
            class="flex flex-col items-center transition-all duration-200"
            :class="activeNodeIndex === 2 ? 'scale-105 -translate-y-1' : ''"
          >
            <span
              v-if="activeNodeIndex === 2"
              class="font-mono text-[9px] bg-[#ffd23f] border border-black px-1.5 py-0.2 mb-0.5 animate-bounce"
            >
              active
            </span>
            <div class="flex border-2 border-black shadow-[3px_3px_0_#111] bg-white">
              <div
                v-if="activeType === 'doubly' || activeType === 'circ-doubly'"
                class="px-1.5 py-1.5 bg-[#fdf9f0] border-r border-black font-mono text-[9px] flex items-center justify-center"
              >
                {{ activeType === 'circ-doubly' ? '⟲' : 'Node 1' }}
              </div>
              <div class="px-2.5 py-1.5 font-display text-sm sm:text-base bg-[#3ddc97] border-r-2 border-black">
                30
              </div>
              <div
                class="px-2 py-1.5 bg-[#fdf9f0] flex items-center justify-center font-mono text-xs"
              >
                <span class="w-2 h-2 rounded-full bg-black"></span>
              </div>
            </div>
            <span class="text-[9px] font-mono text-neutral-500 mt-0.5">Node 2 [TAIL]</span>
          </div>

          <!-- Terminal Null (only for non-circular) -->
          <template v-if="activeType === 'singly' || activeType === 'doubly'">
            <svg class="w-6 h-3 text-black" viewBox="0 0 32 16" fill="none">
              <line x1="2" y1="8" x2="26" y2="8" stroke="currentColor" stroke-width="2.5" />
              <polygon points="24,4 30,8 24,12" fill="currentColor" />
            </svg>
            <div
              class="px-2 py-1 bg-[#ff6b5e] border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0_#111]"
            >
              null
            </div>
          </template>

          <!-- Circular Loop Indicator -->
          <div
            v-else
            class="ml-1 font-mono text-xs font-bold px-2 py-0.5 bg-[#ff3d81] text-white border border-black shadow-[2px_2px_0_#111]"
          >
            ⟳ loops to HEAD!
          </div>
        </div>
      </div>
    </div>

    <!-- 4-Card Comparison Matrix -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
      <div
        v-for="item in listTypes"
        :key="item.id"
        class="border-2 border-[#111111] p-2.5 sm:p-3 cursor-pointer transition-all duration-150 select-none flex flex-col justify-between"
        :class="[
          activeType === item.id
            ? 'bg-[#ffffff] shadow-[5px_5px_0px_#111111] -translate-x-0.5 -translate-y-0.5 ring-2 ring-[#111111]'
            : 'bg-[#ffffff] hover:bg-[#fffcf5] shadow-[3px_3px_0px_#111111]',
        ]"
        @click="setType(item.id)"
      >
        <div>
          <!-- Header -->
          <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b-2 border-[#111111]">
            <div class="flex items-center gap-1.5">
              <component :is="item.icon" class="w-3.5 h-3.5 text-black" />
              <h3 class="font-display text-xs sm:text-sm tracking-tight uppercase">{{ item.name }}</h3>
            </div>
            <BrutalBadge :variant="item.color" size="sm">{{ item.badge }}</BrutalBadge>
          </div>

          <p class="font-body text-xs text-neutral-800 font-medium mb-1.5">
            {{ item.summary }}
          </p>

          <!-- Pros / Cons -->
          <div class="space-y-1 text-xs font-body mb-1.5">
            <div class="flex items-start gap-1 text-neutral-700">
              <span class="text-[#3ddc97] font-bold text-xs leading-none">✓</span>
              <span><strong>Pros:</strong> {{ item.pros }}</span>
            </div>
            <div class="flex items-start gap-1 text-neutral-700">
              <span class="text-[#ff6b5e] font-bold text-xs leading-none">✕</span>
              <span><strong>Cons:</strong> {{ item.cons }}</span>
            </div>
          </div>
        </div>

        <div class="pt-1.5 border-t border-neutral-200">
          <p class="font-mono text-[10px] sm:text-[11px] text-neutral-600">
            <strong>Use cases:</strong> {{ item.useCases }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
