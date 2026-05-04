<template>
  <div class="p-8 max-w-3xl mx-auto">
    <h1 class="text-2xl font-semibold text-gray-900">Leave Request</h1>
    <p class="text-gray-600 mt-2">Submit a new leave request.</p>

    <form class="mt-6 space-y-4 bg-white border border-gray-200 rounded-lg p-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Type</label>
        <select class="mt-1 w-full rounded-md border-gray-300 border px-3 py-2 text-sm">
          <option>Annual Leave</option>
          <option>Sick Leave</option>
          <option>Personal Leave</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">From</label>
          <input type="date" class="mt-1 w-full rounded-md border-gray-300 border px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">To</label>
          <input type="date" class="mt-1 w-full rounded-md border-gray-300 border px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Reason</label>
        <textarea rows="3" class="mt-1 w-full rounded-md border-gray-300 border px-3 py-2 text-sm" />
      </div>
      <button
        type="button"
        class="rounded-md bg-indigo-600 text-white text-sm px-4 py-2 hover:bg-indigo-700 transition"
      >
        Submit
      </button>
    </form>
  </div>
</template>
