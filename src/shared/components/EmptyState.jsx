import { motion } from 'motion/react'
import { PackageX } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function EmptyState({
  icon: Icon = PackageX,
  title = 'Sin resultados',
  description = 'No se encontraron registros.',
  action,
  actionLabel = 'Limpiar filtros',
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('empty-state flex flex-col items-center justify-center py-16 px-5 gap-5 text-center', className)}
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center">
          <Icon className="w-7 h-7 text-muted-foreground" />
        </div>
        <div className="absolute -inset-3 rounded-full border border-dashed border-border" />
      </div>

      <div className="space-y-1.5">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      </div>

      {action && (
        <button
          onClick={action}
          className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  )
}
