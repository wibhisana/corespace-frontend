<script setup lang="ts">
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'

withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  description?: string
  recipient?: string
  closeLabel?: string
}>(), {
  title: 'Approval Sent!',
  description: 'Your approval request has been delivered. The reviewer will be notified shortly.',
  closeLabel: 'Close'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const setOpen = (v: boolean) => {
  emit('update:modelValue', v)
  if (!v) emit('close')
}
</script>

<template>
  <AppModal
    :model-value="modelValue"
    size="sm"
    hide-close
    @update:model-value="setOpen"
  >
    <div class="flex flex-col items-center text-center pt-8 pb-2">
      <div class="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <svg class="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
        {{ title }}
      </h2>

      <p class="mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
        {{ description }}
      </p>

      <p
        v-if="recipient"
        class="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400"
      >
        Sent to · <span class="text-slate-900">{{ recipient }}</span>
      </p>
    </div>

    <template #footer="{ close }">
      <AppButton variant="primary" full-width @click="close">
        {{ closeLabel }}
      </AppButton>
    </template>
  </AppModal>
</template>
