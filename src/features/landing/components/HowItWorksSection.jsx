import { motion } from 'motion/react'
import { BookOpen, CheckCircle2, ShoppingBag } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: BookOpen,
    title: 'Mirá el menú del día',
    description:
      'Entrás a la app y ves qué hay disponible: tipo de comida, cupos restantes y precio. Todo antes de decidir.',
  },
  {
    number: '02',
    icon: CheckCircle2,
    title: 'Confirmá tu pedido',
    description:
      'Un tap y tu vianda queda reservada. Sin filas, sin llamadas. Recibís confirmación al instante.',
  },
  {
    number: '03',
    icon: ShoppingBag,
    title: 'Retirá en la cantina',
    description:
      'Llegás y ya está listo. Solo mostrás el estado de tu pedido y te vas. Sin esperar.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="relative bg-background px-6 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-16 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-orbitron text-xs tracking-[0.3em] uppercase text-primary">
            Cómo funciona
          </span>
          <h2 className="font-orbitron text-2xl font-bold text-foreground sm:text-3xl">
            En tres pasos
          </h2>
        </motion.div>

        <div className="relative flex flex-col gap-12 sm:flex-row sm:gap-0">
          {/* Connecting line — desktop */}
          <div
            className="pointer-events-none absolute top-6 left-0 right-0 hidden h-px sm:block"
            style={{
              background:
                'linear-gradient(to right, transparent 5%, rgba(225,29,72,0.25) 20%, rgba(225,29,72,0.25) 80%, transparent 95%)',
            }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative flex flex-1 flex-row gap-5 sm:flex-col sm:items-center sm:px-6 sm:text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Icon circle */}
              <div
                className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-card shadow-lg shadow-black/20"
                style={{ boxShadow: '0 0 20px rgba(225,29,72,0.12)' }}
              >
                <step.icon className="h-5 w-5 text-primary" />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-orbitron text-3xl font-black leading-none text-primary/15">
                  {step.number}
                </span>
                <h3 className="font-orbitron text-sm font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:max-w-[14rem]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
