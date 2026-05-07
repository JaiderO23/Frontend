import { X } from 'lucide-react'

export default function VentaDetalles({ venta, onClose }) {
  if (!venta) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Venta #{venta.numeroVenta}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Fecha</p>
              <p className="font-semibold">
                {venta.fecha
                  ? new Date(venta.fecha).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Sin fecha'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Cliente</p>
              <p className="font-semibold">
                {venta.clienteNombre || 'Cliente General'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Tipo de Venta</p>
              <p className="font-semibold">{venta.tipoVenta}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Método de Pago</p>
              <p className="font-semibold">{venta.metodoPago || 'No definido'}</p>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Productos</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Producto</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Cantidad</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Precio Unit.</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(venta.detalles || []).map((detalle, index) => (
                    <tr key={detalle.id || index}>
                      <td className="px-4 py-3 text-sm">
                        {detalle.productoNombre || 'Producto eliminado'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {detalle.cantidad}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        ${(detalle.precioUnitario || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">
                        ${(detalle.subtotal || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${(venta.total || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}