import api from '@/lib/axios'

const menuService = {
  getMenus: (params = {}) => api.get('/menus', { params }).then((r) => r.data),
  getMenu:  (id)          => api.get(`/menus/${id}`).then((r) => r.data),
}

export default menuService
