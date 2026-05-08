<script setup lang="ts">
import { ref } from 'vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTextAreaInput from '@/components/ui/AppTextAreaInput.vue'

const props = withDefaults(defineProps<{
  reasons?: string[]
  triggerLabel?: string
  triggerSize?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'right' | 'center'
  customReasonKey?: string
}>(), {
  reasons: () => ['Incomplete Data', 'Budget Exceeded', 'Out of Policy', 'Duplicate Request', 'Other'],
  triggerLabel: 'Reject',
  triggerSize: 'sm',
  align: 'right',
  customReasonKey: 'Other'
})

const emit = defineEmits<{
  (e: 'reject', payload: { reason: string; note?: string }): void
}>()

const dropdownRef = ref<InstanceType<typeof AppDropdown> | null>(null)
const showCustom = ref(false)
const customReason = ref('')

const reset = () => {
  showCustom.value = false
  customReason.value = ''
}

const close = () => {
  dropdownRef.value?.close()
  reset()
}

const onDropdownClose = () => {
  reset()
}

const selectReason = (reason: string) => {
  if (reason === props.customReasonKey) {
    showCustom.value = true
    return
  }
  emit('reject', { reason })
  close()
}

const submitCustom = () => {
  const note = customReason.value.trim()
  if (!note) return
  emit('reject', { reason: props.customReasonKey, note })
  close()
}

const cancelCustom = () => {
  showCustom.value = false
  customReason.value = ''
}
</script>

<template>
  <AppDropdown
    ref="dropdownRef"
    :align="align"
    width="w-72"
    :close-on-select="false"
    @close="onDropdownClose"
  >
    <template #trigger>
      <AppButton variant="danger" :size="triggerSize">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ triggerLabel }}
      </AppButton>
    </template>

    <template #items>
      <div v-if="!showCustom" class="flex flex-col gap-0.5">
        <p class="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Reason for rejection
        </p>
        <button
          v-for="reason in reasons"
          :key="reason"
          type="button"
          :class="[
            'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 transition-colors duration-200',
            reason === customReasonKey
              ? 'hover:bg-slate-50 hover:text-slate-900'
              : 'hover:bg-rose-50 hover:text-rose-700'
          ]"
          @click="selectReason(reason)"
        >
          <span>{{ reason }}</span>
          <svg
            v-if="reason === customReasonKey"
            class="h-3.5 w-3.5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div v-else class="p-1">
        <button
          type="button"
          class="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors duration-200"
          @click="cancelCustom"
        >
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        <AppTextAreaInput
          v-model="customReason"
          label="Specify reason"
          placeholder="Provide details for rejection..."
          :rows="3"
          auto-resize
        />

        <div class="mt-3 flex items-center justify-end gap-2">
          <AppButton variant="outline" size="sm" @click="cancelCustom">
            Cancel
          </AppButton>
          <AppButton
            variant="danger"
            size="sm"
            :disabled="!customReason.trim()"
            @click="submitCustom"
          >
            Reject
          </AppButton>
        </div>
      </div>
    </template>
  </AppDropdown>
</template>
