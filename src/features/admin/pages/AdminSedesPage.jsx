import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Building2, MapPin, Pencil, Plus, Power, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import CommandHeader from '@/shared/components/CommandHeader'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import EmptyState from '@/shared/components/EmptyState'
import ErrorMessage from '@/shared/components/ErrorMessage'
import { CardSkeleton } from '@/shared/components/Skeleton'
import { parseApiError } from '@/lib/parseApiError'
import sedeService from '@/features/sedes/services/sedeService'

export default function AdminSedesPage() {
  const [sedes, setSedes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [toggling, setToggling] = useState(null)

  const loadSedes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await sedeService.getSedes()
      setSedes(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(parseApiError(loadError, 'No se pudieron cargar las sedes'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadSedes() }, [loadSedes])

  async function toggleSede() {
    const nextActive = !isActive(toggling)
    try {
      await (nextActive ? sedeService.activar(toggling.id) : sedeService.desactivar(toggling.id))
      toast.success(nextActive ? 'Sede activada' : 'Sede desactivada')
      setToggling(null)
      loadSedes()
    } catch (toggleError) {
      toast.error(parseApiError(toggleError, 'No se pudo cambiar el estado de la sede'))
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <CommandHeader
        eyebrow="Administración logística"
        title="Gestión de sedes"
        code="ADM / SED"
        description={`${sedes.filter(isActive).length} sede${sedes.filter(isActive).length !== 1 ? 's' : ''} activa${sedes.filter(isActive).length !== 1 ? 's' : ''} de ${sedes.length}.`}
        action={<Button size="sm" onClick={() => setEditing({})}><Plus />Nueva sede</Button>}
      />

      <div className="mb-5 flex justify-end">
        <Button variant="outline" size="sm" onClick={loadSedes} disabled={isLoading}><RefreshCw className={isLoading ? 'animate-spin' : ''} />Actualizar</Button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadSedes} />}
      {!error && isLoading && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <CardSkeleton key={index} />)}</div>}
      {!error && !isLoading && sedes.length === 0 && <EmptyState icon={Building2} title="Sin sedes registradas" description="Creá el primer punto de entrega." action={() => setEditing({})} actionLabel="Nueva sede" />}
      {!error && !isLoading && sedes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sedes.map((sede) => (
            <article key={sede.id} className={`rounded-2xl border bg-card p-5 shadow-[0_16px_44px_-38px_rgba(57,48,35,0.7)] ${isActive(sede) ? 'border-border' : 'border-border opacity-65'}`}>
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 /></span>
                <Status active={isActive(sede)} />
              </div>
              <h2 className="mt-5 text-base font-semibold text-foreground">{sede.nombre}</h2>
              <p className="mt-2 flex min-h-10 items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" />{sede.direccion || 'Dirección no informada'}</p>
              <div className="mt-5 flex gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditing(sede)}><Pencil />Editar</Button>
                <Button variant={isActive(sede) ? 'destructive' : 'secondary'} size="sm" className="flex-1" onClick={() => setToggling(sede)}><Power />{isActive(sede) ? 'Desactivar' : 'Activar'}</Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <SedeDialog sede={editing} onClose={() => setEditing(null)} onSaved={loadSedes} />
      <ConfirmDialog
        open={!!toggling}
        onOpenChange={(open) => { if (!open) setToggling(null) }}
        title={`${isActive(toggling) ? 'Desactivar' : 'Activar'} sede`}
        description={isActive(toggling) ? 'La sede dejará de estar disponible para nuevas operaciones, pero conservará su historial.' : 'La sede volverá a estar disponible.'}
        confirmLabel={isActive(toggling) ? 'Desactivar' : 'Activar'}
        variant={isActive(toggling) ? 'destructive' : 'default'}
        onConfirm={toggleSede}
      />
    </motion.div>
  )
}

function SedeDialog({ sede, onClose, onSaved }) {
  const [form, setForm] = useState({ nombre: '', direccion: '' })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm({ nombre: sede?.nombre ?? '', direccion: sede?.direccion ?? '' })
    setError(null)
  }, [sede])

  async function submit(event) {
    event.preventDefault()
    if (form.nombre.trim().length < 2) return setError('Ingresá un nombre válido')
    setSaving(true)
    setError(null)
    try {
      if (sede?.id) await sedeService.updateSede(sede.id, form)
      else await sedeService.createSede(form)
      toast.success(sede?.id ? 'Sede actualizada' : 'Sede creada')
      onClose()
      onSaved()
    } catch (saveError) {
      setError(parseApiError(saveError, 'No se pudo guardar la sede'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={!!sede} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit}>
          <DialogHeader><DialogTitle>{sede?.id ? 'Editar sede' : 'Nueva sede'}</DialogTitle></DialogHeader>
          <div className="my-5 space-y-4">
            <Field label="Nombre"><Input value={form.nombre} onChange={(e) => setForm((current) => ({ ...current, nombre: e.target.value }))} /></Field>
            <Field label="Dirección"><Input value={form.direccion} onChange={(e) => setForm((current) => ({ ...current, direccion: e.target.value }))} /></Field>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="m-0 -mx-4 -mb-4"><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar sede'}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, children }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>
}

function Status({ active }) {
  return <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${active ? 'bg-emerald-100 text-emerald-800' : 'bg-secondary text-muted-foreground'}`}>{active ? 'Activa' : 'Inactiva'}</span>
}

function isActive(item) {
  return item?.activo === undefined || item?.activo === true || item?.activo === 1 || item?.activo === '1'
}
