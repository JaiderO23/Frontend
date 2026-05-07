import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Power } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import api from '../services/api'
import toast from 'react-hot-toast'

const ROLES = ['ADMIN', 'PROPIETARIO', 'CAJERO']

const initialForm = {
  nombreUsuario: '',
  nombreCompleto: '',
  contraseña: '',
  rol: 'CAJERO',
  activo: true
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      setLoading(true)
      const res = await api.get('/usuarios')
      setUsuarios(res.data)
    } catch (error) {
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const abrirModalNuevo = () => {
    setEditando(null)
    setForm(initialForm)
    setModalOpen(true)
  }

  const abrirModalEditar = (usuario) => {
    setEditando(usuario)
    setForm({
      nombreUsuario: usuario.nombreUsuario,
      nombreCompleto: usuario.nombreCompleto,
      contraseña: '',
      rol: usuario.rol,
      activo: usuario.activo
    })
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setEditando(null)
    setForm(initialForm)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleGuardar = async () => {
  if (!form.nombreUsuario || !form.nombreCompleto || !form.rol) {
    toast.error('Completa todos los campos obligatorios')
    return
  }
  if (!editando && !form.contraseña) {
    toast.error('La contraseña es obligatoria para nuevos usuarios')
    return
  }

  try {
    setGuardando(true)
    
    if (editando) {
      // Si la contraseña está vacía, NO la enviamos al backend
      const datosActualizar = { ...form }
      if (!datosActualizar.contraseña || datosActualizar.contraseña.trim() === '') {
        delete datosActualizar.contraseña
      }
      
      console.log('Enviando PUT a /usuarios/' + editando.id, datosActualizar)
      const response = await api.put(`/usuarios/${editando.id}`, datosActualizar)
      console.log('Respuesta:', response.data)
      toast.success('Usuario actualizado')
    } else {
      await api.post('/usuarios', form)
      toast.success('Usuario creado')
    }
    
    cerrarModal()
    cargarUsuarios()
  } catch (error) {
    console.error('Error completo:', error)
    console.error('Response data:', error.response?.data)
    toast.error(error.response?.data?.error || 'Error al guardar usuario')
  } finally {
    setGuardando(false)
  }
}
  const toggleActivo = async (usuario) => {
  try {
    if (usuario.activo) {
      await api.delete(`/usuarios/${usuario.id}`)
      toast.success('Usuario desactivado')
    } else {
      await api.patch(`/usuarios/${usuario.id}/activar`)
      toast.success('Usuario activado')
    }
    cargarUsuarios()
  } catch (error) {
    toast.error('Error al cambiar estado del usuario')
  }
}

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.nombreUsuario?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.rol?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const columnas = [
    { key: 'nombreCompleto', label: 'Nombre Completo' },
    { key: 'nombreUsuario', label: 'Usuario' },
    {
      key: 'rol', label: 'Rol',
      render: (rol) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          rol === 'ADMIN' ? 'bg-red-100 text-red-700' :
          rol === 'PROPIETARIO' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {rol}
        </span>
      )
    },
    {
      key: 'activo', label: 'Estado',
      render: (activo) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'acciones', label: 'Acciones',
      render: (_, usuario) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => abrirModalEditar(usuario)}>
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant={usuario.activo ? 'danger' : 'success'}
            onClick={() => toggleActivo(usuario)}
          >
            <Power size={14} />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <Button onClick={abrirModalNuevo} className="flex items-center gap-2">
          <Plus size={16} />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, usuario o rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full border-none outline-none text-gray-700"
          />
        </div>
        {loading ? (
          <p className="text-center text-gray-500 py-4">Cargando...</p>
        ) : (
          <Table columns={columnas} data={usuariosFiltrados} />
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={cerrarModal}
        title={editando ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre Completo"
            name="nombreCompleto"
            value={form.nombreCompleto}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
            required
          />
          <Input
            label="Nombre de Usuario"
            name="nombreUsuario"
            value={form.nombreUsuario}
            onChange={handleChange}
            placeholder="Ej: juanp"
            required
            disabled={!!editando}
          />
          <Input
            label={editando ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
            name="contraseña"
            type="password"
            value={form.contraseña}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required={!editando}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ROLES.map(rol => (
                <option key={rol} value={rol}>{rol}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>
            <Button onClick={handleGuardar} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}