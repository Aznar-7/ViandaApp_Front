import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, StickyNote, Hash, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateFull, formatCurrency } from '@/shared/utils'
import { buttonVariants } from '@/components/ui/button'
import StatusBadge from './StatusBadge'
import CancelButton from './CancelButton'
import HistorialTimeline from './HistorialTimeline'
import { CANCELABLE_ESTADOS, EDITABLE_ESTADOS } from '../constants'

export default function PedidoDetail({ pedido, historial, onCanceled }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main info — 2 cols */}
      <div className="lg:col-span-2 space-y-4">
        {/* Header card */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[0_18px_48px_-42px_rgba(57,48,35,0.75)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
                Pedido #{pedido.id}
              </p>
              <h2 className="font-orbitron text-lg font-bold text-foreground mt-1">
                {pedido.menuNombre}
              </h2>
              {pedido.usuarioNombre && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Solicitado por: {pedido.usuarioNombre}
                </p>
              )}
            </div>
            <StatusBadge estado={pedido.estado} />
          </div>

          <div className="h-px bg-border" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <InfoItem icon={Calendar} label="Fecha"   value={formatDateFull(pedido.fecha)} />
            <InfoItem icon={Clock}    label="Turno"   value={<span className="capitalize">{pedido.turnoEntrega}</span>} />
            <InfoItem icon={Users}    label="Cantidad" value={`x${pedido.cantidad}`} />
            <InfoItem icon={Hash}     label="Total"   value={<span className="font-orbitron font-bold text-foreground text-sm">{formatCurrency(pedido.total)}</span>} />
          </div>

          <InfoItem icon={MapPin}     label="Punto de retiro" value={pedido.puntoRetiro} />
          {pedido.observaciones && (
            <InfoItem icon={StickyNote} label="Observaciones" value={pedido.observaciones} />
          )}
        </div>

        {/* Actions */}
        {(EDITABLE_ESTADOS.includes(pedido.estado) || CANCELABLE_ESTADOS.includes(pedido.estado)) && (
          <div className="flex flex-wrap gap-2">
            {EDITABLE_ESTADOS.includes(pedido.estado) && (
              <Link
                to={`/pedidos/${pedido.id}/editar`}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5 font-orbitron text-[9px] tracking-widest uppercase')}
              >
                <Edit2 className="w-3 h-3" />Editar pedido
              </Link>
            )}
            {CANCELABLE_ESTADOS.includes(pedido.estado) && (
              <CancelButton pedidoId={pedido.id} onSuccess={onCanceled} />
            )}
          </div>
        )}
      </div>

      {/* Timeline — 1 col */}
      <div>
        <HistorialTimeline historial={historial} />
      </div>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-border/70 bg-secondary/35 p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3 h-3 text-primary" />
        <span className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  )
}
