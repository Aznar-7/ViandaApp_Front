import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import AppRouter from '@/router'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            classNames: {
              title: 'font-orbitron text-xs tracking-wider',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
