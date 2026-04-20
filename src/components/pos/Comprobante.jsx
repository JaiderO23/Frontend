import { useState } from 'react'
import { Printer, MessageCircle, X, Check } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'

const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)

export default function Comprobante({ isOpen, onClose, venta }) {
  const [telefonoManual, setTelefonoManual] = useState('')

  if (!venta) return null

  const tieneCliente = !!venta.cliente
  const telefonoCliente = venta.cliente?.telefono

  const handleImprimir = () => {
    window.print()
  }

  const handleWhatsApp = () => {
    const telefono = tieneCliente ? telefonoCliente : telefonoManual

    if (!telefono || telefono.trim() === '') {
      alert('Ingresa un número de WhatsApp para enviar el comprobante')
      return
    }

    const mensaje = generarMensaje(venta)
    const telefonoLimpio = telefono.replace(/\D/g, '')
    const url = `https://wa.me/57${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  const generarMensaje = (venta) => {
    const fecha = new Date(venta.fecha).toLocaleString('es-CO')
    let msg = `*COMPROBANTE DE VENTA*\n`
    msg += `*${venta.numeroVenta}*\n`
    msg += `Fecha: ${fecha}\n\n`
    msg += `*PRODUCTOS:*\n`
    venta.detalles?.forEach(d => {
      msg += `• ${d.producto.nombre} x${d.cantidad} = ${formatCurrency(d.subtotal)}\n`
    })
    msg += `\n*Subtotal:* ${formatCurrency(venta.subtotal)}`
    if (venta.descuento > 0) {
      msg += `\n*Descuento:* - ${formatCurrency(venta.descuento)}`
    }
    msg += `\n*TOTAL: ${formatCurrency(venta.total)}*`
    msg += `\n\nGracias por su compra`
    return msg
  }

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #comprobante, #comprobante * { visibility: visible; }
          #comprobante { 
            position: fixed; top: 0; left: 0;
            width: 80mm; font-size: 12px;
          }
        }
      `}</style>

      <Modal isOpen={isOpen} onClose={onClose} title="Venta Exitosa" size="md">
        <div className="space-y-4">

          {/* Icono de éxito */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="text-green-600" size={32} />
            </div>
          </div>

          {/* Comprobante */}
          <div id="comprobante" className="border rounded-lg p-4 bg-gray-50 font-mono text-sm">
            <div className="text-center mb-3">
              <p className="font-bold text-lg">COMPROBANTE DE VENTA</p>
              <p className="font-bold text-blue-600">{venta.numeroVenta}</p>
              <p className="text-gray-500 text-xs">
                {new Date(venta.fecha).toLocaleString('es-CO')}
              </p>
            </div>

            {venta.cliente && (
              <div className="mb-3 border-t pt-2">
                <p className="text-gray-600 text-xs">
                  Cliente: <span className="font-medium text-gray-800">
                    {venta.cliente.nombre} {venta.cliente.apellido}
                  </span>
                </p>
                {telefonoCliente && (
                  <p className="text-gray-500 text-xs">Tel: {telefonoCliente}</p>
                )}
              </div>
            )}

            <div className="border-t border-b py-2 mb-2">
              {venta.detalles?.map((detalle, i) => (
                <div key={i} className="flex justify-between text-xs mb-1">
                  <span className="flex-1">{detalle.producto.nombre}</span>
                  <span className="mx-2">x{detalle.cantidad}</span>
                  <span>{formatCurrency(detalle.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(venta.subtotal)}</span>
              </div>
              {venta.descuento > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Descuento:</span>
                  <span>- {formatCurrency(venta.descuento)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm border-t pt-1">
                <span>TOTAL:</span>
                <span>{formatCurrency(venta.total)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Pago:</span>
                <span>{venta.metodoPago} - {venta.tipoVenta}</span>
              </div>
            </div>

            <p className="text-center text-gray-500 text-xs mt-3">
              ¡Gracias por su compra!
            </p>
          </div>

          {/* Input de teléfono si no hay cliente registrado */}
          {!tieneCliente && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 font-medium mb-2">
                ¿Deseas enviar el comprobante por WhatsApp?
              </p>
              <Input
                label="Número de WhatsApp"
                placeholder="Ej: 3001234567"
                value={telefonoManual}
                onChange={(e) => setTelefonoManual(e.target.value)}
                type="tel"
              />
            </div>
          )}

          {/* Si tiene cliente con teléfono, mostrar info */}
          {tieneCliente && telefonoCliente && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                📱 Se enviará al número registrado: <strong>{telefonoCliente}</strong>
              </p>
            </div>
          )}

          {/* Si tiene cliente pero sin teléfono */}
          {tieneCliente && !telefonoCliente && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700 font-medium mb-2">
                El cliente no tiene teléfono registrado
              </p>
              <Input
                label="Número de WhatsApp"
                placeholder="Ej: 3001234567"
                value={telefonoManual}
                onChange={(e) => setTelefonoManual(e.target.value)}
                type="tel"
              />
            </div>
          )}

          {/* Botones de acción */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={handleImprimir}
              className="flex flex-col items-center gap-1 py-3"
            >
              <Printer size={20} />
              <span className="text-xs">Imprimir</span>
            </Button>

            <Button
              variant="success"
              onClick={handleWhatsApp}
              className="flex flex-col items-center gap-1 py-3"
            >
              <MessageCircle size={20} />
              <span className="text-xs">WhatsApp</span>
            </Button>

            <Button
              variant="secondary"
              onClick={onClose}
              className="flex flex-col items-center gap-1 py-3"
            >
              <X size={20} />
              <span className="text-xs">Cerrar</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}