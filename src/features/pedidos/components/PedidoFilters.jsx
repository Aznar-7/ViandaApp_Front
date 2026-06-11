import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ESTADOS_FILTER } from '../constants'
import { DateInput } from '@/components/ui/date-input'

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

      <div className="flex min-w-0 flex-col gap-2 sm:ml-auto sm:flex-row">
        {/* Date */}
        <div className="min-w-0 flex-1 sm:w-44">
          <DateInput
            value={filters.fecha ?? ''}
            onChange={(e) => onChange({ ...filters, fecha: e.target.value, page: 1 })}
            aria-label="Filtrar por fecha"
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
