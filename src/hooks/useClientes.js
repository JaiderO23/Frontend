import { useState, useEffect } from 'react'
import { clientesService } from '../services'
import toast from 'react-hot-toast'

export function useClientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    loadClientes()
  }, [])
  
  const loadClientes = async () => {
    try {
      setLoading(true)
      const response = await clientesService.getAll()
      setClientes(response.data)
    } catch (error) {
      toast.error('Error al cargar clientes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  const createCliente = async (data) => {
    try {
      setSaving(true)
      await clientesService.create(data)
      toast.success('Cliente creado exitosamente')
      await loadClientes()
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear cliente')
      console.error(error)
      return false
    } finally {
      setSaving(false)
    }
  }
  
  const updateCliente = async (id, data) => {
    try {
      setSaving(true)
      await clientesService.update(id, data)
      toast.success('Cliente actualizado exitosamente')
      await loadClientes()
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar cliente')
      console.error(error)
      return false
    } finally {
      setSaving(false)
    }
  }
  
  const deleteCliente = async (id) => {
    try {
      await clientesService.delete(id)
      toast.success('Cliente eliminado exitosamente')
      await loadClientes()
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar cliente')
      console.error(error)
      return false
    }
  }
  
  return {
    clientes,
    loading,
    saving,
    createCliente,
    updateCliente,
    deleteCliente,
    reload: loadClientes
  }
}