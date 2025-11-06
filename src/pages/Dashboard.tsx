'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { NavigationTabs } from '../components/NavigationTabs'
import TextToVideoPage from './TextToVideoPage'
import VideoToVideoPage from './VideoToVideoPage'
import { LogoutIcon } from '../components/icons'
import { useAuth } from '../hooks/useAuth'
import { getStoredAuth } from '../services/pocketbase/auth'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('text-to-video')
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const { token } = getStoredAuth()
    if (!token) {
      navigate('/login')
    }
  }, [])
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <main className='min-h-screen bg-gray-100 p-8'>
      <header className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold'>Ecuador Contrapunto</h1>
        <Button onClick={handleLogout} icon={<LogoutIcon />}>
          Logout
        </Button>
      </header>

      <NavigationTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="mt-6">
        {activeTab === 'text-to-video' && <TextToVideoPage />}
        {activeTab === 'video-to-video' && <VideoToVideoPage />}
      </div>
    </main>
  )
}

export default Dashboard