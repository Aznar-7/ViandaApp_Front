import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const STATS = [
  { value: '30+', label: 'cupos por día' },
  { value: '4',   label: 'tipos de menú' },
  { value: '< 60s', label: 'para reservar' },
]

export default function LandingCTA() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(225,29,72,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center gap-12">

        {/* Stats */}
        <motion.div
          className="w-full grid grid-cols-3 gap-px rounded-xl border border-border bg-border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 bg-card px-4 py-6 text-center">
              <span className="font-orbitron text-2xl font-black text-primary sm:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA block */}
        <motion.div
          className="flex flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {/* Scarcity indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-60" />
              <span className="rounded-full h-1.5 w-1.5 bg-amber-400" />
            </span>
            Los cupos se agotan todos los días
          </div>

          <h2 className="font-orbitron text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
            Reservá el tuyo antes de llegar
          </h2>

          <p className="max-w-md text-muted-foreground">
            Creá tu cuenta gratis, mirá el menú de hoy y asegurá tu vianda. Sin filas, sin sorpresas.
          </p>

          <Link
            to="/register"
            className={cn(buttonVariants({ size: 'lg' }), 'mt-2 px-10')}
          >
            Crear mi cuenta gratis
          </Link>

          <p className="text-xs text-muted-foreground/60">
            ¿Ya tenés cuenta?{' '}
            <Link
              to="/login"
              className="text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
