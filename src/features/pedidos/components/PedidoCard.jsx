import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Calendar, Users, Clock, MapPin, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate, formatCurrency } from '@/shared/utils'
import StatusBadge from './StatusBadge'
import { CANCELABLE_ESTADOS } from '../constants'
import CancelButton from './CancelButton'

const STATUS_LEFT_BORDER = {
  pendiente:  'border-l-[#FACC15]',
  confirmado: 'border-l-[#38BDF8]',
  entregado:  'border-l-[#22C55E]',
  cancelado:  'border-l-[#EF4444]',
}

function MetaItem({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground/70" />
      <span>{children}</span>
    </div>
  )
}

export default function PedidoCard({ pedido, onCanceled }) {
  const leftBorder = STATUS_LEFT_BORDER[pedido.estado] ?? STATUS_LEFT_BORDER.pendiente

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={cn(
        'order-consumer-card border-l-2 overflow-hidden flex flex-col',
        'hover:border-border hover:border-l-2 transition-colors duration-150',
        leftBorder
      )}
    >
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground mb-0.5">
              Pedido #{pedido.id}
            </p>
            <h3 className="font-semibold text-foreground leading-snug truncate">
              {pedido.menuNombre}
            </h3>
          </div>
          <StatusBadge estado={pedido.estado} className="shrink-0" />
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          <MetaItem icon={Calendar}>{formatDate(pedido.fecha)}</MetaItem>
          <MetaItem icon={Users}>×{pedido.cantidad}</MetaItem>
          <MetaItem icon={Clock}><span className="capitalize">{pedido.turnoEntrega}</span></MetaItem>
          <MetaItem icon={MapPin}><span className="truncate block">{pedido.puntoRetiro}</span></MetaItem>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/70">
          <p className="font-orbitron text-base font-bold text-foreground">
            {formatCurrency(pedido.total)}
          </p>
          <div className="flex items-center gap-2">
            {CANCELABLE_ESTADOS.includes(pedido.estado) && (
              <CancelButton pedidoId={pedido.id} onSuccess={onCanceled} size="sm" />
            )}
            <Link
              to={`/pedidos/${pedido.id}`}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Detalle <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
