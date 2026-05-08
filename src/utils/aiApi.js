import axios from 'axios'

export const aiApi = axios.create({
  baseURL: import.meta.env.VITE_AI_API_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

aiApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

aiApi.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const detail = err.response?.data?.detail

    let userMessage
    if (typeof detail === 'string') {
      userMessage = detail
    } else if (Array.isArray(detail) && detail.length) {
      userMessage = detail.map((d) => d.msg ?? JSON.stringify(d)).join('; ')
    } else if (status === 401) {
      userMessage = 'Your session has expired. Please log in again.'
    } else if (status === 503) {
      userMessage = 'The AI service is temporarily unavailable. Please try again shortly.'
    } else if (status === 504 || err.code === 'ECONNABORTED') {
      userMessage = 'The AI service took too long to respond. Please try again.'
    } else {
      userMessage = err.message || 'Unexpected error from the AI service.'
    }

    err.userMessage = userMessage
    return Promise.reject(err)
  }
)
