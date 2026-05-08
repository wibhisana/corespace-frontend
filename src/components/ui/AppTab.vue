<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'

export interface TabItem {
  key: string
  label: string
  badge?: string | number
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue: string
  tabs: TabItem[]
  variant?: 'pill' | 'underline'
  size?: 'sm' | 'md'
  fullWidth?: boolean
}>(), {
  variant: 'pill',
  size: 'md',
  fullWidth: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', key: string): void
  (e: 'change', key: string): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const indicator = ref({ left: 0, width: 0 })

const select = (tab: TabItem) => {
  if (tab.disabled || tab.key === props.modelValue) return
  emit('update:modelValue', tab.key)
  emit('change', tab.key)
}

const updateIndicator = async () => {
  await nextTick()
  if (!containerRef.value) return
  const active = containerRef.value.querySelector<HTMLElement>('[data-active="true"]')
  if (!active) {
    indicator.value = { left: 0, width: 0 }
    return
  }
  indicator.value = {
    left: active.offsetLeft,
    width: active.offsetWidth
  }
}

watch(() => [props.modelValue, props.tabs], updateIndicator, { immediate: true, flush: 'post' })

const sizeClasses = computed(() => {
  return props.size === 'sm'
    ? 'text-xs px-4 py-1.5'
    : 'text-sm px-5 py-2'
})
</script>

<template>
  <div
    v-if="variant === 'pill'"
    ref="containerRef"
    :class="[
      'relative inline-flex items-center gap-1 p-1 bg-slate-100/70 rounded-full',
      fullWidth && 'w-full'
    ]"
  >
    <span
      class="absolute top-1 bottom-1 bg-white rounded-full shadow-[0_2px_10px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out"
      :style="{ left: `${indicator.left}px`, width: `${indicator.width}px` }"
    />

    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      :disabled="tab.disabled"
      :data-active="tab.key === modelValue"
      :class="[
        'relative z-10 inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 ease-out',
        sizeClasses,
        fullWidth && 'flex-1',
        tab.key === modelValue
          ? 'text-slate-900'
          : 'text-slate-500 hover:text-slate-900',
        tab.disabled && 'opacity-40 cursor-not-allowed'
      ]"
      @click="select(tab)"
    >
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.badge !== undefined"
        :class="[
          'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold rounded-full',
          tab.key === modelValue ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
        ]"
      >
        {{ tab.badge }}
      </span>
    </button>
  </div>

  <div
    v-else
    ref="containerRef"
    :class="['relative inline-flex items-center gap-6', fullWidth && 'w-full justify-between']"
  >
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      :disabled="tab.disabled"
      :data-active="tab.key === modelValue"
      :class="[
        'relative inline-flex items-center gap-2 py-3 font-semibold transition-all duration-300 ease-out',
        sizeClasses.replace('px-4', '').replace('px-5', ''),
        tab.key === modelValue ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700',
        tab.disabled && 'opacity-40 cursor-not-allowed'
      ]"
      @click="select(tab)"
    >
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.badge !== undefined"
        class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600"
      >
        {{ tab.badge }}
      </span>
    </button>

    <span
      class="absolute bottom-0 h-[2px] bg-slate-900 rounded-full transition-all duration-300 ease-out"
      :style="{ left: `${indicator.left}px`, width: `${indicator.width}px` }"
    />
  </div>
</template>
