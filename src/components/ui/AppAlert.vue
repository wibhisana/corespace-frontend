<script setup lang="ts">
import { computed, ref, type Component } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  variant?: 'success' | 'critical' | 'warning' | 'info' | 'brand'
  title?: string
  description?: string
  icon?: boolean | Component
  dismissible?: boolean
}>(), {
  modelValue: true,
  variant: 'info',
  icon: true,
  dismissible: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const internalVisible = ref(true)

const visible = computed({
  get: () => props.modelValue && internalVisible.value,
  set: (v) => {
    internalVisible.value = v
    emit('update:modelValue', v)
  }
})

const palette = computed(() => {
  switch (props.variant) {
    case 'success': return { bg: 'bg-emerald-50', text: 'text-emerald-800', subtle: 'text-emerald-700/80', icon: 'text-emerald-500', dismissHover: 'hover:bg-emerald-100' }
    case 'critical': return { bg: 'bg-rose-50', text: 'text-rose-800', subtle: 'text-rose-700/80', icon: 'text-rose-500', dismissHover: 'hover:bg-rose-100' }
    case 'warning': return { bg: 'bg-amber-50', text: 'text-amber-800', subtle: 'text-amber-700/80', icon: 'text-amber-500', dismissHover: 'hover:bg-amber-100' }
    case 'brand': return { bg: 'bg-indigo-50', text: 'text-indigo-800', subtle: 'text-indigo-700/80', icon: 'text-indigo-500', dismissHover: 'hover:bg-indigo-100' }
    default: return { bg: 'bg-sky-50', text: 'text-sky-800', subtle: 'text-sky-700/80', icon: 'text-sky-500', dismissHover: 'hover:bg-sky-100' }
  }
})

const showIcon = computed(() => props.icon !== false)
const iconComponent = computed(() => typeof props.icon === 'object' && props.icon !== null ? props.icon : null)

const close = () => {
  visible.value = false
  emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 -translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 scale-100 max-h-screen"
    leave-to-class="opacity-0 -translate-y-2 scale-95 max-h-0"
  >
    <div
      v-if="visible"
      role="alert"
      :class="['flex items-start gap-4 rounded-2xl p-5', palette.bg, palette.text]"
    >
      <div
        v-if="showIcon"
        :class="['shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/60', palette.icon]"
      >
        <component
          v-if="iconComponent"
          :is="iconComponent"
          class="h-5 w-5"
          aria-hidden="true"
        />
        <svg v-else-if="variant === 'success'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else-if="variant === 'critical'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-else-if="variant === 'warning'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div class="flex-1 min-w-0 pt-1">
        <p v-if="title" class="text-sm font-extrabold tracking-tight">{{ title }}</p>
        <p
          v-if="description || $slots.default"
          :class="['text-sm', title && 'mt-1', !title ? palette.text : palette.subtle]"
        >
          <slot>{{ description }}</slot>
        </p>
      </div>

      <button
        v-if="dismissible"
        type="button"
        aria-label="Dismiss"
        :class="[
          'shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200',
          palette.icon,
          palette.dismissHover
        ]"
        @click="close"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>
