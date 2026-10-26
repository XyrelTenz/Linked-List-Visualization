<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'pink' | 'yellow' | 'mint' | 'lilac' | 'coral' | 'white' | 'black'
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    variant: 'yellow',
    size: 'sm'
  }
)

const variantClasses: Record<string, string> = {
  pink: 'bg-[#ff3d81] text-black',
  yellow: 'bg-[#ffd23f] text-black',
  mint: 'bg-[#3ddc97] text-black',
  lilac: 'bg-[#c8a2ff] text-black',
  coral: 'bg-[#ff6b5e] text-black',
  white: 'bg-white text-black',
  black: 'bg-[#111111] text-white'
}

const sizeClasses: Record<string, string> = {
  sm: 'text-[11px] px-2.5 py-0.5 tracking-wider',
  md: 'text-xs px-3 py-1 tracking-wider',
  lg: 'text-sm px-4 py-1.5 tracking-wide'
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 font-mono font-bold uppercase border-2 border-[#111111] shadow-[2px_2px_0px_#111111] select-none rounded-none"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <slot />
  </span>
</template>
