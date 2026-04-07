import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  cliente: null,
  tipoVenta: 'CONTADO',
  metodoPago: 'EFECTIVO',
  
  addItem: (producto, cantidad = 1) => {
    const items = get().items
    const existingItem = items.find(item => item.producto.id === producto.id)
    
    if (existingItem) {
      set({
        items: items.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      })
    } else {
      set({
        items: [...items, { producto, cantidad }]
      })
    }
  },
  
  removeItem: (productoId) => {
    set({
      items: get().items.filter(item => item.producto.id !== productoId)
    })
  },
  
  updateQuantity: (productoId, cantidad) => {
    set({
      items: get().items.map(item =>
        item.producto.id === productoId
          ? { ...item, cantidad }
          : item
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