<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'card' | 'list' | 'stats'
  rows?: number
  flat?: boolean
}>(), {
  type: 'card',
  rows: 3,
  flat: false
})

const wrapperClass = computed(() => {
  return props.flat
    ? 'p-6'
    : 'p-6 bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(15,23,42,0.03)]'
})

const bar = 'animate-pulse bg-slate-100/80 rounded-full'
</script>

<template>
  <div :class="wrapperClass" role="status" aria-label="Loading">
    <template v-if="type === 'card'">
      <div :class="['h-40 w-full rounded-[1.5rem]', 'animate-pulse bg-slate-100/80']" />
      <div class="mt-6 space-y-3">
        <div :class="[bar, 'h-5 w-3/4']" />
        <div :class="[bar, 'h-3 w-full']" />
        <div :class="[bar, 'h-3 w-5/6']" />
      </div>
      <div class="mt-6 flex items-center gap-3">
        <div :class="['h-9 w-9 rounded-full', 'animate-pulse bg-slate-100/80']" />
        <div class="flex-1 space-y-2">
          <div :class="[bar, 'h-3 w-1/3']" />
          <div :class="[bar, 'h-2.5 w-1/4']" />
        </div>
      </div>
    </template>

    <template v-else-if="type === 'list'">
      <div class="space-y-5">
        <div
          v-for="i in rows"
          :key="i"
          class="flex items-center gap-4"
        >
          <div :class="['h-12 w-12 rounded-full shrink-0', 'animate-pulse bg-slate-100/80']" />
          <div class="flex-1 space-y-2.5">
            <div :class="[bar, 'h-3.5 w-2/5']" />
            <div :class="[bar, 'h-2.5 w-3/4']" />
          </div>
          <div :class="[bar, 'h-6 w-16 shrink-0']" />
        </div>
      </div>
    </template>

    <template v-else-if="type === 'stats'">
      <div :class="[bar, 'h-2.5 w-1/3']" />
      <div :class="['mt-4 h-9 w-1/2 rounded-2xl', 'animate-pulse bg-slate-100/80']" />
      <div class="mt-5 flex items-center gap-2">
        <div :class="['h-5 w-5 rounded-full', 'animate-pulse bg-slate-100/80']" />
        <div :class="[bar, 'h-3 w-1/4']" />
      </div>
    </template>
  </div>
</template>
