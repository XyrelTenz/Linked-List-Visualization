<script setup lang="ts">
import { sound } from '../../utils/sound'

const props = withDefaults(
  defineProps<{
    variant?: 'pink' | 'yellow' | 'mint' | 'lilac' | 'coral' | 'white' | 'black'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    soundEffect?:
      | 'click'
      | 'step'
      | 'add'
      | 'remove'
      | 'success'
      | 'reverse'
      | 'whoosh'
      | 'tada'
      | 'none'
  }>(),
  {
    variant: 'yellow',
    size: 'md',
    disabled: false,
    soundEffect: 'click',
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const variantClasses: Record<string, string> = {
  pink: 'bg-[#ff3d81] text-black hover:bg-[#ff5793]',
  yellow: 'bg-[#ffd23f] text-black hover:bg-[#ffe066]',
  mint: 'bg-[#3ddc97] text-black hover:bg-[#58e4a9]',
  lilac: 'bg-[#c8a2ff] text-black hover:bg-[#d8baff]',
  coral: 'bg-[#ff6b5e] text-black hover:bg-[#ff857a]',
  white: 'bg-white text-black hover:bg-[#f3f0e8]',
  black: 'bg-[#111111] text-white hover:bg-[#252525]',
}

const sizeClasses: Record<string, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 font-bold',
  md: 'text-sm px-4 py-2 gap-2 font-bold',
  lg: 'text-base px-6 py-3 gap-2.5 font-bold',
}

function handleClick(e: MouseEvent) {
  if (props.disabled) return
  if (props.soundEffect !== 'none') {
    sound.play(props.soundEffect)
  }
  emit('click', e)
}
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    class="brutal-btn inline-flex items-center justify-center cursor-pointer transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#111111]"
    :class="[variantClasses[variant], sizeClasses[size]]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
