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
      // 'staff' ditambahkan ke sini!
      roles: ['super_admin', 'hr_manager', 'manager', 'employee', 'staff'],
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
      // 'staff' ditambahkan ke sini!
      roles: ['super_admin', 'hr_manager', 'manager', 'employee', 'staff'],
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
      // 'staff' ditambahkan ke sini!
      roles: ['super_admin', 'hr_manager', 'manager', 'employee', 'staff'],
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
      // Staff tidak boleh mengakses halaman persetujuan (approval)
      roles: ['super_admin', 'hr_manager', 'manager'],
      showInSidebar: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// === GLOBAL NAVIGATION GUARD ===
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // 1. Pengecekan Halaman Publik (seperti Login)
  if (to.meta.public) {
    if (to.name === 'login' && auth.isAuthenticated) {
      // Jika sudah login tapi iseng buka /login, kembalikan ke dashboard
      return { name: 'dashboard' } 
    }
    return true
  }

  // 2. Pengecekan Sesi Terotentikasi
  if (!auth.isAuthenticated) {
    // Belum login? Lempar ke halaman login dan catat tujuan awalnya (redirect)
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 3. Hydration Sesi (Efek Refresh Page/F5)
  // Token ada, tapi data user di RAM kosong. Kita harus fetch dari backend (/me).
  if (!auth.user) {
    try {
      await auth.fetchUser()
    } catch (error) {
      // Jika /me gagal (token expired/invalid), bersihkan sisa token agar tidak terjadi infinite loop
      await auth.logout()
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }

  // 4. RBAC (Role-Based Access Control)
  // Mencegah karyawan biasa masuk ke halaman HR Manager
  if (to.meta.roles && !to.meta.roles.some((r) => auth.can(r))) {
    return { name: 'dashboard' }
  }

  // Lolos semua hadangan, silakan lewat!
  return true
})

export default router