<script setup lang="ts">
  import { inject, onMounted, ref } from 'vue'

  const popover = inject('popover') as {
    toggle: () => void
    triggerEl: { value: HTMLElement | null }
  }

  const btnRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    popover.triggerEl.value = btnRef.value
  })
</script>

<template>
  <span ref="btnRef" @click.stop="popover.toggle">
    <slot />
  </span>
</template>
