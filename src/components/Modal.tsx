import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

function Modal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que quieres eliminar este diálogo?",
  confirmText = "Sí, eliminar",
  cancelText = "Cancelar"
}: ModalProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let root = document.getElementById('modal')
    if (!root) {
      root = document.createElement('div')
      root.id = 'modal'
      document.body.appendChild(root)
    }
    setPortalRoot(root)

    return () => {
      if (root && root.childNodes.length === 0) {
        document.body.removeChild(root)
      }
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const preventScroll = (e: WheelEvent | TouchEvent) => {
      e.preventDefault()
    }

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('wheel', preventScroll, { passive: false })
      document.addEventListener('touchmove', preventScroll, { passive: false })
      document.addEventListener('contextmenu', preventContextMenu)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('wheel', preventScroll)
      document.removeEventListener('touchmove', preventScroll)
      document.removeEventListener('contextmenu', preventContextMenu)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (!isOpen || !portalRoot) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full backdrop-blur-sm"
      onClick={handleBackdropClick}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        ref={modalRef}
        className="relative p-4 w-full max-w-md max-h-full"
        onClick={handleModalContentClick}
      >
        <div className="relative bg-white rounded-lg shadow-sm">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={onClose}
          >
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500">{title}</h3>
            <p className="mb-5 text-sm text-gray-600">{message}</p>
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <button
              type="button"
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              onClick={onClose}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, portalRoot)
}

export default Modal