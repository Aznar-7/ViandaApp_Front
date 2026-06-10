export const TIPO_CONFIG = {
  clasico: {
    label:  'Clásico',
    accent: 'bg-border',
    badge:  'border-border/60 text-muted-foreground',
  },
  vegetariano: {
    label:  'Vegetariano',
    accent: 'bg-emerald-500/60',
    badge:  'border-emerald-500/40 text-emerald-400',
  },
  vegano: {
    label:  'Vegano',
    accent: 'bg-teal-500/60',
    badge:  'border-teal-500/40 text-teal-400',
  },
  sin_tacc: {
    label:  'Sin TACC',
    accent: 'bg-amber-500/60',
    badge:  'border-amber-500/40 text-amber-400',
  },
}

export const TIPOS_FILTER = [
  { value: '',            label: 'Todos' },
  { value: 'clasico',     label: 'Clásico' },
  { value: 'vegetariano', label: 'Vegetariano' },
  { value: 'vegano',      label: 'Vegano' },
  { value: 'sin_tacc',    label: 'Sin TACC' },
]
