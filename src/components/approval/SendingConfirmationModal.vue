<script setup lang="ts">
import { computed } from 'vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  description?: string
  cancelLabel?: string
  confirmLabel?: string
  tone?: 'warning' | 'critical' | 'info' | 'brand'
  loading?: boolean
}>(), {
  title: 'Send for approval?',
  description: 'Once submitted, your request will be routed to the assigned reviewer and cannot be edited.',
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm Send',
  tone: 'warning',
  loading: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const palette = computed(() => {
  switch (props.tone) {
    case 'critical': return { bg: 'bg-rose-50', text: 'text-rose-500' }
    case 'info': return { bg: 'bg-sky-50', text: 'text-sky-500' }
    case 'brand': return { bg: 'bg-indigo-50', text: 'text-indigo-500' }
    default: return { bg: 'bg-amber-50', text: 'text-amber-500' }
  }
})

const confirmVariant = computed(() => props.tone === 'critical' ? 'danger' : 'primary')

const setOpen = (v: boolean) => {
  emit('update:modelValue', v)
  if (!v) emit('cancel')
}

const onConfirm = () => emit('confirm')
</script>

<template>
  <AppModal
    :model-value="modelValue"
    size="sm"
    @update:model-value="setOpen"
  >
    <div class="flex flex-col items-center text-center pt-6 pb-2">
      <div :class="['mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full', palette.bg]">
        <svg
          v-if="tone === 'critical'"
          :class="['h-8 w-8', palette.text]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <svg
          v-else-if="tone === 'info' || tone === 'brand'"
          :class="['h-8 w-8', palette.text]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <svg
          v-else
          :class="['h-8 w-8', palette.text]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>

      <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">
        {{ title }}
      </h2>

      <p class="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
        {{ description }}
      </p>
    </div>

    <template #footer="{ close }">
      <AppButton variant="secondary" :disabled="loading" @click="close">
        {{ cancelLabel }}
      </AppButton>
      <AppButton :variant="confirmVariant" :is-loading="loading" @click="onConfirm">
        {{ confirmLabel }}
      </AppButton>
    </template>
  </AppModal>
</template>
