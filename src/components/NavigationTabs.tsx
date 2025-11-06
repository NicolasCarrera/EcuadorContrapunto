import { LetterCaseIcon, FileUploadIcon } from './icons'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  path: string
}

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

const tabs: Tab[] = [
  {
    id: 'text-to-video',
    label: 'Generar por Texto',
    icon: <LetterCaseIcon />,
    path: '/dashboard'
  },
  {
    id: 'video-to-video',
    label: 'Generar por Video',
    icon: <FileUploadIcon />,
    path: '/video-dashboard'
  }
]

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
        {tabs.map((tab) => (
          <li key={tab.id} className="me-2">
            <button
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex items-center justify-center gap-2 p-4 border-b-2 rounded-t-lg group ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.icon}
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}