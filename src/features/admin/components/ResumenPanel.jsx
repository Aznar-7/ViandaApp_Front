import { DollarSign, Clock, CheckCircle, Package, XCircle } from 'lucide-react'
import { formatCurrency } from '@/shared/utils'
import { StatSkeleton } from '@/shared/components/Skeleton'
import ResumenCard from './ResumenCard'

export default function ResumenPanel({ resumen, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)}
      </div>
    )
  }

  if (!resumen) return null

  const byEstado   = Object.fromEntries((resumen.porEstado ?? []).map((e) => [e.estado, e]))
  const pendiente  = byEstado.pendiente
  const confirmado = byEstado.confirmado
  const entregado  = byEstado.entregado
  const cancelado  = byEstado.cancelado

  return (
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
  )
}
