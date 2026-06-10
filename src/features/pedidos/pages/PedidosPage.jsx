import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Plus, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { usePedidos } from '../hooks/usePedidos'
import PedidoCard from '../components/PedidoCard'
import PedidoFilters from '../components/PedidoFilters'
import { CardSkeleton } from '@/shared/components/Skeleton'
import EmptyState from '@/shared/components/EmptyState'
import ErrorMessage from '@/shared/components/ErrorMessage'
import Pagination from '@/shared/components/Pagination'
import CommandHeader from '@/shared/components/CommandHeader'

export default function PedidosPage() {
  const { user }   = useAuth()
  const { pedidos, total, page, limit, isLoading, error, filters, setFilters, refetch } = usePedidos()

  const totalPages = Math.ceil(total / limit)
  const hasFilters = filters.estado !== '' || !!filters.fecha

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="orders-consumer">

      <CommandHeader
        eyebrow={user?.nombre}
        title="Mis Pedidos"
        code="ORD / USER"
        description={!isLoading && !error ? `${total} orden${total !== 1 ? 'es' : ''} registrada${total !== 1 ? 's' : ''} en tu historial.` : 'Seguimiento y control de tus solicitudes.'}
        action={(
          <Link
            to="/pedidos/nuevo"
            className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5 text-sm shrink-0')}
          >
            <Plus className="w-4 h-4" /> Nueva orden
          </Link>
        )}
      />

      {/* Filters */}
      <div className="mb-6">
        <PedidoFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Error */}
      {!isLoading && error && <ErrorMessage message={error} onRetry={refetch} />}

      {/* Empty */}
      {!isLoading && !error && pedidos.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="Sin pedidos"
          description={hasFilters ? 'Ningún pedido coincide con los filtros.' : 'Todavía no realizaste ningún pedido.'}
          action={hasFilters ? () => setFilters({ estado: '', fecha: '', page: 1, limit: 10 }) : undefined}
          actionLabel="Limpiar filtros"
        />
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !error && pedidos.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pedidos.map((p) => (
              <div key={p.id}>
                <PedidoCard pedido={p} onCanceled={refetch} />
              </div>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          />
        </>
      )}
    </motion.div>
  )
}
