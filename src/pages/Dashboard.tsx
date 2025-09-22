import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'
import Textarea from '../components/Textarea'
import Dialog from '../components/Dialog'
import { generateNewsScript, generateVideos, type Character } from '../services/n8n/workflow'
import type { DialogVideoData } from '../services/n8n/workflow'
import { SparklesIcon, AddIcon, LogoutIcon } from '../components/icons'
import { useAuth } from '../hooks/useAuth'
import { getStoredAuth } from '../services/pocketbase/auth'

export interface Dialogo {
  index: number
  character: Character
  dialog: string
  video: File | null
  videoUrl?: string
  processing?: boolean
  error?: string
}

const Dashboard: React.FC = () => {
  const [title, setTitle] = useState('')
  const [resumen, setResumen] = useState('')
  const [dialogos, setDialogos] = useState<Dialogo[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const { token } = getStoredAuth()
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const addDialogo = () => {
    setDialogos([...dialogos, { index: dialogos.length + 1, character: '' as Character, dialog: '', video: null }])
  }

  const updateDialogo = (index: number, field: keyof Pick<Dialogo, 'character' | 'dialog'>, value: string) => {
    setDialogos(dialogos.map(d => d.index === index ? { ...d, [field]: value } : d))
  }

  const handleVideoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'video/mp4') {
      setDialogos(dialogos.map(d => d.index === index ? { ...d, video: file, videoUrl: undefined, processing: false, error: undefined } : d))
    } else {
      alert('Please select a valid MP4 video file')
    }
  }

  const handleGenerateVideo = async (index: number) => {
    const dialogo = dialogos.find(d => d.index === index)
    if (!dialogo || !dialogo.character || !dialogo.video) return

    setDialogos(dialogos.map(d => d.index === index ? { ...d, processing: true, error: undefined } : d))
    try {
      const videoData: DialogVideoData = {
        character: dialogo.character,
        video: dialogo.video
      }
      const videoResponse = await generateVideos(videoData)
      setDialogos(dialogos.map(d => d.index === index ? { ...d, videoUrl: videoResponse.output, processing: false, error: undefined } : d))
    } catch (error) {
      console.error('Error generating video:', error)
      setDialogos(dialogos.map(d => d.index === index ? { ...d, processing: false, error: 'Error generating video' } : d))
    }
  }

  const handleGenerate = async (query?: string) => {
    setLoading(true)
    try {
      const response = await generateNewsScript(query)
      console.log('API Response:', response) // Debug log
      setTitle(response.title || '')
      setResumen(response.summary || '')
      const dialogs = response.dialogs || []
      setDialogos(dialogs.map((d: { index: number, character: Character, dialog: string }) => ({
        ...d,
        video: null,
        videoUrl: undefined,
        processing: false,
        error: undefined
      })))
    } catch (error) {
      console.error('Error generating news script:', error)
      alert('Error generating news script')
    }
    setLoading(false)
  }


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Ecuador Contrapunto</h1>
        <Button onClick={logout} icon={<LogoutIcon />}>
          Logout
        </Button>
      </div>
      <div className="mb-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Consulta de Búsqueda (opcional)
        </label>
        <div className="flex gap-4 items-end">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Dejar vacío para noticia del día"
            className="flex-1"
          />
          <Button type="button" onClick={() => handleGenerate(searchQuery || undefined)} loading={loading} icon={<SparklesIcon />}>
            {loading ? 'Generando...' : 'Generar'}
          </Button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Textarea
            label="Resumen"
            id="resumen"
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Dialogos
          </label>
          {dialogos.map((dialogo) => (
            <Dialog
              key={dialogo.index}
              dialog={dialogo}
              onUpdate={(field: keyof Pick<Dialogo, 'character' | 'dialog'>, value: string) => updateDialogo(dialogo.index, field, value)}
              onVideoChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVideoChange(dialogo.index, e)}
              onGenerate={() => handleGenerateVideo(dialogo.index)}
            />
          ))}
          <Button type="button" onClick={addDialogo} icon={<AddIcon />}>
            Add Dialogo
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard