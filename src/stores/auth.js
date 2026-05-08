import { defineStore } from 'pinia'
import { laravelApi } from '@/utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    roles: [],
    attendanceStatus: null,
    token: localStorage.getItem('auth_token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    can: (state) => (role) => state.roles.includes(role),
  },
  actions: {
    async login(email, password, rememberMe = false) {
      const { data } = await laravelApi.post('/iam/login', {
        email,
        password,
        remember_me: !!rememberMe,
        device_name: 'Web Browser',
      })

      const token = data.access_token
      if (!token) throw new Error('Login failed: missing access_token in response.')

      this.token = token
      localStorage.setItem('auth_token', token)
      laravelApi.defaults.headers.common['Authorization'] = `Bearer ${token}`

      const initialUser = data.user ?? null
      this.user = initialUser
      this.roles = (initialUser?.roles ?? [])
        .map((r) => (typeof r === 'string' ? r : r?.name))
        .filter(Boolean)
      this.attendanceStatus = data.attendance_status ?? null

      return this.user
    },

    async fetchUser() {
      try {
        if (this.token && !laravelApi.defaults.headers.common['Authorization']) {
          laravelApi.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        }

        const { data } = await laravelApi.get('/iam/me')
        const user = data.user ?? null

        this.user = user
        this.roles = (user?.roles ?? [])
          .map((r) => (typeof r === 'string' ? r : r?.name))
          .filter(Boolean)
        this.attendanceStatus = data.attendance_status ?? null

        return this.user
      } catch (err) {
        if (err?.response?.status === 401) {
          await this.logout()
        }
        throw err
      }
    },

    async logout() {
      try {
        if (this.token) {
          laravelApi.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          await laravelApi.post('/iam/logout')
        }
      } catch {
        // tolerate server-side failure; local state must still be cleared
      } finally {
        this.user = null
        this.roles = []
        this.attendanceStatus = null
        this.token = null
        localStorage.removeItem('auth_token')
        delete laravelApi.defaults.headers.common['Authorization']
      }
    },
  },
})
