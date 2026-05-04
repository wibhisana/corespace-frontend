import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true, layout: 'blank' },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: 'Dashboard',
      icon: 'home',
      roles: ['super_admin', 'hr_manager', 'employee'],
      showInSidebar: true,
    },
  },
  {
    path: '/ai-assistant',
    name: 'ai-assistant',
    component: () => import('@/views/AiAssistant.vue'),
    meta: {
      title: 'AI Assistant',
      icon: 'sparkles',
      roles: ['super_admin', 'hr_manager', 'employee'],
      showInSidebar: true,
    },
  },
  {
    path: '/leave-request',
    name: 'leave-request',
    component: () => import('@/views/LeaveRequest.vue'),
    meta: {
      title: 'Leave Request',
      icon: 'calendar',
      roles: ['super_admin', 'hr_manager', 'employee'],
      showInSidebar: true,
    },
  },
  {
    path: '/leave-approval',
    name: 'leave-approval',
    component: () => import('@/views/LeaveApproval.vue'),
    meta: {
      title: 'Leave Approval',
      icon: 'check-circle',
      roles: ['super_admin', 'hr_manager'],
      showInSidebar: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.public) {
    if (to.name === 'login' && auth.isAuthenticated) {
      return { name: 'dashboard' }
    }
    return true
  }

  if (!auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (!auth.user) {
    try {
      await auth.fetchUser()
    } catch {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }

  if (to.meta.roles && !to.meta.roles.some((r) => auth.can(r))) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
