<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: File[]
  accept?: string
  multiple?: boolean
  maxSize?: number
  disabled?: boolean
  title?: string
  hint?: string
}>(), {
  multiple: true,
  disabled: false,
  title: 'Drop files here',
  hint: 'or click to browse'
})

const emit = defineEmits<{
  (e: 'update:modelValue', files: File[]): void
  (e: 'select', files: File[]): void
  (e: 'reject', items: { file: File; reason: string }[]): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const dragCounter = ref(0)
const isDragging = computed(() => dragCounter.value > 0)

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

const onDragEnter = (e: DragEvent) => {
  if (props.disabled) return
  e.preventDefault()
  dragCounter.value++
}

const onDragLeave = (e: DragEvent) => {
  if (props.disabled) return
  e.preventDefault()
  dragCounter.value = Math.max(0, dragCounter.value - 1)
}

const onDragOver = (e: DragEvent) => {
  if (props.disabled) return
  e.preventDefault()
}

const onDrop = (e: DragEvent) => {
  if (props.disabled) return
  e.preventDefault()
  dragCounter.value = 0
  const files = Array.from(e.dataTransfer?.files ?? [])
  handleFiles(files)
}

const onChange = (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  handleFiles(files)
  if (inputRef.value) inputRef.value.value = ''
}

const handleFiles = (files: File[]) => {
  const accepted: File[] = []
  const rejected: { file: File; reason: string }[] = []

  for (const f of files) {
    if (props.maxSize && f.size > props.maxSize) {
      rejected.push({ file: f, reason: `Exceeds ${formatBytes(props.maxSize)}` })
      continue
    }
    accepted.push(f)
  }

  if (rejected.length) emit('reject', rejected)
  if (accepted.length) {
    emit('update:modelValue', accepted)
    emit('select', accepted)
  }
}

const open = () => {
  if (props.disabled) return
  inputRef.value?.click()
}

const meta = computed(() => {
  const parts: string[] = []
  if (props.accept) parts.push(props.accept)
  if (props.maxSize) parts.push(`Max ${formatBytes(props.maxSize)}`)
  return parts.join(' · ')
})
</script>

<template>
  <div
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled"
    :class="[
      'relative flex w-full flex-col items-center justify-center gap-4 px-8 py-12 rounded-2xl text-center select-none transition-all duration-300 ease-out border-2 border-dashed',
      isDragging
        ? 'bg-indigo-50 border-indigo-400/70 scale-[1.01]'
        : 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-200/50',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="open"
    @keydown.enter.prevent="open"
    @keydown.space.prevent="open"
  >
    <input
      ref="inputRef"
      type="file"
      class="sr-only"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="onChange"
    />

    <div
      :class="[
        'inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-[0_4px_20px_rgba(79,70,229,0.10)] transition-all duration-300 ease-out',
        isDragging && '-translate-y-1 shadow-[0_8px_30px_rgba(79,70,229,0.25)]'
      ]"
    >
      <svg
        v-if="!isDragging"
        class="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      <svg v-else class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <div>
      <p class="text-base font-extrabold text-slate-900 tracking-tight">
        {{ isDragging ? 'Release to upload' : title }}
      </p>
      <p class="mt-1 text-sm text-slate-500">
        {{ hint }}
      </p>
    </div>

    <p
      v-if="meta"
      class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
    >
      {{ meta }}
    </p>
  </div>
</template>
