import axios from 'axios'
import { toast } from 'sonner'

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
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.replace('/login')
      return Promise.reject(error)
    }
    if (status === 403) toast.error('Sin permisos para realizar esta acción')
    else if (status === 404) toast.error('Recurso no encontrado')
    else if (status === 500) toast.error('Error interno del servidor')
    return Promise.reject(error)
  }
)

export default api
