import {
  DollarSign,
  Clock,
  CheckCircle,
  Package,
  XCircle,
  CalendarClock,
  UtensilsCrossed,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/shared/utils'
import { StatSkeleton } from '@/shared/components/Skeleton'
import ResumenCard from './ResumenCard'

export default function ResumenPanel({ resumen, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!resumen) return null

  const byEstado = Object.fromEntries((resumen.porEstado ?? []).map((e) => [e.estado, e]))
  const pendiente = byEstado.pendiente
  const confirmado = byEstado.confirmado
  const entregado = byEstado.entregado
  const cancelado = byEstado.cancelado

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <ResumenCard
          label="Recaudado"
          value={formatCurrency(resumen.recaudado ?? 0)}
          sub="confirmado + entregado"
          icon={DollarSign}
          variant="primary"
        />
        <ResumenCard
          label="Pendientes"
          value={pendiente?.cantidad ?? 0}
          sub={pendiente ? formatCurrency(pendiente.totalMonto) : 'Sin pedidos'}
          icon={Clock}
          variant="warning"
        />
        <ResumenCard
          label="Confirmados"
          value={confirmado?.cantidad ?? 0}
          sub={confirmado ? formatCurrency(confirmado.totalMonto) : 'Sin pedidos'}
          icon={CheckCircle}
          variant="info"
        />
        <ResumenCard
          label="Entregados"
          value={entregado?.cantidad ?? 0}
          sub={entregado ? formatCurrency(entregado.totalMonto) : 'Sin pedidos'}
          icon={Package}
          variant="success"
        />
        <ResumenCard
          label="Cancelados"
          value={cancelado?.cantidad ?? 0}
          sub={cancelado ? formatCurrency(cancelado.totalMonto) : 'Sin pedidos'}
          icon={XCircle}
          variant="danger"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownPanel icon={UtensilsCrossed} title="Cupos restantes por menú">
          {(resumen.cuposPorMenu ?? []).length === 0 ? (
            <EmptyBreakdown>Sin menús activos.</EmptyBreakdown>
          ) : (
            resumen.cuposPorMenu.map((menu) => (
              <div
                key={menu.id}
                className="flex items-center justify-between gap-4 border-b border-border/60 py-2.5 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{menu.nombre}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(menu.fecha)}</p>
                </div>
                <p className="shrink-0 font-orbitron text-sm font-bold text-foreground">
                  {menu.disponible}
                  <span className="text-muted-foreground">/{menu.total}</span>
                </p>
              </div>
            ))
          )}
        </BreakdownPanel>

        <BreakdownPanel icon={CalendarClock} title="Pedidos pendientes por fecha">
          {(resumen.pendientesPorFecha ?? []).length === 0 ? (
            <EmptyBreakdown>Sin pedidos pendientes.</EmptyBreakdown>
          ) : (
            resumen.pendientesPorFecha.map((item) => (
              <div
                key={item.fecha}
                className="flex items-center justify-between gap-4 border-b border-border/60 py-2.5 last:border-0"
              >
                <p className="text-sm font-medium text-foreground">{formatDate(item.fecha)}</p>
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{item.pedidos}</strong> pedidos ·{' '}
                  {item.unidades} unidades
                </p>
              </div>
            ))
          )}
        </BreakdownPanel>
      </div>
    </div>
  )
}

function BreakdownPanel({ icon: Icon, title, children }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <h3 className="font-orbitron text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h3>
      </div>
      <div className="max-h-64 overflow-y-auto pr-1">{children}</div>
    </section>
  )
}

function EmptyBreakdown({ children }) {
  return <p className="py-5 text-center text-sm text-muted-foreground">{children}</p>
}
