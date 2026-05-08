<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  shortcut?: string
  shortcutEnabled?: boolean
  size?: 'md' | 'lg'
  autofocus?: boolean
  loading?: boolean
}>(), {
  modelValue: '',
  placeholder: 'Search documents, policies, templates...',
  shortcut: '/',
  shortcutEnabled: true,
  size: 'lg',
  autofocus: false,
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit', value: string): void
  (e: 'clear'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const sizeClass = computed(() => props.size === 'md' ? 'h-12 px-5' : 'h-16 px-6')
const iconSize = computed(() => props.size === 'md' ? 'h-5 w-5' : 'h-6 w-6')
const textSize = computed(() => props.size === 'md' ? 'text-sm' : 'text-base')

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const onSubmit = () => emit('submit', String(props.modelValue ?? ''))

const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

const onGlobalKey = (e: KeyboardEvent) => {
  if (!props.shortcutEnabled || !props.shortcut) return
  if (e.key !== props.shortcut) return
  const target = e.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
  e.preventDefault()
  inputRef.value?.focus()
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKey)
  if (props.autofocus) inputRef.value?.focus()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKey)
})

const hasValue = computed(() => String(props.modelValue ?? '').length > 0)
</script>

<template>
  <form
    role="search"
    class="w-full"
    @submit.prevent="onSubmit"
  >
    <div
      :class="[
        'group flex items-center gap-3 rounded-full bg-slate-100/70 transition-all duration-300 ease-out focus-within:bg-white focus-within:shadow-[0_8px_30px_rgba(15,23,42,0.08)] focus-within:ring-2 focus-within:ring-indigo-500/40',
        sizeClass
      ]"
    >
      <svg
        v-if="!loading"
        :class="['shrink-0 text-slate-400 transition-colors duration-300 ease-out group-focus-within:text-indigo-500', iconSize]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
      </svg>
      <svg
        v-else
        :class="['shrink-0 animate-spin text-indigo-500', iconSize]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>

      <input
        ref="inputRef"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :class="[
          'flex-1 min-w-0 bg-transparent outline-none font-medium text-slate-900 placeholder:text-slate-400',
          textSize
        ]"
        @input="onInput"
      />

      <button
        v-if="hasValue"
        type="button"
        aria-label="Clear search"
        class="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors duration-200"
        @click="clear"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <kbd
        v-if="shortcutEnabled && shortcut && !hasValue"
        class="hidden sm:inline-flex shrink-0 items-center justify-center min-w-6 h-6 px-1.5 rounded bg-white shadow-sm text-[10px] font-bold uppercase tracking-wider text-slate-400"
      >
        {{ shortcut }}
      </kbd>
    </div>
  </form>
</template>
