import { CalendarDays, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TIPOS_FILTER } from '../constants'

export default function MenuFilters({ filters, onChange }) {
  const hasActive = filters.tipo !== '' || filters.fecha !== ''

  return (
    <div className="filter-console flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Tipo pills */}
      <div className="flex flex-wrap gap-2">
        {TIPOS_FILTER.map(({ value, label }) => {
          const active = filters.tipo === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...filters, tipo: value, page: 1 })}
              className={cn(
                'px-3.5 py-1.5 rounded-md border text-sm font-medium transition-all duration-150',
                active
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2 sm:ml-auto">
        {/* Date input */}
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="date"
            value={filters.fecha}
            onChange={(e) => onChange({ ...filters, fecha: e.target.value, page: 1 })}
            className={cn(
              'pl-8 pr-3 py-1.5 rounded-lg border border-border bg-secondary',
              'text-foreground text-sm',
              'focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20',
              '[color-scheme:light]'
            )}
          />
        </div>

        {/* Clear */}
        {hasActive && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, tipo: '', fecha: '', page: 1 })}
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
