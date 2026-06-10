import { motion } from 'motion/react'
import { UtensilsCrossed } from 'lucide-react'

export default function MenusPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-3 text-center"
    >
      <UtensilsCrossed className="w-10 h-10 text-muted-foreground/30" />
      <p className="font-orbitron text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
        Módulo de Menús — Fase 3
      </p>
    </motion.div>
  )
}
