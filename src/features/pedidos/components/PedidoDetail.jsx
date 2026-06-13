import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  Ban, Calendar, Clock, Edit2, Hash, Hourglass, MapPin,
  PackageCheck, ReceiptText, ShieldCheck, StickyNote, Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateFull, formatCurrency } from '@/shared/utils'
import { buttonVariants } from '@/components/ui/button'
import StatusBadge from './StatusBadge'
import CancelButton from './CancelButton'
import HistorialTimeline from './HistorialTimeline'
import { CANCELABLE_ESTADOS, EDITABLE_ESTADOS } from '../constants'

const STATUS_HERO_CONFIG = {
  entregado: {
    Icon:     PackageCheck,
    title:    '¡Tu pedido fue entregado!',
    sub:      'Ración retirada exitosamente. ¡Buen provecho, soldado!',
    gradient: 'from-emerald-500/[0.07]',
    border:   'border-emerald-400/20',
    iconBg:   'bg-emerald-500/10 text-emerald-600 border-emerald-400/25',
    text:     'text-emerald-700',
  },
  confirmado: {
    Icon:     ShieldCheck,
    title:    'Pedido confirmado',
    sub:      'El Imperio procesó tu solicitud. Preparate para el retiro.',
    gradient: 'from-sky-500/[0.07]',
    border:   'border-sky-400/20',
    iconBg:   'bg-sky-500/10 text-sky-600 border-sky-400/25',
    text:     'text-sky-700',
  },
  pendiente: {
    Icon:     Hourglass,
    title:    'Esperando confirmación',
    sub:      'Tu solicitud está en revisión. Te notificaremos al confirmarla.',
    gradient: 'from-amber-400/[0.07]',
    border:   'border-amber-400/20',
    iconBg:   'bg-amber-500/10 text-amber-600 border-amber-400/25',
    text:     'text-amber-700',
    pulse:    true,
  },
  cancelado: {
    Icon:     Ban,
    title:    'Pedido anulado',
    sub:      'Esta solicitud fue cancelada y ya no está activa.',
    gradient: 'from-red-500/[0.05]',
    border:   'border-red-400/15',
    iconBg:   'bg-red-500/[0.08] text-red-500 border-red-400/20',
    text:     'text-red-600/80',
  },
}

function StatusHero({ pedido }) {
  const cfg = STATUS_HERO_CONFIG[pedido.estado] ?? STATUS_HERO_CONFIG.pendiente
  const { Icon } = cfg

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-5 overflow-hidden bg-gradient-to-r to-transparent',
        cfg.gradient,
        cfg.border
      )}
    >
      <div className="flex items-start gap-4">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.32, type: 'spring', stiffness: 260, damping: 18 }}
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-2xl border',
            cfg.iconBg,
            cfg.pulse && 'animate-pulse'
          )}
        >
          <Icon className="size-7" />
        </motion.div>
        <div className="min-w-0 pt-0.5">
          <p className={cn('text-base font-bold leading-tight', cfg.text)}>{cfg.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cfg.sub}</p>
        </div>
      </div>
    </motion.div>
  )
}

const infoContainerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
}
const infoItemVariants = {
  hidden:   { opacity: 0, y: 8 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
}

export default function PedidoDetail({ pedido, historial, onCanceled }) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <StatusHero key={pedido.estado} pedido={pedido} />
      </AnimatePresence>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Main info */}
        <div className="min-w-0 space-y-4">
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
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Solicitado por: {pedido.usuarioNombre}
                    </p>
                  )}
                </div>
              </div>
              <StatusBadge estado={pedido.estado} />
            </div>

            <motion.div
              variants={infoContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4 p-5"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InfoItem icon={Calendar} label="Fecha"    value={formatDateFull(pedido.fecha)} />
                <InfoItem icon={Clock}    label="Turno"    value={<span className="capitalize">{pedido.turnoEntrega}</span>} />
                <InfoItem icon={Users}    label="Cantidad" value={`x${pedido.cantidad}`} />
                <InfoItem icon={Hash}     label="Total"    emphasis value={formatCurrency(pedido.total)} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem icon={MapPin}    label="Punto de retiro" value={pedido.puntoRetiro} />
                <InfoItem icon={StickyNote} label="Observaciones" value={pedido.observaciones || 'Sin observaciones'} muted={!pedido.observaciones} />
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          {(EDITABLE_ESTADOS.includes(pedido.estado) || CANCELABLE_ESTADOS.includes(pedido.estado)) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="order-detail-actions"
            >
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
                    <Edit2 className="w-3 h-3" /> Editar pedido
                  </Link>
                )}
                {CANCELABLE_ESTADOS.includes(pedido.estado) && (
                  <CancelButton pedidoId={pedido.id} onSuccess={onCanceled} />
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Timeline */}
        <div className="min-w-0">
          <HistorialTimeline historial={historial} />
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value, emphasis = false, muted = false }) {
  return (
    <motion.div variants={infoItemVariants} className="rounded-lg border border-border/70 bg-secondary/35 p-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon className="w-3 h-3 text-primary" />
        <span className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
          {label}
        </span>
      </div>
      <div className={cn(
        'break-words text-sm',
        emphasis ? 'font-orbitron text-base font-bold text-foreground'
          : muted ? 'text-muted-foreground italic'
          : 'text-foreground'
      )}>
        {value}
      </div>
    </motion.div>
  )
}
