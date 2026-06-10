import { motion } from 'motion/react'

export default function Spinner({ fullscreen = false }) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="relative w-11 h-11"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-border border-t-primary" />
        <motion.div
          className="absolute inset-2 rounded-full border border-border border-b-accent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-[18px] rounded-full bg-primary" />
      </motion.div>
      <span className="font-orbitron text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
        Cargando...
      </span>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {content}
    </div>
  )
}
