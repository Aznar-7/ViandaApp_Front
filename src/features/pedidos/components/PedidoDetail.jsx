import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, StickyNote, Hash, Edit2, ReceiptText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateFull, formatCurrency } from '@/shared/utils'
import { buttonVariants } from '@/components/ui/button'
import StatusBadge from './StatusBadge'
import CancelButton from './CancelButton'
import HistorialTimeline from './HistorialTimeline'
import { CANCELABLE_ESTADOS, EDITABLE_ESTADOS } from '../constants'

export default function PedidoDetail({ pedido, historial, onCanceled }) {
  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      {/* Main info — 2 cols */}
      <div className="min-w-0 space-y-4">
        {/* Header card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_48px_-42px_rgba(57,48,35,0.75)]">
          <div className="flex flex-col gap-4 border-b border-border bg-secondary/35 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <ReceiptText className="size-5" />
              </div>
              <div className="min-w-0">
              <p className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
                Pedido #{pedido.id}
              </p>
              <h2 className="mt-1 truncate text-lg font-bold text-foreground sm:text-xl">
                {pedido.menuNombre}
              </h2>
              {pedido.usuarioNombre && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Solicitado por: {pedido.usuarioNombre}
                </p>
              )}
              </div>
            </div>
            <StatusBadge estado={pedido.estado} />
          </div>

          <div className="space-y-4 p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <InfoItem icon={Calendar} label="Fecha" value={formatDateFull(pedido.fecha)} />
              <InfoItem icon={Clock} label="Turno" value={<span className="capitalize">{pedido.turnoEntrega}</span>} />
              <InfoItem icon={Users} label="Cantidad" value={`x${pedido.cantidad}`} />
              <InfoItem icon={Hash} label="Total" emphasis value={formatCurrency(pedido.total)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem icon={MapPin} label="Punto de retiro" value={pedido.puntoRetiro} />
              <InfoItem icon={StickyNote} label="Observaciones" value={pedido.observaciones || 'Sin observaciones'} muted={!pedido.observaciones} />
            </div>
          </div>
        </div>

        {/* Actions */}
        {(EDITABLE_ESTADOS.includes(pedido.estado) || CANCELABLE_ESTADOS.includes(pedido.estado)) && (
          <div className="order-detail-actions">
            <div>
              <p className="text-sm font-semibold text-foreground">Acciones disponibles</p>
              <p className="text-xs text-muted-foreground">Podés modificar el pedido mientras siga activo.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
            {EDITABLE_ESTADOS.includes(pedido.estado) && (
              <Link
                to={`/pedidos/${pedido.id}/editar`}
                className={cn(buttonVariants({ variant: 'outline' }), 'gap-1.5')}
              >
                <Edit2 className="w-3 h-3" />Editar pedido
              </Link>
            )}
            {CANCELABLE_ESTADOS.includes(pedido.estado) && (
              <CancelButton pedidoId={pedido.id} onSuccess={onCanceled} />
            )}
            </div>
          </div>
        )}
      </div>

      {/* Timeline — 1 col */}
      <div className="min-w-0">
        <HistorialTimeline historial={historial} />
      </div>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value, emphasis = false, muted = false }) {
  return (
    <div className="rounded-lg border border-border/70 bg-secondary/35 p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3 h-3 text-primary" />
        <span className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
          {label}
        </span>
      </div>
      <div className={cn('break-words text-sm', emphasis ? 'font-orbitron text-base font-bold text-foreground' : muted ? 'text-muted-foreground italic' : 'text-foreground')}>{value}</div>
    </div>
  )
}
