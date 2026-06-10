import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import ImperialCrest from '@/shared/components/ImperialCrest'
import { cn } from '@/lib/utils'

export default function LandingCTA() {
  return (
    <section className="relative overflow-hidden px-6 py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(225,29,72,0.05), transparent 60%), linear-gradient(to top, rgba(11,13,16,0.6), transparent)',
        }}
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <ImperialCrest className="h-[36rem] w-[36rem] text-primary" />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-orbitron text-sm italic tracking-wider text-muted-foreground">
          "El Imperio tiene hambre de eficiencia."
        </p>

        <div
          className="h-px w-16 bg-primary/40"
          style={{ boxShadow: '0 0 12px rgba(225,29,72,0.4)' }}
        />

        <h2 className="font-orbitron text-2xl font-bold text-foreground sm:text-3xl">
          Unite a la causa imperial
        </h2>

        <p className="max-w-md text-muted-foreground">
          Registrate gratis y empezá a gestionar tus viandas con disciplina imperial.
        </p>

        <Link
          to="/register"
          className={cn(buttonVariants({ size: 'lg' }), 'mt-2')}
        >
          Unirme al Imperio
        </Link>

        <p className="text-xs text-muted-foreground/60">
          Ya tenés cuenta?{' '}
          <Link
            to="/login"
            className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline transition-colors"
          >
            Iniciá sesión
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
