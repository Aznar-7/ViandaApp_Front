import { motion } from 'motion/react'
import { UtensilsCrossed, Zap, ShieldCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: UtensilsCrossed,
    iconClass: 'text-primary',
    title: 'Raciones imperiales',
    description:
      'Menús diarios diseñados para la élite. Clásico, vegetariano, vegano y certificado sin TACC.',
  },
  {
    icon: Zap,
    iconClass: 'text-amber-400',
    title: 'Eficiencia galáctica',
    description:
      'Pedí tu ración en segundos. Sin filas, sin demoras. El Imperio no espera.',
  },
  {
    icon: ShieldCheck,
    iconClass: 'text-sky-400',
    title: 'Control total',
    description:
      'Seguí tu pedido en tiempo real. Sabés exactamente cuándo retirar tu ración.',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function FeaturesSection() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-12 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-orbitron text-xs tracking-[0.3em] uppercase text-primary">
            Por qué el Imperio elige Orden 66
          </span>
          <h2 className="font-orbitron text-2xl font-bold text-foreground sm:text-3xl">
            Las tres leyes del aprovisionamiento
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
            >
              <feat.icon className={`h-8 w-8 ${feat.iconClass}`} />
              <div className="flex flex-col gap-1.5">
                <h3 className="font-orbitron text-sm font-bold text-foreground">
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
