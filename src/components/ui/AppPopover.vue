<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(defineProps<{
  align?: 'left' | 'right' | 'center'
}>(), {
  align: 'right'
})

const isOpen = ref(false)
const popoverRef = ref<HTMLElement | null>(null)

// Menutup popover jika user klik di luar kotak
onClickOutside(popoverRef, () => {
  isOpen.value = false
})

const toggle = () => {
  isOpen.value = !isOpen.value
}

const alignClasses = computed(() => {
  if (props.align === 'left') return 'left-0'
  if (props.align === 'center') return 'left-1/2 -translate-x-1/2'
  return 'right-0' // default right
})
</script>

<template>
  <div ref="popoverRef" class="relative inline-block">
    <div @click.stop="toggle" class="cursor-pointer inline-flex">
      <slot name="trigger" :is-open="isOpen" />
    </div>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="isOpen" 
        class="absolute z-50 mt-2 w-56 rounded-[4px] bg-background-page shadow-lg ring-1 ring-border-neutral focus:outline-none"
        :class="alignClasses"
      >
        <div class="p-2" @click="isOpen = false">
          <slot name="content" />
        </div>
      </div>
    </Transition>
  </div>
</template>