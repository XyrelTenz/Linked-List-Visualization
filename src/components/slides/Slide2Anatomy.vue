<script setup lang="ts">
import { ref } from 'vue'
import BrutalBadge from '../common/BrutalBadge.vue'
import { sound } from '../../utils/sound'
import { Box, Binary, ArrowUpRight, Compass, Anchor, Ban, Sparkles } from 'lucide-vue-next'

type AnatomyPart = 'node' | 'data' | 'pointer' | 'head' | 'tail' | 'null'

const selectedPart = ref<AnatomyPart>('node')

const anatomyItems = [
  {
    id: 'node' as AnatomyPart,
    title: '1. Node',
    badge: 'CONTAINER',
    color: 'yellow' as const,
    icon: Box,
    summary: 'The basic building block of a linked list.',
    details:
      'The basic building block of a linked list. It contains the data and a link (pointer) to the next node.',
  },
  {
    id: 'data' as AnatomyPart,
    title: '2. Data / Value',
    badge: 'PAYLOAD',
    color: 'pink' as const,
    icon: Binary,
    summary: 'The actual value or information stored inside a node.',
    details:
      'The actual value or information stored inside a node (e.g. integers, strings, or complex objects).',
  },
  {
    id: 'pointer' as AnatomyPart,
    title: '3. Pointer / Link',
    badge: 'REFERENCE',
    color: 'mint' as const,
    icon: ArrowUpRight,
    summary: 'A reference (memory address) pointing to the next node.',
    details:
      'A reference (memory address) that points to the next node. In a doubly linked list, there is also a pointer to the previous node.',
  },
  {
    id: 'head' as AnatomyPart,
    title: '4. Head',
    badge: 'ENTRY POINT',
    color: 'mint' as const,
    icon: Compass,
    summary: 'The first node of the list and its starting point.',
    details:
      'The first node of the list and its starting point. If Head is null, the list is completely empty.',
  },
  {
    id: 'tail' as AnatomyPart,
    title: '5. Tail',
    badge: 'TERMINAL',
    color: 'lilac' as const,
    icon: Anchor,
    summary: 'The last node of the list. Its pointer is null.',
    details:
      'The last node of the list. Its pointer is null. Having a dedicated Tail pointer enables O(1) appends.',
  },
  {
    id: 'null' as AnatomyPart,
    title: '6. Null',
    badge: 'TERMINATOR',
    color: 'coral' as const,
    icon: Ban,
    summary: 'A special value meaning "no node". Marks the end.',
    details:
      'A special value meaning "no node". It marks the end of the list (nullptr in C++, null in Java/JS, None in Python).',
  },
]

function selectPart(part: AnatomyPart) {
  selectedPart.value = part
  sound.play('click')
}
</script>

<template>
  <div class="space-y-2 sm:space-y-2.5 w-full mx-auto">
    <!-- Slide Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111111] pb-1.5">
      <div>
        <div class="flex items-center gap-2">
          <BrutalBadge variant="yellow" size="sm">TOPIC II</BrutalBadge>
          <span class="font-mono text-xs text-neutral-600 font-bold">STRUCTURAL DECOMPOSITION</span>
        </div>
        <h2 class="font-display text-xl sm:text-2xl uppercase tracking-tight mt-0.5">
          II. BASIC COMPONENTS OF A LINKED LIST
        </h2>
      </div>
      <div class="text-right font-mono text-xs text-neutral-600 hidden sm:block">
        <p>Interactive Anatomy Explorer</p>
        <p class="text-[10px] text-neutral-500">Click any card to inspect</p>
      </div>
    </div>

    <!-- Live Interactive Visual Anatomy Diagram (Hero Card) -->
    <div
      class="border-2 border-[#111111] bg-white p-2.5 sm:p-3 shadow-[4px_4px_0px_#111111] relative overflow-hidden"
    >
      <div class="flex items-center justify-between pb-1.5 border-b-2 border-[#111111] mb-2">
        <span class="font-display text-xs uppercase flex items-center gap-1.5">
          <Sparkles class="w-3.5 h-3.5 text-[#ff3d81]" />
          LIVE ANATOMY INSPECTOR:
          <span
            class="bg-[#ffd23f] px-1.5 py-0.2 border border-black font-mono font-bold text-xs uppercase"
          >
            {{ selectedPart }}
          </span>
        </span>
        <span class="font-mono text-[10px] text-neutral-500">Pointer diagram</span>
      </div>

      <!-- Animated SVG / HTML Node Chain Schematic -->
      <div class="py-1.5 sm:py-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 overflow-x-auto">
        <!-- 1. HEAD POINTER -->
        <div
          class="flex items-center cursor-pointer transition-all duration-200 gap-1.5"
          :class="selectedPart === 'head' ? 'scale-105 -translate-y-1' : 'opacity-90'"
          @click="selectPart('head')"
        >
          <span
            class="font-mono text-[10px] font-black px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_#111] transition-colors"
            :class="
              selectedPart === 'head'
                ? 'bg-[#3ddc97] text-black ring-2 ring-black'
                : 'bg-white text-black'
            "
          >
            HEAD [0x100]
          </span>
          <svg class="w-5 h-3 text-black" viewBox="0 0 32 16" fill="none">
            <line x1="2" y1="8" x2="26" y2="8" stroke="currentColor" stroke-width="2.5" />
            <polygon points="24,4 30,8 24,12" fill="currentColor" />
          </svg>
        </div>

        <!-- 2. NODE 1 (Atomic Node: Data + Next) -->
        <div
          class="flex flex-col items-center cursor-pointer transition-all duration-200"
          :class="[
            selectedPart === 'node' ? 'scale-105 -translate-y-1 ring-3 ring-[#ffd23f]' : '',
            selectedPart === 'head' ? 'ring-2 ring-[#3ddc97]' : '',
          ]"
          @click="selectPart('node')"
        >
          <div class="text-[9px] font-mono text-neutral-600 mb-0.5 font-bold">
            Node #1 (0x100)
          </div>
          <div
            class="flex border-2 border-[#111111] shadow-[3px_3px_0px_#111111] bg-white overflow-hidden"
          >
            <!-- DATA PORTION -->
            <div
              class="px-2.5 py-1 flex flex-col items-center border-r-2 border-[#111111] transition-colors"
              :class="
                selectedPart === 'data'
                  ? 'bg-[#ff3d81] text-white font-black'
                  : 'bg-[#fff5f8]'
              "
              @click.stop="selectPart('data')"
            >
              <span class="text-[8px] font-mono uppercase font-bold tracking-wider opacity-75"
                >DATA</span
              >
              <span class="font-display text-sm sm:text-base leading-none">42</span>
            </div>

            <!-- NEXT POINTER PORTION -->
            <div
              class="px-2 py-1 flex flex-col items-center justify-center transition-colors min-w-[42px]"
              :class="
                selectedPart === 'pointer'
                  ? 'bg-[#3ddc97] text-black ring-2 ring-inset ring-black'
                  : 'bg-[#fdf9f0]'
              "
              @click.stop="selectPart('pointer')"
            >
              <span class="text-[8px] font-mono uppercase font-bold tracking-wider text-neutral-600"
                >NEXT</span
              >
              <div class="w-3 h-3 rounded-full bg-black flex items-center justify-center mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ffd23f]"></span>
              </div>
            </div>
          </div>
          <span class="text-[8px] font-mono text-neutral-500 mt-0.5">next: 0x250</span>
        </div>

        <!-- POINTER ARROW 1 -> 2 -->
        <div
          class="flex flex-col items-center cursor-pointer px-0.5"
          :class="selectedPart === 'pointer' ? 'scale-110 text-[#3ddc97]' : 'text-black'"
          @click="selectPart('pointer')"
        >
          <span class="text-[8px] font-mono font-bold">ref</span>
          <svg class="w-6 h-3" viewBox="0 0 32 16" fill="none">
            <line x1="2" y1="8" x2="26" y2="8" stroke="currentColor" stroke-width="2.5" />
            <polygon points="24,4 30,8 24,12" fill="currentColor" />
          </svg>
        </div>

        <!-- 3. NODE 2 (Tail) -->
        <div
          class="flex flex-col items-center cursor-pointer transition-all duration-200"
          :class="[
            selectedPart === 'tail' ? 'scale-105 -translate-y-1 ring-3 ring-[#c8a2ff]' : '',
            selectedPart === 'node' ? 'scale-105 -translate-y-1 ring-3 ring-[#ffd23f]' : '',
          ]"
          @click="selectPart('tail')"
        >
          <div class="text-[9px] font-mono text-neutral-600 mb-0.5 font-bold">
            Node #2 [TAIL]
          </div>
          <div
            class="flex border-2 border-[#111111] shadow-[3px_3px_0px_#111111] bg-white overflow-hidden"
          >
            <!-- DATA PORTION -->
            <div
              class="px-2.5 py-1 flex flex-col items-center border-r-2 border-[#111111] transition-colors"
              :class="selectedPart === 'data' ? 'bg-[#ff3d81] text-white font-black' : 'bg-white'"
              @click.stop="selectPart('data')"
            >
              <span class="text-[8px] font-mono uppercase font-bold tracking-wider opacity-75"
                >DATA</span
              >
              <span class="font-display text-sm sm:text-base leading-none">88</span>
            </div>

            <!-- NEXT POINTER (POINTS TO NULL) -->
            <div
              class="px-2 py-1 flex flex-col items-center justify-center transition-colors min-w-[42px]"
              :class="
                selectedPart === 'null'
                  ? 'bg-[#ff6b5e] text-black ring-2 ring-inset ring-black'
                  : 'bg-[#fdf9f0]'
              "
              @click.stop="selectPart('null')"
            >
              <span class="text-[8px] font-mono uppercase font-bold tracking-wider text-neutral-600"
                >NEXT</span
              >
              <div class="w-3 h-3 rounded-full bg-black flex items-center justify-center mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#ff6b5e]"></span>
              </div>
            </div>
          </div>
          <span class="text-[8px] font-mono text-neutral-500 mt-0.5">next: null</span>
        </div>

        <!-- POINTER ARROW 2 -> NULL -->
        <div
          class="flex flex-col items-center cursor-pointer px-0.5"
          :class="selectedPart === 'null' ? 'scale-110 text-[#ff6b5e]' : 'text-black'"
          @click="selectPart('null')"
        >
          <span class="text-[8px] font-mono font-bold">ref</span>
          <svg class="w-6 h-3" viewBox="0 0 32 16" fill="none">
            <line x1="2" y1="8" x2="26" y2="8" stroke="currentColor" stroke-width="2.5" />
            <polygon points="24,4 30,8 24,12" fill="currentColor" />
          </svg>
        </div>

        <!-- 4. NULL TERMINATOR -->
        <div
          class="flex flex-col items-center cursor-pointer transition-all duration-200"
          :class="selectedPart === 'null' ? 'scale-105 -translate-y-1' : ''"
          @click="selectPart('null')"
        >
          <div
            class="px-2.5 py-1 border-2 border-black font-mono font-black text-xs shadow-[3px_3px_0_#111] transition-colors"
            :class="
              selectedPart === 'null'
                ? 'bg-[#ff6b5e] text-black ring-2 ring-black'
                : 'bg-[#ffe4e1] text-black'
            "
          >
            null (∅)
          </div>
          <span class="text-[8px] font-mono text-neutral-500 mt-0.5">ground / end</span>
        </div>
      </div>

      <!-- Detail Callout Bar for currently selected item -->
      <div
        class="mt-2 p-2 bg-[#fdf9f0] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5"
      >
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="w-2 h-2 rounded-full bg-[#111111]"></span>
          <span class="font-mono font-bold text-xs uppercase text-[#111]">
            {{ anatomyItems.find((x) => x.id === selectedPart)?.title }}:
          </span>
          <span class="font-body text-xs text-neutral-800">
            {{ anatomyItems.find((x) => x.id === selectedPart)?.details }}
          </span>
        </div>
      </div>
    </div>

    <!-- 6 Anatomy Cards Grid (Compact Interactive Tiles) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <div
        v-for="item in anatomyItems"
        :key="item.id"
        class="border-2 border-[#111111] p-2 sm:p-2.5 cursor-pointer transition-all duration-150 select-none flex flex-col justify-between"
        :class="[
          selectedPart === item.id
            ? 'bg-white shadow-[4px_4px_0px_#111111] -translate-x-0.5 -translate-y-0.5 ring-2 ring-[#111111]'
            : 'bg-[#ffffff] hover:bg-[#fffdfa] shadow-[2px_2px_0px_#111111] hover:shadow-[3px_3px_0px_#111111]',
        ]"
        @click="selectPart(item.id)"
      >
        <div>
          <!-- Card Header -->
          <div class="flex items-center justify-between pb-1 mb-1 border-b border-[#111111]">
            <div class="flex items-center gap-1.5">
              <component :is="item.icon" class="w-3.5 h-3.5 text-[#111111]" />
              <h3 class="font-display text-xs tracking-tight uppercase">{{ item.title }}</h3>
            </div>
            <div class="flex items-center gap-1">
              <BrutalBadge :variant="item.color" size="sm">{{ item.badge }}</BrutalBadge>
            </div>
          </div>

          <!-- Card Summary -->
          <p class="font-body text-[11px] text-neutral-700 leading-snug line-clamp-2">
            {{ item.summary }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
