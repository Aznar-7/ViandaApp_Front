import { useState, useEffect, useMemo } from 'react'
import menuService from '../services/menuService'

export function useMenus() {
  const [allMenus, setAllMenus] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ tipo: '', fecha: '', page: 1, limit: 9 })

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    menuService
      .getMenus()
      .then(setAllMenus)
      .catch((err) => setError(err.response?.data?.message ?? 'Error al cargar los menús'))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredMenus = useMemo(() => {
    return allMenus.filter((m) => {
      if (!m.activo) return false
      if (filters.tipo && m.tipo !== filters.tipo) return false
      if (filters.fecha && m.fecha !== filters.fecha) return false
      return true
    })
  }, [allMenus, filters])

  const total = filteredMenus.length
  const totalPages = Math.max(1, Math.ceil(total / filters.limit))
  const page = Math.min(filters.page, totalPages)
  const start = (page - 1) * filters.limit
  const menus = filteredMenus.slice(start, start + filters.limit)

  return { menus, allMenus, total, totalPages, page, isLoading, error, filters, setFilters }
}
