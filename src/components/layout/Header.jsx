import { User } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

export default function Header() {
  const { user } = useAuthStore()

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

        <div className="flex items-center gap-2 text-gray-600">
          <User size={20} />
          <span className="text-sm font-medium">{user?.rol}</span>
        </div>
      </div>
    </header>
  )
}