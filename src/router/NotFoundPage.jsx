import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ImperialCrest from '@/shared/components/ImperialCrest'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">

      {/* ImperialCrest watermark de fondo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0.03 }}
      >
        <ImperialCrest className="w-[70vmin] h-[70vmin] text-foreground" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{ x: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="font-orbitron font-black leading-none select-none mb-4"
          style={{
            fontSize: 'clamp(5rem,18vw,9rem)',
            color: 'rgba(225,29,72,0.10)',
          }}
        >
          404
        </motion.div>

        <p className="font-orbitron text-lg tracking-[0.2em] uppercase text-foreground mb-2">
          Esta no es la ruta que buscás.
        </p>

        <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: '#94A3B8' }}>
          El sector que intentaste alcanzar no figura en los archivos del Imperio.
        </p>

        <Link to="/" className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}>
          <Home className="w-4 h-4" />
          <span className="font-orbitron text-[10px] tracking-widest uppercase">Panel Central</span>
        </Link>
      </motion.div>
    </div>
  )
}
