import { LogOut, User } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

export default function Header() {
  const { user, logout } = useAuthStore()
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Bienvenido, {user?.nombreCompleto}
          </h2>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('es-CO', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={20} />
            <span className="text-sm font-medium">{user?.rol}</span>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}