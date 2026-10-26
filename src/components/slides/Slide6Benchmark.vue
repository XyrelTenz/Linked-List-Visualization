<script setup lang="ts">
import { ref } from 'vue'
import BrutalBadge from '../common/BrutalBadge.vue'
import BrutalButton from '../common/BrutalButton.vue'
import { sound } from '../../utils/sound'
import {
  Cpu,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-vue-next'

type LayoutMode = 'array' | 'linkedlist'
const layoutMode = ref<LayoutMode>('array')
const cacheTested = ref<boolean>(false)
const cacheMessage = ref<string>('')

function setLayout(mode: LayoutMode) {
  layoutMode.value = mode
  cacheTested.value = false
  cacheMessage.value = ''
  sound.play('click')
}

function testCacheLocality() {
  sound.play('step')
  cacheTested.value = true
  if (layoutMode.value === 'array') {
    cacheMessage.value = '🔥 99% CPU L1/L2 CACHE HIT: Adjacent elements are pre-fetched together into modern CPU 64-byte cache lines!'
    sound.play('success')
  } else {
    cacheMessage.value = '⚠️ CACHE MISS / POINTER CHASING: Nodes are scattered at random heap addresses. CPU must wait ~100-300 cycles fetching from RAM.'
    sound.play('remove')
  }
}

const comparisonRows = [
  {
    metric: 'Memory Allocation',
    arrayVal: 'Contiguous block (fixed / dynamic resize)',
    arrayBadge: 'yellow' as const,
    listVal: 'Scattered individual heap nodes',
    listBadge: 'mint' as const,
    winner: 'Context dependent'
  },
  {
    metric: 'Random Access (arr[i])',
    arrayVal: 'O(1) instant pointer math',
    arrayBadge: 'mint' as const,
    listVal: 'O(n) linear pointer hopping',
    listBadge: 'coral' as const,
    winner: 'Array wins'
  },
  {
    metric: 'Insert / Delete at Head',
    arrayVal: 'O(n) shifts all subsequent items',
    arrayBadge: 'coral' as const,
    listVal: 'O(1) instant pointer update',
    listBadge: 'mint' as const,
    winner: 'Linked List wins'
  },
  {
    metric: 'Insert / Delete at Mid',
    arrayVal: 'O(n) requires shifting',
    arrayBadge: 'yellow' as const,
    listVal: 'O(1) once pointer is reached',
    listBadge: 'mint' as const,
    winner: 'Linked List wins'
  },
  {
    metric: 'Memory Overhead',
    arrayVal: '0 extra bytes per element',
    arrayBadge: 'mint' as const,
    listVal: '+8 to 16 bytes per node for pointers',
    listBadge: 'coral' as const,
    winner: 'Array wins'
  },
  {
    metric: 'CPU Cache Locality',
    arrayVal: 'Excellent (high spatial locality)',
    arrayBadge: 'mint' as const,
    listVal: 'Poor (heap fragmentation & misses)',
    listBadge: 'coral' as const,
    winner: 'Array wins'
  }
]
</script>

<template>
  <div class="space-y-2 sm:space-y-2.5 w-full mx-auto">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111111] pb-2">
      <div>
        <div class="flex items-center gap-2">
          <BrutalBadge variant="pink" size="sm">TOPIC VI</BrutalBadge>
          <span class="font-mono text-xs text-neutral-600 font-bold">HEAD-TO-HEAD SHOWDOWN</span>
        </div>
        <h2 class="font-display text-xl sm:text-2xl uppercase tracking-tight mt-0.5">
          VI. LINKED LIST VS. ARRAY
        </h2>
      </div>
      <div class="font-mono text-xs text-neutral-600 hidden sm:block text-right">
        <p>Architectural Trade-Offs</p>
        <p class="text-[10px] text-neutral-500">RAM physical layout vs Cache efficiency</p>
      </div>
    </div>

    <!-- Interactive Memory Layout & Cache Simulation -->
    <div class="border-2 border-[#111111] bg-white p-2.5 sm:p-3 shadow-[4px_4px_0px_#111111]">
      <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-[#111111] mb-2">
        <div class="flex items-center gap-2">
          <Cpu class="w-4 h-4 text-[#ff3d81]" />
          <span class="font-display text-xs sm:text-sm uppercase">RAM HARDWARE SIMULATOR:</span>
          <span class="font-mono text-xs font-bold px-1.5 py-0.5 bg-[#ffd23f] border border-black shadow-[1px_1px_0_#111]">
            {{ layoutMode === 'array' ? 'CONTIGUOUS ARRAY' : 'SCATTERED LINKED LIST' }}
          </span>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="brutal-btn px-2.5 py-0.5 text-xs font-mono font-bold"
            :class="layoutMode === 'array' ? 'bg-[#ffd23f]' : 'bg-white'"
            @click="setLayout('array')"
          >
            ARRAY MODE
          </button>
          <button
            type="button"
            class="brutal-btn px-2.5 py-0.5 text-xs font-mono font-bold"
            :class="layoutMode === 'linkedlist' ? 'bg-[#ff3d81] text-white' : 'bg-white'"
            @click="setLayout('linkedlist')"
          >
            LINKED LIST MODE
          </button>
          <button
            type="button"
            class="brutal-btn bg-[#3ddc97] px-2.5 py-0.5 text-xs font-mono font-bold flex items-center gap-1"
            @click="testCacheLocality"
          >
            <Zap class="w-3.5 h-3.5" />
            <span>TEST CACHE</span>
          </button>
        </div>
      </div>

      <!-- Memory Visualizer Grid -->
      <div class="p-4 bg-[#fdf9f0] border-2 border-black font-mono">
        <div class="text-xs text-neutral-600 font-bold mb-2 flex items-center justify-between">
          <span>PHYSICAL 64-BYTE RAM SLOTS:</span>
          <span class="text-[11px] text-neutral-500">Each box represents a physical memory word</span>
        </div>

        <!-- ARRAY MODE LAYOUT -->
        <div v-if="layoutMode === 'array'" class="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
          <div class="p-2.5 bg-[#3ddc97] border-2 border-black font-bold shadow-[2px_2px_0_#111]">
            arr[0]<br><span class="text-[10px]">val: 10</span>
          </div>
          <div class="p-2.5 bg-[#3ddc97] border-2 border-black font-bold shadow-[2px_2px_0_#111]">
            arr[1]<br><span class="text-[10px]">val: 20</span>
          </div>
          <div class="p-2.5 bg-[#3ddc97] border-2 border-black font-bold shadow-[2px_2px_0_#111]">
            arr[2]<br><span class="text-[10px]">val: 30</span>
          </div>
          <div class="p-2.5 bg-[#3ddc97] border-2 border-black font-bold shadow-[2px_2px_0_#111]">
            arr[3]<br><span class="text-[10px]">val: 40</span>
          </div>
          <div class="p-2.5 bg-neutral-200 border border-neutral-400 text-neutral-500">
            free<br><span class="text-[10px]">0x110</span>
          </div>
          <div class="p-2.5 bg-neutral-200 border border-neutral-400 text-neutral-500">
            free<br><span class="text-[10px]">0x114</span>
          </div>
          <div class="p-2.5 bg-neutral-200 border border-neutral-400 text-neutral-500">
            free<br><span class="text-[10px]">0x118</span>
          </div>
          <div class="p-2.5 bg-neutral-200 border border-neutral-400 text-neutral-500">
            free<br><span class="text-[10px]">0x11C</span>
          </div>
        </div>

        <!-- LINKED LIST MODE LAYOUT -->
        <div v-else class="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
          <div class="p-2 bg-neutral-200 border border-neutral-400 text-neutral-500">
            OS data<br><span class="text-[10px]">0x100</span>
          </div>
          <div class="p-2 bg-[#ff3d81] text-white border-2 border-black font-bold shadow-[2px_2px_0_#111]">
            Node 0<br><span class="text-[9px]">[10 | 0x118]</span>
          </div>
          <div class="p-2 bg-neutral-200 border border-neutral-400 text-neutral-500">
            stack<br><span class="text-[10px]">0x108</span>
          </div>
          <div class="p-2 bg-neutral-200 border border-neutral-400 text-neutral-500">
            free<br><span class="text-[10px]">0x10C</span>
          </div>
          <div class="p-2 bg-[#ffd23f] text-black border-2 border-black font-bold shadow-[2px_2px_0_#111]">
            Node 2<br><span class="text-[9px]">[30 | null]</span>
          </div>
          <div class="p-2 bg-neutral-200 border border-neutral-400 text-neutral-500">
            free<br><span class="text-[10px]">0x114</span>
          </div>
          <div class="p-2 bg-[#c8a2ff] text-black border-2 border-black font-bold shadow-[2px_2px_0_#111]">
            Node 1<br><span class="text-[9px]">[20 | 0x110]</span>
          </div>
          <div class="p-2 bg-neutral-200 border border-neutral-400 text-neutral-500">
            free<br><span class="text-[10px]">0x11C</span>
          </div>
        </div>

        <!-- Simulation Feedback -->
        <div
          v-if="cacheTested"
          class="mt-2 p-1.5 sm:p-2 border-2 border-black font-body text-xs font-bold"
          :class="layoutMode === 'array' ? 'bg-[#3ddc97]' : 'bg-[#ffd23f]'"
        >
          {{ cacheMessage }}
        </div>
      </div>
    </div>

    <!-- Comprehensive Comparison Table -->
    <div class="border-2 border-[#111111] bg-white shadow-[4px_4px_0px_#111111] overflow-x-auto">
      <table class="w-full text-left border-collapse font-body text-xs sm:text-sm">
        <thead>
          <tr class="bg-[#ffd23f] border-b-2 border-black font-display uppercase text-xs">
            <th class="py-1.5 px-2.5 border-r-2 border-black">Criterion</th>
            <th class="py-1.5 px-2.5 border-r-2 border-black">Array</th>
            <th class="py-1.5 px-2.5 border-r-2 border-black">Linked List</th>
            <th class="py-1.5 px-2.5">Advantage</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in comparisonRows"
            :key="row.metric"
            class="border-b border-neutral-300 hover:bg-[#fdf9f0] transition-colors"
            :class="idx % 2 === 0 ? 'bg-white' : 'bg-[#fffdf8]'"
          >
            <td class="py-1 px-2.5 font-display text-[11px] sm:text-xs border-r-2 border-black uppercase">
              {{ row.metric }}
            </td>
            <td class="py-1 px-2.5 font-mono border-r-2 border-black text-xs">
              <span class="inline-block px-1.5 py-0.2 border border-black text-[11px] font-bold mr-1 shadow-[1px_1px_0_#000]" :class="row.arrayBadge === 'mint' ? 'bg-[#3ddc97]' : row.arrayBadge === 'coral' ? 'bg-[#ff6b5e]' : 'bg-[#ffd23f]'">
                {{ row.arrayVal }}
              </span>
            </td>
            <td class="py-1 px-2.5 font-mono border-r-2 border-black text-xs">
              <span class="inline-block px-1.5 py-0.2 border border-black text-[11px] font-bold mr-1 shadow-[1px_1px_0_#000]" :class="row.listBadge === 'mint' ? 'bg-[#3ddc97]' : row.listBadge === 'coral' ? 'bg-[#ff6b5e]' : 'bg-[#ffd23f]'">
                {{ row.listVal }}
              </span>
            </td>
            <td class="py-1 px-2.5 font-mono text-[11px] sm:text-xs font-bold">
              {{ row.winner }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
