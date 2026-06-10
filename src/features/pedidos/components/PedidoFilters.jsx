import { CalendarDays, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ESTADOS_FILTER } from '../constants'

const ESTADO_ACTIVE = {
  '':          'bg-[#E11D48]/10 border-[#E11D48]/40 text-[#E11D48]',
  pendiente:   'bg-[#FACC15]/10 border-[#FACC15]/35 text-[#FACC15]',
  confirmado:  'bg-[#38BDF8]/10 border-[#38BDF8]/35 text-[#38BDF8]',
  entregado:   'bg-[#22C55E]/10 border-[#22C55E]/35 text-[#22C55E]',
  cancelado:   'bg-[#EF4444]/10 border-[#EF4444]/35 text-[#EF4444]',
}

export default function PedidoFilters({ filters, onChange }) {
  const hasActive = filters.estado !== '' || !!filters.fecha

  return (
    <div className="filter-console flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Estado pills */}
      <div className="flex flex-wrap gap-2">
        {ESTADOS_FILTER.map(({ value, label }) => {
          const active = filters.estado === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...filters, estado: value, page: 1 })}
              className={cn(
                'px-3.5 py-1.5 rounded-md border text-sm font-medium transition-all duration-150',
                active
                  ? ESTADO_ACTIVE[value]
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2 sm:ml-auto">
        {/* Date */}
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="date"
            value={filters.fecha ?? ''}
            onChange={(e) => onChange({ ...filters, fecha: e.target.value, page: 1 })}
            className={cn(
              'pl-8 pr-3 py-1.5 rounded-lg border border-border bg-secondary',
              'text-foreground text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[#E11D48]/30 focus:border-[#E11D48]/50',
              '[color-scheme:light]'
            )}
          />
        </div>

        {hasActive && (
          <button
            type="button"
            onClick={() => onChange({ estado: '', fecha: '', page: 1, limit: filters.limit })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
