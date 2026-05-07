import axios from 'axios'

const API_URL = 'http://localhost:8081/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('Token enviado:', token ? 'SÍ' : 'NO', config.url)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expirado o inválido → cerrar sesión
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
      return Promise.reject(error)
    }

   
    if (error.response?.data) {
      const data = error.response.data
      
      if (!data.error && data.message) {
        data.error = data.message
      } else if (!data.error && typeof data === 'string') {
        error.response.data = { error: data }
      } else if (!data.error) {
        data.error = 'Error en la operación'
      }
    } else {
      // Error sin respuesta del servidor (red caída, CORS, etc)
      error.response = {
        data: {
          error: 'No se pudo conectar con el servidor. Verifica tu conexión.'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api