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
    async login(email, password) {
      const { data } = await laravelApi.post('/login', {
        email,
        password,
        device_name: 'Web Browser',
      })
      
      // data.token, bukan data.access_token
      const token = data.token 
      if (!token) throw new Error('Login failed: missing token in response.')
      
      this.token = token
      localStorage.setItem('auth_token', token)
      await this.fetchUser()
      return this.user
    },
    async fetchUser() {
      const { data } = await laravelApi.get('/me')
      const user = data.user ?? null
      this.user = user
      this.roles = (user?.roles ?? [])
        .map((r) => (typeof r === 'string' ? r : r?.name))
        .filter(Boolean)
      this.attendanceStatus = data.attendance_status ?? null
      return this.user
    },
    async logout() {
      try {
        await laravelApi.post('/logout')
      } catch {
        // clear locally regardless
      } finally {
        this.user = null
        this.roles = []
        this.attendanceStatus = null
        this.token = null
        localStorage.removeItem('auth_token')
      }
    },
  },
})
