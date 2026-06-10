import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorMessage({
  message = 'Ocurrió un error inesperado en el sistema.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-card px-5 py-14 text-center shadow-[0_18px_48px_-42px_rgba(57,48,35,0.75)]">
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
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
