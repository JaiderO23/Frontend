import { useState, useEffect } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

export default function ProductoForm({ producto, categorias, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    codigoBarras: '',
    nombre: '',
    descripcion: '',
    categoriaId: '',
    precioCompra: '',
    precioVenta: '',
    stockActual: '',
    stockMinimo: '',
    activo: true
  })
  
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (producto) {
      setFormData({
        codigoBarras: producto.codigoBarras || '',
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        categoriaId: producto.categoria?.id || '',
        precioCompra: producto.precioCompra || '',
        precioVenta: producto.precioVenta || '',
        stockActual: producto.stockActual || '',
        stockMinimo: producto.stockMinimo || '',
        activo: producto.activo !== undefined ? producto.activo : true
      })
    }
  }, [producto])
  
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
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    }
    
    if (!formData.categoriaId) {
      newErrors.categoriaId = 'Selecciona una categoría'
    }
    
    if (!formData.precioVenta || parseFloat(formData.precioVenta) <= 0) {
      newErrors.precioVenta = 'El precio de venta debe ser mayor a 0'
    }
    
    if (!formData.stockActual || parseInt(formData.stockActual) < 0) {
      newErrors.stockActual = 'El stock debe ser mayor o igual a 0'
    }
    
    if (!formData.stockMinimo || parseInt(formData.stockMinimo) < 0) {
      newErrors.stockMinimo = 'El stock mínimo debe ser mayor o igual a 0'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    const dataToSubmit = {
      ...formData,
      categoriaId: parseInt(formData.categoriaId),
      precioCompra: parseFloat(formData.precioCompra) || 0,
      precioVenta: parseFloat(formData.precioVenta),
      stockActual: parseInt(formData.stockActual),
      stockMinimo: parseInt(formData.stockMinimo)
    }
    
    onSubmit(dataToSubmit)
  }
  
  const categoriaOptions = categorias.map(c => ({
    value: c.id,
    label: c.nombre
  }))
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Código de Barras"
          name="codigoBarras"
          value={formData.codigoBarras}
          onChange={handleChange}
          placeholder="7701234567890"
        />
        
        <Input
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
        />
      </div>
      
      <Input
        label="Descripción"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Descripción opcional del producto"
      />
      
      <Select
        label="Categoría"
        name="categoriaId"
        value={formData.categoriaId}
        onChange={handleChange}
        options={categoriaOptions}
        error={errors.categoriaId}
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio de Compra"
          name="precioCompra"
          type="number"
          value={formData.precioCompra}
          onChange={handleChange}
          placeholder="0"
        />
        
        <Input
          label="Precio de Venta"
          name="precioVenta"
          type="number"
          value={formData.precioVenta}
          onChange={handleChange}
          error={errors.precioVenta}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Stock Actual"
          name="stockActual"
          type="number"
          value={formData.stockActual}
          onChange={handleChange}
          error={errors.stockActual}
          required
        />
        
        <Input
          label="Stock Mínimo"
          name="stockMinimo"
          type="number"
          value={formData.stockMinimo}
          onChange={handleChange}
          error={errors.stockMinimo}
          required
        />
      </div>
      
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
          Producto activo
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
          {loading ? 'Guardando...' : (producto ? 'Actualizar' : 'Crear')}
        </Button>
      </div>
    </form>
  )
}