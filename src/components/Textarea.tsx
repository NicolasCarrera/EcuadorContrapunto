import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

function Textarea({ className, label, ...props }: TextareaProps) {
  return (
    <>
      {label && (
        <label className='block mb-2 text-sm font-medium text-gray-900'>
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-0 focus:border-gray-300 ${className || ''}`}
      />
    </>
  )
}

export default Textarea