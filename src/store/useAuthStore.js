import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: {
    id: 1,
    nombreUsuario: 'admin',
    nombreCompleto: 'Administrador Sistema',
    rol: 'ADMIN'
  },
  isAuthenticated: true,
  
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))