import { useState, useEffect } from 'react'
import { reportesService } from '../services'
import toast from 'react-hot-toast'

export function useDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadDashboard()
  }, [])
  
  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await reportesService.dashboard()
      setData(response.data)
    } catch (err) {
      setError(err.message)
      toast.error('Error al cargar el dashboard')
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return { data, loading, error, reload: loadDashboard }
}