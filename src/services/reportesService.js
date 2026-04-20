import api from './api'

export const reportesService = {
  dashboard: () => api.get('/reportes/dashboard'),
  
  productosMasVendidos: (limite = 10) => 
    api.get(`/reportes/productos/mas-vendidos?limite=${limite}`),
  
  ventasPorDia: (dias = 7) => 
    api.get(`/reportes/ventas/por-dia?dias=${dias}`),
  
  ventasPorMes: (meses = 6) => 
    api.get(`/reportes/ventas/por-mes?meses=${meses}`),
  
  clientesConDeuda: () => 
    api.get('/reportes/clientes/con-deuda'),
  
  ventasPorMetodoPago: () => 
    api.get('/reportes/ventas/por-metodo-pago'),
  
  productosStockBajo: () => 
    api.get('/reportes/productos/stock-bajo'),
  
  ventasPorUsuario: (inicio, fin) => 
    api.get(`/reportes/ventas/por-usuario?inicio=${inicio}&fin=${fin}`),

  ventasPorMetodoPagoEnRango: (inicio, fin) =>
    api.get(`/reportes/ventas/por-metodo-pago?inicio=${inicio}&fin=${fin}`),
}