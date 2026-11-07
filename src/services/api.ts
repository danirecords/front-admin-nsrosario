import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
  const isTokenRequest = config.url === (import.meta.env.VITE_AUTH_TOKEN_PATH || '/auth/login')
  const token = isTokenRequest
    ? undefined
    : localStorage.getItem('beaver_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
