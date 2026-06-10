import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <div className="font-orbitron font-black text-[clamp(5rem,18vw,9rem)] leading-none select-none text-primary/10 mb-4">
          404
        </div>
        <p className="font-orbitron text-lg tracking-[0.2em] uppercase text-[#F8FAFC] mb-2">
          Ruta no encontrada
        </p>
        <p className="text-sm text-[#94A3B8] mb-8 max-w-xs mx-auto">
          La sección que buscás no existe. Revisá la URL o volvé al inicio.
        </p>
        <Link to="/" className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}>
          <Home className="w-4 h-4" />
          <span className="font-orbitron text-[10px] tracking-widest uppercase">Panel Central</span>
        </Link>
      </motion.div>
    </div>
  )
}
