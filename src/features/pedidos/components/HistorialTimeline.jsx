import { cn } from '@/lib/utils'

const ACTION_LABELS = {
  'creacion':                      { label: 'Creación',                  color: 'bg-primary' },
  'edicion':                       { label: 'Edición',                   color: 'bg-sky-500' },
  'estado:pendiente->confirmado':  { label: 'Confirmado',                color: 'bg-sky-400' },
  'estado:pendiente->cancelado':   { label: 'Cancelado (desde pendiente)',color: 'bg-destructive' },
  'estado:confirmado->cancelado':  { label: 'Cancelado (desde confirmado)',color: 'bg-destructive' },
  'estado:confirmado->entregado':  { label: 'Entregado',                 color: 'bg-emerald-500' },
}

export default function HistorialTimeline({ historial }) {
  if (!historial?.length) return null

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[0_18px_48px_-42px_rgba(57,48,35,0.75)]">
      <p className="font-orbitron text-[9px] tracking-[0.4em] uppercase text-primary mb-4">
        Historial
      </p>

      <div className="relative pl-4">
        {/* Vertical line */}
        <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border" />

        <div className="space-y-5">
          {historial.map((entry, i) => {
            const cfg = ACTION_LABELS[entry.accion] ?? { label: entry.accion, color: 'bg-muted-foreground' }
            const date = new Date(entry.fechaHora)
            return (
              <div key={entry.id ?? i} className="relative">
                {/* Dot */}
                <div className={cn('absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card', cfg.color)} />

                <div className="space-y-1 rounded-lg border border-border/70 bg-secondary/35 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-orbitron text-[10px] tracking-wider text-foreground">
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                      {' '}
                      {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {entry.usuarioNombre && (
                    <p className="text-[10px] text-muted-foreground">por {entry.usuarioNombre}</p>
                  )}

                  {/* Show diff for edits */}
                  {entry.accion === 'edicion' && entry.valorNuevo && (
                    <div className="mt-1.5 text-[10px] text-muted-foreground space-y-0.5 pl-2 border-l border-border/60">
                      {Object.entries(entry.valorNuevo).map(([k, v]) => {
                        const prev = entry.valorAnterior?.[k]
                        if (prev === v) return null
                        return (
                          <div key={k}>
                            <span className="text-foreground/60">{k}:</span>{' '}
                            <span className="line-through opacity-50">{String(prev)}</span>{' → '}
                            <span className="text-foreground">{String(v)}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
