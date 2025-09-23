import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { SpinnerIcon } from './icons'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
  icon?: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  textAlign?: 'left' | 'center' | 'right'
}

function Button({ className, fullWidth, icon, variant = 'primary', size = 'md', loading = false, textAlign = 'center', children, ...props }: ButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300',
    secondary: 'bg-gray-700 hover:bg-gray-800 focus:ring-gray-300',
    success: 'bg-green-700 hover:bg-green-800 focus:ring-green-300',
    danger: 'bg-red-700 hover:bg-red-800 focus:ring-red-300',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const justifyClass = textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start'
  const baseClasses = `text-white font-medium rounded-lg focus:outline-none focus:ring-4 ${justifyClass} flex items-center me-2`

  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className || ''}`}
    >
      {loading ? <SpinnerIcon /> : icon && <span className='me-2'>{icon}</span>}
      {children}
    </button>
  )
}

export default Button