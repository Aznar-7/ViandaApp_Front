import { Link } from 'react-router-dom'
import { History } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate, formatCurrency } from '@/shared/utils'
import StatusBadge from '@/features/pedidos/components/StatusBadge'
import StatusActions from './StatusActions'

const COLS = ['#', 'Usuario', 'Menú', 'Fecha', 'Turno', 'Cant.', 'Total', 'Estado', 'Acciones']

export default function AdminTable({ pedidos, onRowUpdated }) {
  return (
    <div className="admin-orders-table overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/70">
              {COLS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-orbitron text-[9px] tracking-[0.2em] uppercase text-muted-foreground whitespace-nowrap first:pl-5 last:pr-5"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, idx) => (
              <tr
                key={pedido.id}
                className={cn(
                  'border-b border-border/70 transition-colors duration-150 last:border-b-0',
                  'hover:bg-primary/[0.045]',
                  idx % 2 === 0 ? 'bg-card' : 'bg-secondary/25'
                )}
              >
                <td className="px-4 py-3 pl-5">
                  <span className="font-orbitron text-[10px] text-muted-foreground">#{pedido.id}</span>
                </td>
                <td className="px-4 py-3 max-w-[130px]">
                  <span className="text-foreground truncate block font-medium">{pedido.usuarioNombre}</span>
                </td>
                <td className="px-4 py-3 max-w-[160px]">
                  <span className="text-foreground/85 truncate block">{pedido.menuNombre}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-muted-foreground">{formatDate(pedido.fecha)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-muted-foreground capitalize">{pedido.turnoEntrega}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-medium text-foreground/80">×{pedido.cantidad}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-orbitron text-sm font-semibold text-foreground">
                    {formatCurrency(pedido.total)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge estado={pedido.estado} />
                </td>
                <td className="px-4 py-3 pr-5">
                  <div className="flex items-center gap-2">
                    <StatusActions pedido={pedido} onSuccess={onRowUpdated} />
                    <Link
                      to={`/admin/pedidos/${pedido.id}/historial`}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5',
                        'font-orbitron text-[9px] tracking-wider uppercase text-muted-foreground',
                        'hover:border-primary/35 hover:bg-primary/[0.06] hover:text-primary transition-colors duration-150'
                      )}
                    >
                      <History className="w-3 h-3" />
                      Log
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
