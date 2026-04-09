import { ShoppingCart } from 'lucide-react'
import CartItem from './CartItem'

export default function Cart({ items, onUpdateQuantity, onRemove, total }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col" style={{ height: '75vh' }}>
      {/* Header fijo */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart size={24} className="text-blue-600" />
          <h3 className="text-lg font-semibold">
            Carrito ({items.length})
          </h3>
        </div>
      </div>
      
      {/* Lista de productos CON SCROLL */}
      <div className="flex-1 p-4 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <p>El carrito está vacío</p>
            <p className="text-sm mt-1">Busca productos para agregar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem
                key={item.producto.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer FIJO - Siempre visible */}
      <div className="border-t p-4 bg-white flex-shrink-0">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">${total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Descuento:</span>
            <span className="font-semibold">$0</span>
          </div>
          <div className="flex justify-between text-xl border-t pt-2 mt-2">
            <span className="font-bold text-gray-800">Total:</span>
            <span className="font-bold text-blue-600">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}