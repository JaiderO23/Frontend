import { useState, useEffect } from 'react'
import { productosService, clientesService, ventasService } from '../services'
import { useCartStore } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'
import toast from 'react-hot-toast'

export function usePOS() {
  const [productos, setProductos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingVenta, setProcessingVenta] = useState(false)
  
  const {
    items,
    cliente,
    tipoVenta,
    metodoPago,
    addItem: addItemStore,
    removeItem,
    updateQuantity: updateQuantityStore,
    setCliente,
    setTipoVenta,
    setMetodoPago,
    clearCart,
    getTotal
  } = useCartStore()
  
  const { user } = useAuthStore()
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setLoading(true)
      const [productosRes, clientesRes] = await Promise.all([
  productosService.getActivos(),
  clientesService.getActivos()
])
      setProductos(productosRes.data)
      setClientes(clientesRes.data)
    } catch (error) {
      toast.error('Error al cargar los datos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  const addItem = (producto) => {
    const existingItem = items.find(item => item.producto.id === producto.id)
    
    if (existingItem) {
      if (existingItem.cantidad >= producto.stockActual) {
        toast.error(`Stock insuficiente. Disponible: ${producto.stockActual}`)
        return
      }
    } else {
      if (producto.stockActual <= 0) {
        toast.error('Producto sin stock')
        return
      }
    }
    
    addItemStore(producto)
  }
  
  const updateQuantity = (productoId, newQuantity) => {
    const item = items.find(i => i.producto.id === productoId)
    if (!item) return
    
    if (newQuantity > item.producto.stockActual) {
      toast.error(`Stock insuficiente. Disponible: ${item.producto.stockActual}`)
      return
    }
    
    if (newQuantity < 1) return
    
    updateQuantityStore(productoId, newQuantity)
  }
  
  const procesarVenta = async () => {
    if (items.length === 0) {
      toast.error('El carrito esta vacio')
      return
    }
    
    if (tipoVenta === 'CREDITO' && !cliente) {
      toast.error('Selecciona un cliente para venta a credito')
      return
    }
    
    if (tipoVenta === 'CREDITO' && cliente.creditoDisponible < getTotal()) {
      toast.error('El cliente no tiene suficiente credito disponible')
      return
    }
    
    try {
      setProcessingVenta(true)
      
      const ventaData = {
        clienteId: tipoVenta === 'CREDITO' ? cliente.id : null,
        usuarioId: user.id,
        tipoVenta,
        metodoPago: tipoVenta === 'CONTADO' ? metodoPago : 'EFECTIVO',
        detalles: items.map(item => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precioVenta
        }))
      }
      
      const response = await ventasService.create(ventaData)
      
      toast.success(`Venta ${response.data.numeroVenta} creada exitosamente`)
      clearCart()
      await loadData()
      
      return response.data
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar la venta')
      console.error(error)
    } finally {
      setProcessingVenta(false)
    }
  }
  
  return {
    productos,
    clientes,
    loading,
    processingVenta,
    items,
    cliente,
    tipoVenta,
    metodoPago,
    total: getTotal(),
    addItem,
    removeItem,
    updateQuantity,
    setCliente,
    setTipoVenta,
    setMetodoPago,
    procesarVenta
  }
}