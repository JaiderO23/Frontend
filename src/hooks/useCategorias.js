import { useState, useEffect } from 'react'
import api from '../services/api'

export function useCategorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadCategorias()
  }, [])
  
  const loadCategorias = async () => {
    try {
      setLoading(true)
      const response = await api.get('/categorias')
      setCategorias(response.data)
    } catch (error) {
      console.error('Error loading categorias:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return { categorias, loading }
}