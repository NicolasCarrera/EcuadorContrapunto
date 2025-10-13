'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChangeEvent } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import Textarea from '../components/Textarea'
import Select from '../components/Select'
import Dialog from '../components/Dialog'
import Alert from '../components/Alert'
import { generateNewsScript, generateVideoRunway, generateVideoHedra, mergeVideos, postVideo, type Character, type Background, type VideoResponse } from '../services/n8n/workflow'
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
  videoId?: string
  processing?: boolean
  error?: string
  generationType: 'text' | 'video' | null
  background: Background | ''
}

function Dashboard() {
  const [title, setTitle] = useState('')
  const [resumen, setResumen] = useState('')
  const [dialogos, setDialogos] = useState<Dialogo[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [mergedVideoUrl, setMergedVideoUrl] = useState<string | null>(null)
  const [isGeneratingMergedVideo, setIsGeneratingMergedVideo] = useState(false)
  const [generateMergedError, setGenerateMergedError] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [globalGenerationType, setGlobalGenerationType] = useState<'text' | 'video' | null>(null)
  const [globalBackground, setGlobalBackground] = useState<Background | ''>('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const { token } = getStoredAuth()
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const addDialogo = () => {
    setDialogos([...dialogos, { index: dialogos.length + 1, character: '' as Character, dialog: '', video: null, generationType: globalGenerationType, videoId: undefined, background: globalBackground }])
  }

  const updateDialogo = (index: number, field: keyof Pick<Dialogo, 'character' | 'dialog' | 'background'>, value: string) => {
    setDialogos(dialogos.map(d => d.index === index ? { ...d, [field]: value } : d))
  }

  const updateGenerationType = (index: number, type: 'text' | 'video' | null) => {
    setDialogos(dialogos.map(d => d.index === index ? { ...d, generationType: type } : d))
  }

  const applyGlobalSettings = () => {
    setDialogos(dialogos.map(d => ({ ...d, generationType: globalGenerationType, background: globalBackground })))
  }

  const handleVideoChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'video/mp4') {
      setDialogos(dialogos.map(d => d.index === index ? { ...d, video: file, videoUrl: undefined, processing: false, error: undefined } : d))
      setAlertMessage(null)
    } else {
      setAlertMessage('Por favor selecciona un archivo de video MP4 válido')
    }
  }

  const generateVideoForDialogo = async (dialogo: Dialogo): Promise<VideoResponse> => {
    if (!dialogo.background) {
      throw new Error('Fondo requerido para generación de video')
    }
    if (!dialogo.character || !dialogo.generationType) {
      throw new Error('Dialogo no válido')
    }
    if (dialogo.generationType === 'video' && !dialogo.video) {
      throw new Error('Video requerido para generación de video')
    }
    if (dialogo.generationType === 'text' && !dialogo.dialog) {
      throw new Error('Diálogo requerido para generación de texto')
    }

    setDialogos(prev => prev.map(d => d.index === dialogo.index ? { ...d, processing: true, error: undefined } : d))

    try {
      let videoResponse: VideoResponse
      if (dialogo.generationType === 'video') {
        const videoData: DialogVideoData = {
          character: dialogo.character,
          video: dialogo.video!,
          background: dialogo.background as Background
        }
        videoResponse = await generateVideoRunway(videoData)
      } else {
        const hedraData = {
          character: dialogo.character,
          dialog: dialogo.dialog,
          background: dialogo.background as Background
        }
        videoResponse = await generateVideoHedra(hedraData)
      }

      setDialogos(prev => prev.map(d => d.index === dialogo.index ? {
        ...d,
        videoUrl: videoResponse.generatedVideo,
        videoId: videoResponse.id,
        processing: false,
        error: undefined
      } : d))

      return videoResponse
    } catch (error) {
      console.error('Error generating video:', error)
      setDialogos(prev => prev.map(d => d.index === dialogo.index ? {
        ...d,
        processing: false,
        error: 'Error al generar el video'
      } : d))
      throw error
    }
  }

  const handleGenerateVideo = async (index: number) => {
    const dialogo = dialogos.find(d => d.index === index)
    if (!dialogo) return

    try {
      await generateVideoForDialogo(dialogo)
    } catch (error) {
      console.error('Error generating video:', error)
    }
  }

  const handleGenerate = async (query?: string) => {
    setLoading(true)
    setAlertMessage(null)
    try {
      const response = await generateNewsScript(query)
      console.log('API Response:', response)
      setTitle(response.title || '')
      setResumen(response.summary || '')
      const dialogs = response.dialogs || []
      setDialogos(dialogs.map((d: { index: number, character: Character, dialog: string }) => ({
        ...d,
        video: null,
        videoUrl: undefined,
        videoId: undefined,
        processing: false,
        error: undefined,
        generationType: globalGenerationType,
        background: globalBackground
      })))
    } catch (error) {
      console.error('Error generating news script:', error)
      setAlertMessage('Error al generar el guion de noticias')
    }
    setLoading(false)
  }

  const handleGenerateMergedVideo = async () => {
    if (dialogos.length <= 1 || dialogos.some(d => !d.generationType || !d.background)) {
      return
    }

    setIsGeneratingMergedVideo(true)
    setGenerateMergedError(null)
    setMergedVideoUrl(null)

    try {
      const videosToMerge = []

      for (const dialogo of dialogos) {
        if (dialogo.videoUrl && dialogo.videoId) {
          // Already has video
          videosToMerge.push({
            id: dialogo.videoId,
            index: dialogo.index,
            video_url: dialogo.videoUrl
          })
        } else {
          // Need to generate
          const videoResponse = await generateVideoForDialogo(dialogo)
          videosToMerge.push({
            id: videoResponse.id,
            index: dialogo.index,
            video_url: videoResponse.generatedVideo
          })
        }
      }

      const result = await mergeVideos(videosToMerge)
      if (result.success && result.videoUrl) {
        setMergedVideoUrl(result.videoUrl)
      } else {
        setGenerateMergedError(result.error || 'Error desconocido al generar el video')
      }
    } catch (error) {
      console.error('Error generating merged video:', error)
      setGenerateMergedError('Error al generar el video combinado')
    }
    setIsGeneratingMergedVideo(false)
  }

  const handlePublish = async () => {
    if (!mergedVideoUrl) return

    setIsPublishing(true)
    setPublishError(null)

    try {
      const base64 = mergedVideoUrl.split(',')[1]
      const response = await postVideo({
        title,
        summary: resumen,
        video: base64
      })
      setPublishedUrl(response.video_url)
    } catch (error) {
      console.error('Error publishing video:', error)
      setPublishError('Error al publicar el video')
    }

    setIsPublishing(false)
  }


  return (
    <main className='min-h-screen bg-gray-100 p-8'>
      <header className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold'>Ecuador Contrapunto</h1>
        <Button onClick={logout} icon={<LogoutIcon />}>
          Logout
        </Button>
      </header>
      {alertMessage && <Alert message={alertMessage} />}
      <section className='mb-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md'>
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          Consulta de Búsqueda (opcional)
        </label>
        <div className='flex gap-4 items-end'>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Dejar vacío para noticia del día'
            className='flex-1'
          />
          <Button type='button' onClick={() => handleGenerate(searchQuery || undefined)} loading={loading} icon={<SparklesIcon />}>
            {loading ? 'Generando...' : 'Generar'}
          </Button>
        </div>
      </section>
      <section className='mb-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md'>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='title'>
            Title
          </label>
          <Input
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <Textarea
            label='Resumen'
            id='resumen'
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Dialogos
          </label>

          <div className={`mb-4 border border-gray-200 rounded-lg ${dialogos.length <= 1 ? 'bg-gray-100 opacity-50' : 'bg-gray-50'}`}>
            <div className='px-3 py-2 border-b border-gray-200'>
              <div className='flex gap-4 items-end'>
                <Select
                  label='Tipo de Generación'
                  id='global-generation-type'
                  value={globalGenerationType || ''}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setGlobalGenerationType(e.target.value as 'text' | 'video' | null)}
                  options={[
                    { value: '', label: 'Selecciona tipo' },
                    { value: 'text', label: 'Texto' },
                    { value: 'video', label: 'Video' }
                  ]}
                  disabled={dialogos.length <= 1}
                />
                <Select
                  label='Escenario'
                  id='global-background'
                  value={globalBackground}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setGlobalBackground(e.target.value as Background | '')}
                  options={[
                    { value: '', label: 'Selecciona escenario' },
                    { value: 'cityhall', label: 'Ayuntamiento' },
                    { value: 'home', label: 'Casa' },
                    { value: 'newscast', label: 'Noticiero' },
                    { value: 'podcast', label: 'Podcast' },
                    { value: 'street', label: 'Calle' },
                    { value: 'university', label: 'Universidad' }
                  ]}
                  disabled={dialogos.length <= 1}
                />
                <div className='ml-auto'>
                  <Button type='button' onClick={applyGlobalSettings} disabled={dialogos.length <= 1}>
                    Aplicar a Todos
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {dialogos.map((dialogo) => (
            <Dialog
              key={dialogo.index}
              dialog={dialogo}
              onUpdate={(field: keyof Pick<Dialogo, 'character' | 'dialog' | 'background'>, value: string) => updateDialogo(dialogo.index, field, value)}
              onUpdateGenerationType={(type: 'text' | 'video' | null) => updateGenerationType(dialogo.index, type)}
              onVideoChange={(e: ChangeEvent<HTMLInputElement>) => handleVideoChange(dialogo.index, e)}
              onGenerate={() => handleGenerateVideo(dialogo.index)}
            />
          ))}
          <Button type='button' onClick={addDialogo} icon={<AddIcon />}>
            Add Dialogo
          </Button>
        </div>
      </section>
      <section className='max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md'>
        {generateMergedError && <Alert message={generateMergedError} />}
        {publishError && <Alert message={publishError} />}
        <div className='flex gap-4'>
          <Button
            type='button'
            onClick={handleGenerateMergedVideo}
            loading={isGeneratingMergedVideo}
            disabled={isGeneratingMergedVideo || dialogos.length <= 1 || dialogos.some(d => !d.generationType || !d.background)}
            className='flex-1'
          >
            {isGeneratingMergedVideo ? 'Generando Video...' : 'Generar Video'}
          </Button>
          <Button
            type='button'
            onClick={publishedUrl ? () => window.open(publishedUrl, '_blank') : handlePublish}
            loading={isPublishing}
            disabled={!mergedVideoUrl || isPublishing}
            className='flex-1'
          >
            {isPublishing ? 'Publicando...' : publishedUrl ? 'Ver Video' : 'Subir Video'}
          </Button>
        </div>
        {mergedVideoUrl && (
          <div className='mt-4 flex justify-center'>
            <video controls>
              <source src={mergedVideoUrl} type='video/mp4' />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard