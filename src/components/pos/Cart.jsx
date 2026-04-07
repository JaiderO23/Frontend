import { ShoppingCart } from 'lucide-react'
import Card from '../ui/Card'
import CartItem from './CartItem'

export default function Cart({ items, onUpdateQuantity, onRemove, total }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart size={24} className="text-blue-600" />
        <h3 className="text-lg font-semibold">
          Carrito ({items.length})
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <p>El carrito está vacío</p>
            <p className="text-sm mt-1">Busca productos para agregar</p>
          </div>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.producto.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
      
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-lg">
          <span className="font-medium">Subtotal:</span>
          <span className="font-bold">${total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-medium">Descuento:</span>
          <span>$0</span>
        </div>
        <div className="flex justify-between text-2xl border-t pt-2">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-blue-600">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  )
}