import axios from 'axios'

const API_URL = 'http://localhost:8081/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de REQUEST - agregar token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de RESPONSE - manejar errores globalmente
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
export default api