import { cn } from '@/lib/utils'

const CONFIG = {
  pendiente:  { label: 'Pendiente',  dot: 'bg-[#FACC15]', text: 'text-[#FACC15]', bg: 'bg-[#FACC15]/10', border: 'border-[#FACC15]/25' },
  confirmado: { label: 'Confirmado', dot: 'bg-[#38BDF8]', text: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10', border: 'border-[#38BDF8]/25' },
  entregado:  { label: 'Entregado',  dot: 'bg-[#22C55E]', text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/25' },
  cancelado:  { label: 'Cancelado',  dot: 'bg-[#EF4444]', text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/25' },
}

export default function StatusBadge({ estado, className }) {
  const cfg = CONFIG[estado] ?? CONFIG.pendiente
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border',
      'font-orbitron text-[9px] tracking-widest uppercase whitespace-nowrap',
      cfg.bg, cfg.border, cfg.text,
      className
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
      {cfg.label}
    </span>
  )
}

export { CONFIG as ESTADO_VISUAL }
