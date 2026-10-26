<script setup lang="ts">
import { ref } from 'vue'
import BrutalBadge from '../common/BrutalBadge.vue'
import { sound } from '../../utils/sound'
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-vue-next'

type FilterCategory = 'all' | 'memory' | 'performance' | 'engineering'
const activeFilter = ref<FilterCategory>('all')

const advantages = [
  {
    category: 'memory' as const,
    title: 'Dynamic Heap Sizing',
    summary: 'Grows and shrinks seamlessly node-by-node without pre-allocating large memory blocks or wasting unused buffer slots.'
  },
  {
    category: 'performance' as const,
    title: 'O(1) Insertion & Deletion at Head',
    summary: 'Inserting or deleting the first element requires updating only two pointer references. Zero memory element shifting is involved.'
  },
  {
    category: 'memory' as const,
    title: 'No Array Reallocation Spikes',
    summary: 'Dynamic arrays (like std::vector or JS Array) must double in capacity and copy all items when full. Linked lists never freeze on reallocation.'
  },
  {
    category: 'performance' as const,
    title: 'Fragmented Memory Utilization',
    summary: 'Can easily allocate nodes into small, scattered free RAM blocks where a large contiguous array would fail with an Out-Of-Memory error.'
  },
  {
    category: 'engineering' as const,
    title: 'Foundation for Advanced Topologies',
    summary: 'The primary architecture for building FIFO Queues, LRU Caches, Hash Table Separate Chaining buckets, and Adjacency Lists in Graphs.'
  }
]

const disadvantages = [
  {
    category: 'performance' as const,
    title: 'No Constant-Time Random Access (O(n))',
    summary: 'You cannot calculate `arr[i]` with memory math. To inspect element 500, you must traverse all 499 preceding nodes sequentially.'
  },
  {
    category: 'memory' as const,
    title: 'Significant Pointer Memory Overhead',
    summary: 'Each node carries 8 bytes (or 16 bytes for doubly) in 64-bit pointer references alongside the actual payload. For small types like chars or ints, overhead exceeds payload size!'
  },
  {
    category: 'performance' as const,
    title: 'Severely Degraded CPU Cache Locality',
    summary: 'Nodes are scattered arbitrarily across heap addresses. Modern CPU prefetchers cannot anticipate the next address, resulting in frequent L1/L2 cache misses.'
  },
  {
    category: 'engineering' as const,
    title: 'High Risk of Pointer Bugs & Leaks',
    summary: 'Dangling pointers, cycles causing infinite loops, and memory leaks (in unmanaged languages like C/C++) are common without careful discipline.'
  },
  {
    category: 'engineering' as const,
    title: 'Complex Bidirectional Management',
    summary: 'Reversing or traversing backward in a singly linked list requires recursive or multi-pointer overhead, or upgrading to doubly linked lists.'
  }
]

function setFilter(cat: FilterCategory) {
  activeFilter.value = cat
  sound.play('click')
}

function matchesFilter(item: { category: string }) {
  if (activeFilter.value === 'all') return true
  return item.category === activeFilter.value
}
</script>

<template>
  <div class="space-y-2 sm:space-y-2.5 w-full mx-auto">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111111] pb-2">
      <div>
        <div class="flex items-center gap-2">
          <BrutalBadge variant="mint" size="sm">TOPIC VII</BrutalBadge>
          <span class="font-mono text-xs text-neutral-600 font-bold">SYSTEMS ENGINEERING ANALYSIS</span>
        </div>
        <h2 class="font-display text-xl sm:text-2xl uppercase tracking-tight mt-0.5">
          VII. ADVANTAGES AND DISADVANTAGES
        </h2>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1 font-mono text-xs">
        <span class="text-neutral-500 mr-1 hidden sm:inline text-[11px]">FILTER:</span>
        <button
          type="button"
          class="px-2 py-0.5 border border-black font-bold cursor-pointer transition-colors text-xs"
          :class="activeFilter === 'all' ? 'bg-[#ffd23f] shadow-[2px_2px_0_#111]' : 'bg-white hover:bg-neutral-100'"
          @click="setFilter('all')"
        >
          ALL
        </button>
        <button
          type="button"
          class="px-2 py-0.5 border border-black font-bold cursor-pointer transition-colors text-xs"
          :class="activeFilter === 'performance' ? 'bg-[#ffd23f] shadow-[2px_2px_0_#111]' : 'bg-white hover:bg-neutral-100'"
          @click="setFilter('performance')"
        >
          SPEED
        </button>
        <button
          type="button"
          class="px-2 py-0.5 border border-black font-bold cursor-pointer transition-colors text-xs"
          :class="activeFilter === 'memory' ? 'bg-[#ffd23f] shadow-[2px_2px_0_#111]' : 'bg-white hover:bg-neutral-100'"
          @click="setFilter('memory')"
        >
          MEMORY
        </button>
        <button
          type="button"
          class="px-2 py-0.5 border border-black font-bold cursor-pointer transition-colors text-xs"
          :class="activeFilter === 'engineering' ? 'bg-[#ffd23f] shadow-[2px_2px_0_#111]' : 'bg-white hover:bg-neutral-100'"
          @click="setFilter('engineering')"
        >
          ENGINEERING
        </button>
      </div>
    </div>

    <!-- Mint Advantages vs Coral Disadvantages Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
      <!-- Advantages (Mint Accent) -->
      <div class="border-2 border-[#111111] bg-white shadow-[4px_4px_0px_#111111] flex flex-col justify-between overflow-hidden">
        <div>
          <!-- Header -->
          <div class="bg-[#3ddc97] p-2 sm:p-2.5 border-b-2 border-black flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <CheckCircle2 class="w-4 h-4 text-black stroke-[2.5]" />
              <h3 class="font-display text-xs sm:text-sm uppercase text-black">ADVANTAGES (STRENGTHS)</h3>
            </div>
            <span class="font-mono text-[10px] font-black bg-white px-1.5 py-0.2 border border-black shadow-[1px_1px_0_#111]">
              WHEN IT SHINES
            </span>
          </div>

          <!-- List Items -->
          <div class="p-2 sm:p-2.5 space-y-1 sm:space-y-1.5">
            <template v-for="(adv, i) in advantages" :key="adv.title">
              <div
                v-if="matchesFilter(adv)"
                class="p-1.5 sm:p-2 bg-[#fdf9f0] border border-black shadow-[1px_1px_0_#111] transition-transform hover:-translate-x-0.5"
              >
                <div class="flex items-center justify-between mb-0.5">
                  <h4 class="font-display text-xs uppercase text-black">{{ i + 1 }}. {{ adv.title }}</h4>
                  <span class="text-[8px] font-mono font-bold uppercase px-1 py-0.2 bg-[#3ddc97] border border-black">
                    {{ adv.category }}
                  </span>
                </div>
                <p class="font-body text-[11px] text-neutral-700 leading-snug">
                  {{ adv.summary }}
                </p>
              </div>
            </template>
          </div>
        </div>

        <div class="p-1.5 sm:p-2 bg-[#f3fbf6] border-t-2 border-black font-mono text-[10px] text-neutral-700 flex items-center gap-1">
          <span class="font-bold text-[#111]">Verdict:</span> Unbeatable for high-frequency prepends and unknown dynamic streams.
        </div>
      </div>

      <!-- Disadvantages (Coral Accent) -->
      <div class="border-2 border-[#111111] bg-white shadow-[4px_4px_0px_#111111] flex flex-col justify-between overflow-hidden">
        <div>
          <!-- Header -->
          <div class="bg-[#ff6b5e] p-2 sm:p-2.5 border-b-2 border-black flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <XCircle class="w-4 h-4 text-black stroke-[2.5]" />
              <h3 class="font-display text-xs sm:text-sm uppercase text-black">DISADVANTAGES (PITFALLS)</h3>
            </div>
            <span class="font-mono text-[10px] font-black bg-white px-1.5 py-0.2 border border-black shadow-[1px_1px_0_#111]">
              HIDDEN COSTS
            </span>
          </div>

          <!-- List Items -->
          <div class="p-2 sm:p-2.5 space-y-1 sm:space-y-1.5">
            <template v-for="(dis, i) in disadvantages" :key="dis.title">
              <div
                v-if="matchesFilter(dis)"
                class="p-1.5 sm:p-2 bg-[#fdf9f0] border border-black shadow-[1px_1px_0_#111] transition-transform hover:-translate-x-0.5"
              >
                <div class="flex items-center justify-between mb-0.5">
                  <h4 class="font-display text-xs uppercase text-black">{{ i + 1 }}. {{ dis.title }}</h4>
                  <span class="text-[8px] font-mono font-bold uppercase px-1 py-0.2 bg-[#ff6b5e] border border-black">
                    {{ dis.category }}
                  </span>
                </div>
                <p class="font-body text-[11px] text-neutral-700 leading-snug">
                  {{ dis.summary }}
                </p>
              </div>
            </template>
          </div>
        </div>

        <div class="p-1.5 sm:p-2 bg-[#fff5f4] border-t-2 border-black font-mono text-[10px] text-neutral-700 flex items-center gap-1">
          <span class="font-bold text-[#111]">Verdict:</span> Avoid when random index lookup or tight cache throughput is critical.
        </div>
      </div>
    </div>
  </div>
</template>
