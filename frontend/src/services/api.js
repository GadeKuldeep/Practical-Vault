
import axios from 'axios'

// Use the deployed backend URL directly (no .env)
const api = axios.create({ baseURL: 'https://practical-vault.onrender.com', headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
