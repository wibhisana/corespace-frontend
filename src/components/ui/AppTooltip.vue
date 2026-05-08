<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}>(), {
  position: 'top'
})

const positionClasses = computed(() => {
  switch (props.position) {
    case 'bottom': return 'top-full mt-2 left-1/2 -translate-x-1/2'
    case 'left': return 'right-full mr-2 top-1/2 -translate-y-1/2'
    case 'right': return 'left-full ml-2 top-1/2 -translate-y-1/2'
    case 'top': 
    default: return 'bottom-full mb-2 left-1/2 -translate-x-1/2'
  }
})
</script>

<template>
  <div class="relative inline-flex group">
    <slot />
    
    <div 
      class="absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap rounded-[4px] bg-text-primary px-2.5 py-1.5 body-xs text-background-page shadow-sm"
      :class="positionClasses"
      role="tooltip"
    >
      {{ text }}
    </div>
  </div>
</template>