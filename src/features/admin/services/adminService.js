import api from '@/lib/axios'

async function getAllPedidos(params = {}) {
  const limit = 100
  const firstPage = await api
    .get('/pedidos', { params: { ...params, page: 1, limit } })
    .then((r) => r.data)
  const totalPages = Math.ceil(firstPage.total / limit)

  if (totalPages <= 1) return firstPage.pedidos

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      api
        .get('/pedidos', { params: { ...params, page: index + 2, limit } })
        .then((r) => r.data.pedidos)
    )
  )

  return [firstPage.pedidos, ...remainingPages].flat()
}

const adminService = {
  getPedidos: (params) => api.get('/pedidos', { params }).then((r) => r.data),
  getAllPedidos,
  getResumen: () => api.get('/pedidos/resumen').then((r) => r.data),
  getPedido: (id) => api.get(`/pedidos/${id}`).then((r) => r.data),
  getHistorial: (id) => api.get(`/pedidos/${id}/historial`).then((r) => r.data),
  confirmar: (id) => api.patch(`/pedidos/${id}/confirmar`).then((r) => r.data),
  entregar: (id) => api.patch(`/pedidos/${id}/entregar`).then((r) => r.data),
  cancelar: (id) => api.patch(`/pedidos/${id}/cancelar`).then((r) => r.data),
}

export default adminService
