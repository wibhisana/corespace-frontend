<script setup lang="ts">
import { onBeforeUnmount, onMounted, nextTick, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

withDefaults(defineProps<{
  width?: string
  disabled?: boolean
  closeOnSelect?: boolean
}>(), {
  width: 'w-56',
  disabled: false,
  closeOnSelect: true
})

const emit = defineEmits<{
  (e: 'open', payload: { x: number; y: number; event: MouseEvent }): void
  (e: 'close'): void
}>()

const isOpen = ref(false)
const x = ref(0)
const y = ref(0)
const menuRef = ref<HTMLElement | null>(null)

const close = () => {
  if (!isOpen.value) return
  isOpen.value = false
  emit('close')
}

const onContextMenu = (e: MouseEvent, disabled: boolean) => {
  if (disabled) return
  e.preventDefault()
  x.value = e.clientX
  y.value = e.clientY
  isOpen.value = true
  emit('open', { x: e.clientX, y: e.clientY, event: e })

  nextTick(() => {
    const el = menuRef.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const margin = 8
    if (e.clientX + rect.width + margin > window.innerWidth) {
      x.value = window.innerWidth - rect.width - margin
    }
    if (e.clientY + rect.height + margin > window.innerHeight) {
      y.value = window.innerHeight - rect.height - margin
    }
  })
}

onClickOutside(menuRef, () => close())

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) close()
}

const onScroll = () => {
  if (isOpen.value) close()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', close)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', close)
})

defineExpose({ close })
</script>

<template>
  <div @contextmenu="(e) => onContextMenu(e, disabled)">
    <slot />

    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-1 scale-95"
      >
        <div
          v-if="isOpen"
          ref="menuRef"
          :class="[
            'fixed z-[60] origin-top-left bg-white rounded-2xl p-2 shadow-[0_8px_30px_rgba(15,23,42,0.08)]',
            width
          ]"
          :style="{ top: `${y}px`, left: `${x}px` }"
          role="menu"
          @click="closeOnSelect && close()"
        >
          <div class="flex flex-col gap-0.5">
            <slot name="items" :close="close" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
