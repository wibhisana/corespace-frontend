<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

type Variant = 'success' | 'error' | 'warning' | 'info'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  variant?: Variant
  title?: string
  message?: string
  duration?: number
  dismissible?: boolean
}>(), {
  modelValue: true,
  variant: 'info',
  duration: 0,
  dismissible: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'dismiss'): void
}>()

const visible = ref(props.modelValue)
let timer: ReturnType<typeof setTimeout> | null = null

const close = () => {
  visible.value = false
  emit('update:modelValue', false)
  emit('dismiss')
}

const variantStyles = computed(() => {
  switch (props.variant) {
    case 'success':
      return {
        icon: 'text-emerald-500 bg-emerald-50',
        accent: 'text-emerald-600'
      }
    case 'error':
      return {
        icon: 'text-rose-500 bg-rose-50',
        accent: 'text-rose-600'
      }
    case 'warning':
      return {
        icon: 'text-amber-500 bg-amber-50',
        accent: 'text-amber-600'
      }
    default:
      return {
        icon: 'text-indigo-500 bg-indigo-50',
        accent: 'text-indigo-600'
      }
  }
})

onMounted(() => {
  if (props.duration > 0) {
    timer = setTimeout(close, props.duration)
  }
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-2 scale-95"
  >
    <div
      v-if="visible"
      role="status"
      class="pointer-events-auto flex items-start gap-4 w-full max-w-sm p-5 bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5"
    >
      <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-full', variantStyles.icon]">
        <svg v-if="variant === 'success'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else-if="variant === 'error'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-else-if="variant === 'warning'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div class="flex-1 min-w-0 pt-0.5">
        <p v-if="title" class="text-sm font-extrabold text-slate-900 tracking-tight">{{ title }}</p>
        <p v-if="message" class="text-sm text-slate-500" :class="title && 'mt-1'">{{ message }}</p>
        <slot />
      </div>

      <button
        v-if="dismissible"
        type="button"
        aria-label="Dismiss"
        class="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 ease-out"
        @click="close"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>
