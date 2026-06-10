import { useState } from 'react'
import { Loader2, CheckCircle2, PackageCheck, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import adminService from '../services/adminService'

const ACTIONS = {
  pendiente:  [
    { key: 'confirmar', label: 'Confirmar', icon: CheckCircle2, call: adminService.confirmar,
      className: 'border-sky-500/40 text-sky-400 hover:bg-sky-500/10' },
    { key: 'cancelar', label: 'Cancelar',  icon: X,            call: adminService.cancelar,
      className: 'border-destructive/40 text-destructive hover:bg-destructive/10', confirm: true },
  ],
  confirmado: [
    { key: 'entregar', label: 'Entregar',  icon: PackageCheck,  call: adminService.entregar,
      className: 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10' },
    { key: 'cancelar', label: 'Cancelar',  icon: X,             call: adminService.cancelar,
      className: 'border-destructive/40 text-destructive hover:bg-destructive/10', confirm: true },
  ],
}

export default function StatusActions({ pedido, onSuccess }) {
  const [loading, setLoading]     = useState(null)
  const [confirming, setConfirming] = useState(null)

  const actions = ACTIONS[pedido.estado]
  if (!actions) return <span className="text-xs text-muted-foreground">—</span>

  async function handleAction(action) {
    if (action.confirm && confirming !== action.key) {
      setConfirming(action.key)
      return
    }
    setLoading(action.key)
    setConfirming(null)
    try {
      const updated = await action.call(pedido.id)
      toast.success(`Pedido #${pedido.id} — ${action.label.toLowerCase()}`)
      onSuccess?.(updated)
    } catch (err) {
      toast.error(err.response?.data?.error ?? 'No se pudo realizar la acción')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {actions.map((action) => {
        const Icon = action.icon
        const isLoading   = loading === action.key
        const isConfirming = confirming === action.key
        return (
          <button
            key={action.key}
            type="button"
            disabled={!!loading}
            onClick={() => handleAction(action)}
            onBlur={() => { if (confirming === action.key) setConfirming(null) }}
            className={cn(
              'flex items-center gap-1 px-2 py-1 border rounded transition-all duration-150',
              'font-orbitron text-[9px] tracking-wider uppercase',
              action.className,
              (isLoading || !!loading) && 'opacity-60 cursor-not-allowed',
              isConfirming && 'animate-pulse'
            )}
          >
            {isLoading
              ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
              : <Icon className="w-2.5 h-2.5" />
            }
            {isConfirming ? '¿Sí?' : action.label}
          </button>
        )
      })}
    </div>
  )
}
