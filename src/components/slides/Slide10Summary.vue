<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDeckStore } from '../../stores/deck'
import BrutalBadge from '../common/BrutalBadge.vue'
import BrutalButton from '../common/BrutalButton.vue'
import { sound } from '../../utils/sound'
import confetti from 'canvas-confetti'
import {
  Award,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Compass,
  ArrowRight
} from 'lucide-vue-next'

const router = useRouter()
const deckStore = useDeckStore()

// Interactive Decision Helper
const qRandomAccess = ref<'yes' | 'no' | null>(null)
const qPrependOften = ref<'yes' | 'no' | null>(null)
const qSizeKnown = ref<'yes' | 'no' | null>(null)

function triggerCelebration() {
  sound.play('tada')
  try {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff3d81', '#ffd23f', '#3ddc97', '#c8a2ff', '#ff6b5e', '#111111']
    })
  } catch (e) {
    // fallback if canvas not available
  }
}

function restartDeck() {
  deckStore.setSlide(0)
  router.push('/slide/1')
}

const goldenRules = [
  {
    num: '01',
    rule: 'Always Guard Against Null Dereference',
    detail: 'Before reading `curr.next.val`, always check `if (curr && curr.next)`. Null pointer exceptions are the #1 source of linked list runtime crashes.'
  },
  {
    num: '02',
    rule: 'Never Overwrite a Pointer Before Saving It',
    detail: 'When inserting or deleting, cache `let temp = curr.next` before assigning `curr.next = newNode`. Otherwise, the rest of your list is permanently lost in the heap.'
  },
  {
    num: '03',
    rule: 'Deploy Dummy / Sentinel Head Nodes',
    detail: 'Creating a pseudo dummy node (`let dummy = new Node(0, head)`) eliminates special if-else branches for inserting or deleting the head node.'
  },
  {
    num: '04',
    rule: "Leverage Floyd's Two-Pointer Technique",
    detail: 'Use Fast (2 steps) and Slow (1 step) pointers to find the middle element in a single pass or detect memory cycles without extra hash set memory.'
  },
  {
    num: '05',
    rule: 'Mind Garbage Collection & Memory Leaks',
    detail: 'In manual memory languages like C/C++, free each node during deletion. In garbage-collected runtimes, ensure unneeded references are nulled out.'
  }
]
</script>

<template>
  <div class="space-y-2 sm:space-y-2.5 w-full mx-auto">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111111] pb-2">
      <div>
        <div class="flex items-center gap-2">
          <BrutalBadge variant="coral" size="sm">TOPIC X</BrutalBadge>
          <span class="font-mono text-xs text-neutral-600 font-bold">SYNTHESIS & CONCLUSION</span>
        </div>
        <h2 class="font-display text-xl sm:text-2xl uppercase tracking-tight mt-0.5">
          X. CONCLUSION & BEST PRACTICES
        </h2>
      </div>
      <div class="font-mono text-xs text-neutral-600 hidden sm:block text-right">
        <p>Architectural Decision Matrix</p>
        <p class="text-[10px] text-neutral-500">Mastery Checklist & Completion</p>
      </div>
    </div>

    <!-- Topic X 3 Core Takeaways -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <div class="bg-white border-2 border-[#111111] p-2.5 shadow-[3px_3px_0px_#111111]">
        <div class="flex items-center gap-1.5 pb-1 border-b border-black mb-1">
          <span class="font-mono text-[10px] font-bold px-1 bg-[#ffd23f] border border-black">01</span>
          <h4 class="font-display text-xs uppercase">Core Summary</h4>
        </div>
        <p class="font-body text-[11px] text-neutral-700 leading-snug">
          A dynamic linear chain of heap nodes connected by pointers, supporting single, doubly, and circular variants.
        </p>
      </div>

      <div class="bg-white border-2 border-[#111111] p-2.5 shadow-[3px_3px_0px_#111111]">
        <div class="flex items-center gap-1.5 pb-1 border-b border-black mb-1">
          <span class="font-mono text-[10px] font-bold px-1 bg-[#3ddc97] border border-black">02</span>
          <h4 class="font-display text-xs uppercase">Importance in DSA</h4>
        </div>
        <p class="font-body text-[11px] text-neutral-700 leading-snug">
          Foundational building block for Stacks, Queues, Graphs (adjacency lists), and Hash Table collision chaining.
        </p>
      </div>

      <div class="bg-white border-2 border-[#111111] p-2.5 shadow-[3px_3px_0px_#111111]">
        <div class="flex items-center gap-1.5 pb-1 border-b border-black mb-1">
          <span class="font-mono text-[10px] font-bold px-1 bg-[#c8a2ff] border border-black">03</span>
          <h4 class="font-display text-xs uppercase">When to Choose</h4>
        </div>
        <p class="font-body text-[11px] text-neutral-700 leading-snug">
          Ideal when size changes frequently with heavy insertions/deletions and no requirement for fast O(1) random index access.
        </p>
      </div>
    </div>

    <!-- 5 Golden Rules Grid -->
    <div class="border-2 border-[#111111] bg-white p-2.5 sm:p-3 shadow-[5px_5px_0px_#111111]">
      <div class="flex items-center justify-between pb-1.5 border-b-2 border-[#111111] mb-2">
        <span class="font-display text-xs sm:text-sm uppercase flex items-center gap-1.5">
          <ShieldAlert class="w-4 h-4 text-[#ff3d81]" />
          THE 5 GOLDEN RULES OF LINKED LIST ENGINEERING
        </span>
        <BrutalBadge variant="yellow" size="sm">MUST-KNOW</BrutalBadge>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div
          v-for="item in goldenRules"
          :key="item.num"
          class="p-2 sm:p-2.5 bg-[#fdf9f0] border-2 border-black shadow-[2px_2px_0_#111] flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center gap-1.5 mb-1">
              <span class="font-display text-xs px-1.5 py-0.2 bg-[#ffd23f] border border-black shadow-[1px_1px_0_#111]">
                {{ item.num }}
              </span>
              <h4 class="font-display text-xs uppercase leading-snug">{{ item.rule }}</h4>
            </div>
            <p class="font-body text-[11px] text-neutral-700 leading-snug">
              {{ item.detail }}
            </p>
          </div>
        </div>

        <!-- 6th Special Card: Celebration card -->
        <div class="p-2 sm:p-2.5 bg-[#ff3d81] text-black border-2 border-black shadow-[2px_2px_0_#111] flex flex-col items-center justify-center text-center">
          <Award class="w-6 h-6 mb-0.5 animate-bounce" />
          <h4 class="font-display text-xs uppercase">COURSE COMPLETED!</h4>
          <p class="font-body text-[11px] text-black font-semibold mt-0.5 mb-1.5">
            You have mastered linked list algorithms and memory structures.
          </p>
          <BrutalButton
            variant="yellow"
            size="sm"
            @click="triggerCelebration"
          >
            <Sparkles class="w-3 h-3" />
            <span>TRIGGER CONFETTI!</span>
          </BrutalButton>
        </div>
      </div>
    </div>

    <!-- Interactive Decision Matrix Helper Tool -->
    <div class="border-2 border-[#111111] bg-white p-2.5 sm:p-3 shadow-[4px_4px_0px_#111111]">
      <div class="flex items-center justify-between pb-1.5 border-b-2 border-[#111111] mb-2">
        <span class="font-display text-xs sm:text-sm uppercase flex items-center gap-1.5">
          <Compass class="w-4 h-4 text-[#3ddc97]" />
          INTERACTIVE ARCHITECTURE DECISION HELPER
        </span>
        <span class="font-mono text-[10px] text-neutral-500">Pick your criteria</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <!-- Question 1 -->
        <div class="p-2 bg-[#fdf9f0] border-2 border-black shadow-[2px_2px_0_#111] space-y-1">
          <p class="font-body text-[11px] font-bold">1. Do you need fast random index lookup (arr[i])?</p>
          <div class="flex gap-1.5">
            <button
              type="button"
              class="brutal-btn flex-1 py-0.5 text-xs font-mono font-bold"
              :class="qRandomAccess === 'yes' ? 'bg-[#ff6b5e]' : 'bg-white'"
              @click="qRandomAccess = 'yes'"
            >
              YES
            </button>
            <button
              type="button"
              class="brutal-btn flex-1 py-0.5 text-xs font-mono font-bold"
              :class="qRandomAccess === 'no' ? 'bg-[#3ddc97]' : 'bg-white'"
              @click="qRandomAccess = 'no'"
            >
              NO
            </button>
          </div>
        </div>

        <!-- Question 2 -->
        <div class="p-2 bg-[#fdf9f0] border-2 border-black shadow-[2px_2px_0_#111] space-y-1">
          <p class="font-body text-[11px] font-bold">2. Will you frequently insert/delete at the HEAD?</p>
          <div class="flex gap-1.5">
            <button
              type="button"
              class="brutal-btn flex-1 py-0.5 text-xs font-mono font-bold"
              :class="qPrependOften === 'yes' ? 'bg-[#3ddc97]' : 'bg-white'"
              @click="qPrependOften = 'yes'"
            >
              YES
            </button>
            <button
              type="button"
              class="brutal-btn flex-1 py-0.5 text-xs font-mono font-bold"
              :class="qPrependOften === 'no' ? 'bg-[#ffd23f]' : 'bg-white'"
              @click="qPrependOften = 'no'"
            >
              NO
            </button>
          </div>
        </div>

        <!-- Question 3 -->
        <div class="p-2 bg-[#fdf9f0] border-2 border-black shadow-[2px_2px_0_#111] space-y-1">
          <p class="font-body text-[11px] font-bold">3. Is your dataset size unpredictable / fragmented?</p>
          <div class="flex gap-1.5">
            <button
              type="button"
              class="brutal-btn flex-1 py-0.5 text-xs font-mono font-bold"
              :class="qSizeKnown === 'yes' ? 'bg-[#3ddc97]' : 'bg-white'"
              @click="qSizeKnown = 'yes'"
            >
              YES
            </button>
            <button
              type="button"
              class="brutal-btn flex-1 py-0.5 text-xs font-mono font-bold"
              :class="qSizeKnown === 'no' ? 'bg-[#ffd23f]' : 'bg-white'"
              @click="qSizeKnown = 'no'"
            >
              NO
            </button>
          </div>
        </div>
      </div>

      <!-- Recommendation Banner -->
      <div class="mt-2.5 p-2.5 sm:p-3 border-2 border-black shadow-[3px_3px_0_#111] flex flex-col sm:flex-row items-center justify-between gap-2.5"
        :class="[
          qRandomAccess === 'yes'
            ? 'bg-[#ffd23f]'
            : qPrependOften === 'yes' || qSizeKnown === 'yes'
            ? 'bg-[#3ddc97]'
            : 'bg-[#fdf9f0]'
        ]"
      >
        <div>
          <span class="font-mono text-xs font-black uppercase text-black block">SYSTEM RECOMMENDATION:</span>
          <p class="font-display text-sm sm:text-base text-black mt-0.5">
            <template v-if="qRandomAccess === 'yes'">
              👉 USE A DYNAMIC ARRAY (Vector/ArrayList). Random access O(1) is paramount; linked lists would introduce severe O(n) traversal penalties.
            </template>
            <template v-else-if="qPrependOften === 'yes' || qSizeKnown === 'yes'">
              👉 USE A LINKED LIST (OR DEQUE). O(1) prepend and smooth dynamic allocation will give you optimal efficiency without reallocation spikes.
            </template>
            <template v-else>
              Select your requirements above to see an instant architectural recommendation.
            </template>
          </p>
        </div>

        <div class="flex items-center gap-2">
          <BrutalButton variant="white" size="sm" @click="restartDeck">
            <RotateCcw class="w-3.5 h-3.5" />
            <span>RESTART DECK</span>
          </BrutalButton>
        </div>
      </div>
    </div>
  </div>
</template>
