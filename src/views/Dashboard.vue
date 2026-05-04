<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
    <p class="text-gray-600 mt-2">Welcome back, {{ auth.user?.name }}.</p>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-lg border border-gray-200 bg-white p-4">
        <p class="text-xs uppercase tracking-wide text-gray-500">Pending Leaves</p>
        <p class="mt-2 text-2xl font-semibold">3</p>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4">
        <p class="text-xs uppercase tracking-wide text-gray-500">Team Members</p>
        <p class="mt-2 text-2xl font-semibold">12</p>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-4">
        <p class="text-xs uppercase tracking-wide text-gray-500">AI Queries Today</p>
        <p class="mt-2 text-2xl font-semibold">7</p>
      </div>
    </div>
  </div>
</template>
