import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import PublicRoute from './PublicRoute'
import PageLayout from '@/shared/components/PageLayout'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import MenusPage from '@/features/menus/pages/MenusPage'
import PedidosPage from '@/features/pedidos/pages/PedidosPage'
import PedidoDetailPage from '@/features/pedidos/pages/PedidoDetailPage'
import PedidoFormPage from '@/features/pedidos/pages/PedidoFormPage'
import AdminDashboard from '@/features/admin/pages/AdminDashboard'
import HistorialPage from '@/features/admin/pages/HistorialPage'
import NotFoundPage from './NotFoundPage'

function RootRedirect() {
  const { user, isAdmin, isLoading } = useAuth()
  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<PublicRoute />}>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<PageLayout />}>
          <Route path="/dashboard"           element={<DashboardPage />} />
          <Route path="/menus"               element={<MenusPage />} />
          <Route path="/pedidos"             element={<PedidosPage />} />
          <Route path="/pedidos/nuevo"       element={<PedidoFormPage />} />
          <Route path="/pedidos/:id"         element={<PedidoDetailPage />} />
          <Route path="/pedidos/:id/editar"  element={<PedidoFormPage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<PageLayout />}>
          <Route path="/admin"                          element={<AdminDashboard />} />
          <Route path="/admin/pedidos/:id/historial"   element={<HistorialPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
