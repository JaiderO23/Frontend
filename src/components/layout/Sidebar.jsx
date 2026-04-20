import { Home, Package, Users, ShoppingCart, DollarSign, BarChart3, LogOut, UserCog } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { puedeAcceder } from '../../utils/roles'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const rol = user?.rol

  const menuItems = [
    { icon: Home,        label: 'Dashboard',       path: '/',          permiso: 'dashboard' },
    { icon: ShoppingCart,label: 'Punto de Venta',  path: '/pos',       permiso: 'pos' },
    { icon: Package,     label: 'Productos',        path: '/productos', permiso: 'productos_ver' },
    { icon: Users,       label: 'Clientes',         path: '/clientes',  permiso: 'clientes' },
    { icon: DollarSign,  label: 'Ventas',           path: '/ventas',    permiso: 'ventas_ver' },
    { icon: DollarSign,  label: 'Abonos',           path: '/abonos',    permiso: 'abonos' },
    { icon: BarChart3,   label: 'Reportes',         path: '/reportes',  permiso: 'reportes' },
    { icon: UserCog,     label: 'Usuarios',         path: '/usuarios',  permiso: 'usuarios' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">🚀 Sistema POS</h1>
        <p className="text-sm text-gray-400 mt-1">Punto de Venta</p>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        {menuItems
          .filter(item => puedeAcceder(rol, item.permiso))
          .map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="mb-3 px-2">
          <p className="text-sm font-medium text-white">{user?.nombreCompleto}</p>
          <p className="text-xs text-gray-400">{user?.rol}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}