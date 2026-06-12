import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { todayISO } from '@/shared/utils'
import menuService from '@/features/menus/services/menuService'

const createSchema = z.object({
  menuId:        z.coerce.number().min(1, 'Seleccione un menú'),
  fecha:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  cantidad:      z.coerce.number().min(1, 'Mínimo 1').max(10, 'Máximo 10'),
  turnoEntrega:  z.enum(['almuerzo', 'cena'], { required_error: 'Seleccione un turno' }),
  puntoRetiro:   z.string().min(2, 'Mínimo 2 caracteres').max(200),
  observaciones: z.string().max(500).optional(),
})

const editSchema = z.object({
  cantidad:      z.coerce.number().min(1, 'Mínimo 1').max(10, 'Máximo 10'),
  turnoEntrega:  z.enum(['almuerzo', 'cena'], { required_error: 'Seleccione un turno' }),
  puntoRetiro:   z.string().min(2, 'Mínimo 2 caracteres').max(200),
  observaciones: z.string().max(500).optional(),
})

export function usePedidoForm({ defaultValues, isEdit = false }) {
  const [menus, setMenus]               = useState([])
  const [loadingMenus, setLoadingMenus] = useState(!isEdit)

  const form = useForm({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: isEdit
      ? {
          cantidad:      defaultValues?.cantidad      ?? 1,
          turnoEntrega:  defaultValues?.turnoEntrega  ?? '',
          puntoRetiro:   defaultValues?.puntoRetiro   ?? '',
          observaciones: defaultValues?.observaciones ?? '',
        }
      : {
          menuId:        defaultValues?.menuId        ?? '',
          fecha:         defaultValues?.fecha         ?? todayISO(),
          cantidad:      defaultValues?.cantidad      ?? 1,
          turnoEntrega:  defaultValues?.turnoEntrega  ?? '',
          puntoRetiro:   defaultValues?.puntoRetiro   ?? '',
          observaciones: defaultValues?.observaciones ?? '',
        },
  })

  const watchFecha    = form.watch('fecha')
  const watchMenuId   = form.watch('menuId')
  const watchCantidad = form.watch('cantidad')

  useEffect(() => {
    if (isEdit || !watchFecha) return
    let cancelled = false
    setLoadingMenus(true)
    menuService.getMenus({ fecha: watchFecha, activo: 1 })
      .then((data) => { if (!cancelled) setMenus(data) })
      .catch(() => { if (!cancelled) setMenus([]) })
      .finally(() => { if (!cancelled) setLoadingMenus(false) })
    return () => { cancelled = true }
  }, [isEdit, watchFecha])

  const selectedMenu = useMemo(
    () => menus.find((m) => String(m.id) === String(watchMenuId)) ?? null,
    [menus, watchMenuId]
  )

  const total    = selectedMenu ? selectedMenu.precio * (watchCantidad || 0) : 0
  const canSubmit = isEdit || menus.length > 0

  return { form, menus, loadingMenus, selectedMenu, total, canSubmit }
}
