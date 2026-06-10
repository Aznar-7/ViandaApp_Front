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
  { match: (path) => path.startsWith('/admin/'), section: 'Administración', title: 'Historial operativo' },
  { match: (path) => path === '/admin', section: 'Administración', title: 'Control de operaciones' },
  { match: (path) => path === '/dashboard', section: 'Inicio', title: 'Panel central' },
]

export default function Topbar({ onMenuClick, className }) {
  const { user, isAdmin } = useAuth()
  const location = useLocation()
  const context = ROUTE_CONTEXT.find((item) => item.match(location.pathname)) ?? ROUTE_CONTEXT.at(-1)

  return (
    <header className={cn(
      'app-topbar sticky top-0 z-30 h-14 backdrop-blur-xl flex items-center px-4 lg:px-6 gap-3',
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
      <div className="lg:hidden flex items-center gap-2">
        <Order66Mark className="!w-7 !h-7" />
        <span className="font-orbitron text-[11px] font-bold tracking-[0.12em] uppercase text-foreground">
          Orden 66
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-3 min-w-0">
        <div>
          <div className="technical-label">{context.section}</div>
          <div className="mt-1 truncate text-sm font-semibold text-foreground">{context.title}</div>
        </div>
      </div>

      <div className="flex-1" />

      {!isAdmin && !location.pathname.startsWith('/pedidos/nuevo') && (
        <Link to="/pedidos/nuevo" className={cn(buttonVariants({ size: 'sm' }), 'hidden sm:inline-flex gap-1.5')}>
          <Plus className="size-3.5" /> Nuevo pedido
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
