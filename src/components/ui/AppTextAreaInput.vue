<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  rows?: number
  maxLength?: number
  disabled?: boolean
  readonly?: boolean
  hasError?: boolean
  errorMessage?: string
  hint?: string
  autoResize?: boolean
  showCount?: boolean
}>(), {
  modelValue: '',
  rows: 4,
  disabled: false,
  readonly: false,
  hasError: false,
  autoResize: false,
  showCount: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const stateClasses = computed(() => {
  if (props.hasError) {
    return 'bg-rose-50/60 text-rose-900 placeholder:text-rose-300 ring-1 ring-rose-200 focus:ring-2 focus:ring-rose-400'
  }
  return 'bg-slate-100/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/40'
})

const resize = async () => {
  if (!props.autoResize) return
  await nextTick()
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

watch(() => props.modelValue, resize, { immediate: true })

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
  resize()
}

const charCount = computed(() => String(props.modelValue || '').length)
</script>

<template>
  <div class="w-full">
    <div v-if="label || (showCount && maxLength)" class="flex items-end justify-between mb-2">
      <label v-if="label" class="text-xs font-bold uppercase tracking-wider text-slate-400">
        {{ label }}
      </label>
      <span v-if="showCount && maxLength" class="text-xs font-semibold text-slate-400 tabular-nums">
        {{ charCount }}/{{ maxLength }}
      </span>
    </div>

    <textarea
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :maxlength="maxLength"
      :disabled="disabled"
      :readonly="readonly"
      :class="[
        'block w-full px-5 py-4 text-sm font-medium rounded-2xl resize-none transition-all duration-300 ease-out outline-none disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed',
        stateClasses
      ]"
      @input="onInput"
    />

    <p v-if="hasError && errorMessage" class="mt-2 text-xs font-semibold text-rose-500">
      {{ errorMessage }}
    </p>
    <p v-else-if="hint" class="mt-2 text-xs text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>
