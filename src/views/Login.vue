<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

function formatLoginError(err) {
  const status = err?.response?.status
  const data = err?.response?.data

  if (status === 422 && data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat().filter(Boolean)
    if (messages.length) return messages.join(' ')
  }

  if (status === 401) return 'Invalid email or password.'

  return data?.message || err?.message || 'Login failed. Please try again.'
}

async function handleSubmit() {
  if (loading.value) return
  errorMessage.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const redirect = router.currentRoute.value.query.redirect
    router.replace(typeof redirect === 'string' ? redirect : '/dashboard')
  } catch (err) {
    errorMessage.value = formatLoginError(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-indigo-50 px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-sm">
          C
        </div>
        <h1 class="mt-4 text-2xl font-semibold text-gray-900">Corespace HCIS</h1>
        <p class="mt-1 text-sm text-gray-500">Sign in to your account</p>
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4"
        novalidate
      >
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            :disabled="loading"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            :disabled="loading"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="••••••••"
          />
        </div>

        <p
          v-if="errorMessage"
          class="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg
            v-if="loading"
            class="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" stroke-width="4" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
          </svg>
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <p class="mt-6 text-center text-xs text-gray-400">
        © {{ new Date().getFullYear() }} Corespace
      </p>
    </div>
  </div>
</template>
