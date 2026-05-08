<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean | (string | number)[]
  value?: string | number
  label?: string
  description?: string
  disabled?: boolean
  indeterminate?: boolean
  size?: 'sm' | 'md'
}>(), {
  modelValue: false,
  disabled: false,
  indeterminate: false,
  size: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | (string | number)[]): void
}>()

const isArray = computed(() => Array.isArray(props.modelValue))

const isChecked = computed(() => {
  if (isArray.value && props.value !== undefined) {
    return (props.modelValue as (string | number)[]).includes(props.value)
  }
  return Boolean(props.modelValue)
})

const sizeClasses = computed(() => {
  return props.size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
})

const onToggle = () => {
  if (props.disabled) return
  if (isArray.value && props.value !== undefined) {
    const arr = [...(props.modelValue as (string | number)[])]
    const idx = arr.indexOf(props.value)
    if (idx >= 0) arr.splice(idx, 1)
    else arr.push(props.value)
    emit('update:modelValue', arr)
  } else {
    emit('update:modelValue', !isChecked.value)
  }
}
</script>

<template>
  <label
    :class="[
      'group inline-flex items-start gap-3 select-none',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]"
  >
    <input
      type="checkbox"
      class="sr-only"
      :checked="isChecked"
      :disabled="disabled"
      @change="onToggle"
    />

    <span
      :class="[
        'relative shrink-0 inline-flex items-center justify-center rounded-md transition-all duration-300 ease-out mt-0.5',
        sizeClasses,
        (isChecked || indeterminate)
          ? 'bg-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.25)]'
          : 'bg-slate-100 group-hover:bg-slate-200'
      ]"
    >
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-50"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-50"
      >
        <svg v-if="indeterminate" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
        </svg>
        <svg v-else-if="isChecked" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </Transition>
    </span>

    <span v-if="label || description || $slots.default" class="flex-1 min-w-0">
      <slot>
        <span v-if="label" class="block text-sm font-semibold text-slate-900">{{ label }}</span>
        <span v-if="description" class="block mt-0.5 text-xs text-slate-500">{{ description }}</span>
      </slot>
    </span>
  </label>
</template>
