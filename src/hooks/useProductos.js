import { useState, useEffect } from 'react'
import { productosService } from '../services'
import toast from 'react-hot-toast'

export function useProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    loadProductos()
  }, [])
  
  const loadProductos = async () => {
    try {
      setLoading(true)
      const response = await productosService.getAll()
      setProductos(response.data)
    } catch (error) {
      toast.error('Error al cargar productos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  const createProducto = async (data) => {
    try {
      setSaving(true)
      await productosService.create(data)
      toast.success('Producto creado exitosamente')
      await loadProductos()
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear producto')
      console.error(error)
      return false
    } finally {
      setSaving(false)
    }
  }
  
  const updateProducto = async (id, data) => {
    try {
      setSaving(true)
      await productosService.update(id, data)
      toast.success('Producto actualizado exitosamente')
      await loadProductos()
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar producto')
      console.error(error)
      return false
    } finally {
      setSaving(false)
    }
  }
  
  const deleteProducto = async (id) => {
    try {
      await productosService.delete(id)
      toast.success('Producto eliminado exitosamente')
      await loadProductos()
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar producto')
      console.error(error)
      return false
    }
  }
  
  return {
    productos,
    loading,
    saving,
    createProducto,
    updateProducto,
    deleteProducto,
    reload: loadProductos
  }
}