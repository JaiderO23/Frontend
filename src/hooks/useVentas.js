import { useState, useEffect } from 'react'
import { ventasService } from '../services'
import toast from 'react-hot-toast'

export function useVentas() {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadVentas()
  }, [])
  
  const loadVentas = async () => {
    try {
      setLoading(true)
      const response = await ventasService.getAll()
      setVentas(response.data)
    } catch (error) {
      toast.error('Error al cargar ventas')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return {
    ventas,
    loading,
    reload: loadVentas
  }
}