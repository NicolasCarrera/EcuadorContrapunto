import { useRef } from 'react'
import type { ReactNode } from 'react'

interface OptionPanelProps {
  id: string
  actions: ReactNode[]
  children: ReactNode
}

function OptionPanel ({ id, actions, children }: OptionPanelProps) {
  const childRef = useRef<HTMLDivElement>(null)

  const panel = (
    <div
      id={id}
      role="complementary"
      className="absolute z-10"
      style={{
        top: `0px`,
        left: `calc(100% + 12px)`
      }}
    >
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
        <div className="flex flex-col gap-2">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div ref={childRef} className="relative">
      {children}
      {panel}
    </div>
  )
}

export default OptionPanel