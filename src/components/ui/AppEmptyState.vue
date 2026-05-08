<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  icon?: Component
  iconTone?: 'brand' | 'neutral' | 'success' | 'warning' | 'critical'
  size?: 'sm' | 'md' | 'lg'
  background?: 'transparent' | 'subtle'
}>(), {
  iconTone: 'brand',
  size: 'md',
  background: 'transparent'
})

const iconTonePalette = computed(() => {
  switch (props.iconTone) {
    case 'success': return { bg: 'bg-emerald-50', text: 'text-emerald-500' }
    case 'warning': return { bg: 'bg-amber-50', text: 'text-amber-500' }
    case 'critical': return { bg: 'bg-rose-50', text: 'text-rose-500' }
    case 'neutral': return { bg: 'bg-slate-100', text: 'text-slate-500' }
    default: return { bg: 'bg-indigo-50', text: 'text-indigo-500' }
  }
})

const iconWrapperSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-12 w-12'
    case 'lg': return 'h-20 w-20'
    default: return 'h-16 w-16'
  }
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-6 w-6'
    case 'lg': return 'h-10 w-10'
    default: return 'h-8 w-8'
  }
})

const titleClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-base'
    case 'lg': return 'text-2xl'
    default: return 'text-lg'
  }
})

const containerPadding = computed(() => {
  switch (props.size) {
    case 'sm': return 'p-8'
    case 'lg': return 'p-16'
    default: return 'p-12'
  }
})

const containerBg = computed(() => {
  return props.background === 'subtle' ? 'bg-[#f8f9fc] rounded-[2rem]' : 'bg-transparent'
})
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center text-center',
      containerPadding,
      containerBg
    ]"
  >
    <div
      :class="[
        'mb-6 inline-flex items-center justify-center rounded-full',
        iconWrapperSize,
        iconTonePalette.bg
      ]"
    >
      <component
        v-if="icon"
        :is="icon"
        :class="[iconSize, iconTonePalette.text]"
        aria-hidden="true"
      />
      <svg
        v-else
        :class="[iconSize, iconTonePalette.text]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    </div>

    <h3 :class="['font-extrabold tracking-tight text-slate-900', titleClass]">
      {{ title }}
    </h3>

    <p
      v-if="description"
      class="mt-2 max-w-sm text-sm text-slate-500"
    >
      {{ description }}
    </p>

    <div v-if="$slots.action" class="mt-8">
      <slot name="action" />
    </div>
  </div>
</template>
