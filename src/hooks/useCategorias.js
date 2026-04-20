import { useState, useEffect } from 'react'
import { categoriasService } from '../services'
import toast from 'react-hot-toast'

export function useCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadCategorias()
  }, [])
  
  const loadCategorias = async () => {
    try {
      setLoading(true)
      const response = await categoriasService.getAll()
      setCategorias(response.data)
    } catch (error) {
      toast.error('Error al cargar categorias')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return { categorias, loading, reload: loadCategorias }
}