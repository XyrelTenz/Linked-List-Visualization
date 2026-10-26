<script setup lang="ts">
import { ref } from 'vue'
import BrutalBadge from '../common/BrutalBadge.vue'
import { ArrowRight, Sparkles, Cpu, Link as LinkIcon, Compass, Link2, Zap } from 'lucide-vue-next'

const demoVal1 = ref(42)
const demoVal2 = ref(99)
const isLinked = ref(true)

function toggleLink() {
  isLinked.value = !isLinked.value
}
</script>

<template>
  <div class="space-y-2 sm:space-y-3 w-full mx-auto">
    <!-- Top Sticker Badges -->
    <div class="flex flex-wrap items-center justify-center gap-1.5 pt-1">
      <BrutalBadge variant="pink" size="sm">
        <Sparkles class="w-3 h-3" />
        TOPIC I: INTRODUCTION TO LINKED LISTS
      </BrutalBadge>
      <BrutalBadge variant="yellow" size="sm">
        <Cpu class="w-3 h-3" />
        DYNAMIC HEAP ALLOCATION
      </BrutalBadge>
      <BrutalBadge variant="mint" size="sm">
        <LinkIcon class="w-3 h-3" />
        O(1) PREPEND
      </BrutalBadge>
    </div>

    <!-- Main Hero Box -->
    <div
      class="border-4 border-[#111111] bg-white p-3.5 sm:p-5 shadow-[6px_6px_0px_#111111] text-center relative overflow-hidden"
    >
      <!-- Decorative corner tape -->
      <div
        class="absolute -top-6 -right-10 w-28 h-8 bg-[#ffd23f] border-2 border-[#111111] rotate-12 shadow-[2px_2px_0px_#111] flex items-center justify-center"
      >
        <span class="font-mono text-[9px] font-black uppercase tracking-widest text-black"
          >TOPIC I</span
        >
      </div>

      <!-- Super Title -->
      <p class="font-mono text-[11px] font-black text-neutral-600 uppercase tracking-widest mb-1">
        Masterclass • Part 01
      </p>

      <!-- Giant Archivo Black Title -->
      <h1
        class="font-display text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#111111] uppercase leading-none drop-shadow-sm mb-2"
      >
        I. INTRODUCTION TO
        <span class="text-[#ff3d81] underline decoration-[#ffd23f] decoration-wavy decoration-4"
          >LINKED LISTS</span
        >
      </h1>

      <!-- Concept Definition Pill -->
      <div
        class="max-w-2xl mx-auto bg-[#fdf9f0] border-2 border-[#111111] p-2.5 sm:p-3 shadow-[3px_3px_0px_#111111] my-2 text-left sm:text-center"
      >
        <p class="font-body text-xs sm:text-sm text-[#111111] leading-relaxed">
          A fundamental
          <strong class="bg-[#ffd23f] px-1 font-bold">linear data structure</strong> where elements
          are <strong class="underline decoration-[#ff6b5e] decoration-2">not stored</strong> at
          contiguous memory locations. Instead, independent nodes in the heap are linked together
          using <strong class="bg-[#3ddc97] px-1 font-bold">explicit pointers</strong>.
        </p>
      </div>

      <!-- Interactive Mini Demo: Two Nodes Toy -->
      <div
        class="my-2 p-2 sm:p-2.5 bg-[#fdf9f0] border-2 border-dashed border-[#111111] inline-block max-w-full"
      >
        <div class="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
          <!-- Head Label -->
          <span
            class="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-[#3ddc97] border border-black shadow-[1px_1px_0_#111]"
          >
            HEAD
          </span>

          <ArrowRight class="w-3.5 h-3.5 text-black hidden sm:inline" />

          <!-- Node 1 -->
          <div
            class="flex border-2 border-black shadow-[3px_3px_0_#111] bg-white cursor-pointer select-none"
          >
            <div
              class="px-2.5 py-1 border-r-2 border-black font-display text-sm sm:text-base bg-[#ffe066]"
            >
              {{ demoVal1 }}
            </div>
            <div
              class="px-2 py-1 bg-[#fdf9f0] flex items-center justify-center font-mono text-xs text-neutral-600"
            >
              <span class="w-2 h-2 rounded-full bg-black"></span>
            </div>
          </div>

          <!-- Pointer Line (Clickable) -->
          <button
            type="button"
            class="group flex flex-col items-center px-1 text-xs font-mono font-bold cursor-pointer"
            title="Click to toggle pointer link"
            @click="toggleLink"
          >
            <span class="text-[8px] group-hover:text-[#ff3d81] flex items-center gap-0.5">
              <span>next</span>
              <Link2 v-if="isLinked" class="w-2.5 h-2.5 text-black" />
              <span v-else class="text-[#ff6b5e]">✕</span>
            </span>
            <svg
              class="w-8 h-4 transition-transform"
              :class="isLinked ? 'text-black' : 'text-[#ff6b5e] stroke-dashed'"
              viewBox="0 0 40 24"
            >
              <line
                x1="2"
                y1="12"
                x2="32"
                y2="12"
                :stroke="isLinked ? '#111' : '#ff6b5e'"
                stroke-width="3"
                :stroke-dasharray="isLinked ? 'none' : '4,3'"
              />
              <polygon points="30,7 39,12 30,17" :fill="isLinked ? '#111' : '#ff6b5e'" />
            </svg>
          </button>

          <!-- Node 2 -->
          <div
            class="flex border-2 border-black shadow-[3px_3px_0_#111] transition-all bg-white cursor-pointer select-none"
            :class="isLinked ? 'opacity-100' : 'opacity-40 grayscale'"
          >
            <div
              class="px-2.5 py-1 border-r-2 border-black font-display text-sm sm:text-base bg-[#c8a2ff]"
            >
              {{ demoVal2 }}
            </div>
            <div
              class="px-2 py-1 bg-[#fdf9f0] flex items-center justify-center font-mono text-xs text-neutral-600"
            >
              <span class="w-2 h-2 rounded-full bg-black"></span>
            </div>
          </div>

          <!-- Final Null -->
          <ArrowRight class="w-3.5 h-3.5 text-black hidden sm:inline" />
          <div
            class="px-2 py-0.5 bg-[#ff6b5e] border-2 border-black shadow-[2px_2px_0_#111] font-mono font-bold text-xs"
          >
            null
          </div>
        </div>

        <p class="text-[10px] font-mono text-neutral-600 mt-1">
          Click the <span class="underline font-bold">pointer arrow</span> to simulate
          breaking/linking nodes!
        </p>
      </div>

    </div>

    <!-- Quick Highlights 3-Card Footer: Analogies & Motivation -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <div
        class="bg-white border-2 border-[#111111] p-2 sm:p-2.5 shadow-[3px_3px_0px_#111111] flex items-center gap-2"
      >
        <div
          class="w-7 h-7 rounded-none bg-[#3ddc97] border-2 border-black flex items-center justify-center font-mono font-bold text-xs shadow-[1px_1px_0_#000]"
        >
          <Compass class="w-4 h-4 text-black stroke-[2.5]" />
        </div>
        <div>
          <h4 class="font-display text-xs uppercase">Scavenger Hunt</h4>
          <p class="font-body text-[11px] text-neutral-600">
            Each clue gives the address to find the next clue until null.
          </p>
        </div>
      </div>

      <div
        class="bg-white border-2 border-[#111111] p-2 sm:p-2.5 shadow-[3px_3px_0px_#111111] flex items-center gap-2"
      >
        <div
          class="w-7 h-7 rounded-none bg-[#ffd23f] border-2 border-black flex items-center justify-center font-mono font-bold text-xs shadow-[1px_1px_0_#000]"
        >
          <Link2 class="w-4 h-4 text-black stroke-[2.5]" />
        </div>
        <div>
          <h4 class="font-display text-xs uppercase">Train Couplers</h4>
          <p class="font-body text-[11px] text-neutral-600">
            Hook or detach any car in O(1) without moving the rest.
          </p>
        </div>
      </div>

      <div
        class="bg-white border-2 border-[#111111] p-2 sm:p-2.5 shadow-[3px_3px_0px_#111111] flex items-center gap-2"
      >
        <div
          class="w-7 h-7 rounded-none bg-[#c8a2ff] border-2 border-black flex items-center justify-center font-mono font-bold text-xs shadow-[1px_1px_0_#000]"
        >
          <Zap class="w-4 h-4 text-black fill-black" />
        </div>
        <div>
          <h4 class="font-display text-xs uppercase">Dynamic Heap Size</h4>
          <p class="font-body text-[11px] text-neutral-600">
            Grows on demand with zero contiguous preallocation.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
