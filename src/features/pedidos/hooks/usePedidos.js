import { useState, useEffect, useCallback } from 'react'
import pedidoService from '../services/pedidoService'

export function usePedidos(initialFilters = {}) {
  const [data, setData]       = useState({ pedidos: [], total: 0, page: 1, limit: 10 })
  const [filters, setFilters] = useState({ page: 1, limit: 10, ...initialFilters })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  const fetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    const params = {}
    if (filters.estado) params.estado = filters.estado
    if (filters.fecha)  params.fecha  = filters.fecha
    params.page  = filters.page
    params.limit = filters.limit

    pedidoService
      .getPedidos(params)
      .then(setData)
      .catch((err) => setError(err.response?.data?.error ?? 'Error al cargar pedidos'))
      .finally(() => setIsLoading(false))
  }, [filters])

  useEffect(() => { fetch() }, [fetch])

  return { ...data, isLoading, error, filters, setFilters, refetch: fetch }
}
