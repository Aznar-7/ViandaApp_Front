import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(0.92 0.006 78) 3px, oklch(0.92 0.006 78) 4px)' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="font-orbitron font-black text-[clamp(5rem,18vw,10rem)] leading-none select-none text-primary/10 mb-2"
        >
          404
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-orbitron text-lg tracking-[0.25em] uppercase text-foreground mb-2"
        >
          Sector No Encontrado
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto"
        >
          Las coordenadas ingresadas no corresponden a ningún sector conocido del Imperio Galáctico.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/" className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}>
            <Home className="w-4 h-4" />
            <span className="font-orbitron text-[10px] tracking-widest uppercase">Base Imperial</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
