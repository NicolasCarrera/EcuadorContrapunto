import type { ChangeEvent } from 'react'

interface SelectProps {
  label: string
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
  required?: boolean
  disabled?: boolean
}

function Select({ label, id, value, onChange, options, required = false, disabled = false }: SelectProps) {
  return (
    <div>
      {label &&
        <label htmlFor={id} className='block mb-2 text-sm font-medium text-gray-900'>
          {label}
        </label>
      }
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-200 disabled:cursor-not-allowed'
        required={required}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select