<script setup lang="ts">
import { computed } from 'vue'
import AppPagingButton from './AppPagingButton.vue'

const props = withDefaults(defineProps<{
  currentPage: number
  totalPages: number
  totalRecords?: number
  size?: 'sm' | 'md'
  showSummary?: boolean
}>(), {
  size: 'md',
  showSummary: true
})

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

type PageItem = number | 'ellipsis-left' | 'ellipsis-right'

const pages = computed<PageItem[]>(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis-right', total]
  if (current >= total - 3) return [1, 'ellipsis-left', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis-left', current - 1, current, current + 1, 'ellipsis-right', total]
})

const goTo = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('update:currentPage', page)
}

const next = () => goTo(props.currentPage + 1)
const prev = () => goTo(props.currentPage - 1)
</script>

<template>
  <nav class="flex items-center justify-between gap-4 py-4" aria-label="Pagination">
    <p
      v-if="showSummary && totalRecords"
      class="text-xs font-bold uppercase tracking-wider text-slate-400"
    >
      Showing <span class="text-slate-900">{{ totalRecords }}</span> results
    </p>
    <span v-else />

    <div class="inline-flex items-center gap-1">
      <AppPagingButton
        :size="size"
        :disabled="currentPage === 1"
        aria-label="Previous page"
        @click="prev"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </AppPagingButton>

      <template v-for="(item, idx) in pages" :key="`${item}-${idx}`">
        <span
          v-if="item === 'ellipsis-left' || item === 'ellipsis-right'"
          class="inline-flex h-10 min-w-10 items-center justify-center text-sm font-semibold text-slate-300"
        >
          ···
        </span>
        <AppPagingButton
          v-else
          :size="size"
          :active="item === currentPage"
          :aria-label="`Go to page ${item}`"
          @click="goTo(item)"
        >
          {{ item }}
        </AppPagingButton>
      </template>

      <AppPagingButton
        :size="size"
        :disabled="currentPage === totalPages"
        aria-label="Next page"
        @click="next"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </AppPagingButton>
    </div>
  </nav>
</template>
