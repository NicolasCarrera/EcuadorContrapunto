import React from 'react'

interface SelectProps {
  label: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
  required?: boolean
}

const Select: React.FC<SelectProps> = ({ label, id, value, onChange, options, required = false }) => (
  <div>
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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

export default Select