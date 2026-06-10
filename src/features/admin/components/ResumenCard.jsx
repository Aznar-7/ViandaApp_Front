import { cn } from '@/lib/utils'

const VARIANTS = {
  default: {
    border:  'border-border',
    label:   'text-muted-foreground',
    value:   'text-foreground',
    sub:     'text-muted-foreground',
    bar:     'bg-[#B8AE9E]',
  },
  primary: {
    border:  'border-[#E11D48]/30',
    bg:      'bg-[#E11D48]/5',
    label:   'text-muted-foreground',
    value:   'text-[#E11D48]',
    sub:     'text-[#E11D48]/50',
    bar:     'bg-[#E11D48]',
  },
  warning: {
    border:  'border-[#FACC15]/25',
    label:   'text-muted-foreground',
    value:   'text-[#A16207]',
    sub:     'text-muted-foreground',
    bar:     'bg-[#D6A72A]',
  },
  info: {
    border:  'border-[#38BDF8]/25',
    label:   'text-muted-foreground',
    value:   'text-[#0369A1]',
    sub:     'text-muted-foreground',
    bar:     'bg-[#38BDF8]',
  },
  success: {
    border:  'border-[#22C55E]/25',
    label:   'text-muted-foreground',
    value:   'text-[#15803D]',
    sub:     'text-muted-foreground',
    bar:     'bg-[#22C55E]',
  },
}

export default function ResumenCard({ label, value, sub, icon: Icon, variant = 'default', className }) {
  const v = VARIANTS[variant] ?? VARIANTS.default
  return (
    <div className={cn(
      'admin-summary-card relative bg-card border p-5 overflow-hidden',
      v.border, v.bg,
      className
    )}>
      {/* Accent bar top */}
      <div className={cn('absolute top-0 left-0 right-0 h-[2px]', v.bar)} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <p className={cn('font-orbitron text-[9px] tracking-[0.3em] uppercase', v.label)}>
          {label}
        </p>
        {Icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', v.bg ?? 'bg-secondary', 'border', v.border)}>
            <Icon className={cn('w-3.5 h-3.5', v.value)} />
          </div>
        )}
      </div>

      <p className={cn('font-orbitron text-2xl font-bold leading-none mb-1', v.value)}>
        {value}
      </p>

      {sub && (
        <p className={cn('text-xs mt-1', v.sub)}>{sub}</p>
      )}
    </div>
  )
}
