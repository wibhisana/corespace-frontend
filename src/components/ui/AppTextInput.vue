<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  type?: 'text' | 'email' | 'number' | 'search' | 'tel' | 'url'
  disabled?: boolean
  readonly?: boolean
  hasError?: boolean
  errorMessage?: string
  hint?: string
  shape?: 'rounded' | 'pill'
}>(), {
  modelValue: '',
  size: 'md',
  type: 'text',
  disabled: false,
  readonly: false,
  hasError: false,
  shape: 'rounded'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const slots = useSlots()

const radiusClass = computed(() => props.shape === 'pill' ? 'rounded-full' : 'rounded-xl')

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-9 text-sm'
    case 'lg': return 'h-14 text-base'
    default: return 'h-11 text-sm'
  }
})

const paddingClasses = computed(() => {
  const left = slots.leading ? 'pl-11' : 'pl-5'
  const right = slots.trailing ? 'pr-11' : 'pr-5'
  return `${left} ${right}`
})

const stateClasses = computed(() => {
  if (props.hasError) {
    return 'bg-rose-50/60 text-rose-900 placeholder:text-rose-300 ring-1 ring-rose-200 focus:ring-2 focus:ring-rose-400'
  }
  return 'bg-slate-100/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/40'
})

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
      {{ label }}
    </label>

    <div class="relative">
      <span
        v-if="$slots.leading"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"
      >
        <slot name="leading" />
      </span>

      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="[
          'block w-full font-medium transition-all duration-300 ease-out outline-none disabled:opacity-50 disabled:cursor-not-allowed',
          radiusClass,
          sizeClasses,
          paddingClasses,
          stateClasses
        ]"
        @input="onInput"
      />

      <span
        v-if="$slots.trailing"
        class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400"
      >
        <slot name="trailing" />
      </span>
    </div>

    <p v-if="hasError && errorMessage" class="mt-2 text-xs font-semibold text-rose-500">
      {{ errorMessage }}
    </p>
    <p v-else-if="hint" class="mt-2 text-xs text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>
