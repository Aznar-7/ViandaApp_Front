import { useState, useEffect, useCallback } from 'react'
import pedidoService from '../services/pedidoService'
import { PAGE_SIZES } from '@/shared/constants'

export function usePedidos(initialFilters = {}) {
  const [data, setData]       = useState({ pedidos: [], total: 0, page: 1, limit: PAGE_SIZES.pedidos })
  const [filters, setFilters] = useState({ page: 1, limit: PAGE_SIZES.pedidos, ...initialFilters })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)
  const [tick, setTick]           = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    const params = {}
    if (filters.estado) params.estado = filters.estado
    if (filters.fecha)  params.fecha  = filters.fecha
    params.page  = filters.page
    params.limit = filters.limit

    pedidoService.getPedidos(params)
      .then((d) => { if (!cancelled) setData(d) })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.error ?? 'Error al cargar pedidos') })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [filters, tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { ...data, isLoading, error, filters, setFilters, refetch }
}
