import { useState, useEffect } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function ClienteForm({ cliente, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    numeroDocumento: '',  
    telefono: '',
    direccion: '',
    email: '',
    limiteCredito: '',
    activo: true
  })
  
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        apellido: cliente.apellido || '',
        numeroDocumento: cliente.numeroDocumento || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        email: cliente.email || '',
        limiteCredito: cliente.limiteCredito || '',
        activo: cliente.activo !== undefined ? cliente.activo : true
      })
    }
  }, [cliente])
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validate = () => {
    const newErrors = {}
    
    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    }
    
    if (!formData.apellido?.trim()) {
      newErrors.apellido = 'El apellido es obligatorio'
    }
    
    if (!formData.numeroDocumento?.trim()) {
      newErrors.numeroDocumento = 'El documento es obligatorio'
    }
    
    if (!formData.limiteCredito || parseFloat(formData.limiteCredito) < 0) {
      newErrors.limiteCredito = 'El límite de crédito debe ser mayor o igual a 0'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    const dataToSubmit = {
      ...formData,
      limiteCredito: parseFloat(formData.limiteCredito) || 0
    }
    
    console.log('Datos a enviar:', dataToSubmit)
    
    onSubmit(dataToSubmit)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
        />
        
        <Input
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          error={errors.apellido}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Documento"
          name="numeroDocumento"  
          value={formData.numeroDocumento}
          onChange={handleChange}
          error={errors.numeroDocumento}
          required
        />
        
        <Input
          label="Teléfono"
          name="telefono"
          type="tel"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="3001234567"
        />
      </div>
      
      <Input
        label="Dirección"
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        placeholder="Calle 123 #45-67"
      />
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="cliente@ejemplo.com"
      />
      
      <Input
        label="Límite de Crédito"
        name="limiteCredito"
        type="number"
        value={formData.limiteCredito}
        onChange={handleChange}
        error={errors.limiteCredito}
        required
        placeholder="0"
      />
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="activo"
          name="activo"
          checked={formData.activo}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <label htmlFor="activo" className="text-sm font-medium text-gray-700">
          Cliente activo
        </label>
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          className="flex-1"
          disabled={loading}
        >
          {loading ? 'Guardando...' : (cliente ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  )
}