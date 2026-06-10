import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    title: 'Explorá el menú',
    description: 'Revisá las raciones disponibles para cada día y turno.',
  },
  {
    number: '02',
    title: 'Hacé tu pedido',
    description:
      'Elegí tu menú, cantidad y punto de retiro. Todo en menos de un minuto.',
  },
  {
    number: '03',
    title: 'Retirá tu ración',
    description: 'Llegá a la cantina. Tu pedido ya está listo y esperándote.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-secondary/30 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-16 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-orbitron text-xs tracking-[0.3em] uppercase text-primary">
            Protocolo
          </span>
          <h2 className="font-orbitron text-2xl font-bold text-foreground sm:text-3xl">
            El protocolo imperial
          </h2>
        </motion.div>

        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex flex-1 flex-row sm:flex-col">
              <motion.div
                className="flex flex-1 flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-orbitron text-5xl font-black leading-none text-primary/20">
                  {step.number}
                </span>
                <div className="flex flex-col gap-1.5 sm:pr-6">
                  <h3 className="font-orbitron text-sm font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div className="hidden items-center justify-end pt-5 sm:flex" style={{ width: '2.5rem' }}>
                  <ArrowRight className="h-4 w-4 shrink-0 text-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
