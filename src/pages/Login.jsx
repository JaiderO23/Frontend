import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import api from '../services/api'
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [form, setForm] = useState({ nombreUsuario: '', contraseña: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', form)
      const { token, id, nombreUsuario, nombreCompleto, rol } = response.data

      login({ id, nombreUsuario, nombreCompleto, rol }, token)
      navigate('/')
    } catch (err) {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Burbujas decorativas de fondo */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-300/20 rounded-full blur-2xl"></div>

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/posbarrio_mini.svg"
            alt="PosBarrio"
            className="w-24 h-24 drop-shadow-lg"
          />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">
          PosBarrio
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Inicia sesión para continuar
        </p>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center gap-2">

            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuario */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={form.nombreUsuario}
                onChange={(e) => setForm({ ...form, nombreUsuario: e.target.value })}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.contraseña}
                onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Botón iniciar sesión */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Iniciar sesión
              </>
            )}
          </button>
        </form>

        
      </div>
    </div>
  )
}