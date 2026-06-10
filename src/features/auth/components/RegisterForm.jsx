import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const schema = z
  .object({
    nombre:          z.string().min(2, 'Mínimo 2 caracteres'),
    email:           z.string().email('Email inválido'),
    password:        z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

const FIELDS = [
  { id: 'nombre',          label: 'Nombre de Rango',  icon: User, type: 'text',     placeholder: 'Comandante',      autoComplete: 'name' },
  { id: 'email',           label: 'Identificador',    icon: Mail, type: 'email',    placeholder: 'cmd@imperio.gal', autoComplete: 'email' },
  { id: 'password',        label: 'Código de Acceso', icon: Lock, type: 'password', placeholder: '••••••••',        autoComplete: 'new-password', toggle: true },
  { id: 'confirmPassword', label: 'Confirmar Código', icon: Lock, type: 'password', placeholder: '••••••••',        autoComplete: 'new-password', toggle: true },
]

export default function RegisterForm({ onSubmit, isLoading, error }) {
  const [visible, setVisible] = useState({ password: false, confirmPassword: false })
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const toggle = (id) => setVisible((v) => ({ ...v, [id]: !v[id] }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {FIELDS.map(({ id, label, icon: Icon, type, placeholder, autoComplete, toggle: hasToggle }) => (
        <div key={id} className="space-y-1.5">
          <Label htmlFor={id} className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
            {label}
          </Label>
          <motion.div
            className="relative"
            animate={errors[id] ? { x: [-5, 5, -4, 4, -2, 2, 0] } : {}}
            transition={{ duration: 0.35 }}
          >
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id={id}
              type={hasToggle && visible[id] ? 'text' : type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={cn('pl-9', hasToggle && 'pr-10', errors[id] && 'border-destructive focus-visible:ring-destructive')}
              {...register(id)}
            />
            {hasToggle && (
              <button
                type="button"
                onClick={() => toggle(id)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {visible[id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </motion.div>
          <AnimatePresence>
            {errors[id] && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="w-3 h-3 shrink-0" />{errors[id].message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button type="submit" disabled={isLoading} className="w-full font-orbitron text-xs tracking-[0.15em] uppercase h-10 mt-1">
        {isLoading
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Procesando...</>
          : 'Solicitar Acceso'}
      </Button>
    </form>
  )
}
