import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ClipboardList, Gauge, LogOut, Plus, ShieldCheck,
  UtensilsCrossed, X, UserCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import Order66Mark from './Order66Mark'

const USER_SECTIONS = [
  {
    label: 'Operación',
    links: [
      { to: '/dashboard', icon: Gauge, label: 'Inicio', description: 'Resumen del día', code: '01' },
      { to: '/menus', icon: UtensilsCrossed, label: 'Elegir menú', description: 'Raciones y cupos', code: '02' },
      { to: '/pedidos', icon: ClipboardList, label: 'Mis pedidos', description: 'Estado e historial', code: '03' },
      { to: '/perfil', icon: UserCircle, label: 'Mi perfil', description: 'Datos y seguridad', code: '04' },
    ],
  },
]

const ADMIN_SECTIONS = [
  {
    label: 'Centro operativo',
    links: [
      { to: '/admin', icon: ShieldCheck, label: 'Operaciones', description: 'Pedidos y estados', code: 'A1' },
      { to: '/menus', icon: UtensilsCrossed, label: 'Suministros', description: 'Menús y cupos', code: 'A2' },
    ],
  },
]

function isRouteActive(pathname, to) {
  if (to === '/admin') return pathname === '/admin' || pathname.startsWith('/admin/')
  if (to === '/dashboard') return pathname === '/dashboard'
  return pathname === to || pathname.startsWith(`${to}/`)
}

function NavItem({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn('sidebar-nav-item group', active && 'sidebar-nav-item--active')}
    >
      <span className="sidebar-nav-item__code">{item.code}</span>
      <span className="sidebar-nav-item__icon"><Icon /></span>
      <span className="min-w-0 flex-1">
        <span className="sidebar-nav-item__label">{item.label}</span>
        <span className="sidebar-nav-item__description">{item.description}</span>
      </span>
    </Link>
  )
}

function Brand({ home, onClose }) {
  return (
    <div className="sidebar-brand">
      <Link to={home} onClick={onClose} className="flex min-w-0 items-center gap-3">
        <Order66Mark className="shrink-0" />
        <span className="min-w-0">
          <span className="sidebar-brand__name">Orden 66</span>
          <span className="sidebar-brand__product">Gestión de viandas</span>
        </span>
      </Link>
      <button type="button" onClick={onClose} className="sidebar-close lg:hidden" aria-label="Cerrar menú">
        <X className="size-4" />
      </button>
    </div>
  )
}

function SidebarContent({ onClose }) {
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
    <div className="flex h-full flex-col">
      <Brand home={home} onClose={onClose} />

      {!isAdmin && (
        <div className="px-3 pt-4">
          <Link to="/pedidos/nuevo" onClick={onClose} className="sidebar-primary-action">
            <span className="sidebar-primary-action__icon"><Plus className="size-4" /></span>
            <span>
              <span className="block text-sm font-semibold">Nuevo pedido</span>
              <span className="block text-[10px] text-white/60">Elegir ración y entrega</span>
            </span>
            <span className="ml-auto font-orbitron text-[8px] tracking-widest text-white/50">NEW</span>
          </Link>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {sections.map((section) => (
          <section key={section.label} className="mb-6">
            <div className="sidebar-section-label">
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
                />
              ))}
            </div>
          </section>
        ))}

        <div className="sidebar-sector">
          <div className="flex items-center justify-between">
            <span className="technical-label">Terminal</span>
            <span className="system-dot" />
          </div>
          <div className="mt-3 font-orbitron text-xs font-bold tracking-[0.24em] text-[#CBD5E1]">
            SECTOR R-66
          </div>
          <div className="mt-1 text-[10px] text-[#64748B]">Sistema operativo de raciones</div>
        </div>
      </nav>

      <div className="sidebar-session">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/perfil" onClick={onClose} className="sidebar-avatar shrink-0 hover:ring-2 hover:ring-sidebar-primary/40 transition-all">
            {user?.nombre?.charAt(0)?.toUpperCase() ?? '?'}
          </Link>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-[#F8FAFC]">{user?.nombre}</div>
            <div className="technical-label mt-0.5">{isAdmin ? 'Administrador Imperial' : 'Operador autenticado'}</div>
          </div>
          <button type="button" onClick={handleLogout} className="sidebar-logout" aria-label="Cerrar sesión">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside className="sidebar-frame hidden lg:flex">
        <SidebarContent onClose={() => {}} />
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
