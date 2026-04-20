import api from './api'

export const productosService = {
 
  getAll: () => api.get('/productos'),
  getById: (id) => api.get(`/productos/${id}`),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
  search: (query) => api.get(`/productos/buscar?q=${query}`),
  stockBajo: () => api.get('/productos/stock-bajo'),
  getActivos: () => api.get('/productos/activos'),
getStockBajo: () => api.get('/productos/stock-bajo'),
}