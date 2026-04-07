import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function ProductSearch({ productos, onAddToCart }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredProducts = productos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigoBarras?.includes(searchTerm)
  )
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o código de barras..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
      
      <div className="max-h-[500px] overflow-y-auto space-y-2">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {searchTerm ? 'No se encontraron productos' : 'Busca un producto para empezar'}
          </p>
        ) : (
          filteredProducts.map((producto) => (
            <div
              key={producto.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{producto.nombre}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500">
                    Stock: {producto.stockActual}
                  </span>
                  {producto.codigoBarras && (
                    <span className="text-xs text-gray-400">
                      {producto.codigoBarras}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ${producto.precioVenta.toLocaleString()}
                  </p>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => onAddToCart(producto)}
                  disabled={producto.stockActual === 0}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Agregar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}