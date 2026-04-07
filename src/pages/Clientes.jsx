import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Users, AlertCircle, DollarSign } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import ClienteForm from '../components/clientes/ClienteForm'
import { useClientes } from '../hooks/useClientes'
import ConfirmModal from '../components/ui/ConfirmModal'

export default function Clientes() {
  const { clientes, loading, saving, createCliente, updateCliente, deleteCliente } = useClientes()
  
  const [showModal, setShowModal] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState(null)
  
 const filteredClientes = clientes.filter(c =>
  c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  c.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  c.numeroDocumento?.includes(searchTerm)
)
  
  const handleCreate = () => {
    setSelectedCliente(null)
    setShowModal(true)
  }
  
  const handleEdit = (cliente) => {
    setSelectedCliente(cliente)
    setShowModal(true)
  }
  
  const handleDelete = (cliente) => {
  setClienteToDelete(cliente)
  setShowDeleteConfirm(true)
}

const confirmDelete = async () => {
  if (clienteToDelete) {
    await deleteCliente(clienteToDelete.id)
    setClienteToDelete(null)
  }
}
  
  const handleSubmit = async (data) => {
    let success
    if (selectedCliente) {
      success = await updateCliente(selectedCliente.id, data)
    } else {
      success = await createCliente(data)
    }
    
    if (success) {
      setShowModal(false)
    }
  }
  
  const columns = [
    {
      key: 'numeroDocumento',
      label: 'Documento'
    },
    {
      key: 'nombre',
      label: 'Cliente',
      render: (_, row) => `${row.nombre} ${row.apellido}`
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      render: (value) => value || '-'
    },
    {
      key: 'limiteCredito',
      label: 'Límite Crédito',
      render: (value) => `$${value.toLocaleString()}`
    },
    {
      key: 'saldoDeuda',
      label: 'Deuda',
      render: (value) => (
        <span className={value > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
          ${value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'creditoDisponible',
      label: 'Crédito Disponible',
      render: (value) => (
        <span className="text-green-600 font-semibold">
          ${value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (value) => (
        <Badge variant={value ? 'success' : 'danger'}>
          {value ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ]
  
  const clientesConDeuda = clientes.filter(c => c.saldoDeuda > 0)
  const totalDeuda = clientesConDeuda.reduce((sum, c) => sum + c.saldoDeuda, 0)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Users className="animate-pulse mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-600 mt-1">
            {clientes.length} clientes registrados
          </p>
        </div>
        
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Cliente
        </Button>
      </div>
      
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-800">{clientes.length}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Clientes con Deuda</p>
              <p className="text-2xl font-bold text-gray-800">{clientesConDeuda.length}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Deuda</p>
              <p className="text-2xl font-bold text-gray-800">
                ${totalDeuda.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Búsqueda */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, apellido o documento..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>
      
      {/* Tabla */}
      <Card>
        <Table
          columns={columns}
          data={filteredClientes}
        />
      </Card>
      
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        size="lg"
      >
        <ClienteForm
          cliente={selectedCliente}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={saving}
        />
      </Modal>

       <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar Cliente"
        message={`¿Estás seguro de eliminar al cliente "${clienteToDelete?.nombre} ${clienteToDelete?.apellido}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  )
}