import api from './api'

export const abonosService = {
  // Registrar un nuevo abono
  create: async (abonoData) => {
    return await api.post('/abonos', abonoData)
  },

  // Obtener todos los abonos
  getAll: async () => {
    return await api.get('/abonos')
  },

  // Obtener abono por ID
  getById: async (id) => {
    return await api.get(`/abonos/${id}`)
  },

  // Obtener abonos de un cliente
  getByCliente: async (clienteId) => {
    return await api.get(`/abonos/cliente/${clienteId}`)
  },

  // Obtener abonos de una venta
  getByVenta: async (ventaId) => {
    return await api.get(`/abonos/venta/${ventaId}`)
  },

  // Obtener saldo de una venta
  getSaldoVenta: async (ventaId) => {
    return await api.get(`/abonos/venta/${ventaId}/saldo`)
  },

  // Obtener abonos del día
  getHoy: async () => {
    return await api.get('/abonos/hoy')
  },

  // Obtener estadísticas del día
  getEstadisticasHoy: async () => {
    return await api.get('/abonos/estadisticas/hoy')
  },

  // Cancelar abono
  cancelar: async (id, motivo) => {
    return await api.post(`/abonos/${id}/cancelar`, null, {
      params: { motivo }
    })
  },

  // Eliminar abono
  delete: async (id) => {
    return await api.delete(`/abonos/${id}`)
  }
}