<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const route = useRoute()
const useBlankLayout = computed(() => route.meta?.layout === 'blank')
</script>

<template>
  <router-view v-if="useBlankLayout" />
  <AppLayout v-else />
</template>
