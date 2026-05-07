import { useState } from 'react'
import { ShoppingCart, Eye, Calendar, DollarSign } from 'lucide-react'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import VentaDetalles from '../components/ventas/VentaDetalles'
import { useVentas } from '../hooks/useVentas'

export default function Ventas() {
  const { ventas, loading } = useVentas()
  const [selectedVenta, setSelectedVenta] = useState(null)
  const [filtroFecha, setFiltroFecha] = useState('')

  const ventasFiltradas = ventas.filter(v => {
    if (!filtroFecha) return true

    // Validar que exista la fecha
    if (!v.creadoEn) return false

    const fecha = new Date(v.creadoEn)

    // Validar fecha válida
    if (isNaN(fecha.getTime())) {
      console.error('Fecha inválida:', v.creadoEn, v)
      return false
    }

    const fechaVenta = fecha.toISOString().split('T')[0]

    return fechaVenta === filtroFecha
  })

  const columns = [
    {
      key: 'numeroVenta',
      label: 'Número',
      render: (value) => `#${value}`
    },
    {
  key: 'fecha',
  label: 'Fecha',
  render: (value, row) => {
    
    if (!value) return 'Sin fecha'

    const fecha = new Date(value)
    if (isNaN(fecha.getTime())) return 'Fecha inválida'

    return fecha.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
},
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (value) => value || 'Cliente General'
    },
    {
      key: 'tipoVenta',
      label: 'Tipo',
      render: (value) => (
        <Badge variant={value === 'CONTADO' ? 'success' : 'info'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'metodoPago',
      label: 'Método',
      render: (value) => value || 'No definido'
    },
    {
      key: 'total',
      label: 'Total',
      render: (value) => (
        <span className="font-bold text-green-600">
          ${(value || 0).toLocaleString()}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <button
          onClick={() => setSelectedVenta(row)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          <Eye size={18} />
        </button>
      )
    }
  ]

  const totalVentas = ventasFiltradas.reduce(
    (sum, v) => sum + (v.total || 0),
    0
  )

  const ventasContado = ventasFiltradas.filter(
    v => v.tipoVenta === 'CONTADO'
  ).length

  const ventasCredito = ventasFiltradas.filter(
    v => v.tipoVenta === 'CREDITO'
  ).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ShoppingCart
            className="animate-pulse mx-auto mb-4 text-blue-600"
            size={48}
          />
          <p className="text-gray-600">Cargando ventas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Historial de Ventas
          </h1>

          <p className="text-gray-600 mt-1">
            {ventasFiltradas.length} ventas registradas
          </p>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Total Ventas
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {ventasFiltradas.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Total Vendido
              </p>

              <p className="text-2xl font-bold text-gray-800">
                ${totalVentas.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="text-purple-600" size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Contado
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {ventasContado}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="text-orange-600" size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Crédito
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {ventasCredito}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtro por Fecha */}
      <Card>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Filtrar por fecha:
          </label>

          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {filtroFecha && (
            <button
              onClick={() => setFiltroFecha('')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </Card>

      {/* Tabla */}
      <Card>
        <Table
          columns={columns}
          data={ventasFiltradas}
        />
      </Card>

      {/* Modal de detalles */}
      {selectedVenta && (
        <VentaDetalles
          venta={selectedVenta}
          onClose={() => setSelectedVenta(null)}
        />
      )}
    </div>
  )
}