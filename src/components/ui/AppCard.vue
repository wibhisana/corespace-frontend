<script setup lang="ts">
const props = withDefaults(defineProps<{
  noPadding?: boolean
  hoverEffect?: boolean
}>(), {
  noPadding: false,
  hoverEffect: false
})
</script>

<template>
  <div 
    class="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden"
    :class="[hoverEffect ? 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300' : '']"
  >
    <div v-if="$slots.header" class="px-8 pt-8 pb-2">
      <slot name="header" />
    </div>

    <div :class="noPadding ? '' : 'p-8'">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-8 pb-8 pt-2">
      <slot name="footer" />
    </div>
  </div>
</template>