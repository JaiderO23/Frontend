import { useState } from 'react'
import { ShoppingCart, CreditCard, Loader } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProductSearch from '../components/pos/ProductSearch'
import Cart from '../components/pos/Cart'
import ClienteSelector from '../components/pos/ClienteSelector'
import VentaConfig from '../components/pos/VentaConfig'
import Modal from '../components/ui/Modal'
import { usePOS } from '../hooks/usePOS'

export default function POS() {
  const {
    productos,
    clientes,
    loading,
    processingVenta,
    items,
    cliente,
    tipoVenta,
    metodoPago,
    total,
    addItem,
    removeItem,
    updateQuantity,
    setCliente,
    setTipoVenta,
    setMetodoPago,
    procesarVenta
  } = usePOS()
  
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  
  const handleProcesarVenta = async () => {
    const venta = await procesarVenta()
    if (venta) {
      setShowConfirmModal(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600">Cargando punto de venta...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Punto de Venta</h1>
          <p className="text-gray-600 mt-1">Registra una nueva venta</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-blue-600">
              ${total.toLocaleString()}
            </p>
          </div>
          
          <Button
            size="lg"
            onClick={() => setShowConfirmModal(true)}
            disabled={items.length === 0 || processingVenta}
            className="flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            Procesar Venta
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Columna Izquierda - Búsqueda de Productos */}
        <div className="col-span-2 flex flex-col">
          <Card title="Productos" className="flex-1 flex flex-col">
            <ProductSearch
              productos={productos}
              onAddToCart={addItem}
            />
          </Card>
        </div>
        
        {/* Columna Derecha - Carrito */}
        <div className="flex flex-col space-y-4">
          <Cart
            items={items}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
            total={total}
          />
        </div>
      </div>
      
      {/* Modal de Confirmación */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar Venta"
        size="lg"
      >
        <div className="space-y-6">
          {/* Configuración de Venta */}
          <VentaConfig
            tipoVenta={tipoVenta}
            metodoPago={metodoPago}
            onChangeTipo={setTipoVenta}
            onChangeMetodo={setMetodoPago}
          />
          
          {/* Selector de Cliente */}
          <ClienteSelector
            clientes={clientes}
            selectedCliente={cliente}
            onSelectCliente={setCliente}
            tipoVenta={tipoVenta}
          />
          
          {/* Resumen */}
          <Card title="Resumen de la Venta">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Productos:</span>
                <span className="font-medium">{items.length} items</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tipo de venta:</span>
                <span className="font-medium">{tipoVenta}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Método de pago:</span>
                <span className="font-medium">{metodoPago}</span>
              </div>
              
              {cliente && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{cliente.nombre} {cliente.apellido}</span>
                </div>
              )}
              
              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-blue-600">
                  ${total.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
          
          {/* Botones */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1"
              disabled={processingVenta}
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleProcesarVenta}
              className="flex-1 flex items-center justify-center gap-2"
              disabled={processingVenta}
            >
              {processingVenta ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Confirmar Venta
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}