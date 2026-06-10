import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import ImperialCrest from '@/shared/components/ImperialCrest'
import { cn } from '@/lib/utils'

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() < 0.2 ? 2 : 1,
  opacity: 0.15 + Math.random() * 0.55,
}))

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-24">
      {STARS.map((s) => (
        <span
          key={s.id}
          className="pointer-events-none absolute rounded-full bg-foreground"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(225,29,72,0.07) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 text-center"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="mb-2"
        >
          <ImperialCrest className="h-28 w-28 text-primary/40 sm:h-36 sm:w-36" />
        </motion.div>

        <motion.span
          className="font-orbitron rounded-sm border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-primary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          Sistema de provisiones imperiales
        </motion.span>

        <motion.h1
          className="font-orbitron text-4xl font-black tracking-wider text-foreground sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55 }}
        >
          Orden 66 Viandas
        </motion.h1>

        <motion.p
          className="max-w-lg text-center text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          El Imperio te alimenta. Tú, alimentas al Imperio.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <Link
            to="/login"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className={cn(buttonVariants({ size: 'lg' }))}
          >
            Únete al Imperio
          </Link>
        </motion.div>
      </motion.div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(11,13,16,0.85))',
        }}
      />
    </section>
  )
}
