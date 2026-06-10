import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorMessage({
  message = 'Ocurrió un error inesperado en el sistema.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <AlertTriangle className="w-10 h-10 text-destructive" />
      <p className="font-orbitron text-xs tracking-widest uppercase text-destructive">
        Error del sistema
      </p>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
