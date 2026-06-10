import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import pedidoService from '../services/pedidoService'

export default function CancelButton({ pedidoId, onSuccess, size = 'default', className }) {
  const [loading, setLoading]   = useState(false)
  const [confirm, setConfirm]   = useState(false)

  async function handleCancel() {
    if (!confirm) { setConfirm(true); return }
    setLoading(true)
    try {
      const updated = await pedidoService.cancelar(pedidoId)
      toast.success('Pedido cancelado')
      onSuccess?.(updated)
    } catch (err) {
      toast.error(err.response?.data?.error ?? 'No se pudo cancelar el pedido')
    } finally {
      setLoading(false)
      setConfirm(false)
    }
  }

  const small = size === 'sm'

  return (
    <button
      type="button"
      onClick={handleCancel}
      onBlur={() => setConfirm(false)}
      disabled={loading}
      className={cn(
        'flex items-center gap-1 border rounded transition-all duration-150',
        'font-orbitron tracking-widest uppercase',
        small ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1.5 text-[10px]',
        confirm
          ? 'border-destructive/60 bg-destructive/15 text-destructive'
          : 'border-border/60 text-muted-foreground hover:border-destructive/40 hover:text-destructive',
        loading && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {loading
        ? <Loader2 className={cn('animate-spin', small ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
        : <X className={cn(small ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
      }
      {confirm ? '¿Confirmar?' : 'Cancelar'}
    </button>
  )
}
