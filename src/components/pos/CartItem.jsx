import { Minus, Plus, Trash2 } from 'lucide-react'
import Button from '../ui/Button'

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { producto, cantidad } = item
  const subtotal = producto.precioVenta * cantidad
  
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{producto.nombre}</h4>
        <p className="text-sm text-gray-500">
          ${producto.precioVenta.toLocaleString()} c/u
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(producto.id, cantidad - 1)}
          disabled={cantidad <= 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus size={16} />
        </button>
        
        <span className="w-12 text-center font-medium">
          {cantidad}
        </span>
        
        <button
          onClick={() => onUpdateQuantity(producto.id, cantidad + 1)}
          disabled={cantidad >= producto.stockActual}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="w-24 text-right">
        <p className="font-bold text-gray-900">
          ${subtotal.toLocaleString()}
        </p>
      </div>
      
      <button
        onClick={() => onRemove(producto.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}