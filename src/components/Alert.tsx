interface AlertProps {
  message: string
  type?: 'danger' | 'success' | 'warning' | 'info'
}

function Alert({ message, type = 'danger' }: AlertProps) {
  const alertClasses = {
    danger: 'text-red-800 bg-red-50',
    success: 'text-green-800 bg-green-50',
    warning: 'text-yellow-800 bg-yellow-50',
    info: 'text-blue-800 bg-blue-50'
  }

  return (
    <div className={`p-4 mb-4 text-sm rounded-lg ${alertClasses[type]}`} role='alert'>
      <span className='font-medium'>
        {message}
      </span>
    </div>
  )
}

export default Alert