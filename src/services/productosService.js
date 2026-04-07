import api from './api'

export const productosService = {
  // Obtener todos los productos
  getAll: () => api.get('/productos'),
  
  // Obtener producto por ID
  getById: (id) => api.get(`/productos/${id}`),
  
  // Crear producto
  create: (data) => api.post('/productos', data),
  
  // Actualizar producto
  update: (id, data) => api.put(`/productos/${id}`, data),
  
  // Eliminar producto
  delete: (id) => api.delete(`/productos/${id}`),
  
  // Buscar por nombre o código
  search: (query) => api.get(`/productos/buscar?q=${query}`),
  
  // Productos con stock bajo
  stockBajo: () => api.get('/productos/stock-bajo'),
}