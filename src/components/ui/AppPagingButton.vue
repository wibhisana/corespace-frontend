<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  active?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  ariaLabel?: string
  type?: 'button' | 'submit'
}>(), {
  active: false,
  disabled: false,
  size: 'md',
  type: 'button'
})

const sizeClass = computed(() => {
  return props.size === 'sm'
    ? 'h-8 min-w-8 text-xs'
    : 'h-10 min-w-10 text-sm'
})

const stateClass = computed(() => {
  if (props.disabled) return 'text-slate-300 cursor-not-allowed'
  if (props.active) return 'bg-slate-900 text-white shadow-[0_4px_14px_rgba(15,23,42,0.25)]'
  return 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :aria-current="active ? 'page' : undefined"
    :class="[
      'inline-flex items-center justify-center px-3 font-semibold rounded-full transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 select-none',
      sizeClass,
      stateClass
    ]"
  >
    <slot />
  </button>
</template>
