<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(defineProps<{
  modelValue?: Date | string | null
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  hint?: string
  minDate?: Date | string
  maxDate?: Date | string
  format?: (date: Date) => string
  weekStart?: 0 | 1
}>(), {
  modelValue: null,
  placeholder: 'Select date',
  size: 'md',
  disabled: false,
  hasError: false,
  weekStart: 1
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void
  (e: 'change', value: Date | null): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const toDate = (v: Date | string | null | undefined): Date | null => {
  if (!v) return null
  const d = v instanceof Date ? v : new Date(v)
  return Number.isNaN(d.getTime()) ? null : d
}

const selected = computed(() => toDate(props.modelValue))
const minD = computed(() => toDate(props.minDate))
const maxD = computed(() => toDate(props.maxDate))

const cursor = ref<Date>(selected.value ?? new Date())

watch(() => props.modelValue, (v) => {
  const d = toDate(v)
  if (d) cursor.value = new Date(d.getFullYear(), d.getMonth(), 1)
})

const monthLabel = computed(() => {
  return cursor.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
})

const weekdayLabels = computed(() => {
  const base = new Date(2024, 0, 7) // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base)
    d.setDate(base.getDate() + ((i + props.weekStart) % 7))
    return d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2)
  })
})

const isSameDay = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const today = new Date()

interface Cell {
  date: Date
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
}

const cells = computed<Cell[]>(() => {
  const year = cursor.value.getFullYear()
  const month = cursor.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const padStart = (firstDay - props.weekStart + 7) % 7

  const list: Cell[] = []
  for (let i = padStart - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    list.push(buildCell(d, false))
  }
  for (let d = 1; d <= lastDate; d++) {
    list.push(buildCell(new Date(year, month, d), true))
  }
  while (list.length < 42) {
    const last = list[list.length - 1].date
    const next = new Date(last)
    next.setDate(last.getDate() + 1)
    list.push(buildCell(next, false))
  }
  return list
})

function buildCell(d: Date, inMonth: boolean): Cell {
  let disabled = false
  if (minD.value && d < new Date(minD.value.getFullYear(), minD.value.getMonth(), minD.value.getDate())) disabled = true
  if (maxD.value && d > new Date(maxD.value.getFullYear(), maxD.value.getMonth(), maxD.value.getDate())) disabled = true
  return {
    date: d,
    inMonth,
    isToday: isSameDay(d, today),
    isSelected: isSameDay(d, selected.value),
    isDisabled: disabled
  }
}

const formattedValue = computed(() => {
  if (!selected.value) return ''
  if (props.format) return props.format(selected.value)
  return selected.value.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-9 text-sm'
    case 'lg': return 'h-14 text-base'
    default: return 'h-11 text-sm'
  }
})

const stateClasses = computed(() => {
  if (props.hasError) return 'bg-rose-50/60 text-rose-900 ring-1 ring-rose-200 focus:ring-2 focus:ring-rose-400'
  return 'bg-slate-100/70 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40'
})

const open = () => {
  if (props.disabled) return
  if (selected.value) cursor.value = new Date(selected.value.getFullYear(), selected.value.getMonth(), 1)
  isOpen.value = true
}

const close = () => { isOpen.value = false }

const toggle = () => { isOpen.value ? close() : open() }

const prevMonth = () => {
  const c = cursor.value
  cursor.value = new Date(c.getFullYear(), c.getMonth() - 1, 1)
}

const nextMonth = () => {
  const c = cursor.value
  cursor.value = new Date(c.getFullYear(), c.getMonth() + 1, 1)
}

const selectCell = (cell: Cell) => {
  if (cell.isDisabled) return
  emit('update:modelValue', cell.date)
  emit('change', cell.date)
  close()
}

const clear = (e: MouseEvent) => {
  e.stopPropagation()
  emit('update:modelValue', null)
  emit('change', null)
}

const goToday = () => {
  cursor.value = new Date(today.getFullYear(), today.getMonth(), 1)
  if (!minD.value || today >= minD.value) {
    if (!maxD.value || today <= maxD.value) {
      emit('update:modelValue', today)
      emit('change', today)
      close()
    }
  }
}

onClickOutside(containerRef, () => close())
</script>

<template>
  <div ref="containerRef" class="relative w-full">
    <label v-if="label" class="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
      {{ label }}
    </label>

    <button
      type="button"
      :disabled="disabled"
      :class="[
        'flex w-full items-center justify-between gap-3 px-5 rounded-xl font-medium transition-all duration-300 ease-out outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses,
        stateClasses
      ]"
      @click="toggle"
    >
      <span :class="formattedValue ? 'text-slate-900' : 'text-slate-400'">
        {{ formattedValue || placeholder }}
      </span>

      <span class="flex items-center gap-2">
        <span
          v-if="formattedValue && !disabled"
          role="button"
          tabindex="-1"
          aria-label="Clear date"
          class="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors duration-200"
          @click="clear"
        >
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
        <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </span>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 z-50 mt-2 w-80 origin-top bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
      >
        <div class="flex items-center justify-between mb-4">
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
            aria-label="Previous month"
            @click="prevMonth"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <span class="text-sm font-extrabold text-slate-900 tracking-tight capitalize">
            {{ monthLabel }}
          </span>

          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
            aria-label="Next month"
            @click="nextMonth"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-2">
          <span
            v-for="(w, i) in weekdayLabels"
            :key="i"
            class="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 py-1"
          >
            {{ w }}
          </span>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="(cell, i) in cells"
            :key="i"
            type="button"
            :disabled="cell.isDisabled"
            :class="[
              'h-9 inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200',
              cell.isSelected && 'bg-slate-900 text-white shadow-[0_4px_14px_rgba(15,23,42,0.25)]',
              !cell.isSelected && cell.isToday && 'text-indigo-600',
              !cell.isSelected && !cell.isToday && cell.inMonth && 'text-slate-700 hover:bg-slate-100',
              !cell.inMonth && !cell.isSelected && 'text-slate-300 hover:bg-slate-50',
              cell.isDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent'
            ]"
            @click="selectCell(cell)"
          >
            {{ cell.date.getDate() }}
          </button>
        </div>

        <div class="mt-4 flex items-center justify-between">
          <button
            type="button"
            class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors duration-200"
            @click="goToday"
          >
            Today
          </button>
          <button
            type="button"
            class="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors duration-200"
            @click="close"
          >
            Close
          </button>
        </div>
      </div>
    </Transition>

    <p v-if="hasError && errorMessage" class="mt-2 text-xs font-semibold text-rose-500">
      {{ errorMessage }}
    </p>
    <p v-else-if="hint" class="mt-2 text-xs text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>
