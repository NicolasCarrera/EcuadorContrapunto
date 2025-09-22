const translateError = (message: string): string => {
  const translations: { [key: string]: string } = {
    'Invalid login credentials.': 'Credenciales de inicio de sesión inválidas',
    'Failed to authenticate.': 'Error al autenticar',
  }
  return translations[message] || message
}

export interface AuthResponse {
  record: {
    avatar: string
    collectionId: string
    collectionName: string
    created: string
    email: string
    emailVisibility: boolean
    id: string
    name: string
    updated: string
    verified: boolean
  }
  token: string
}

export const login = async (identity: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${import.meta.env.VITE_POCKETBASE_URL}/api/collections/users/auth-with-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      identity,
      password
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(translateError(errorData.message) || 'Error en la autenticación.')
  }

  return response.json()
}

export const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
}

export const getStoredAuth = () => {
  const token = localStorage.getItem('authToken')
  const user = localStorage.getItem('user')
  return { token, user: user ? JSON.parse(user) : null }
}

export const setStoredAuth = (token: string, user: any) => {
  localStorage.setItem('authToken', token)
  localStorage.setItem('user', JSON.stringify(user))
}