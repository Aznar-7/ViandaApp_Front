import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import RegisterForm from '../components/RegisterForm'
import Order66Mark from '@/shared/components/Order66Mark'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit({ confirmPassword: _discard, ...data }) {
    setIsLoading(true)
    setError(null)
    try {
      const user = await registerUser(data)
      toast.success('Recluta registrado', { description: `Bienvenido al Imperio, ${user.nombre}` })
      navigate(user.rol === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error ?? 'No fue posible completar el registro.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-10"
      style={{ backgroundColor: '#0B0D10' }}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #1F2430 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
        }}
      />

      {/* Atmospheric light */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #38BDF835 0%, transparent 70%)',
          filter: 'blur(120px)',
          top: '-10%',
          right: '-8%',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #E11D4835 0%, transparent 70%)',
          filter: 'blur(120px)',
          bottom: '-12%',
          left: '-8%',
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="imperial-panel relative z-10 w-full max-w-[420px] mx-4"
        style={{
          background: 'rgba(21, 25, 34, 0.80)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid #2F3645',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, transparent, #38BDF8, transparent)' }}
        />

        <div className="p-8">
          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-7">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mb-5"
            >
              <div
                className="relative flex items-center justify-center"
                style={{ width: 64, height: 64 }}
              >
                {/* Glow pulse */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{ background: '#E11D48', filter: 'blur(16px)', opacity: 0.35 }}
                />
                {/* Logo square */}
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: 56,
                    height: 56,
                    background: 'transparent',
                    border: 'none',
                  }}
                >
                  <Order66Mark className="!w-14 !h-14" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <h1
                className="font-orbitron font-black tracking-[0.15em] uppercase mb-1"
                style={{ color: '#F8FAFC', fontSize: '1.125rem' }}
              >
                Orden 66 Viandas
              </h1>
              <p
                className="font-orbitron text-[9px] tracking-[0.45em] uppercase"
                style={{ color: '#94A3B8' }}
              >
                Sistema de gestión de raciones
              </p>
            </motion.div>
          </div>

          {/* Divider */}
          <div
            className="mb-6 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #2F3645, transparent)' }}
          />

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="mb-5"
          >
            <p
              className="font-orbitron text-[9px] tracking-[0.5em] uppercase mb-1"
              style={{ color: '#38BDF8' }}
            >
              Nuevo Recluta
            </p>
            <p className="text-sm" style={{ color: '#94A3B8' }}>
              Complete el formulario para unirse al Imperio.
            </p>
          </motion.div>

          {/* Form */}
          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          {/* Footer link */}
          <p className="text-center text-sm mt-6" style={{ color: '#94A3B8' }}>
            ¿Ya tiene credenciales?{' '}
            <Link
              to="/login"
              className="font-medium transition-colors duration-150"
              style={{ color: '#E11D48' }}
              onMouseEnter={e => (e.target.style.color = '#BE123C')}
              onMouseLeave={e => (e.target.style.color = '#E11D48')}
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl"
          style={{ background: 'linear-gradient(90deg, transparent, #2F3645, transparent)' }}
        />
      </motion.div>
    </div>
  )
}
