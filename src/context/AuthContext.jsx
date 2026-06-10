import { createContext, useContext, useState, useCallback } from 'react'
import authService from '@/features/auth/services/authService'

const AuthContext = createContext(null)

function readUser() {
  try {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(readUser)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const isLoading         = false

  const login = useCallback(async (credentials) => {
    const { token, usuario } = await authService.login(credentials)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(usuario))
    setToken(token)
    setUser(usuario)
    return usuario
  }, [])

  const register = useCallback(async (data) => {
    await authService.register(data)
    // Register returns only the user; auto-login to obtain token
    const { token, usuario } = await authService.login({ email: data.email, password: data.password })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(usuario))
    setToken(token)
    setUser(usuario)
    return usuario
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const isAdmin = user?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
