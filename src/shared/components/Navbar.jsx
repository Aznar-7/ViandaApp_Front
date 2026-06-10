import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { LogOut, UserCircle2, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import ImperialCrest from './ImperialCrest'

const USER_LINKS  = [
  { to: '/menus',   label: 'Menús' },
  { to: '/pedidos', label: 'Pedidos' },
]
const ADMIN_LINKS = [
  { to: '/admin',   label: 'Panel Imperial' },
  { to: '/menus',   label: 'Menús' },
]

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()
  const links     = isAdmin ? ADMIN_LINKS : USER_LINKS

  function handleLogout() {
    logout()
    toast.info('Sesión cerrada')
    navigate('/login', { replace: true })
  }

  function isActive(to) {
    return location.pathname === to || (to.length > 1 && location.pathname.startsWith(to))
  }

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-40 h-14 bg-card/95 backdrop-blur-sm border-b border-border relative"
    >
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4">

        {/* Logo */}
        <Link
          to={isAdmin ? '/admin' : '/pedidos'}
          className="flex items-center gap-2.5 shrink-0 group mr-2"
        >
          <ImperialCrest className="w-6 h-6 text-primary transition-transform duration-500 group-hover:rotate-[60deg]" />
          <div className="flex flex-col leading-none">
            <span className="font-orbitron text-[11px] font-bold tracking-[0.18em] uppercase text-foreground">
              Orden 66
            </span>
            <span className="font-orbitron text-[7px] tracking-[0.5em] uppercase text-accent leading-tight">
              Viandas
            </span>
          </div>
        </Link>

        <Separator orientation="vertical" className="h-6 hidden sm:block" />

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-0.5 flex-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 rounded text-[10px] font-orbitron tracking-widest uppercase transition-all duration-150',
                isActive(to)
                  ? 'bg-primary/12 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {isActive(to) && <ChevronRight className="w-2.5 h-2.5 shrink-0" />}
              {label}
            </Link>
          ))}
        </nav>

        {/* User area */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <UserCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-foreground/80 font-medium truncate max-w-[120px]">
              {user?.nombre}
            </span>
            <Badge
              variant="outline"
              className={cn(
                'text-[8px] font-orbitron tracking-widest uppercase h-4 px-1.5',
                isAdmin
                  ? 'border-accent/50 text-accent'
                  : 'border-primary/40 text-primary'
              )}
            >
              {isAdmin ? 'Almirante' : 'Soldado'}
            </Badge>
          </div>

          <Separator orientation="vertical" className="h-5 hidden sm:block" />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Crimson accent line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </motion.header>
  )
}
