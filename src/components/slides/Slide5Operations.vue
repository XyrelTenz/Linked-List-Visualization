<script setup lang="ts">
import BrutalBadge from '../common/BrutalBadge.vue'
import LinkedListVisualizer from '../visualizer/LinkedListVisualizer.vue'
import {
  GitCommit,
  PlusCircle,
  Trash2,
  Search,
  RefreshCw,
  RotateCw,
  Sparkles
} from 'lucide-vue-next'

const operations = [
  {
    name: 'Traversal',
    complexity: 'O(n)',
    badgeColor: 'yellow' as const,
    desc: 'Visiting each node from head to tail.',
    icon: GitCommit
  },
  {
    name: 'Insertion',
    complexity: 'O(1) / O(n)',
    badgeColor: 'mint' as const,
    desc: 'Adding a new node at head, middle, or tail.',
    icon: PlusCircle
  },
  {
    name: 'Deletion',
    complexity: 'O(1) / O(n)',
    badgeColor: 'coral' as const,
    desc: 'Removing a node by relinking pointers.',
    icon: Trash2
  },
  {
    name: 'Searching',
    complexity: 'O(n)',
    badgeColor: 'lilac' as const,
    desc: 'Linear search checking each node for a value.',
    icon: Search
  },
  {
    name: 'Updating',
    complexity: 'O(n)',
    badgeColor: 'yellow' as const,
    desc: 'Changing the data stored in an existing node.',
    icon: RefreshCw
  },
  {
    name: 'Reversing',
    complexity: 'O(n)',
    badgeColor: 'pink' as const,
    desc: 'Flipping pointers so the tail becomes head.',
    icon: RotateCw
  }
]
</script>

<template>
  <div class="space-y-2 sm:space-y-2.5 w-full mx-auto">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#111111] pb-2">
      <div>
        <div class="flex items-center gap-2">
          <BrutalBadge variant="coral" size="sm">TOPIC V</BrutalBadge>
          <span class="font-mono text-xs text-neutral-600 font-bold">ALGORITHMIC PRIMITIVES</span>
        </div>
        <h2 class="font-display text-xl sm:text-2xl uppercase tracking-tight mt-0.5">
          V. BASIC OPERATIONS & VISUALIZER LAB
        </h2>
      </div>
      <div class="font-mono text-xs text-neutral-600 hidden sm:block text-right">
        <p>Dynamic Pointer Mutation</p>
        <p class="text-[10px] text-neutral-500">Play with all 6 operations in real time</p>
      </div>
    </div>

    <!-- 6 Operations Quick Badges Matrix -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      <div
        v-for="op in operations"
        :key="op.name"
        class="border-2 border-black bg-white p-2.5 shadow-[2px_2px_0_#111] flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between gap-1 mb-1">
            <component :is="op.icon" class="w-3.5 h-3.5 text-black shrink-0" />
            <BrutalBadge :variant="op.badgeColor" size="sm">{{ op.complexity }}</BrutalBadge>
          </div>
          <h4 class="font-display text-xs uppercase font-black">{{ op.name }}</h4>
        </div>
        <p class="font-body text-[11px] text-neutral-600 mt-1 leading-snug break-words">
          {{ op.desc }}
        </p>
      </div>
    </div>

    <!-- Embedded Rich Interactive Visualizer Playground -->
    <div class="pt-0.5">
      <LinkedListVisualizer />
    </div>
  </div>
</template>
