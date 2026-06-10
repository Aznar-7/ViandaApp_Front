# Perfil de Usuario Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a full-featured user profile page for Orden 66 Viandas with personal data, password change, and order history tabs.

**Architecture:** Three focused files — a service layer (`perfilService`), a display component (`ImperialRankBadge`), and the main page (`PerfilPage`) which delegates heavy tab content to three sub-components. Router gets one new lazy route.

**Tech Stack:** React 19, Tailwind CSS v4, Motion, React Hook Form + Zod, Lucide React, React Router v7, sonner (toasts), @base-ui/react components

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/features/perfil/services/perfilService.js` | Create | API calls for profile + password update |
| `src/features/perfil/components/ImperialRankBadge.jsx` | Create | Rank badge based on order count |
| `src/features/perfil/components/TabDatosPersonales.jsx` | Create | Personal data form (name, puntoRetiro, turno) |
| `src/features/perfil/components/TabSeguridad.jsx` | Create | Password change form with strength indicator |
| `src/features/perfil/components/TabMisPedidos.jsx` | Create | Compact list of last 5 orders |
| `src/features/perfil/pages/PerfilPage.jsx` | Create | Header + custom tabs shell |
| `src/router/index.jsx` | Modify | Add lazy `/perfil` route inside ProtectedRoute |

---

### Task 1: perfilService

**Files:**
- Create: `src/features/perfil/services/perfilService.js`

- [ ] **Step 1: Create the service file**

```js
import api from '@/lib/axios'

const perfilService = {
  updatePerfil: (data) => api.put('/usuarios/perfil', data).then((r) => r.data),
  updatePassword: (data) => api.put('/usuarios/password', data).then((r) => r.data),
}

export default perfilService
```

- [ ] **Step 2: Commit**

```bash
git add src/features/perfil/services/perfilService.js
git commit -m "feat(perfil): add perfilService"
```

---

### Task 2: ImperialRankBadge

**Files:**
- Create: `src/features/perfil/components/ImperialRankBadge.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { Medal } from 'lucide-react'
import { cn } from '@/lib/utils'

const RANKS = [
  {
    min: 0, max: 4,
    nombre: 'Recruta',
    descripcion: 'Nuevo en las filas imperiales',
    color: 'text-slate-400 border-slate-400/30 bg-slate-400/10',
  },
  {
    min: 5, max: 14,
    nombre: 'Soldado Imperial',
    descripcion: 'Tropa de línea del Imperio',
    color: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  },
  {
    min: 15, max: 29,
    nombre: 'Sargento',
    descripcion: 'Veterano de múltiples misiones',
    color: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  },
  {
    min: 30, max: Infinity,
    nombre: 'Oficial Imperial',
    descripcion: 'Élite al servicio del Emperador',
    color: 'text-primary border-primary/30 bg-primary/10',
  },
]

export default function ImperialRankBadge({ totalPedidos = 0, className }) {
  const rank = RANKS.find((r) => totalPedidos >= r.min && totalPedidos <= r.max) ?? RANKS[0]

  return (
    <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium', rank.color, className)}>
      <Medal className="w-3.5 h-3.5 shrink-0" />
      <span className="font-orbitron tracking-wide">{rank.nombre}</span>
      <span className="text-[10px] opacity-70 hidden sm:inline">— {rank.descripcion}</span>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/perfil/components/ImperialRankBadge.jsx
git commit -m "feat(perfil): add ImperialRankBadge component"
```

---

### Task 3: TabDatosPersonales

**Files:**
- Create: `src/features/perfil/components/TabDatosPersonales.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Save, Loader2, Mail } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import perfilService from '../services/perfilService'

const PUNTOS_RETIRO = ['Sede central', 'Cantina Norte', 'Cantina Sur', 'Edificio A', 'Edificio B']
const TURNOS = ['Almuerzo', 'Cena']

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  puntoRetiro: z.string().min(1),
  turno: z.string().min(1),
})

export default function TabDatosPersonales({ user }) {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: user?.nombre ?? '',
      puntoRetiro: PUNTOS_RETIRO[0],
      turno: TURNOS[0],
    },
  })

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      await perfilService.updatePerfil(data)
      toast.success('Perfil actualizado', { description: 'Tus datos han sido guardados.' })
    } catch {
      toast.error('No se pudo actualizar el perfil', { description: 'Intenta de nuevo más tarde.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      <div className="space-y-1.5">
        <Label htmlFor="nombre" className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Nombre
        </Label>
        <Input
          id="nombre"
          placeholder="Nombre completo"
          {...register('nombre')}
          aria-invalid={!!errors.nombre}
        />
        {errors.nombre && (
          <p className="text-xs text-destructive">{errors.nombre.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="email"
            type="email"
            value={user?.email ?? ''}
            disabled
            className="pl-9"
            readOnly
          />
        </div>
        <p className="text-[10px] text-muted-foreground">El email no puede modificarse.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="puntoRetiro" className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Punto de retiro preferido
        </Label>
        <NativeSelect id="puntoRetiro" {...register('puntoRetiro')}>
          {PUNTOS_RETIRO.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </NativeSelect>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="turno" className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Turno preferido
        </Label>
        <NativeSelect id="turno" {...register('turno')}>
          {TURNOS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </NativeSelect>
      </div>

      <Button type="submit" disabled={isLoading} className="gap-2">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Guardar cambios
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/perfil/components/TabDatosPersonales.jsx
git commit -m "feat(perfil): add TabDatosPersonales component"
```

---

### Task 4: TabSeguridad

**Files:**
- Create: `src/features/perfil/components/TabSeguridad.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import perfilService from '../services/perfilService'

const schema = z.object({
  passwordActual: z.string().min(1, 'Requerido'),
  passwordNueva: z.string().min(8, 'Mínimo 8 caracteres'),
  passwordConfirm: z.string().min(1, 'Requerido'),
}).refine((d) => d.passwordNueva === d.passwordConfirm, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordConfirm'],
})

function PasswordInput({ id, label, registration, error, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder ?? '••••••••'}
          className={cn('pl-9 pr-10', error && 'border-destructive')}
          aria-invalid={!!error}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  )
}

function StrengthBar({ password }) {
  const len = password?.length ?? 0
  const strength = len < 6 ? 0 : len < 10 ? 1 : 2
  const labels = ['Débil', 'Media', 'Fuerte']
  const colors = ['bg-red-500', 'bg-yellow-400', 'bg-green-500']

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i <= strength && password ? colors[strength] : 'bg-border'
            )}
          />
        ))}
      </div>
      {password && (
        <p className="text-[10px] text-muted-foreground">{labels[strength]}</p>
      )}
    </div>
  )
}

export default function TabSeguridad() {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { passwordActual: '', passwordNueva: '', passwordConfirm: '' },
  })

  const nuevaPass = watch('passwordNueva')

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      await perfilService.updatePassword({
        passwordActual: data.passwordActual,
        passwordNueva: data.passwordNueva,
      })
      toast.success('Código de acceso actualizado')
      reset()
    } catch {
      toast.error('No se pudo actualizar la contraseña', { description: 'Verifica tu contraseña actual.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      <PasswordInput
        id="passwordActual"
        label="Contraseña actual"
        registration={register('passwordActual')}
        error={errors.passwordActual}
      />

      <div className="space-y-2">
        <PasswordInput
          id="passwordNueva"
          label="Nueva contraseña"
          registration={register('passwordNueva')}
          error={errors.passwordNueva}
        />
        <StrengthBar password={nuevaPass} />
      </div>

      <PasswordInput
        id="passwordConfirm"
        label="Confirmar contraseña"
        registration={register('passwordConfirm')}
        error={errors.passwordConfirm}
      />

      <Button type="submit" disabled={isLoading} className="gap-2">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        Actualizar código de acceso
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/perfil/components/TabSeguridad.jsx
git commit -m "feat(perfil): add TabSeguridad with password strength indicator"
```

---

### Task 5: TabMisPedidos

**Files:**
- Create: `src/features/perfil/components/TabMisPedidos.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/shared/utils'
import { Skeleton } from '@/shared/components/Skeleton'
import EmptyState from '@/shared/components/EmptyState'
import StatusBadge from '@/features/pedidos/components/StatusBadge'
import pedidoService from '@/features/pedidos/services/pedidoService'

function PedidoRow({ pedido }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{pedido.menuNombre}</p>
        <p className="text-xs text-muted-foreground">{formatDate(pedido.fecha)}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge estado={pedido.estado} />
        <p className="font-orbitron text-sm font-bold text-foreground hidden sm:block">
          {formatCurrency(pedido.total)}
        </p>
        <Link
          to={`/pedidos/${pedido.id}`}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

function PedidoRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border">
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16 hidden sm:block" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    </div>
  )
}

export default function TabMisPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    pedidoService.getPedidos({ limit: 5, page: 1 })
      .then((data) => {
        if (!cancelled) setPedidos(data.pedidos ?? data ?? [])
      })
      .catch(() => {
        if (!cancelled) setPedidos([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="max-w-lg space-y-4">
      <div className="bg-card border border-border rounded-xl px-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <PedidoRowSkeleton key={i} />)
        ) : pedidos.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Sin provisiones en el registro"
            description="Todavía no realizaste ningún pedido."
          />
        ) : (
          pedidos.map((p) => <PedidoRow key={p.id} pedido={p} />)
        )}
      </div>

      {!isLoading && pedidos.length > 0 && (
        <Link
          to="/pedidos"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          Ver todos mis pedidos <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/perfil/components/TabMisPedidos.jsx
git commit -m "feat(perfil): add TabMisPedidos component"
```

---

### Task 6: PerfilPage

**Files:**
- Create: `src/features/perfil/pages/PerfilPage.jsx`

- [ ] **Step 1: Create the page**

```jsx
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { User, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import pedidoService from '@/features/pedidos/services/pedidoService'
import ImperialRankBadge from '../components/ImperialRankBadge'
import TabDatosPersonales from '../components/TabDatosPersonales'
import TabSeguridad from '../components/TabSeguridad'
import TabMisPedidos from '../components/TabMisPedidos'

const TABS = [
  { id: 'datos', label: 'Datos personales', icon: User },
  { id: 'seguridad', label: 'Seguridad', icon: Shield },
  { id: 'pedidos', label: 'Mis pedidos', icon: null },
]

function Avatar({ nombre }) {
  const initial = nombre?.[0]?.toUpperCase() ?? '?'
  return (
    <div className={cn(
      'w-20 h-20 rounded-full flex items-center justify-center shrink-0',
      'bg-gradient-to-br from-primary/80 to-primary/40',
      'ring-2 ring-primary/40 ring-offset-2 ring-offset-background'
    )}>
      <span className="font-orbitron text-2xl font-bold text-white">{initial}</span>
    </div>
  )
}

export default function PerfilPage() {
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('datos')
  const [totalPedidos, setTotalPedidos] = useState(0)

  useEffect(() => {
    pedidoService.getPedidos({ limit: 1, page: 1 })
      .then((data) => setTotalPedidos(data.total ?? 0))
      .catch(() => setTotalPedidos(0))
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5"
      >
        <Avatar nombre={user?.nombre} />
        <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
          <h1 className="font-orbitron text-xl font-bold text-foreground">{user?.nombre}</h1>
          <ImperialRankBadge totalPedidos={totalPedidos} />
          <p className="text-sm text-muted-foreground">
            {isAdmin ? 'Administrador Imperial' : 'Operador autenticado'}
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-border px-4 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'datos' && <TabDatosPersonales user={user} />}
          {activeTab === 'seguridad' && <TabSeguridad />}
          {activeTab === 'pedidos' && <TabMisPedidos />}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/perfil/pages/PerfilPage.jsx
git commit -m "feat(perfil): add PerfilPage with custom tabs"
```

---

### Task 7: Router update

**Files:**
- Modify: `src/router/index.jsx`

- [ ] **Step 1: Add lazy import and route**

After line 18 (`const NotFoundPage = lazy...`), add:

```js
const PerfilPage = lazy(() => import('@/features/perfil/pages/PerfilPage'))
```

Inside the `<Route element={<ProtectedRoute />}><Route element={<PageLayout />}>` block, add after the last existing protected route:

```jsx
<Route path="/perfil" element={<PerfilPage />} />
```

- [ ] **Step 2: Commit**

```bash
git add src/router/index.jsx
git commit -m "feat(perfil): add /perfil route to router"
```

---

## Self-Review

**Spec coverage:**
- [x] `perfilService.js` with `updatePerfil` and `updatePassword` — Task 1
- [x] `ImperialRankBadge` with rank tiers, Medal icon, description — Task 2
- [x] Tab 1: nombre (editable), email (readonly), puntoRetiro select, turno select, save button — Task 3
- [x] Tab 2: 3 password inputs with eye toggle, strength bar (3 segments), update button — Task 4
- [x] Tab 3: last 5 orders, skeleton, empty state, "Ver todos" link — Task 5
- [x] PerfilPage: avatar, header, custom tabs, totalPedidos from API — Task 6
- [x] Router: lazy import + protected route — Task 7

**Placeholder scan:** No TBD, no "similar to Task N", all code provided.

**Type consistency:** `pedidoService.getPedidos` returns `{ pedidos, total }` based on PedidosPage pattern — TabMisPedidos uses `data.pedidos ?? data` to handle both shapes. PerfilPage reads `data.total`.
