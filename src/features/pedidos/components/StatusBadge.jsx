import { Hourglass, ShieldCheck, PackageCheck, Ban } from 'lucide-react'
import { cn } from '@/lib/utils'

const CONFIG = {
  pendiente:  {
    label: 'Pendiente',
    icon: Hourglass,
    dot: 'bg-[#FACC15]', text: 'text-[#FACC15]', bg: 'bg-[#FACC15]/10', border: 'border-[#FACC15]/25',
    leftBorder: 'border-l-[#FACC15]',
    pulse: true,
  },
  confirmado: {
    label: 'Confirmado',
    icon: ShieldCheck,
    dot: 'bg-[#38BDF8]', text: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10', border: 'border-[#38BDF8]/25',
    leftBorder: 'border-l-[#38BDF8]',
    pulse: false,
  },
  entregado:  {
    label: 'Entregado',
    icon: PackageCheck,
    dot: 'bg-[#22C55E]', text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]/25',
    leftBorder: 'border-l-[#22C55E]',
    pulse: false,
  },
  cancelado:  {
    label: 'Anulado',
    icon: Ban,
    dot: 'bg-[#EF4444]', text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/25',
    leftBorder: 'border-l-[#EF4444]',
    pulse: false,
  },
}

export default function StatusBadge({ estado, className }) {
  const cfg = CONFIG[estado] ?? CONFIG.pendiente
  const Icon = cfg.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border',
      'font-orbitron text-[9px] tracking-widest uppercase whitespace-nowrap',
      cfg.bg, cfg.border, cfg.text,
      className
    )}>
      <span className="relative flex items-center shrink-0">
        <Icon className="w-3 h-3" />
        {cfg.pulse && (
          <span className={cn('absolute -inset-0.5 rounded-full opacity-40 animate-ping', cfg.dot)} />
        )}
      </span>
      {cfg.label}
    </span>
  )
}

export { CONFIG as ESTADO_VISUAL }
