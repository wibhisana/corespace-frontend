<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const sidebarOpen = ref(true)

const menuItems = computed(() =>
  router.options.routes
    .filter((r) => r.meta?.showInSidebar && (!r.meta.roles || r.meta.roles.some((role) => auth.can(role))))
    .map((r) => ({ name: r.name, title: r.meta.title, icon: r.meta.icon }))
)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

async function handleLogout() {
  await auth.logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
    <!-- Sidebar -->
    <aside
      class="flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out"
      :class="sidebarOpen ? 'w-64' : 'w-16'"
    >
      <!-- Header / hamburger -->
      <div class="flex h-14 items-center justify-between px-3 border-b border-gray-200">
        <span v-if="sidebarOpen" class="font-semibold text-sm tracking-wide">Corespace HCIS</span>
        <button
          @click="toggleSidebar"
          class="p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-2">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="{ name: item.name }"
          v-slot="{ isActive, navigate }"
          custom
        >
          <button
            @click="navigate"
            class="flex w-full items-center gap-3 px-3 py-2 my-0.5 mx-2 rounded-md text-sm transition"
            :class="isActive ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'"
            :title="item.title"
          >
            <span class="flex h-6 w-6 items-center justify-center text-gray-600 shrink-0">
              <span class="h-2 w-2 rounded-full bg-current" />
            </span>
            <span v-if="sidebarOpen" class="truncate">{{ item.title }}</span>
          </button>
        </router-link>
      </nav>

      <!-- Footer / user -->
      <div class="border-t border-gray-200 p-3 space-y-2">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
            {{ auth.user?.name?.[0] ?? '?' }}
          </div>
          <div v-if="sidebarOpen" class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="flex w-full items-center gap-3 px-2 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition"
          :title="'Sign out'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="sidebarOpen">Sign out</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>
