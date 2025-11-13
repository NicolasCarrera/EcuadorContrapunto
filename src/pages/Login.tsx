'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'
import { useAuth } from '../hooks/useAuth'
import { getStoredAuth } from '../services/pocketbase/auth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { authenticate, loading, error } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const { token } = getStoredAuth()
    if (token) {
      navigate('/dashboard')
    }
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    authenticate(email, password)
  }

  return (
    <section className='bg-gray-50'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <a href='#' className='flex items-center mb-6 text-2xl font-semibold text-gray-900'>
          Ecuador Contrapunto
        </a>
        <div className='w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
              <div>
                <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900'>
                  Su correo electrónico
                </label>
                <Input
                  type='email'
                  name='email'
                  id='email'
                  placeholder='name@company.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900'>
                  Contraseña
                </label>
                <Input
                  type='password'
                  name='password'
                  id='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <Alert message={error} />}
              <Button type='submit' fullWidth loading={loading}>
                Iniciar sesión
              </Button>
            </form>
            <div className="text-center mt-6">
              <div className="text-sm text-gray-600">
                Al iniciar sesión, aceptas nuestros{' '}
                <a href={import.meta.env.VITE_TERMS_URL || "/terms"} className="text-blue-600 hover:text-blue-500 font-medium">
                  Términos de Servicio
                </a>{' '}
                y{' '}
                <a href={import.meta.env.VITE_PRIVACY_URL || "/privacy"} className="text-blue-600 hover:text-blue-500 font-medium">
                  Política de Privacidad
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login