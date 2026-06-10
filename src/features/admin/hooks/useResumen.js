import { useState, useEffect, useCallback } from 'react'
import adminService from '../services/adminService'

export function useResumen() {
  const [resumen, setResumen] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  const fetch = useCallback(() => {
    setIsLoading(true)
    adminService
      .getResumen()
      .then(setResumen)
      .catch((err) => setError(err.response?.data?.error ?? 'Error al cargar resumen'))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { resumen, isLoading, error, refetch: fetch }
}
