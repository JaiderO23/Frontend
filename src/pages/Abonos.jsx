import { useState, useEffect } from 'react'
import { DollarSign, Users, TrendingUp, Loader, Plus, History } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { clientesService, abonosService } from '../services'
import { useAuthStore } from '../store/useAuthStore'
import toast from 'react-hot-toast'

export default function Abonos() {
  const [clientes, setClientes] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [abonos, setAbonos] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRegistrarModal, setShowRegistrarModal] = useState(false)
  const [showHistorialModal, setShowHistorialModal] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const { user } = useAuthStore()
  
  const [formData, setFormData] = useState({
    monto: '',
    metodoPago: 'EFECTIVO',
    observaciones: ''
  })
  
  useEffect(() => {
    cargarDatos()
  }, [])
  
  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [clientesRes, estadisticasRes] = await Promise.all([
        clientesService.getAll(),
        abonosService.getEstadisticasHoy()
      ])
      
      // Filtrar solo clientes con deuda
      const clientesConDeuda = clientesRes.data.filter(c => c.saldoDeuda > 0)
      setClientes(clientesConDeuda)
      setEstadisticas(estadisticasRes.data)
    } catch (error) {
      toast.error('Error al cargar los datos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleOpenRegistrar = (cliente) => {
    setClienteSeleccionado(cliente)
    setFormData({
      monto: '',
      metodoPago: 'EFECTIVO',
      observaciones: ''
    })
    setShowRegistrarModal(true)
  }
  
  const handleOpenHistorial = async (cliente) => {
    try {
      setClienteSeleccionado(cliente)
      const response = await abonosService.getByCliente(cliente.id)
      setAbonos(response.data)
      setShowHistorialModal(true)
    } catch (error) {
      toast.error('Error al cargar el historial')
      console.error(error)
    }
  }
  
  const handleRegistrarAbono = async (e) => {
    e.preventDefault()
    
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      toast.error('Ingresa un monto válido')
      return
    }
    
    if (parseFloat(formData.monto) > clienteSeleccionado.saldoDeuda) {
      toast.error('El monto no puede ser mayor a la deuda')
      return
    }
    
    try {
      setProcesando(true)
      
      const abonoData = {
        clienteId: clienteSeleccionado.id,
        usuarioId: user.id,
        monto: parseFloat(formData.monto),
        metodoPago: formData.metodoPago,
        observaciones: formData.observaciones || null
      }
      
      await abonosService.create(abonoData)
      
      toast.success('Abono registrado exitosamente')
      setShowRegistrarModal(false)
      await cargarDatos()
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar el abono')
      console.error(error)
    } finally {
      setProcesando(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600">Cargando abonos...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Abonos</h1>
        <p className="text-gray-600 mt-1">Registra pagos parciales de deudas</p>
      </div>
      
      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Abonos Hoy</p>
                <p className="text-2xl font-bold text-gray-800">
                  {estadisticas.cantidadAbonos}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <History className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Recaudado</p>
                <p className="text-2xl font-bold text-green-600">
                  ${estadisticas.totalRecaudado?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes con Deuda</p>
                <p className="text-2xl font-bold text-orange-600">
                  {clientes.length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="text-orange-600" size={24} />
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {/* Lista de Clientes con Deuda */}
      <Card title="Clientes con Deuda Pendiente">
        {clientes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay clientes con deuda pendiente</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Deuda Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Crédito Disponible
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {cliente.nombre} {cliente.apellido}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.numeroDocumento || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-red-600">
                        ${cliente.saldoDeuda?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        ${cliente.creditoDisponible?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleOpenRegistrar(cliente)}
                          className="flex items-center gap-1"
                        >
                          <Plus size={16} />
                          Registrar Abono
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenHistorial(cliente)}
                          className="flex items-center gap-1"
                        >
                          <History size={16} />
                          Historial
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Modal Registrar Abono */}
      <Modal
        isOpen={showRegistrarModal}
        onClose={() => setShowRegistrarModal(false)}
        title="Registrar Abono"
      >
        {clienteSeleccionado && (
          <form onSubmit={handleRegistrarAbono} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cliente</p>
              <p className="font-semibold text-gray-900">
                {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
              </p>
              <p className="text-sm text-red-600 mt-1">
                Deuda actual: ${clienteSeleccionado.saldoDeuda?.toLocaleString()}
              </p>
            </div>
            
            <Input
              label="Monto del Abono"
              type="number"
              step="0.01"
              min="0.01"
              max={clienteSeleccionado.saldoDeuda}
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              required
              placeholder="0.00"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <select
                value={formData.metodoPago}
                onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones (Opcional)
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notas adicionales..."
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowRegistrarModal(false)}
                className="flex-1"
                disabled={procesando}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={procesando}
              >
                {procesando ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
                    Procesando...
                  </>
                ) : (
                  'Registrar Abono'
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>
      
      {/* Modal Historial */}
      <Modal
        isOpen={showHistorialModal}
        onClose={() => setShowHistorialModal(false)}
        title="Historial de Abonos"
        size="lg"
      >
        {clienteSeleccionado && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cliente</p>
              <p className="font-semibold text-gray-900">
                {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
              </p>
            </div>
            
            {abonos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No hay abonos registrados</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {abonos.map((abono) => (
                  <div key={abono.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          ${abono.monto?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(abono.fecha).toLocaleString('es-CO', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {abono.metodoPago}
                      </span>
                    </div>
                    {abono.observaciones && (
                      <p className="text-sm text-gray-600 mt-2">
                        {abono.observaciones}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}