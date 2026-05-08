<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number | boolean | null
  value: string | number | boolean
  name?: string
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}>(), {
  modelValue: null,
  disabled: false,
  size: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void
}>()

const isChecked = computed(() => props.modelValue === props.value)

const sizeClasses = computed(() => props.size === 'sm' ? 'h-4 w-4' : 'h-5 w-5')
const dotSize = computed(() => props.size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')

const onSelect = () => {
  if (props.disabled || isChecked.value) return
  emit('update:modelValue', props.value)
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
      type="radio"
      class="sr-only"
      :name="name"
      :value="value"
      :checked="isChecked"
      :disabled="disabled"
      @change="onSelect"
    />

    <span
      :class="[
        'relative shrink-0 inline-flex items-center justify-center rounded-full transition-all duration-300 ease-out mt-0.5',
        sizeClasses,
        isChecked
          ? 'bg-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.25)]'
          : 'bg-slate-100 group-hover:bg-slate-200'
      ]"
    >
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-0"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-0"
      >
        <span v-if="isChecked" :class="['rounded-full bg-white', dotSize]" />
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
