import { useState, useEffect, useCallback } from 'react'
import pedidoService from '../services/pedidoService'

export function usePedidoDetail(id) {
  const [pedido, setPedido]       = useState(null)
  const [historial, setHistorial] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  const fetch = useCallback(() => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    Promise.all([
      pedidoService.getPedido(id),
      pedidoService.getHistorial(id),
    ])
      .then(([p, h]) => { setPedido(p); setHistorial(h) })
      .catch((err) => setError(err.response?.data?.error ?? 'Error al cargar el pedido'))
      .finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => { fetch() }, [fetch])

  return { pedido, historial, isLoading, error, refetch: fetch, setPedido }
}
