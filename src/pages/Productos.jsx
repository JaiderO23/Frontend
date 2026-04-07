import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import ProductoForm from '../components/productos/ProductoForm'
import { useProductos } from '../hooks/useProductos'
import { useCategorias } from '../hooks/useCategorias'

export default function Productos() {
  const { productos, loading, saving, createProducto, updateProducto, deleteProducto } = useProductos()
  const { categorias } = useCategorias()
  
  const [showModal, setShowModal] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigoBarras?.includes(searchTerm)
  )
  
  const handleCreate = () => {
    setSelectedProducto(null)
    setShowModal(true)
  }
  
  const handleEdit = (producto) => {
    setSelectedProducto(producto)
    setShowModal(true)
  }
  
  const handleDelete = async (producto) => {
    if (window.confirm(`¿Eliminar producto "${producto.nombre}"?`)) {
      await deleteProducto(producto.id)
    }
  }
  
  const handleSubmit = async (data) => {
    let success
    if (selectedProducto) {
      success = await updateProducto(selectedProducto.id, data)
    } else {
      success = await createProducto(data)
    }
    
    if (success) {
      setShowModal(false)
    }
  }
  
  const columns = [
    {
      key: 'codigoBarras',
      label: 'Código',
      render: (value) => value || '-'
    },
    {
      key: 'nombre',
      label: 'Producto'
    },
    {
      key: 'categoria',
      label: 'Categoría',
      render: (value) => value?.nombre || '-'
    },
    {
      key: 'precioVenta',
      label: 'Precio',
      render: (value) => `$${value.toLocaleString()}`
    },
    {
      key: 'stockActual',
      label: 'Stock',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className={value <= row.stockMinimo ? 'text-red-600 font-semibold' : ''}>
            {value}
          </span>
          {value <= row.stockMinimo && (
            <AlertTriangle size={16} className="text-red-600" />
          )}
        </div>
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
  
  const productosStockBajo = productos.filter(p => p.stockActual <= p.stockMinimo)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Package className="animate-pulse mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
          <p className="text-gray-600 mt-1">
            {productos.length} productos registrados
          </p>
        </div>
        
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Producto
        </Button>
      </div>
      
      {/* Alerta de Stock Bajo */}
      {productosStockBajo.length > 0 && (
        <Card className="bg-yellow-50 border border-yellow-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-600" size={24} />
            <div>
              <p className="font-medium text-yellow-800">
                {productosStockBajo.length} productos con stock bajo
              </p>
              <p className="text-sm text-yellow-600">
                Revisa el inventario para evitar faltantes
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Búsqueda */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o código de barras..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>
      
      {/* Tabla */}
      <Card>
        <Table
          columns={columns}
          data={filteredProductos}
        />
      </Card>
      
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <ProductoForm
          producto={selectedProducto}
          categorias={categorias}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={saving}
        />
      </Modal>
    </div>
  )
}