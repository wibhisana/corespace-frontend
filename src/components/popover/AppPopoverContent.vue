<script setup lang="ts">
  import { inject, onUnmounted, ref, watch, nextTick } from 'vue'

  const popover = inject('popover') as {
    isOpen: { value: boolean }
    close: () => void
    open?: () => void
    triggerEl: { value: HTMLElement | null }
  }

  const contentRef = ref<HTMLElement | null>(null)

  const togglePopover = () => {
    if (popover.isOpen.value) {
      popover.close()
    } else {
      if (popover.open) {
        popover.open()
      } else {
        popover.isOpen.value = true
      }
    }
  }

  const updatePosition = () => {
    if (!popover.triggerEl.value || !contentRef.value) return

    const triggerRect = popover.triggerEl.value.getBoundingClientRect()
    const contentEl = contentRef.value

    // Default posisi: di kanan
    let left = triggerRect.left + window.scrollX
    if (contentEl.dataset.placement === 'left') {
      left = triggerRect.left + window.scrollX - contentEl.offsetWidth - 8
    } else {
      left = triggerRect.right + window.scrollX + 8
    }

    const top =
      triggerRect.top + window.scrollY + triggerRect.height / 2 - contentEl.offsetHeight / 2

    contentEl.style.position = 'absolute'
    contentEl.style.top = `${top}px`
    contentEl.style.left = `${left}px`
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (
      contentRef.value &&
      !contentRef.value.contains(e.target as Node) &&
      !popover.triggerEl.value?.contains(e.target as Node)
    ) {
      popover.close()
    }
  }

  watch(
    () => popover.isOpen.value,
    async val => {
      if (val) {
        await nextTick()
        updatePosition()
        document.addEventListener('mousedown', handleClickOutside)
        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition, true)
      } else {
        document.removeEventListener('mousedown', handleClickOutside)
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    }
  )

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  })

  defineExpose({ togglePopover })
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="popover.isOpen.value"
        ref="contentRef"
        class="border-border-neutral z-50 w-64 rounded-xl border bg-white p-3 text-sm shadow-lg"
        :data-placement="$attrs.placement || 'right'"
      >
        <slot />
      </div>
    </transition>
  </Teleport>
</template>
