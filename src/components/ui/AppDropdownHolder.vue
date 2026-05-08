<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  show: boolean
  align?: 'left' | 'right' | 'center'
  position?: 'top' | 'bottom'
  width?: string
  offset?: number
}>(), {
  align: 'right',
  position: 'bottom',
  width: 'w-56',
  offset: 8
})

const alignClass = computed(() => {
  if (props.align === 'left') return 'left-0'
  if (props.align === 'center') return 'left-1/2 -translate-x-1/2'
  return 'right-0'
})

const positionClass = computed(() => {
  return props.position === 'top'
    ? 'bottom-full mb-2 origin-bottom'
    : 'top-full mt-2 origin-top'
})
</script>

<template>
  <div class="relative inline-block">
    <slot />

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="show"
        :class="[
          'absolute z-50 bg-white rounded-2xl p-2 shadow-[0_8px_30px_rgba(15,23,42,0.08)]',
          positionClass,
          alignClass,
          width
        ]"
        role="menu"
      >
        <slot name="panel" />
      </div>
    </Transition>
  </div>
</template>
