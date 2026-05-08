<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  labelPosition?: 'left' | 'right'
}>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
  labelPosition: 'right'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

const sizeMap = computed(() => {
  switch (props.size) {
    case 'sm': return { track: 'h-5 w-9', thumb: 'h-4 w-4', translate: 'translate-x-4' }
    case 'lg': return { track: 'h-8 w-14', thumb: 'h-7 w-7', translate: 'translate-x-6' }
    default: return { track: 'h-6 w-11', thumb: 'h-5 w-5', translate: 'translate-x-5' }
  }
})

const onToggle = () => {
  if (props.disabled) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <label
    :class="[
      'group inline-flex items-center gap-3 select-none',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      labelPosition === 'left' && 'flex-row-reverse'
    ]"
  >
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :disabled="disabled"
      :class="[
        'relative inline-flex shrink-0 items-center rounded-full transition-all duration-300 ease-out',
        sizeMap.track,
        modelValue
          ? 'bg-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.25)]'
          : 'bg-slate-200 group-hover:bg-slate-300'
      ]"
      @click="onToggle"
    >
      <span
        :class="[
          'inline-block translate-x-0.5 rounded-full bg-white shadow-[0_2px_8px_rgba(15,23,42,0.18)] transition-all duration-300 ease-out',
          sizeMap.thumb,
          modelValue && sizeMap.translate
        ]"
      />
    </button>

    <span v-if="label || description || $slots.default" class="flex-1 min-w-0">
      <slot>
        <span v-if="label" class="block text-sm font-semibold text-slate-900">{{ label }}</span>
        <span v-if="description" class="block mt-0.5 text-xs text-slate-500">{{ description }}</span>
      </slot>
    </span>
  </label>
</template>
