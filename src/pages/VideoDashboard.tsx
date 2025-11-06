import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChangeEvent } from 'react'
import Button from '../components/Button'
import VideoDialog from '../components/VideoDialog'
import Alert from '../components/Alert'
import { generateVideoRunway, mergeVideos, type Character, type Background, type VideoResponse } from '../services/n8n/workflow'
import { AddIcon, LogoutIcon } from '../components/icons'
import { useAuth } from '../hooks/useAuth'
import { getStoredAuth } from '../services/pocketbase/auth'

export interface VideoItem {
  index: number
  character: Character
  videoFile: File | null
  videoUrl?: string
  videoId?: string
  processing?: boolean
  error?: string
}

function VideoDashboard() {
  const [videoItems, setVideoItems] = useState<VideoItem[]>([])
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [mergedVideoUrl, setMergedVideoUrl] = useState<string | null>(null)
  const [isGeneratingMergedVideo, setIsGeneratingMergedVideo] = useState(false)
  const [generateMergedError, setGenerateMergedError] = useState<string | null>(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const { token } = getStoredAuth()
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const addVideoItem = () => {
    setVideoItems([...videoItems, { index: videoItems.length + 1, character: '' as Character, videoFile: null, videoId: undefined }])
  }

  const updateVideoItem = (index: number, field: keyof Pick<VideoItem, 'character'>, value: string) => {
    setVideoItems(videoItems.map(item => item.index === index ? { ...item, [field]: value as Character } : item))
  }

  const handleVideoChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'video/mp4') {
      setVideoItems(videoItems.map(item => item.index === index ? { ...item, videoFile: file, videoUrl: undefined, processing: false, error: undefined } : item))
      setAlertMessage(null)
    } else {
      setAlertMessage('Por favor selecciona un archivo de video MP4 válido')
    }
  }

  const generateVideoForItem = async (item: VideoItem): Promise<VideoResponse> => {
    if (!item.character) {
      throw new Error('Personaje requerido para generación de video')
    }
    if (!item.videoFile) {
      throw new Error('Video requerido para generación de video')
    }

    setVideoItems(prev => prev.map(i => i.index === item.index ? { ...i, processing: true, error: undefined } : i))

    try {
      const videoData = {
        character: item.character,
        video: item.videoFile!,
        background: 'cityhall' as Background // Default background
      }
      const videoResponse = await generateVideoRunway(videoData)

      setVideoItems(prev => prev.map(i => i.index === item.index ? {
        ...i,
        videoUrl: videoResponse.generatedVideo,
        videoId: videoResponse.id,
        processing: false,
        error: undefined
      } : i))

      return videoResponse
    } catch (error) {
      console.error('Error generating video:', error)
      setVideoItems(prev => prev.map(i => i.index === item.index ? {
        ...i,
        processing: false,
        error: 'Error al generar el video'
      } : i))
      throw error
    }
  }

  const handleGenerateVideo = async (index: number) => {
    const item = videoItems.find(i => i.index === index)
    if (!item) return

    try {
      await generateVideoForItem(item)
    } catch (error) {
      console.error('Error generating video:', error)
    }
  }

  const handleGenerateMergedVideo = async () => {
    if (videoItems.length <= 1) {
      return
    }

    setIsGeneratingMergedVideo(true)
    setGenerateMergedError(null)
    setMergedVideoUrl(null)

    try {
      const videosToMerge = []

      for (const item of videoItems) {
        if (item.videoUrl && item.videoId) {
          // Already has video
          videosToMerge.push({
            id: item.videoId,
            index: item.index,
            video_url: item.videoUrl
          })
        } else {
          // Need to generate
          const videoResponse = await generateVideoForItem(item)
          videosToMerge.push({
            id: videoResponse.id,
            index: item.index,
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

  const handleDownloadMergedVideo = () => {
    if (mergedVideoUrl) {
      window.open(mergedVideoUrl, '_blank')
    }
  }

  // Helper function to validate video URLs
  const isValidVideoUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
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
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Videos
          </label>

          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            {videoItems.map((item) => (
              <VideoDialog
                key={item.index}
                dialog={item as any}
                onUpdate={(field, value) => updateVideoItem(item.index, field, value)}
                onVideoChange={(e) => handleVideoChange(item.index, e)}
                onGenerate={() => handleGenerateVideo(item.index)}
              />
            ))}

            <Button type="button" onClick={addVideoItem} icon={<AddIcon />}>
              Agregar Video
            </Button>
          </div>
        </div>
      </section>
      <section className='max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md'>
        {generateMergedError && <Alert message={generateMergedError} />}
        <div className='flex gap-4'>
          <Button
            type='button'
            onClick={handleGenerateMergedVideo}
            loading={isGeneratingMergedVideo}
            disabled={isGeneratingMergedVideo || videoItems.length <= 1 || !videoItems.every(item => item.character && item.videoFile)}
            className='flex-1'
          >
            {isGeneratingMergedVideo ? 'Generando Video...' : 'Generar Video Combinado'}
          </Button>
          <Button
            type='button'
            onClick={handleDownloadMergedVideo}
            disabled={!mergedVideoUrl}
            className='flex-1'
          >
            Descargar Video Combinado
          </Button>
        </div>
        {mergedVideoUrl && isValidVideoUrl(mergedVideoUrl) && (
          <div className='mt-4 flex justify-center'>
            <video
              controls
              preload="metadata"
              className='max-w-full rounded-lg shadow-md'
              onError={(e) => {
                console.error('Error loading video:', e)
                setGenerateMergedError('Error al cargar el video')
              }}
            >
              <source src={mergedVideoUrl} type='video/mp4' />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        )}
      </section>
    </main>
  )
}

export default VideoDashboard