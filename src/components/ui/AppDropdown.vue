<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { onClickOutside } from '@vueuse/core'
import AppDropdownHolder from './AppDropdownHolder.vue'

withDefaults(defineProps<{
  align?: 'left' | 'right' | 'center'
  position?: 'top' | 'bottom'
  width?: string
  closeOnSelect?: boolean
  disabled?: boolean
}>(), {
  align: 'right',
  position: 'bottom',
  width: 'w-56',
  closeOnSelect: true,
  disabled: false
})

const emit = defineEmits<{
  (e: 'open'): void
  (e: 'close'): void
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  emit('close')
}

const open = () => {
  if (isOpen.value) return
  isOpen.value = true
  emit('open')
}

const toggle = () => {
  isOpen.value ? close() : open()
}

onClickOutside(containerRef, () => close())

const onPanelClick = (props: { closeOnSelect: boolean }) => {
  if (props.closeOnSelect) close()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

defineExpose({ open, close, toggle })
</script>

<template>
  <div ref="containerRef">
    <AppDropdownHolder
      :show="isOpen"
      :align="align"
      :position="position"
      :width="width"
    >
      <div
        :class="['inline-flex', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
        @click="!disabled && toggle()"
      >
        <slot name="trigger" :is-open="isOpen" :toggle="toggle" />
      </div>

      <template #panel>
        <div
          class="flex flex-col gap-0.5"
          @click="closeOnSelect && close()"
        >
          <slot name="items" :close="close" />
        </div>
      </template>
    </AppDropdownHolder>
  </div>
</template>
