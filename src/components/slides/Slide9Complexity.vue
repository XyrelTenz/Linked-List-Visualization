<script setup lang="ts">
import { ref } from 'vue'
import BrutalBadge from '../common/BrutalBadge.vue'
import { sound } from '../../utils/sound'
import {
  HelpCircle,
  Timer,
  Zap,
  TrendingDown,
  Info,
  Sparkles
} from 'lucide-vue-next'

const selectedOp = ref<number>(0)

const complexityData = [
  {
    operation: 'Access by Index (get(k))',
    timeBest: 'O(1)',
    timeWorst: 'O(n)',
    space: 'O(1)',
    tier: 'fair' as const,
    reasoning: 'Must traverse k pointer references sequentially from HEAD. Best case is k = 0 (HEAD), worst is k = n - 1 (TAIL).'
  },
  {
    operation: 'Search by Value (contains(val))',
    timeBest: 'O(1)',
    timeWorst: 'O(n)',
    space: 'O(1)',
    tier: 'fair' as const,
    reasoning: 'Linear scan over all nodes until node.val === target. Best case is when target is in the HEAD node.'
  },
  {
    operation: 'Prepend / Insert at Head',
    timeBest: 'O(1)',
    timeWorst: 'O(1)',
    space: 'O(1)',
    tier: 'excellent' as const,
    reasoning: 'Guaranteed constant time: allocate new node, point newNode.next to old HEAD, then reassign HEAD = newNode.'
  },
  {
    operation: 'Append / Insert at Tail (with tail ptr)',
    timeBest: 'O(1)',
    timeWorst: 'O(1)',
    space: 'O(1)',
    tier: 'excellent' as const,
    reasoning: 'With a maintained TAIL pointer, point tail.next to newNode and update tail = newNode in constant time.'
  },
  {
    operation: 'Insert after Given Node Pointer',
    timeBest: 'O(1)',
    timeWorst: 'O(1)',
    space: 'O(1)',
    tier: 'excellent' as const,
    reasoning: 'If the reference to the predecessor node is already known in memory, splicing takes exactly 2 pointer assignments.'
  },
  {
    operation: 'Delete at Head',
    timeBest: 'O(1)',
    timeWorst: 'O(1)',
    space: 'O(1)',
    tier: 'excellent' as const,
    reasoning: 'HEAD = HEAD.next. Frees old head node in constant time.'
  },
  {
    operation: 'Delete at Tail (Singly Linked)',
    timeBest: 'O(n)',
    timeWorst: 'O(n)',
    space: 'O(1)',
    tier: 'fair' as const,
    reasoning: 'Even with a tail pointer, singly linked lists require traversing to node (n - 2) to clear its next pointer. Doubly lists solve this in O(1).'
  },
  {
    operation: 'Search and Delete Value',
    timeBest: 'O(1)',
    timeWorst: 'O(n)',
    space: 'O(1)',
    tier: 'fair' as const,
    reasoning: 'Requires locating the target node (O(n)) and keeping track of its predecessor before bypassing it.'
  }
]

function selectRow(idx: number) {
  selectedOp.value = idx
  sound.play('click')
}
</script>

<template>
  <div class="space-y-2 sm:space-y-2.5 w-full mx-auto">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111111] pb-2">
      <div>
        <div class="flex items-center gap-2">
          <BrutalBadge variant="lilac" size="sm">TOPIC IX</BrutalBadge>
          <span class="font-mono text-xs text-neutral-600 font-bold">THEORETICAL TIME & SPACE BOUNDS</span>
        </div>
        <h2 class="font-display text-xl sm:text-2xl uppercase tracking-tight mt-0.5">
          IX. TIME COMPLEXITY OF LINKED LIST OPERATIONS
        </h2>
      </div>
      <div class="font-mono text-xs text-neutral-600 hidden sm:block text-right">
        <p>Asymptotic Analysis</p>
        <p class="text-[10px] text-neutral-500">Best vs Worst vs Auxiliary Space</p>
      </div>
    </div>

    <!-- Big-O Visual Scale Bar -->
    <div class="border-2 border-[#111111] bg-white p-2 sm:p-2.5 shadow-[4px_4px_0px_#111111]">
      <div class="flex items-center justify-between mb-1.5">
        <span class="font-display text-xs uppercase flex items-center gap-1.5">
          <Timer class="w-3.5 h-3.5 text-[#ff3d81]" />
          BIG-O COLOR EFFICIENCY SPECTRUM
        </span>
        <span class="font-mono text-[9px] text-neutral-500">LOWER IS BETTER</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-xs">
        <div class="p-1.5 bg-[#3ddc97] border-2 border-black font-bold flex items-center justify-between shadow-[1px_1px_0_#111]">
          <span>O(1)</span>
          <span class="text-[9px] bg-white px-1 border border-black">EXCELLENT</span>
        </div>
        <div class="p-1.5 bg-[#ffd23f] border-2 border-black font-bold flex items-center justify-between shadow-[1px_1px_0_#111]">
          <span>O(log n)</span>
          <span class="text-[9px] bg-white px-1 border border-black">GOOD</span>
        </div>
        <div class="p-1.5 bg-[#c8a2ff] border-2 border-black font-bold flex items-center justify-between shadow-[1px_1px_0_#111]">
          <span>O(n)</span>
          <span class="text-[9px] bg-white px-1 border border-black">FAIR</span>
        </div>
        <div class="p-1.5 bg-[#ff6b5e] border-2 border-black font-bold flex items-center justify-between shadow-[1px_1px_0_#111]">
          <span>O(n²)</span>
          <span class="text-[9px] bg-white px-1 border border-black">HORRIBLE</span>
        </div>
      </div>
    </div>

    <!-- Master Complexity Table -->
    <div class="border-2 border-[#111111] bg-white shadow-[4px_4px_0px_#111111] overflow-x-auto">
      <table class="w-full text-left border-collapse font-body text-xs sm:text-sm">
        <thead>
          <tr class="bg-[#ffd23f] border-b-2 border-black font-display uppercase text-xs">
            <th class="py-1 px-2 border-r-2 border-black">Operation</th>
            <th class="py-1 px-2 border-r-2 border-black">Best</th>
            <th class="py-1 px-2 border-r-2 border-black">Worst / Avg</th>
            <th class="py-1 px-2 border-r-2 border-black">Space</th>
            <th class="py-1 px-2">Algorithmic Reason</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in complexityData"
            :key="row.operation"
            class="border-b border-neutral-300 cursor-pointer transition-colors"
            :class="[
              selectedOp === idx
                ? 'bg-[#ffeef4] ring-2 ring-inset ring-[#ff3d81]'
                : idx % 2 === 0
                ? 'bg-white hover:bg-[#fdf9f0]'
                : 'bg-[#fffdf8] hover:bg-[#fdf9f0]'
            ]"
            @click="selectRow(idx)"
          >
            <td class="py-1 px-2 font-display text-[11px] sm:text-xs border-r-2 border-black uppercase">
              {{ row.operation }}
            </td>
            <td class="py-1 px-2 font-mono font-bold border-r-2 border-black text-xs">
              <span
                class="px-1.5 py-0.2 border border-black text-[11px] shadow-[1px_1px_0_#000]"
                :class="row.timeBest === 'O(1)' ? 'bg-[#3ddc97]' : 'bg-[#c8a2ff]'"
              >
                {{ row.timeBest }}
              </span>
            </td>
            <td class="py-1 px-2 font-mono font-bold border-r-2 border-black text-xs">
              <span
                class="px-1.5 py-0.2 border border-black text-[11px] shadow-[1px_1px_0_#000]"
                :class="row.timeWorst === 'O(1)' ? 'bg-[#3ddc97]' : 'bg-[#c8a2ff]'"
              >
                {{ row.timeWorst }}
              </span>
            </td>
            <td class="py-1 px-2 font-mono border-r-2 border-black font-bold text-xs">
              {{ row.space }}
            </td>
            <td class="py-1 px-2 font-body text-[11px] text-neutral-700">
              {{ row.reasoning }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Interactive Inspector Callout for Selected Row -->
    <div class="p-2 sm:p-2.5 bg-[#fdf9f0] border-2 border-black shadow-[3px_3px_0_#111] flex items-start gap-2">
      <div class="w-6 h-6 rounded-none bg-[#c8a2ff] border border-black flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 shadow-[1px_1px_0_#111]">
        i
      </div>
      <div>
        <h4 class="font-display text-xs uppercase text-black">
          DEEP DIVE: {{ complexityData[selectedOp]?.operation || '' }}
        </h4>
        <p class="font-body text-xs text-neutral-800 mt-0.5">
          {{ complexityData[selectedOp]?.reasoning || '' }}
        </p>
      </div>
    </div>
  </div>
</template>
