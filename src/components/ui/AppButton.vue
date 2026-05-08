<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'rounded' | 'pill'
  isLoading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  shape: 'rounded',
  isLoading: false,
  disabled: false,
  fullWidth: false,
  type: 'button'
})

const baseClasses = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none shrink-0 select-none'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-indigo-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.25)] hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(79,70,229,0.35)]'
    case 'secondary':
      return 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
    case 'outline':
      return 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    case 'dark':
      return 'bg-slate-900 text-white shadow-[0_4px_14px_rgba(15,23,42,0.25)] hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.35)]'
    case 'danger':
      return 'bg-rose-500 text-white shadow-[0_4px_14px_rgba(244,63,94,0.25)] hover:bg-rose-600 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(244,63,94,0.35)]'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-9 px-4 text-sm gap-1.5'
    case 'lg': return 'h-12 px-7 text-base gap-2.5'
    default: return 'h-11 px-5 text-sm gap-2'
  }
})

const shapeClass = computed(() => props.shape === 'pill' ? 'rounded-full' : 'rounded-xl')
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || isLoading"
    :class="[
      baseClasses,
      variantClasses,
      sizeClasses,
      shapeClass,
      fullWidth && 'w-full'
    ]"
  >
    <span
      v-if="isLoading"
      class="inline-flex items-center justify-center"
    >
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </span>

    <span :class="[isLoading && 'opacity-90', 'inline-flex items-center gap-2']">
      <slot />
    </span>
  </button>
</template>
