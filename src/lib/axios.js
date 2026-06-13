import axios from 'axios'
import { toast } from 'sonner'

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  throw new Error('[viandas] VITE_API_URL no definida. El build de producción requiere esta variable de entorno.')
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      return Promise.reject(error)
    }
    if (status === 403) {
      window.dispatchEvent(new CustomEvent('auth:forbidden', {
        detail: error.response?.data?.message ?? error.response?.data?.error,
      }))
    }
    else if (status === 404) toast.error('Recurso no encontrado', { description: 'El sector solicitado no existe en el Imperio.' })
    else if (status === 500) toast.error('Fallo en el servidor imperial', { description: 'Error interno. Los técnicos han sido alertados.' })
    return Promise.reject(error)
  }
)

export default api
