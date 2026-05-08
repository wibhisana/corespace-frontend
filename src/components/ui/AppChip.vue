<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'active' | 'brand'
  size?: 'sm' | 'md'
  removable?: boolean
  clickable?: boolean
  disabled?: boolean
  leftIcon?: Component
  rightIcon?: Component
}>(), {
  variant: 'default',
  size: 'md',
  removable: false,
  clickable: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', payload: MouseEvent): void
  (e: 'remove'): void
}>()

const variantClass = computed(() => {
  switch (props.variant) {
    case 'active': return 'bg-slate-900 text-white'
    case 'brand': return 'bg-indigo-100 text-indigo-700'
    default: return 'bg-slate-100 text-slate-600'
  }
})

const hoverClass = computed(() => {
  if (!props.clickable || props.disabled) return ''
  switch (props.variant) {
    case 'active': return 'hover:bg-slate-700'
    case 'brand': return 'hover:bg-indigo-200'
    default: return 'hover:bg-slate-200 hover:text-slate-900'
  }
})

const sizeClass = computed(() => {
  return props.size === 'sm'
    ? 'h-6 px-2.5 gap-1.5 text-[10px]'
    : 'h-7 px-3 gap-1.5 text-[10px]'
})

const iconSize = computed(() => props.size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')

const removeBtnClass = computed(() => {
  switch (props.variant) {
    case 'active': return 'text-white/70 hover:text-white hover:bg-white/15'
    case 'brand': return 'text-indigo-500 hover:text-indigo-700 hover:bg-indigo-200/70'
    default: return 'text-slate-400 hover:text-slate-900 hover:bg-slate-200/70'
  }
})

const onClick = (e: MouseEvent) => {
  if (!props.clickable || props.disabled) return
  emit('click', e)
}

const onRemove = (e: MouseEvent) => {
  e.stopPropagation()
  if (props.disabled) return
  emit('remove')
}
</script>

<template>
  <component
    :is="clickable ? 'button' : 'span'"
    :type="clickable ? 'button' : undefined"
    :disabled="clickable && disabled ? true : undefined"
    :class="[
      'inline-flex items-center rounded-full font-bold uppercase tracking-wider transition-all duration-300 ease-out leading-none',
      variantClass,
      hoverClass,
      sizeClass,
      clickable && !disabled && 'cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed'
    ]"
    @click="onClick"
  >
    <component
      v-if="leftIcon"
      :is="leftIcon"
      :class="['shrink-0 -ml-0.5', iconSize]"
      aria-hidden="true"
    />

    <span class="whitespace-nowrap">
      <slot />
    </span>

    <component
      v-if="rightIcon && !removable"
      :is="rightIcon"
      :class="['shrink-0 -mr-0.5', iconSize]"
      aria-hidden="true"
    />

    <button
      v-if="removable"
      type="button"
      aria-label="Remove"
      :class="[
        'shrink-0 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-200',
        removeBtnClass
      ]"
      @click="onRemove"
    >
      <svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </component>
</template>
