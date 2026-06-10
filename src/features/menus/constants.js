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
  { value: '',            label: 'Todos',       activeClass: 'border-primary/40 bg-primary/10 text-primary' },
  { value: 'clasico',     label: 'Clásico',     activeClass: 'border-stone-400/40 bg-stone-400/10 text-stone-500' },
  { value: 'vegetariano', label: 'Vegetariano', activeClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500' },
  { value: 'vegano',      label: 'Vegano',      activeClass: 'border-teal-500/40 bg-teal-500/10 text-teal-500' },
  { value: 'sin_tacc',    label: 'Sin TACC',    activeClass: 'border-amber-500/40 bg-amber-500/10 text-amber-500' },
]
