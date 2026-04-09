import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Button from '../ui/Button'

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { producto, cantidad } = item
  const subtotal = producto.precioVenta * cantidad
  
  const [editingQuantity, setEditingQuantity] = useState(false)
  const [inputValue, setInputValue] = useState(cantidad.toString())
  
  const handleQuantityClick = () => {
    setEditingQuantity(true)
    setInputValue(cantidad.toString())
  }
  
  const handleQuantityChange = (e) => {
    const value = e.target.value
    // Solo permitir números
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value)
    }
  }
  
  const handleQuantityBlur = () => {
    let newQuantity = parseInt(inputValue) || 1
    
    // Validar cantidad mínima
    if (newQuantity < 1) {
      newQuantity = 1
    }
    
    // Validar stock disponible
    if (newQuantity > producto.stockActual) {
      newQuantity = producto.stockActual
    }
    
    onUpdateQuantity(producto.id, newQuantity)
    setEditingQuantity(false)
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuantityBlur()
    }
  }
  
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{producto.nombre}</h4>
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
        
        {editingQuantity ? (
          <input
            type="text"
            value={inputValue}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
            onKeyPress={handleKeyPress}
            className="w-16 text-center font-medium border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span
            onClick={handleQuantityClick}
            className="w-16 text-center font-medium cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
            title="Haz clic para editar la cantidad"
          >
            {cantidad}
          </span>
        )}
        
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