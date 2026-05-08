<script setup lang="ts">
import { reactive, watch } from 'vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTextInput from '@/components/ui/AppTextInput.vue'
import AppDatePicker from '@/components/ui/AppDatePicker.vue'
import AppChip from '@/components/ui/AppChip.vue'
import AppCheckbox from '@/components/ui/AppCheckbox.vue'

export interface AdvancedSearchFilters {
  keywords: string
  author: string
  categories: string[]
  statuses: string[]
  dateFrom: Date | null
  dateTo: Date | null
}

const props = withDefaults(defineProps<{
  modelValue: boolean
  initialFilters?: Partial<AdvancedSearchFilters>
  categories?: string[]
  statuses?: string[]
}>(), {
  categories: () => ['HR', 'Finance', 'Legal', 'IT', 'Operations', 'Marketing'],
  statuses: () => ['Active', 'Archived', 'Draft']
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'apply', filters: AdvancedSearchFilters): void
  (e: 'clear'): void
}>()

const empty = (): AdvancedSearchFilters => ({
  keywords: '',
  author: '',
  categories: [],
  statuses: [],
  dateFrom: null,
  dateTo: null
})

const filters = reactive<AdvancedSearchFilters>({ ...empty(), ...props.initialFilters })

watch(
  () => props.modelValue,
  (open) => {
    if (open) Object.assign(filters, { ...empty(), ...props.initialFilters })
  }
)

const toggleCategory = (cat: string) => {
  const idx = filters.categories.indexOf(cat)
  if (idx >= 0) filters.categories.splice(idx, 1)
  else filters.categories.push(cat)
}

const clearAll = () => {
  Object.assign(filters, empty())
  emit('clear')
}

const apply = () => {
  emit('apply', { ...filters, categories: [...filters.categories], statuses: [...filters.statuses] })
  emit('update:modelValue', false)
}

const setOpen = (v: boolean) => emit('update:modelValue', v)
</script>

<template>
  <AppModal
    :model-value="modelValue"
    size="lg"
    title="Advanced Search"
    description="Refine your results across documents and users."
    @update:model-value="setOpen"
  >
    <div class="flex flex-col gap-6">
      <AppTextInput
        v-model="filters.keywords"
        label="Keywords"
        placeholder="Search title, content, or tags..."
      >
        <template #leading>
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
          </svg>
        </template>
      </AppTextInput>

      <AppTextInput
        v-model="filters.author"
        label="Author"
        placeholder="e.g. Jane Doe"
      />

      <div>
        <p class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Categories
        </p>
        <div class="flex flex-wrap gap-2">
          <AppChip
            v-for="cat in categories"
            :key="cat"
            :variant="filters.categories.includes(cat) ? 'active' : 'default'"
            clickable
            @click="toggleCategory(cat)"
          >
            {{ cat }}
          </AppChip>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppDatePicker
          v-model="filters.dateFrom"
          label="Date From"
          placeholder="Start date"
        />
        <AppDatePicker
          v-model="filters.dateTo"
          label="Date To"
          placeholder="End date"
          :min-date="filters.dateFrom ?? undefined"
        />
      </div>

      <div>
        <p class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Status
        </p>
        <div class="flex flex-col gap-3">
          <AppCheckbox
            v-for="s in statuses"
            :key="s"
            v-model="filters.statuses"
            :value="s"
            :label="s"
          />
        </div>
      </div>
    </div>

    <template #footer="{ close }">
      <AppButton variant="outline" @click="clearAll">
        Clear All
      </AppButton>
      <div class="flex-1" />
      <AppButton variant="secondary" @click="close">
        Cancel
      </AppButton>
      <AppButton variant="primary" @click="apply">
        Apply Filters
      </AppButton>
    </template>
  </AppModal>
</template>
