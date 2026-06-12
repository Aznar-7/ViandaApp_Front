import { useState, useEffect, useCallback } from 'react'
import pedidoService from '../services/pedidoService'

export function usePedidoDetail(id) {
  const [pedido, setPedido]       = useState(null)
  const [historial, setHistorial] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)
  const [tick, setTick]           = useState(0)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setIsLoading(true)
    setError(null)
    Promise.all([
      pedidoService.getPedido(id),
      pedidoService.getHistorial(id),
    ])
      .then(([p, h]) => { if (!cancelled) { setPedido(p); setHistorial(h) } })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.error ?? 'Error al cargar el pedido') })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [id, tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { pedido, historial, isLoading, error, refetch, setPedido }
}
