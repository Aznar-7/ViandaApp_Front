import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import LoginForm from '../components/LoginForm'
import ImperialCrest from '@/shared/components/ImperialCrest'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(data) {
    setIsLoading(true)
    setError(null)
    try {
      const user = await login(data)
      toast.success('Acceso concedido', { description: `Bienvenido, ${user.nombre}` })
      navigate(user.rol === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error ?? 'Credenciales inválidas.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden" style={{ backgroundColor: '#0B0D10' }}>

      {/* ── PANEL IZQUIERDO (header en mobile, columna en desktop) ── */}
      <div
        className="relative flex flex-col items-center justify-center lg:w-[40%] shrink-0
                   py-10 px-8 lg:py-0
                   border-b lg:border-b-0 lg:border-r"
        style={{ borderColor: '#2F3645' }}
      >
        {/* Fondo con trama de puntos */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #1F2430 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.5,
          }}
        />

        {/* Luz ambiental roja esquina superior */}
        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #E11D4820 0%, transparent 70%)',
            filter: 'blur(60px)',
            transform: 'translate(-30%, -30%)',
          }}
        />

        {/* ImperialCrest grande con rotación lenta — oculto en mobile */}
        <div className="relative hidden lg:flex items-center justify-center mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="text-foreground/40"
            style={{ width: 200, height: 200 }}
          >
            <ImperialCrest className="w-full h-full" />
          </motion.div>

          {/* Anillo exterior decorativo */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: '1px solid rgba(225,29,72,0.12)',
              transform: 'scale(1.15)',
            }}
          />
        </div>

        {/* Logo compacto en mobile */}
        <div className="lg:hidden mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="text-foreground/40"
            style={{ width: 64, height: 64 }}
          >
            <ImperialCrest className="w-full h-full" />
          </motion.div>
        </div>

        {/* Textos del panel izquierdo */}
        <div className="relative z-10 text-center lg:text-left max-w-[260px]">
          <p
            className="font-orbitron text-[9px] tracking-[0.25em] uppercase mb-3"
            style={{ color: 'rgba(225,29,72,0.7)' }}
          >
            SISTEMA DE GESTIÓN DE RACIONES
          </p>

          <p
            className="font-orbitron text-sm tracking-[0.3em] uppercase mb-6"
            style={{ color: 'rgba(248,250,252,0.8)' }}
          >
            ORDEN 66 VIANDAS
          </p>

          <div
            className="hidden lg:block h-px mb-6"
            style={{ background: 'linear-gradient(90deg, #2F3645, transparent)' }}
          />

          <p
            className="font-orbitron text-xs tracking-wider italic leading-relaxed"
            style={{ color: 'rgba(148,163,184,0.6)' }}
          >
            "El Imperio recuerda a sus leales servidores."
          </p>
        </div>
      </div>

      {/* ── PANEL DERECHO ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center flex-1 px-6 py-12 lg:py-0"
        style={{ backgroundColor: '#0f1117' }}
      >
        {/* Luz ambiental sutil */}
        <div
          className="absolute pointer-events-none hidden lg:block"
          style={{
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(225,29,72,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
            right: '-10%',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />

        <div className="relative z-10 w-full max-w-[400px]">
          {/* Encabezado del formulario */}
          <div className="mb-8">
            <div
              className="inline-block font-orbitron text-[9px] tracking-[0.35em] uppercase mb-3 px-2 py-1 rounded"
              style={{
                color: 'rgba(225,29,72,0.8)',
                border: '1px solid rgba(225,29,72,0.2)',
                background: 'rgba(225,29,72,0.05)',
              }}
            >
              Identificación Imperial
            </div>

            <h1
              className="font-orbitron text-xl tracking-wider mb-2"
              style={{ color: '#F8FAFC' }}
            >
              Identificación<br />Imperial
            </h1>

            <p className="text-sm" style={{ color: '#94A3B8' }}>
              Ingrese sus credenciales para acceder al sistema imperial.
            </p>
          </div>

          {/* Línea separadora */}
          <div
            className="mb-6 h-px"
            style={{ background: 'linear-gradient(90deg, #2F3645, transparent)' }}
          />

          {/* Formulario */}
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          {/* Footer link */}
          <p className="text-sm mt-6 text-center lg:text-left" style={{ color: '#94A3B8' }}>
            ¿Sin credenciales?{' '}
            <Link
              to="/register"
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 h-auto font-orbitron text-[10px] tracking-wider uppercase'
              )}
              style={{ color: '#E11D48' }}
            >
              Solicitar Acceso →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
