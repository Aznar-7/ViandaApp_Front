import api from '@/lib/axios'

const sedeService = {
  getSedes: (params = {}) => api.get('/sedes', { params }).then((r) => r.data),
}

export default sedeService
