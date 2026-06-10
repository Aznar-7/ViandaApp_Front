import { PackageX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EmptyState({
  icon: Icon = PackageX,
  title = 'Sin resultados',
  description = 'No se encontraron registros en el sistema.',
  action,
  actionLabel = 'Volver',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="p-4 rounded-full bg-secondary border border-border">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-orbitron text-xs tracking-[0.3em] uppercase text-foreground">
          {title}
        </p>
        <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      </div>
      {action && (
        <Button variant="outline" size="sm" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
