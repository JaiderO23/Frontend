import { User, Search } from 'lucide-react'
import { useState } from 'react'
import Select from '../ui/Select'
import Badge from '../ui/Badge'

export default function ClienteSelector({ clientes, selectedCliente, onSelectCliente, tipoVenta }) {
  if (tipoVenta === 'CONTADO') {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 text-gray-600">
          <User size={20} />
          <span className="font-medium">Venta de Contado</span>
          <Badge variant="info">No requiere cliente</Badge>
        </div>
      </div>
    )
  }
  
  const clienteOptions = clientes.map(c => ({
    value: c.id,
    label: `${c.nombre} ${c.apellido} - Crédito disponible: $${c.creditoDisponible.toLocaleString()}`
  }))
  
  return (
    <div className="space-y-3">
      <Select
        label="Cliente"
        value={selectedCliente?.id || ''}
        onChange={(e) => {
          const cliente = clientes.find(c => c.id === parseInt(e.target.value))
          onSelectCliente(cliente)
        }}
        options={clienteOptions}
        placeholder="Selecciona un cliente..."
        required
      />
      
      {selectedCliente && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Cliente:</p>
              <p className="font-semibold">{selectedCliente.nombre} {selectedCliente.apellido}</p>
            </div>
            <div>
              <p className="text-gray-600">Límite de crédito:</p>
              <p className="font-semibold">${selectedCliente.limiteCredito.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Deuda actual:</p>
              <p className="font-semibold text-red-600">${selectedCliente.saldoDeuda.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Crédito disponible:</p>
              <p className="font-semibold text-green-600">${selectedCliente.creditoDisponible.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}