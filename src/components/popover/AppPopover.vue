<script setup lang="ts">
  import { ref, provide } from 'vue'

  const isOpen = ref(false)
  const triggerEl = ref<HTMLElement | null>(null)

  const toggle = () => (isOpen.value = !isOpen.value)
  const open = () => (isOpen.value = true)
  const close = () => (isOpen.value = false)

  provide('popover', { isOpen, toggle, open, close, triggerEl })
</script>

<template>
  <div>
    <slot />
  </div>
</template>
