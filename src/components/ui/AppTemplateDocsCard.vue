<script setup lang="ts">
import { computed, type Component } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  category?: string
  lastUpdated?: string | Date
  icon?: Component
  iconTone?: 'brand' | 'neutral' | 'success' | 'warning' | 'critical'
  clickable?: boolean
  href?: string
}>(), {
  iconTone: 'brand',
  clickable: true
})

const emit = defineEmits<{
  (e: 'click', payload: MouseEvent): void
}>()

const iconTonePalette = computed(() => {
  switch (props.iconTone) {
    case 'success': return { bg: 'bg-emerald-50', text: 'text-emerald-500' }
    case 'warning': return { bg: 'bg-amber-50', text: 'text-amber-500' }
    case 'critical': return { bg: 'bg-rose-50', text: 'text-rose-500' }
    case 'neutral': return { bg: 'bg-slate-100', text: 'text-slate-600' }
    default: return { bg: 'bg-indigo-50', text: 'text-indigo-500' }
  }
})

const formattedDate = computed(() => {
  if (!props.lastUpdated) return ''
  const d = props.lastUpdated instanceof Date ? props.lastUpdated : new Date(props.lastUpdated)
  if (Number.isNaN(d.getTime())) return String(props.lastUpdated)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
})

const tag = computed(() => props.href ? 'a' : (props.clickable ? 'button' : 'div'))

const baseClasses = computed(() => [
  'group relative block w-full text-left bg-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(15,23,42,0.03)] transition-all duration-300 ease-out',
  props.clickable && 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'
])

const onClick = (e: MouseEvent) => {
  if (!props.clickable) return
  emit('click', e)
}
</script>

<template>
  <component
    :is="tag"
    :href="href"
    :type="tag === 'button' ? 'button' : undefined"
    :class="baseClasses"
    @click="onClick"
  >
    <div class="flex items-start justify-between gap-4">
      <div
        :class="[
          'inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ease-out',
          iconTonePalette.bg,
          clickable && 'group-hover:scale-110'
        ]"
      >
        <component
          v-if="icon"
          :is="icon"
          :class="['h-6 w-6', iconTonePalette.text]"
          aria-hidden="true"
        />
        <svg
          v-else
          :class="['h-6 w-6', iconTonePalette.text]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>

      <slot name="badge" />
    </div>

    <div class="mt-6">
      <p
        v-if="category"
        class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
      >
        {{ category }}
      </p>
      <h3
        :class="[
          'text-lg font-extrabold tracking-tight text-slate-900 leading-tight',
          category && 'mt-2'
        ]"
      >
        {{ title }}
      </h3>

      <p
        v-if="$slots.default"
        class="mt-3 text-sm text-slate-500 leading-relaxed"
      >
        <slot />
      </p>
    </div>

    <div
      v-if="lastUpdated || $slots.footer"
      class="mt-6 flex items-center justify-between gap-3"
    >
      <span
        v-if="lastUpdated"
        class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
      >
        Updated · {{ formattedDate }}
      </span>
      <span v-else />

      <slot name="footer">
        <span
          v-if="clickable"
          class="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 transition-all duration-300 ease-out group-hover:text-indigo-600 group-hover:gap-2"
        >
          Open
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </slot>
    </div>
  </component>
</template>
