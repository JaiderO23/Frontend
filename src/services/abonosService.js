import api from './api'

export const abonosService = {
  getAll: () => api.get('/abonos'),
  
  getById: (id) => api.get(`/abonos/${id}`),
  
  create: (data) => api.post('/abonos', data),
  
  porCliente: (clienteId) => api.get(`/abonos/cliente/${clienteId}`),
  
  porVenta: (ventaId) => api.get(`/abonos/venta/${ventaId}`),
  
  saldoVenta: (ventaId) => api.get(`/abonos/venta/${ventaId}/saldo`),
  
  hoy: () => api.get('/abonos/hoy'),
  
  estadisticas: () => api.get('/abonos/estadisticas/hoy'),
}