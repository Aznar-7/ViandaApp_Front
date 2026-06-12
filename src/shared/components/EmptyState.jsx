import { motion } from 'motion/react'
import { PackageX, UtensilsCrossed, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const VARIANTS = {
  pedidos: {
    icon: PackageX,
    title: 'Sin provisiones registradas',
    description: 'El Imperio aún no tiene registro de tus pedidos. Hacé tu primera solicitud.',
  },
  menus: {
    icon: UtensilsCrossed,
    title: 'Sin raciones disponibles',
    description: 'Las cocinas imperiales aún no publicaron el menú para esta fecha.',
  },
  error: {
    icon: AlertTriangle,
    title: 'Fallo en transmisión',
    description: 'No se pudo contactar al servidor imperial. Intentá de nuevo.',
  },
}

/**
 * @param {{ variant?: 'pedidos'|'menus'|'error', icon?: React.ComponentType, title?: string, description?: string, action?: () => void, actionLabel?: string, className?: string }} props
 */
export default function EmptyState({
  variant,
  icon: IconProp,
  title: titleProp,
  description: descriptionProp,
  action,
  actionLabel = 'Reintentar',
  className,
}) {
  const preset = variant ? VARIANTS[variant] : null
  const Icon = IconProp ?? preset?.icon ?? PackageX
  const title = titleProp ?? preset?.title ?? 'Sin resultados'
  const description = descriptionProp ?? preset?.description ?? 'No se encontraron registros.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex flex-col items-center justify-center py-16 px-5 gap-5 text-center', className)}
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
          type="button"
          onClick={action}
          className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  )
}
