import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        // mantenemos también las claves planas para que api.js siga funcionando
        localStorage.setItem('token', token)
        localStorage.setItem('usuario', JSON.stringify(userData))
        set({ user: userData, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'posbarrio-auth', // clave bajo la cual se guarda en localStorage
    }
  )
)