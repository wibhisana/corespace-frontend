<script setup>
import HrChatbot from '@/components/HrChatbot.vue'
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="border-b border-gray-200 bg-white px-6 py-4">
      <h1 class="text-xl font-semibold text-gray-900">AI Assistant</h1>
      <p class="text-sm text-gray-500">Ask anything about HR policies, leave balances, or company info.</p>
    </div>
    <div class="flex-1 min-h-0">
      <HrChatbot />
    </div>
  </div>
</template>
