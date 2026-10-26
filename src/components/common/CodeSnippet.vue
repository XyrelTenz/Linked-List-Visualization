<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'
import { sound } from '../../utils/sound'

const props = defineProps<{
  code: string
  lang?: string
  title?: string
}>()

const copied = ref(false)

function copyCode() {
  sound.play('click')
  navigator.clipboard.writeText(props.code.trim())
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1800)
}
</script>

<template>
  <div class="border-2 border-[#111111] bg-[#111111] text-[#fdf9f0] shadow-[4px_4px_0px_#111111] overflow-hidden text-left">
    <div class="flex items-center justify-between px-3 py-1.5 border-b-2 border-[#333333] bg-[#1a1a1a] text-xs font-mono">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#ff6b5e] border border-black"></span>
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#ffd23f] border border-black"></span>
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-[#3ddc97] border border-black"></span>
        <span v-if="title" class="ml-2 font-bold text-[#ffd23f]">{{ title }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="lang" class="text-neutral-400 uppercase text-[10px] tracking-wider">{{ lang }}</span>
        <button
          type="button"
          class="flex items-center gap-1 text-[11px] text-[#ffd23f] hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded border border-transparent hover:border-[#444]"
          @click="copyCode"
        >
          <component :is="copied ? Check : Copy" class="w-3.5 h-3.5" />
          <span>{{ copied ? 'COPIED' : 'COPY' }}</span>
        </button>
      </div>
    </div>
    <pre class="p-3 font-mono text-xs md:text-sm overflow-x-auto leading-relaxed text-[#fdf9f0]"><code>{{ code }}</code></pre>
  </div>
</template>
