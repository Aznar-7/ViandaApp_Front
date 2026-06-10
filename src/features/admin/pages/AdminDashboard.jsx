import { motion } from 'motion/react'
import { ClipboardList } from 'lucide-react'
import { useAdminPedidos } from '../hooks/useAdminPedidos'
import { useResumen } from '../hooks/useResumen'
import ResumenPanel from '../components/ResumenPanel'
import AdminTable from '../components/AdminTable'
import PedidoFilters from '@/features/pedidos/components/PedidoFilters'
import { TableRowSkeleton } from '@/shared/components/Skeleton'
import EmptyState from '@/shared/components/EmptyState'
import ErrorMessage from '@/shared/components/ErrorMessage'
import Pagination from '@/shared/components/Pagination'
import CommandHeader from '@/shared/components/CommandHeader'

export default function AdminDashboard() {
  const { resumen, isLoading: loadingResumen } = useResumen()
  const { pedidos, total, page, limit, isLoading, error, filters, setFilters, refetch, updateRow } = useAdminPedidos()

  const totalPages = Math.ceil(total / limit)
  const hasFilters = filters.estado !== '' || !!filters.fecha

  return (
    <motion.div className="admin-workspace" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

      <CommandHeader
        eyebrow="Centro de Comando Imperial"
        title="Control de Operaciones"
        code="ADM / O66"
        description={!isLoading && !error ? `${total} provisión${total !== 1 ? 'es' : ''} bajo supervisión del Imperio.` : 'Supervisión de provisiones, estados y acciones operativas.'}
      />

      {/* Stat cards */}
      <div className="mb-7">
        <ResumenPanel resumen={resumen} isLoading={loadingResumen} />
      </div>

      {/* Filters */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Registro de provisiones</h2>
        </div>
        <PedidoFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Table / States */}
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!error && !isLoading && pedidos.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="Sin pedidos"
          description={hasFilters ? 'Ningún pedido coincide con los filtros.' : 'No hay pedidos registrados.'}
          action={hasFilters ? () => setFilters({ estado: '', fecha: '', page: 1, limit: 15 }) : undefined}
          actionLabel="Limpiar filtros"
        />
      )}

      {!error && isLoading && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full">
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={9} />)}
            </tbody>
          </table>
        </div>
      )}

      {!error && !isLoading && pedidos.length > 0 && (
        <>
          <AdminTable pedidos={pedidos} onRowUpdated={updateRow} />
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
