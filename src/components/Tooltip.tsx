import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  id: string
  content: string
  children: React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ id, content, children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<any>(null)

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX + rect.width / 2
      })
    }
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  const tooltipElement = (
    <div
      id={id}
      role="tooltip"
      className={`absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-xs tooltip ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      style={{ top: position.top, left: position.left, transform: 'translateX(-50%)' }}
    >
      {content}
      <div className="tooltip-arrow"></div>
    </div>
  )

  return (
    <>
      <div
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {createPortal(tooltipElement, document.getElementById('tooltip-portal')!)}
    </>
  )
}

export default Tooltip