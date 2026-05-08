<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  hint?: string
  shape?: 'rounded' | 'pill'
  showStrength?: boolean
}>(), {
  modelValue: '',
  size: 'md',
  disabled: false,
  hasError: false,
  shape: 'rounded',
  showStrength: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const visible = ref(false)
const toggle = () => { visible.value = !visible.value }

const radiusClass = computed(() => props.shape === 'pill' ? 'rounded-full' : 'rounded-xl')

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-9 text-sm'
    case 'lg': return 'h-14 text-base'
    default: return 'h-11 text-sm'
  }
})

const stateClasses = computed(() => {
  if (props.hasError) {
    return 'bg-rose-50/60 text-rose-900 placeholder:text-rose-300 ring-1 ring-rose-200 focus:ring-2 focus:ring-rose-400'
  }
  return 'bg-slate-100/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/40'
})

const strength = computed(() => {
  const v = String(props.modelValue || '')
  let score = 0
  if (v.length >= 8) score++
  if (/[A-Z]/.test(v)) score++
  if (/[0-9]/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  return score
})

const strengthLabel = computed(() => ['Too weak', 'Weak', 'Fair', 'Strong', 'Excellent'][strength.value])
const strengthColor = computed(() => ['bg-slate-200', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'][strength.value])

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
      <input
        :type="visible ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="current-password"
        :class="[
          'block w-full font-medium transition-all duration-300 ease-out outline-none pl-5 pr-12 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide',
          radiusClass,
          sizeClasses,
          stateClasses
        ]"
        @input="onInput"
      />

      <button
        type="button"
        tabindex="-1"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        class="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-slate-400 hover:text-slate-900 transition-colors duration-300 ease-out"
        @click="toggle"
      >
        <svg v-if="visible" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>

    <div v-if="showStrength && modelValue" class="mt-3 flex items-center gap-3">
      <div class="flex-1 flex gap-1">
        <span
          v-for="i in 4"
          :key="i"
          :class="[
            'h-1 flex-1 rounded-full transition-all duration-300 ease-out',
            i <= strength ? strengthColor : 'bg-slate-200'
          ]"
        />
      </div>
      <span class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ strengthLabel }}</span>
    </div>

    <p v-if="hasError && errorMessage" class="mt-2 text-xs font-semibold text-rose-500">
      {{ errorMessage }}
    </p>
    <p v-else-if="hint" class="mt-2 text-xs text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>
