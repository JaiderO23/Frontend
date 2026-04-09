import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  cliente: null,
  tipoVenta: 'CONTADO',
  metodoPago: 'EFECTIVO',
  
  addItem: (producto) => {
  const existingItem = get().items.find(item => item.producto.id === producto.id)
  
  if (existingItem) {
    // Si ya existe, incrementar cantidad (validando stock)
    if (existingItem.cantidad < producto.stockActual) {
      set({
        items: get().items.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      })
    } else {
      // Stock insuficiente - podrías agregar una notificación aquí
      console.warn(`Stock insuficiente. Disponible: ${producto.stockActual}`)
    }
  } else {
    // Si no existe, agregarlo con cantidad 1
    if (producto.stockActual > 0) {
      set({
        items: [...get().items, { producto, cantidad: 1 }]
      })
    }
  }
},
  
  removeItem: (productoId) => {
    set({
      items: get().items.filter(item => item.producto.id !== productoId)
    })
  },
  
  updateQuantity: (productoId, newQuantity) => {
  const item = get().items.find(i => i.producto.id === productoId)
  
  if (!item) return
  
  // Validar stock disponible
  if (newQuantity > item.producto.stockActual) {
    newQuantity = item.producto.stockActual
  }
  
  // Validar cantidad mínima
  if (newQuantity < 1) {
    newQuantity = 1
  }
  
  set({
    items: get().items.map(i =>
      i.producto.id === productoId
        ? { ...i, cantidad: newQuantity }
        : i
    )
  })
},
  setCliente: (cliente) => set({ cliente }),
  setTipoVenta: (tipo) => set({ tipoVenta: tipo }),
  setMetodoPago: (metodo) => set({ metodoPago: metodo }),
  
  clearCart: () => set({
    items: [],
    cliente: null,
    tipoVenta: 'CONTADO',
    metodoPago: 'EFECTIVO'
  }),
  
  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + (item.producto.precioVenta * item.cantidad),
      0
    )
  },
}))