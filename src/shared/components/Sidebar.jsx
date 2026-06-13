import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ChevronLeft, ChevronRight, ClipboardList, Gauge, LogOut, Plus,
  ShieldCheck, UtensilsCrossed, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import ImperialCrest from './ImperialCrest'

const USER_SECTIONS = [{
  label: 'Operación',
  links: [
    { to: '/dashboard', icon: Gauge, label: 'Inicio', description: 'Resumen del día', code: '01' },
    { to: '/menus', icon: UtensilsCrossed, label: 'Elegir menú', description: 'Raciones y cupos', code: '02' },
    { to: '/pedidos', icon: ClipboardList, label: 'Mis pedidos', description: 'Estado e historial', code: '03' },
  ],
}]

const ADMIN_SECTIONS = [{
  label: 'Centro operativo',
  links: [
    { to: '/admin', icon: ShieldCheck, label: 'Operaciones', description: 'Pedidos y estados', code: 'A1' },
    { to: '/menus', icon: UtensilsCrossed, label: 'Suministros', description: 'Menús y cupos', code: 'A2' },
  ],
}]

function isRouteActive(pathname, to) {
  if (to === '/admin') return pathname === '/admin' || pathname.startsWith('/admin/')
  if (to === '/dashboard') return pathname === '/dashboard'
  return pathname === to || pathname.startsWith(`${to}/`)
}

function NavItem({ item, active, onClick, collapsed }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      className={cn('sidebar-nav-item group', active && 'sidebar-nav-item--active')}
    >
      <span className="sidebar-nav-item__code">{item.code}</span>
      <span className="sidebar-nav-item__icon"><Icon /></span>
      <span className="sidebar-collapsible-copy min-w-0 flex-1">
        <span className="sidebar-nav-item__label">{item.label}</span>
        <span className="sidebar-nav-item__description">{item.description}</span>
      </span>
    </Link>
  )
}

function Brand({ home, onClose, collapsed, onToggleCollapsed }) {
  return (
    <div className="sidebar-brand">
      <Link to={home} onClick={onClose} className="flex min-w-0 items-center gap-3" aria-label="Inicio">
        <ImperialCrest className="size-9 shrink-0 text-white" />
        <span className="sidebar-collapsible-copy min-w-0">
          <span className="sidebar-brand__name">Orden 66</span>
          <span className="sidebar-brand__product">Gestión de viandas</span>
        </span>
      </Link>
      <button type="button" onClick={onClose} className="sidebar-close lg:hidden" aria-label="Cerrar menú">
        <X className="size-4" />
      </button>
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="sidebar-close hidden lg:grid"
        aria-label={collapsed ? 'Expandir barra lateral' : 'Minimizar barra lateral'}
        title={collapsed ? 'Expandir barra lateral' : 'Minimizar barra lateral'}
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>
    </div>
  )
}

function SidebarContent({ onClose, collapsed = false, onToggleCollapsed = () => {} }) {
  const { user, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const sections = isAdmin ? ADMIN_SECTIONS : USER_SECTIONS
  const home = isAdmin ? '/admin' : '/dashboard'

  function handleLogout() {
    logout()
    toast.info('Sesión cerrada')
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Brand home={home} onClose={onClose} collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />

      {!isAdmin && (
        <div className="px-3 pt-4">
          <Link
            to="/pedidos/nuevo"
            onClick={onClose}
            className="sidebar-primary-action"
            aria-label="Nuevo pedido"
            title={collapsed ? 'Nuevo pedido' : undefined}
          >
            <span className="sidebar-primary-action__icon"><Plus className="size-4" /></span>
            <span className="sidebar-collapsible-copy">
              <span className="block text-sm font-semibold">Nuevo pedido</span>
              <span className="block text-[10px] text-white/60">Elegir ración y entrega</span>
            </span>
            <span className="sidebar-collapsible-copy ml-auto font-orbitron text-[8px] tracking-widest text-white/50">NEW</span>
          </Link>
        </div>
      )}

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
        {sections.map((section) => (
          <section key={section.label} className="mb-6">
            <div className="sidebar-section-label sidebar-collapsible-copy">
              <span>{section.label}</span>
              <span className="sidebar-section-label__line" />
            </div>
            <div className="space-y-1.5">
              {section.links.map((item) => (
                <NavItem
                  key={item.to}
                  item={item}
                  active={isRouteActive(location.pathname, item.to)}
                  onClick={onClose}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </section>
        ))}

        <div className="sidebar-sector sidebar-collapsible-copy">
          <div className="flex items-center justify-between">
            <span className="technical-label">Terminal</span>
            <span className="system-dot" />
          </div>
          <div className="mt-3 font-orbitron text-xs font-bold tracking-[0.24em] text-[#CBD5E1]">SECTOR R-66</div>
          <div className="mt-1 text-[10px] text-[#64748B]">Sistema operativo de raciones</div>
        </div>
      </nav>

      <div className="sidebar-session">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/perfil"
            onClick={onClose}
            aria-label="Mi perfil"
            title={collapsed ? 'Mi perfil' : undefined}
            className="flex min-w-0 flex-1 items-center gap-3 rounded px-1 py-0.5 transition-colors hover:bg-white/5"
          >
            <span className="sidebar-avatar shrink-0">{user?.nombre?.charAt(0)?.toUpperCase() ?? '?'}</span>
            <span className="sidebar-collapsible-copy min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-[#F8FAFC]">{user?.nombre}</span>
              <span className="technical-label mt-0.5 block">{isAdmin ? 'Administrador Imperial' : 'Operador autenticado'}</span>
            </span>
          </Link>
          <button type="button" onClick={handleLogout} className="sidebar-logout" aria-label="Cerrar sesión" title="Cerrar sesión">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapsed }) {
  return (
    <>
      <aside className={cn('sidebar-frame hidden lg:flex', collapsed && 'sidebar-frame--collapsed')}>
        <SidebarContent collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} onClose={() => {}} />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="sidebar-frame fixed inset-y-0 left-0 z-50 flex lg:hidden"
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
