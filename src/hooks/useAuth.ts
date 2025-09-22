import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setStoredAuth, logout as clearAuth } from '../services/pocketbase/auth'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const authenticate = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await login(email, password)
      setStoredAuth(response.token, response.record)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación.')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearAuth()
    navigate('/')
  }

  return {
    authenticate,
    logout,
    loading,
    error
  }
}