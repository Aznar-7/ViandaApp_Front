import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import ImperialCrest from '@/shared/components/ImperialCrest'
import { cn } from '@/lib/utils'

const STARS = Array.from({ length: 120 }, () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() < 0.12 ? 2.5 : Math.random() < 0.35 ? 1.5 : 1,
  opacity: 0.12 + Math.random() * 0.6,
  twinkle: Math.random() < 0.28,
  delay: Math.random() * 5,
  duration: 2 + Math.random() * 3,
}))

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-24">

      {/* Beat 1 — Star field */}
      {STARS.map((s, i) =>
        s.twinkle ? (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full bg-white"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
            animate={{ opacity: [s.opacity * 0.12, s.opacity, s.opacity * 0.12] }}
            transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <span
            key={i}
            className="pointer-events-none absolute rounded-full bg-white"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.opacity }}
          />
        )
      )}

      {/* Atmospheric red glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 55%, rgba(225,29,72,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Beat 2 — Star Wars title card */}
      <motion.p
        className="pointer-events-none absolute top-1/2 left-1/2 z-20 max-w-[85vw] -translate-x-1/2 -translate-y-1/2 text-center font-serif text-xl italic sm:text-2xl"
        aria-hidden
        style={{
          color: '#4BC5F5',
          textShadow: '0 0 40px rgba(75, 197, 245, 0.45), 0 0 80px rgba(75, 197, 245, 0.15)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.6, delay: 0.3, times: [0, 0.15, 0.75, 1], ease: 'easeInOut' }}
      >
        In a university not so far away....
      </motion.p>

      {/* Beats 3–5 — Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">

        {/* Beat 3 — Imperial Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 3.1, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ filter: 'drop-shadow(0 0 32px rgba(225,29,72,0.45)) drop-shadow(0 0 10px rgba(255,255,255,0.06))' }}>
            <ImperialCrest className="h-24 w-24 text-white/70 sm:h-32 sm:w-32" />
          </div>
        </motion.div>

        {/* Beat 4 — Title */}
        <motion.h1
          className="font-orbitron text-5xl font-black leading-none tracking-wider text-white sm:text-6xl lg:text-7xl xl:text-8xl"
          initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 4.3, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{ textShadow: '0 0 80px rgba(225,29,72,0.55), 0 0 30px rgba(225,29,72,0.3)' }}
        >
          ORDEN 66
          <br />
          <span className="text-primary">VIANDAS</span>
        </motion.h1>

        {/* Beat 5a — Catchphrase */}
        <motion.p
          className="text-base text-muted-foreground sm:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.15, duration: 0.55, ease: 'easeOut' }}
        >
          El Imperio te alimenta. Tú, alimentas al Imperio.
        </motion.p>

        {/* Beat 5b — Practical description */}
        <motion.p
          className="text-sm text-muted-foreground/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.35, duration: 0.5, ease: 'easeOut' }}
        >
          Reservá tu vianda universitaria antes de que se agoten los cupos.
        </motion.p>

        {/* Beat 5c — Buttons */}
        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.6, duration: 0.55, ease: 'easeOut' }}
        >
          <Link to="/register" className={cn(buttonVariants({ size: 'lg' }), 'px-8')}>
            Crear mi cuenta
          </Link>
          <Link to="/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            Iniciar sesión
          </Link>
        </motion.div>

        {/* Beat 5d — Trust signals */}
        <motion.div
          className="flex items-center gap-5 text-xs text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6.0, duration: 0.5, ease: 'easeOut' }}
        >
          <span>✓ Sin filas</span>
          <span className="h-3 w-px bg-border" />
          <span>✓ Cupos en tiempo real</span>
          <span className="h-3 w-px bg-border" />
          <span>✓ Gratuito</span>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(11,13,16,0.9))' }}
      />
    </section>
  )
}
