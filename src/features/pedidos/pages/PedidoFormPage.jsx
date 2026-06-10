import { useState } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { usePedidoDetail } from '../hooks/usePedidoDetail'
import pedidoService from '../services/pedidoService'
import PedidoForm from '../components/PedidoForm'
import Spinner from '@/shared/components/Spinner'
import ErrorMessage from '@/shared/components/ErrorMessage'
import CommandHeader from '@/shared/components/CommandHeader'

export default function PedidoFormPage() {
  const { id }          = useParams()
  const [searchParams]  = useSearchParams()
  const navigate        = useNavigate()
  const isEdit          = Boolean(id)

  const { pedido, isLoading, error } = usePedidoDetail(isEdit ? id : null)
  const [submitting, setSubmitting]  = useState(false)
  const [submitError, setSubmitError]= useState(null)

  // Pre-select menu from query param when creating
  const preselectedMenuId = searchParams.get('menuId')

  async function handleSubmit(data) {
    setSubmitting(true)
    setSubmitError(null)
    try {
      if (isEdit) {
        const { cantidad, turnoEntrega, puntoRetiro, observaciones } = data
        await pedidoService.updatePedido(id, { cantidad, turnoEntrega, puntoRetiro, observaciones })
        toast.success('Pedido actualizado')
        navigate(`/pedidos/${id}`, { replace: true })
      } else {
        const created = await pedidoService.createPedido(data)
        toast.success('Pedido creado', { description: `#${created.id} — ${created.menuNombre}` })
        navigate(`/pedidos/${created.id}`, { replace: true })
      }
    } catch (err) {
      setSubmitError(err.response?.data?.error ?? 'No se pudo procesar el pedido')
    } finally {
      setSubmitting(false)
    }
  }

  const defaultValues = isEdit && pedido
    ? {
        menuId:        pedido.menuId,
        fecha:         pedido.fecha,
        cantidad:      pedido.cantidad,
        turnoEntrega:  pedido.turnoEntrega,
        puntoRetiro:   pedido.puntoRetiro,
        observaciones: pedido.observaciones ?? '',
      }
    : preselectedMenuId
    ? { menuId: Number(preselectedMenuId) }
    : undefined

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="order-form-consumer">

      <CommandHeader
        eyebrow={isEdit ? 'Modificar orden' : 'Nueva orden'}
        title={isEdit ? 'Editar Pedido' : 'Solicitar Vianda'}
        code={isEdit ? `ORD / ${id}` : 'ORD / NEW'}
        description={isEdit ? 'Actualizá los datos permitidos antes de confirmar los cambios.' : 'Configurá la ración, entrega y cantidad de la nueva solicitud.'}
        back={(
          <Link
          to={isEdit ? `/pedidos/${id}` : '/pedidos'}
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5 -ml-2 mb-3 font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground')}
          >
            <ArrowLeft className="w-3.5 h-3.5" />{isEdit ? 'Detalle' : 'Mis pedidos'}
          </Link>
        )}
      />

      {isEdit && isLoading && <Spinner />}
      {isEdit && !isLoading && error && <ErrorMessage message={error} />}

      {(!isEdit || (!isLoading && !error && pedido)) && (
        <div className="max-w-3xl">
          <PedidoForm
            isEdit={isEdit}
            pedidoInfo={isEdit && pedido ? { menuNombre: pedido.menuNombre, fecha: pedido.fecha } : undefined}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isLoading={submitting}
            error={submitError}
          />
        </div>
      )}
    </motion.div>
  )
}
