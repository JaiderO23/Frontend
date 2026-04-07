import api from './api'

export const ventasService = {
  getAll: () => api.get('/ventas'),
  
  getById: (id) => api.get(`/ventas/${id}`),
  
  create: (data) => api.post('/ventas', data),
  
  delete: (id) => api.delete(`/ventas/${id}`),
  
  cancelar: (id) => api.post(`/ventas/${id}/cancelar`),
  
  porCliente: (clienteId) => api.get(`/ventas/cliente/${clienteId}`),
  
  hoy: () => api.get('/ventas/hoy'),
  
  estadisticas: () => api.get('/ventas/estadisticas/hoy'),
}