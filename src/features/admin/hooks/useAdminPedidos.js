import { useState, useEffect, useCallback } from 'react'
import adminService from '../services/adminService'
import { PAGE_SIZES } from '@/shared/constants'

export function useAdminPedidos(initialFilters = {}) {
  const [data, setData]       = useState({ pedidos: [], total: 0, page: 1, limit: PAGE_SIZES.adminPedidos })
  const [filters, setFilters] = useState({ page: 1, limit: PAGE_SIZES.adminPedidos, ...initialFilters })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  const fetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    const params = { page: filters.page, limit: filters.limit }
    if (filters.estado) params.estado = filters.estado
    if (filters.fecha)  params.fecha  = filters.fecha

    adminService
      .getPedidos(params)
      .then(setData)
      .catch((err) => setError(err.response?.data?.error ?? 'Error al cargar pedidos'))
      .finally(() => setIsLoading(false))
  }, [filters])

  useEffect(() => { fetch() }, [fetch])

  // In-place update after a state change action
  const updateRow = useCallback((updated) => {
    setData((prev) => ({
      ...prev,
      pedidos: prev.pedidos.map((p) => (p.id === updated.id ? updated : p)),
    }))
  }, [])

  return { ...data, isLoading, error, filters, setFilters, refetch: fetch, updateRow }
}
