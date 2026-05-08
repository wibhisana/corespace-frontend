<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  fileName: string
  fileSize?: number
  progress: number
  status?: 'uploading' | 'success' | 'error' | 'paused'
  errorMessage?: string
  cancellable?: boolean
  flat?: boolean
}>(), {
  status: 'uploading',
  cancellable: true,
  flat: false
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'retry'): void
}>()

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

const clamped = computed(() => Math.max(0, Math.min(100, Math.round(props.progress))))

const trackColor = computed(() => {
  switch (props.status) {
    case 'error': return 'bg-rose-500'
    case 'success': return 'bg-emerald-500'
    case 'paused': return 'bg-slate-400'
    default: return 'bg-indigo-500'
  }
})

const iconWrapClass = computed(() => {
  switch (props.status) {
    case 'error': return 'bg-rose-50 text-rose-500'
    case 'success': return 'bg-emerald-50 text-emerald-500'
    default: return 'bg-indigo-50 text-indigo-500'
  }
})

const statusLabel = computed(() => {
  switch (props.status) {
    case 'success': return 'Complete'
    case 'error': return 'Failed'
    case 'paused': return 'Paused'
    default: return `${clamped.value}%`
  }
})

const wrapperClass = computed(() => {
  return props.flat
    ? 'p-4'
    : 'p-4 bg-white rounded-2xl shadow-[0_4px_24px_rgba(15,23,42,0.03)]'
})

const progressStyle = computed(() => ({ width: `${clamped.value}%` }))
</script>

<template>
  <div :class="['flex items-start gap-4', wrapperClass]">
    <div
      :class="[
        'shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 ease-out',
        iconWrapClass
      ]"
    >
      <svg v-if="status === 'success'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <svg v-else-if="status === 'error'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm font-semibold text-slate-900 truncate">
          {{ fileName }}
        </p>
        <p class="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400 tabular-nums">
          {{ statusLabel }}
        </p>
      </div>

      <p v-if="fileSize !== undefined" class="mt-0.5 text-xs text-slate-500">
        {{ formatBytes(fileSize) }}
      </p>

      <div class="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          :class="['h-full rounded-full transition-all duration-300 ease-out', trackColor]"
          :style="progressStyle"
        />
      </div>

      <div v-if="status === 'error'" class="mt-2 flex items-center justify-between gap-3">
        <p v-if="errorMessage" class="text-xs font-semibold text-rose-500 truncate">
          {{ errorMessage }}
        </p>
        <button
          type="button"
          class="shrink-0 text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          @click="emit('retry')"
        >
          Retry
        </button>
      </div>
    </div>

    <button
      v-if="cancellable && status !== 'success'"
      type="button"
      aria-label="Cancel"
      class="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
      @click="emit('cancel')"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
