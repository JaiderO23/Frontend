import Select from '../ui/Select'
import Badge from '../ui/Badge'

export default function VentaConfig({ tipoVenta, metodoPago, onChangeTipo, onChangeMetodo }) {
  const tipoOptions = [
    { value: 'CONTADO', label: 'Venta de Contado' },
    { value: 'CREDITO', label: 'Venta a Crédito' }
  ]
  
  const metodoOptions = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' }
  ]
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <Select
        label="Tipo de Venta"
        value={tipoVenta}
        onChange={(e) => onChangeTipo(e.target.value)}
        options={tipoOptions}
      />
      
      {tipoVenta === 'CONTADO' ? (
        <Select
          label="Método de Pago"
          value={metodoPago}
          onChange={(e) => onChangeMetodo(e.target.value)}
          options={metodoOptions}
        />
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Método de Pago
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
            Se pagará después (a crédito)
          </div>
        </div>
      )}
    </div>
  )
}