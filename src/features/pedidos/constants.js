export const ESTADO_CONFIG = {
  pendiente: {
    label:     'Pendiente',
    className: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    dot:       'bg-amber-400',
  },
  confirmado: {
    label:     'Confirmado',
    className: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    dot:       'bg-sky-400',
  },
  entregado: {
    label:     'Entregado',
    className: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    dot:       'bg-emerald-400',
  },
  cancelado: {
    label:     'Cancelado',
    className: 'border-destructive/40 text-destructive bg-destructive/10',
    dot:       'bg-destructive',
  },
}

export const TURNO_OPTIONS = [
  { value: 'almuerzo', label: 'Almuerzo' },
  { value: 'cena',     label: 'Cena' },
]

export const ESTADOS_FILTER = [
  { value: '',           label: 'Todos' },
  { value: 'pendiente',  label: 'Pendiente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'entregado',  label: 'Entregado' },
  { value: 'cancelado',  label: 'Cancelado' },
]

export const EDITABLE_ESTADOS = ['pendiente', 'confirmado']
export const CANCELABLE_ESTADOS = ['pendiente', 'confirmado']
