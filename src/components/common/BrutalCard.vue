<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'white' | 'pink' | 'yellow' | 'mint' | 'lilac' | 'coral'
    hoverEffect?: boolean
    shadow?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    variant: 'white',
    hoverEffect: true,
    shadow: 'md'
  }
)

const bgClasses: Record<string, string> = {
  white: 'bg-white text-[#111111]',
  pink: 'bg-[#ff3d81] text-[#111111]',
  yellow: 'bg-[#ffd23f] text-[#111111]',
  mint: 'bg-[#3ddc97] text-[#111111]',
  lilac: 'bg-[#c8a2ff] text-[#111111]',
  coral: 'bg-[#ff6b5e] text-[#111111]'
}

const shadowClasses: Record<string, string> = {
  sm: 'shadow-[4px_4px_0px_#111111]',
  md: 'shadow-[6px_6px_0px_#111111]',
  lg: 'shadow-[9px_9px_0px_#111111]',
  xl: 'shadow-[12px_12px_0px_#111111]'
}
</script>

<template>
  <div
    class="border-2 border-[#111111] transition-all"
    :class="[
      bgClasses[variant],
      shadowClasses[shadow],
      hoverEffect ? 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_#111111]' : ''
    ]"
  >
    <slot />
  </div>
</template>
