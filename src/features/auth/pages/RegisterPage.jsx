import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import ImperialCrest from '@/shared/components/ImperialCrest'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
  const navigate                  = useNavigate()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)

  async function handleSubmit({ confirmPassword: _discard, ...data }) {
    setIsLoading(true)
    setError(null)
    try {
      const user = await registerUser(data)
      toast.success('Recluta registrado', { description: `Bienvenido al Imperio, ${user.nombre}` })
      navigate(user.rol === 'admin' ? '/admin' : '/pedidos', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message ?? 'No fue posible completar el registro.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left panel (lg+) ─────────────────────────── */}
      <div className="hidden lg:flex flex-col w-[420px] shrink-0 relative overflow-hidden bg-card border-r border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,oklch(0.44_0.195_18/0.12),transparent_65%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, oklch(0.92 0.006 78) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative flex flex-col items-center justify-center flex-1 p-10 gap-7">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: 45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <ImperialCrest className="w-28 h-28 text-primary drop-shadow-[0_0_18px_oklch(0.44_0.195_18/0.5)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="font-orbitron text-3xl font-black tracking-[0.12em] uppercase text-foreground">
              Orden 66
            </h1>
            <p className="font-orbitron text-xs tracking-[0.6em] uppercase text-accent mt-1.5">
              Viandas
            </p>
          </motion.div>

          <div className="w-12 h-px bg-border" />

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 text-center"
          >
            <p className="font-orbitron text-[9px] tracking-[0.35em] uppercase text-muted-foreground">
              Proceso de Reclutamiento
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
              Al registrarse acepta servir al Imperio Galáctico y respetar los protocolos de gestión de viandas.
            </p>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center border-l-2 border-primary/30 pl-4"
          >
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              "El miedo mantendrá a los sistemas locales en orden."
            </p>
            <footer className="mt-2 font-orbitron text-[9px] tracking-widest uppercase text-accent/60">
              — Gran Moff Tarkin
            </footer>
          </motion.blockquote>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
      </div>

      {/* ── Right panel — Form ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">

        {/* Mobile header */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 lg:hidden">
          <ImperialCrest className="w-9 h-9 text-primary" />
          <span className="font-orbitron text-xs tracking-[0.25em] uppercase text-foreground">Orden 66</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-[360px] mt-20 lg:mt-0"
        >
          <div className="mb-7">
            <p className="font-orbitron text-[9px] tracking-[0.5em] uppercase text-primary mb-2">
              Nuevo Recluta
            </p>
            <h2 className="font-orbitron text-xl font-bold tracking-wide text-foreground">
              Registro
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Complete el formulario para obtener acceso al sistema.
            </p>
          </div>

          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿Ya tiene credenciales?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Iniciar Sesión
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  )
}
