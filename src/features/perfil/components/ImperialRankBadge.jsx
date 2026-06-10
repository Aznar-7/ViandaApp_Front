import { Medal } from 'lucide-react'
import { cn } from '@/lib/utils'

const RANKS = [
  {
    min: 0, max: 4,
    nombre: 'Recruta',
    descripcion: 'Nuevo en las filas imperiales',
    color: 'text-slate-400 border-slate-400/30 bg-slate-400/10',
  },
  {
    min: 5, max: 14,
    nombre: 'Soldado Imperial',
    descripcion: 'Tropa de línea del Imperio',
    color: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  },
  {
    min: 15, max: 29,
    nombre: 'Sargento',
    descripcion: 'Veterano de múltiples misiones',
    color: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  },
  {
    min: 30, max: Infinity,
    nombre: 'Oficial Imperial',
    descripcion: 'Élite al servicio del Emperador',
    color: 'text-primary border-primary/30 bg-primary/10',
  },
]

export default function ImperialRankBadge({ totalPedidos = 0, className }) {
  const rank = RANKS.find((r) => totalPedidos >= r.min && totalPedidos <= r.max) ?? RANKS[0]

  return (
    <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium', rank.color, className)}>
      <Medal className="w-3.5 h-3.5 shrink-0" />
      <span className="font-orbitron tracking-wide">{rank.nombre}</span>
      <span className="text-[10px] opacity-70 hidden sm:inline">— {rank.descripcion}</span>
    </div>
  )
}
