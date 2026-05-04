<script setup>
const pending = [
  { id: 1, name: 'Andi Pratama', type: 'Annual', from: '2026-05-04', to: '2026-05-06' },
  { id: 2, name: 'Siti Rahayu', type: 'Sick', from: '2026-05-02', to: '2026-05-02' },
]
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-900">Leave Approval</h1>
    <p class="text-gray-600 mt-2">Review and act on pending leave requests.</p>

    <div class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left text-gray-600">
          <tr>
            <th class="px-4 py-2 font-medium">Employee</th>
            <th class="px-4 py-2 font-medium">Type</th>
            <th class="px-4 py-2 font-medium">From</th>
            <th class="px-4 py-2 font-medium">To</th>
            <th class="px-4 py-2 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in pending" :key="r.id" class="border-t border-gray-200">
            <td class="px-4 py-3">{{ r.name }}</td>
            <td class="px-4 py-3">{{ r.type }}</td>
            <td class="px-4 py-3">{{ r.from }}</td>
            <td class="px-4 py-3">{{ r.to }}</td>
            <td class="px-4 py-3 text-right space-x-2">
              <button class="rounded-md bg-emerald-600 text-white text-xs px-3 py-1 hover:bg-emerald-700">Approve</button>
              <button class="rounded-md bg-rose-600 text-white text-xs px-3 py-1 hover:bg-rose-700">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
