import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Ventas from './pages/Ventas'
import Abonos from './pages/Abonos'
import Reportes from './pages/Reportes'
import Login from './pages/Login'
import { useAuthStore } from './store/useAuthStore'
import { puedeAcceder } from './utils/roles'
import Usuarios from './pages/Usuarios'

function PrivateRoute({ children, permiso }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" />

  if (permiso && !puedeAcceder(user?.rol, permiso)) {
    if (user?.rol === 'CAJERO') return <Navigate to="/pos" />
    return <Navigate to="/" />
  }

  return children
}

function App() {
  const { restoreSession } = useAuthStore()

  useEffect(() => {
    restoreSession()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={
                  <PrivateRoute permiso="dashboard">
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/pos" element={<POS />} />
                <Route path="/productos" element={
                  <PrivateRoute permiso="productos_ver">
                    <Productos />
                  </PrivateRoute>
                } />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/ventas" element={<Ventas />} />
                <Route path="/abonos" element={<Abonos />} />
                <Route path="/reportes" element={
                  <PrivateRoute permiso="reportes">
                    <Reportes />
                  </PrivateRoute>
                } />
                <Route path="/usuarios" element={
                  <PrivateRoute permiso="usuarios">
                    <Usuarios />
                  </PrivateRoute>
                } />
              </Routes>
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App