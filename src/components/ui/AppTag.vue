<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'success' | 'critical' | 'warning' | 'info' | 'neutral' | 'brand'
  size?: 'sm' | 'md'
  withDot?: boolean
  solid?: boolean
}>(), {
  variant: 'neutral',
  size: 'md',
  withDot: false,
  solid: false
})

const palette = computed(() => {
  if (props.solid) {
    switch (props.variant) {
      case 'success': return { bg: 'bg-emerald-500', text: 'text-white', dot: 'bg-white' }
      case 'warning': return { bg: 'bg-amber-500', text: 'text-white', dot: 'bg-white' }
      case 'critical': return { bg: 'bg-rose-500', text: 'text-white', dot: 'bg-white' }
      case 'info': return { bg: 'bg-sky-500', text: 'text-white', dot: 'bg-white' }
      case 'brand': return { bg: 'bg-indigo-600', text: 'text-white', dot: 'bg-white' }
      default: return { bg: 'bg-slate-900', text: 'text-white', dot: 'bg-white' }
    }
  }
  switch (props.variant) {
    case 'success': return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' }
    case 'warning': return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' }
    case 'critical': return { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' }
    case 'info': return { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' }
    case 'brand': return { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' }
    default: return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' }
  }
})

const sizeClass = computed(() => {
  return props.size === 'sm'
    ? 'h-5 px-2 gap-1.5 text-[9px]'
    : 'h-6 px-2.5 gap-1.5 text-[10px]'
})

const dotSize = computed(() => props.size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full font-bold uppercase tracking-wider leading-none whitespace-nowrap',
      palette.bg,
      palette.text,
      sizeClass
    ]"
  >
    <span
      v-if="withDot"
      :class="['shrink-0 rounded-full', palette.dot, dotSize]"
      aria-hidden="true"
    />
    <span>
      <slot />
    </span>
  </span>
</template>
