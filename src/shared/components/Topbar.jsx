import { Link, useLocation } from 'react-router-dom'
import { Menu, Plus, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { buttonVariants } from '@/components/ui/button'
import Order66Mark from './Order66Mark'

const ROUTE_CONTEXT = [
  { match: (path) => path.startsWith('/pedidos/nuevo'), section: 'Pedidos', title: 'Nuevo pedido' },
  { match: (path) => path.includes('/editar'), section: 'Pedidos', title: 'Editar pedido' },
  { match: (path) => path.startsWith('/pedidos/'), section: 'Pedidos', title: 'Detalle de pedido' },
  { match: (path) => path === '/pedidos', section: 'Pedidos', title: 'Mis pedidos' },
  { match: (path) => path === '/menus', section: 'Suministros', title: 'Menús disponibles' },
  { match: (path) => path === '/admin/menus', section: 'Administración', title: 'Gestión de menús' },
  { match: (path) => path === '/admin/sedes', section: 'Administración', title: 'Gestión de sedes' },
  { match: (path) => path === '/admin/usuarios', section: 'Administración', title: 'Gestión de usuarios' },
  { match: (path) => path.startsWith('/admin/'), section: 'Administración', title: 'Historial operativo' },
  { match: (path) => path === '/admin', section: 'Administración', title: 'Control de operaciones' },
  { match: (path) => path === '/dashboard', section: 'Inicio', title: 'Panel central' },
  { match: (path) => path === '/perfil', section: 'Cuenta', title: 'Mi perfil imperial' },
]

export default function Topbar({ onMenuClick, className }) {
  const { user, isAdmin } = useAuth()
  const location = useLocation()
  const context = ROUTE_CONTEXT.find((item) => item.match(location.pathname)) ?? ROUTE_CONTEXT.at(-1)

  return (
    <header className={cn(
      'app-topbar sticky top-0 z-30 flex min-h-16 min-w-0 items-center gap-3 px-3 backdrop-blur-xl sm:px-4 lg:px-6',
      className
    )}>
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Abrir menú"
      >
        <Menu className="w-4.5 h-4.5" />
      </button>

      {/* Brand — mobile only */}
      <div className="flex min-w-0 items-center gap-2 lg:hidden">
        <Order66Mark className="!h-7 !w-7" />
        <span className="hidden font-orbitron text-[11px] font-bold uppercase tracking-[0.12em] text-foreground sm:inline">
          Orden 66
        </span>
      </div>

      <div className="min-w-0 flex-1 lg:flex lg:items-center lg:gap-3">
        <div>
          <div className="technical-label hidden sm:block">{context.section}</div>
          <div className="truncate text-sm font-semibold text-foreground sm:mt-1">{context.title}</div>
        </div>
      </div>

      {!isAdmin && !location.pathname.startsWith('/pedidos/nuevo') && (
        <Link aria-label="Nuevo pedido" to="/pedidos/nuevo" className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}>
          <Plus className="size-3.5" /> <span className="hidden md:inline">Nuevo pedido</span>
        </Link>
      )}

      {/* User info — desktop only */}
      <div className="hidden lg:flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <div className="text-right">
          <div className="text-sm font-medium text-foreground">{user?.nombre}</div>
          <div className="font-orbitron text-[8px] tracking-widest uppercase text-muted-foreground">
            {isAdmin ? 'Administrador' : 'Usuario'}
          </div>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground">
          <span className="font-orbitron text-[11px] text-primary font-bold">
            {user?.nombre?.charAt(0)?.toUpperCase() ?? '?'}
          </span>
        </div>
      </div>
    </header>
  )
}
