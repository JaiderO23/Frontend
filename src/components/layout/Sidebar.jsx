import { Home, Package, Users, ShoppingCart, DollarSign, BarChart3 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'Punto de Venta', path: '/pos' },
    { icon: Package, label: 'Productos', path: '/productos' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: DollarSign, label: 'Ventas', path: '/ventas' },
    { icon: DollarSign, label: 'Abonos', path: '/abonos' },
    { icon: BarChart3, label: 'Reportes', path: '/reportes' },
  ]
  
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">🚀 Sistema POS</h1>
        <p className="text-sm text-gray-400 mt-1">Punto de Venta</p>
      </div>
      
      {/* Menu */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
                }
              `}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}