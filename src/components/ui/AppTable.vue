<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'

export interface TableColumn<TRow = Record<string, any>> {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
  sortable?: boolean
  formatter?: (value: any, row: TRow) => string | number
}

const props = withDefaults(defineProps<{
  columns: TableColumn<T>[]
  rows: T[]
  rowKey?: keyof T | ((row: T) => string | number)
  loading?: boolean
  hoverable?: boolean
  clickableRows?: boolean
  emptyText?: string
  density?: 'comfortable' | 'cozy' | 'compact'
}>(), {
  rowKey: 'id' as any,
  loading: false,
  hoverable: true,
  clickableRows: false,
  emptyText: 'No data available',
  density: 'comfortable'
})

const emit = defineEmits<{
  (e: 'row-click', row: T, index: number): void
}>()

const rowPadding = computed(() => {
  switch (props.density) {
    case 'cozy': return 'px-6 py-4'
    case 'compact': return 'px-4 py-3'
    default: return 'px-6 py-5'
  }
})

const alignClass = (align: TableColumn['align']) => {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

const getRowKey = (row: T, index: number): string | number => {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  if (props.rowKey && row[props.rowKey as string] != null) return row[props.rowKey as string]
  return index
}

const cellValue = (row: T, col: TableColumn<T>) => {
  const raw = row[col.key]
  return col.formatter ? col.formatter(raw, row) : raw
}

const onRowClick = (row: T, index: number) => {
  if (props.clickableRows) emit('row-click', row, index)
}
</script>

<template>
  <div class="w-full bg-white rounded-[1.5rem] shadow-[0_4px_24px_rgba(15,23,42,0.04)] ring-1 ring-black/5 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="col.width ? { width: col.width } : undefined"
              :class="[
                rowPadding,
                alignClass(col.align),
                'text-xs font-bold uppercase tracking-wider text-slate-400'
              ]"
            >
              <slot :name="`header-${col.key}`" :column="col">
                {{ col.label }}
              </slot>
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-if="loading">
            <tr v-for="n in 4" :key="`skeleton-${n}`">
              <td v-for="col in columns" :key="col.key" :class="rowPadding">
                <div class="h-3 w-3/4 bg-slate-100 rounded-full animate-pulse" />
              </td>
            </tr>
          </template>

          <template v-else-if="rows.length === 0">
            <tr>
              <td :colspan="columns.length" class="px-6 py-16 text-center">
                <slot name="empty">
                  <p class="text-sm font-medium text-slate-400">{{ emptyText }}</p>
                </slot>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="(row, index) in rows"
              :key="getRowKey(row, index)"
              :class="[
                'transition-colors duration-200',
                hoverable && 'hover:bg-slate-50/80',
                clickableRows && 'cursor-pointer'
              ]"
              @click="onRowClick(row, index)"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                :class="[
                  rowPadding,
                  alignClass(col.align),
                  'text-sm text-slate-700 align-middle'
                ]"
              >
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="index">
                  {{ cellValue(row, col) }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
