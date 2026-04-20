import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(userData))
    set({ user: userData, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    set({ user: null, token: null, isAuthenticated: false })
  },

  // Restaurar sesión al recargar la página
  restoreSession: () => {
    const token = localStorage.getItem('token')
    const usuario = localStorage.getItem('usuario')
    if (token && usuario) {
      set({
        user: JSON.parse(usuario),
        token,
        isAuthenticated: true
      })
    }
  }
}))