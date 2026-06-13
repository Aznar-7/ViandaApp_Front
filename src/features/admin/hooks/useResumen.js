import { useCallback } from 'react'
import { useFetch } from '@/lib/useFetch'
import adminService from '../services/adminService'
import menuService from '@/features/menus/services/menuService'
import { groupPendingByDate, normalizeMenuQuotas } from '../utils/resumen'

export function useResumen() {
  const fetchFn = useCallback(async () => {
    const [resumen, pendientes, menus] = await Promise.all([
      adminService.getResumen(),
      adminService.getAllPedidos({
        estado: 'pendiente',
        sortBy: 'fecha',
        order: 'asc',
      }),
      menuService.getMenus({ activo: 1 }),
    ])

    return {
      ...resumen,
      pendientesPorFecha: groupPendingByDate(pendientes),
      cuposPorMenu: normalizeMenuQuotas(menus),
    }
  }, [])
  const { data: resumen, isLoading, error, refetch } = useFetch(fetchFn)
  return { resumen, isLoading, error, refetch }
}
