import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2, AlertCircle, MapPin, StickyNote, UtensilsCrossed, Calendar, Lock } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { NativeSelect } from '@/components/ui/native-select'
import { cn } from '@/lib/utils'
import { formatCurrency, formatDate, todayISO } from '@/shared/utils'
import menuService from '@/features/menus/services/menuService'
import { TIPO_CONFIG } from '@/features/menus/constants'
import { TURNO_OPTIONS } from '../constants'

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

// pedidoInfo: { menuNombre, fecha } — passed when isEdit=true
export default function PedidoForm({ defaultValues, pedidoInfo, isEdit = false, onSubmit, isLoading, error }) {
  const [menus, setMenus]               = useState([])
  const [loadingMenus, setLoadingMenus] = useState(!isEdit)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
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

  const watchFecha    = watch('fecha')
  const watchMenuId   = watch('menuId')
  const watchCantidad = watch('cantidad')

  useEffect(() => {
    if (isEdit || !watchFecha) return
    setLoadingMenus(true)
    menuService.getMenus({ fecha: watchFecha, activo: 1 })
      .then(setMenus)
      .catch(() => setMenus([]))
      .finally(() => setLoadingMenus(false))
  }, [isEdit, watchFecha])

  const selectedMenu = useMemo(
    () => menus.find((m) => String(m.id) === String(watchMenuId)) ?? null,
    [menus, watchMenuId]
  )

  const total = selectedMenu ? selectedMenu.precio * (watchCantidad || 0) : 0
  const canSubmit = isEdit || menus.length > 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-[0_20px_55px_-44px_rgba(57,48,35,0.8)] sm:p-6">

      {/* Edit mode: read-only menu + date header */}
      {isEdit && pedidoInfo && (
        <div className="flex items-center gap-3 p-3 rounded border border-border/60 bg-secondary/20">
          <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">{pedidoInfo.menuNombre}</span>
            {' · '}
            <span className="flex items-center gap-1 inline-flex">
              <Calendar className="w-3 h-3 inline" />
              {formatDate(pedidoInfo.fecha)}
            </span>
            <p className="text-[10px] mt-0.5 font-orbitron tracking-wider uppercase opacity-60">
              Menú y fecha no editables
            </p>
          </div>
        </div>
      )}

      {/* Create mode: date picker */}
      {!isEdit && (
        <div className="space-y-1.5">
          <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
            Fecha de entrega
          </Label>
          <Input
            type="date"
            {...register('fecha')}
            className={cn(
              '[color-scheme:light]',
              errors.fecha ? 'border-destructive' : 'border-border'
            )}
          />
          {errors.fecha && <FieldError msg={errors.fecha.message} />}
        </div>
      )}

      {/* Create mode: menu selector */}
      {!isEdit && (
        <div className="space-y-1.5">
          <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
            Menú
          </Label>
          {loadingMenus ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
              <Loader2 className="w-3 h-3 animate-spin" />Cargando menús...
            </div>
          ) : menus.length === 0 ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
              <UtensilsCrossed className="w-3.5 h-3.5" />Sin menús disponibles para esta fecha
            </div>
          ) : (
            <div className="grid gap-2">
              {menus.map((menu) => {
                const tipo     = TIPO_CONFIG[menu.tipo] ?? TIPO_CONFIG.clasico
                const disabled = menu.cupoDisponible < 1
                const selected = String(menu.id) === String(watchMenuId)
                return (
                  <label
                    key={menu.id}
                    className={cn(
                      'relative flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors duration-150',
                      disabled && 'opacity-50 cursor-not-allowed',
                      selected && !disabled && 'border-primary/50 bg-primary/5',
                      !selected && !disabled && 'border-border hover:border-border/80'
                    )}
                  >
                    <input
                      type="radio"
                      value={menu.id}
                      disabled={disabled}
                      {...register('menuId')}
                      className="mt-0.5 accent-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-orbitron text-xs font-semibold text-foreground">{menu.nombre}</span>
                        <span className={cn('text-[9px] font-orbitron tracking-wider uppercase border rounded px-1.5 py-px', tipo.badge)}>
                          {tipo.label}
                        </span>
                        {disabled && (
                          <span className="text-[9px] font-orbitron tracking-wider uppercase border border-destructive/30 text-destructive rounded px-1.5 py-px">
                            Sin cupo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{formatCurrency(menu.precio)} / unidad</span>
                        <span>Cupo: {menu.cupoDisponible ?? menu.cupoDiario} restantes</span>
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
          )}
          {errors.menuId && <FieldError msg={errors.menuId.message} />}
        </div>
      )}

      {/* Cantidad + Turno */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
            Cantidad
          </Label>
          <Input
            type="number" min={1} max={10}
            {...register('cantidad')}
            className={cn(errors.cantidad && 'border-destructive')}
          />
          {errors.cantidad && <FieldError msg={errors.cantidad.message} />}
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
            Turno
          </Label>
          <NativeSelect
            {...register('turnoEntrega')}
            className={cn(errors.turnoEntrega && 'border-destructive')}
          >
            <option value="">Seleccionar...</option>
            {TURNO_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </NativeSelect>
          {errors.turnoEntrega && <FieldError msg={errors.turnoEntrega.message} />}
        </div>
      </div>

      {/* Punto de retiro */}
      <div className="space-y-1.5">
        <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          <MapPin className="inline w-3 h-3 mr-1" />Punto de retiro
        </Label>
        <Input
          placeholder="Ej: Sede central"
          {...register('puntoRetiro')}
          className={cn(errors.puntoRetiro && 'border-destructive')}
        />
        {errors.puntoRetiro && <FieldError msg={errors.puntoRetiro.message} />}
      </div>

      {/* Observaciones */}
      <div className="space-y-1.5">
        <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          <StickyNote className="inline w-3 h-3 mr-1" />Observaciones (opcional)
        </Label>
        <Textarea
          rows={3}
          placeholder="Sin cubiertos, alergia a..."
          {...register('observaciones')}
          className="resize-none"
        />
      </div>

      {/* Total preview — create mode only */}
      {!isEdit && selectedMenu && (
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div>
            <span className="technical-label">Cupo restante</span>
            <p className="font-orbitron text-lg font-bold text-foreground mt-1">
              {selectedMenu.cupoDisponible ?? selectedMenu.cupoDiario}
            </p>
          </div>
          <div className="text-right">
            <span className="technical-label">Total estimado</span>
            <p className="font-orbitron text-lg font-bold text-foreground mt-1">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      )}

      {/* Server error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 rounded bg-destructive/10 border border-destructive/30 text-destructive text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hud-rule opacity-50" />
      <Button
        type="submit"
        disabled={isLoading || !canSubmit}
        className="w-full font-orbitron text-xs tracking-[0.15em] uppercase h-10"
      >
        {isLoading
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Procesando...</>
          : isEdit ? 'Guardar cambios' : 'Confirmar pedido'
        }
      </Button>
    </form>
  )
}

function FieldError({ msg }) {
  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="w-3 h-3 shrink-0" />{msg}
    </p>
  )
}
