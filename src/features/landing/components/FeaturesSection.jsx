import { motion } from 'motion/react'

function MenuCardMockup() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-xl shadow-black/30">
      <div className="mb-4 flex items-start justify-between">
        <span className="font-orbitron rounded-sm border border-amber-400/25 bg-amber-400/15 px-2 py-0.5 text-[9px] tracking-widest uppercase text-amber-400">
          Clásico
        </span>
        <span className="text-xs text-muted-foreground">Hoy · 12hs</span>
      </div>
      <h4 className="mb-1 font-semibold text-foreground">Milanesa napolitana</h4>
      <p className="mb-5 text-sm text-muted-foreground">con papas fritas y ensalada verde</p>

      <div className="mb-4">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="text-muted-foreground">Cupos disponibles</span>
          <span className="font-medium text-amber-400">18 / 30</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-amber-400/70" style={{ width: '60%' }} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="font-bold text-foreground">$1.500</span>
        <div className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white">
          Pedir vianda
        </div>
      </div>
    </div>
  )
}

function StatusMockup() {
  const statuses = [
    { label: 'Pendiente',  time: '10:32', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/25', dot: 'bg-amber-400', pulse: true  },
    { label: 'Confirmado', time: '10:45', color: 'text-sky-400',   bg: 'bg-sky-400/10',   border: 'border-sky-400/25',   dot: 'bg-sky-400',   pulse: false },
    { label: 'Entregado',  time: '12:15', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/25', dot: 'bg-green-400', pulse: false },
  ]
  return (
    <div className="w-full max-w-sm flex flex-col gap-2.5">
      {statuses.map((s) => (
        <div key={s.label} className={`flex items-center gap-3 rounded-lg border ${s.border} ${s.bg} px-4 py-3`}>
          <span className="relative flex h-2 w-2 shrink-0">
            <span className={`rounded-full h-2 w-2 ${s.dot}`} />
            {s.pulse && <span className={`absolute inset-0 rounded-full animate-ping opacity-50 ${s.dot}`} />}
          </span>
          <span className={`font-orbitron text-[10px] tracking-widest uppercase font-medium ${s.color}`}>
            {s.label}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">{s.time}</span>
        </div>
      ))}

      <div className="mt-1 flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/30 to-primary/10 font-orbitron text-xs font-bold text-primary">
          FA
        </div>
        <div>
          <p className="text-xs font-medium text-foreground">Milanesa napolitana</p>
          <p className="text-[10px] text-muted-foreground">Retiro: cantina central</p>
        </div>
      </div>
    </div>
  )
}

function RankMockup() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/30">
      <div className="px-5 pt-5 pb-4">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/40 to-primary/10 font-orbitron text-sm font-bold text-primary">
            FA
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Facundo A.</p>
            <p className="text-xs text-muted-foreground">Universitario · Desde ene 2026</p>
          </div>
          <span className="font-orbitron rounded-sm border border-primary/25 bg-primary/10 px-2 py-1 text-[8px] tracking-widest uppercase text-primary">
            Oficial
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[{ label: 'Pedidos totales', value: '32' }, { label: 'Este mes', value: '8' }].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-background/40 px-3 py-2.5">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="font-orbitron text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-background/20 px-5 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Próximo rango</span>
          <span className="font-medium text-foreground">Sargento · 15 pedidos más</span>
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  {
    eyebrow: 'Menú diario',
    title: 'Sabés qué hay hoy antes de llegar',
    description:
      'El menú universitario actualizado cada día. Cupos en tiempo real, precio visible y tipo de comida. Llegás sabiendo qué elegiste.',
    visual: <MenuCardMockup />,
  },
  {
    eyebrow: 'Seguimiento',
    title: 'De reservado a listo en tiempo real',
    description:
      'Tu pedido avanza sin que tengas que llamar a nadie. Pendiente, confirmado, entregado — seguís cada paso desde la app.',
    visual: <StatusMockup />,
    reverse: true,
  },
  {
    eyebrow: 'Historial y rango',
    title: 'Cada vianda suma a tu historial',
    description:
      'Tus pedidos quedan registrados. Subís de rango en el Imperio y podés revisar todo tu historial cuando quieras.',
    visual: <RankMockup />,
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function FeaturesSection() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl flex flex-col gap-28">
        {FEATURES.map((feat) => (
          <motion.div
            key={feat.eyebrow}
            className={`flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20 ${feat.reverse ? 'lg:flex-row-reverse' : ''}`}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {/* Copy */}
            <div className="flex flex-col gap-5 lg:flex-1">
              <span className="font-orbitron text-xs tracking-[0.3em] uppercase text-primary">
                {feat.eyebrow}
              </span>
              <h2 className="font-orbitron text-2xl font-bold leading-snug text-foreground sm:text-3xl">
                {feat.title}
              </h2>
              <p className="max-w-md leading-relaxed text-muted-foreground">
                {feat.description}
              </p>
            </div>

            {/* Visual mockup */}
            <div className={`flex lg:flex-1 ${feat.reverse ? 'lg:justify-start' : 'lg:justify-end'}`}>
              {feat.visual}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
