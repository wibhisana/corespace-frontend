<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'danger' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'rounded' | 'circle'
  icon?: Component
  isLoading?: boolean
  disabled?: boolean
  ariaLabel?: string
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'subtle',
  size: 'md',
  shape: 'rounded',
  isLoading: false,
  disabled: false,
  type: 'button'
})

const baseClasses = 'relative inline-flex items-center justify-center transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 select-none'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-indigo-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.25)] hover:bg-indigo-500'
    case 'secondary':
      return 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
    case 'outline':
      return 'bg-transparent text-slate-700 hover:bg-slate-100'
    case 'subtle':
      return 'bg-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-100'
    case 'dark':
      return 'bg-slate-900 text-white hover:bg-slate-800'
    case 'danger':
      return 'bg-rose-500 text-white hover:bg-rose-600'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-9 w-9'
    case 'lg': return 'h-12 w-12'
    default: return 'h-11 w-11'
  }
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-4 w-4'
    case 'lg': return 'h-6 w-6'
    default: return 'h-5 w-5'
  }
})

const shapeClass = computed(() => props.shape === 'circle' ? 'rounded-full' : 'rounded-xl')
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || isLoading"
    :aria-label="ariaLabel"
    :class="[baseClasses, variantClasses, sizeClasses, shapeClass]"
  >
    <svg
      v-if="isLoading"
      class="animate-spin"
      :class="iconSize"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>

    <component
      v-else-if="icon"
      :is="icon"
      :class="iconSize"
      aria-hidden="true"
    />

    <slot v-else />
  </button>
</template>
