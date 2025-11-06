import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import Select from './Select'
import Tooltip from './Tooltip'
import Alert from './Alert'
import { FileUploadIcon, SparklesIcon, DownloadIcon, CheckIcon, SpinnerIcon } from './icons'
import type { VideoItem } from '../pages/VideoToVideoPage'

interface VideoDialogProps {
  dialog: VideoItem
  onUpdate: (field: keyof Pick<VideoItem, 'character'>, value: string) => void
  onVideoChange: (e: ChangeEvent<HTMLInputElement>) => void
  onGenerate: () => Promise<void>
}

function VideoDialog({ dialog, onUpdate, onVideoChange, onGenerate }: VideoDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const handleSelectVideo = () => {
    fileInputRef.current?.click()
  }

  const handleGenerate = async () => {
    if (!dialog.character) {
      setAlertMessage('Por favor selecciona un personaje')
      return
    }
    if (!dialog.videoFile) {
      setAlertMessage('Por favor sube un video')
      return
    }
    setAlertMessage(null)
    await onGenerate()
  }

  const handleDownload = () => {
    if (dialog.videoUrl) {
      window.open(dialog.videoUrl, '_blank')
    }
  }

  return (
    <div className='w-full mb-4 border border-gray-200 rounded-lg bg-gray-50'>
      <div className='flex items-center justify-between px-3 py-2 border-b border-gray-200'>
        <div className='flex items-center space-x-2'>
          <div className='inline-flex rounded-md shadow-xs' role='group'>
            <Tooltip id={`video-tooltip-${dialog.index}`} content='Subir video'>
              <button
                type='button'
                onClick={handleSelectVideo}
                className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer flex items-center ${
                  dialog.videoFile
                    ? 'text-white bg-blue-600 border border-blue-600 hover:bg-blue-700'
                    : 'text-gray-900 bg-gray-200 border border-gray-300 hover:bg-gray-300'
                }`}
              >
                <FileUploadIcon />
                {dialog.videoFile && <CheckIcon className='ml-1 w-4 h-4 text-white' />}
              </button>
            </Tooltip>
          </div>
        </div>
        <div className='flex items-center space-x-1'>
          <Tooltip id={`generate-tooltip-${dialog.index}`} content='Generar Video'>
            <button
              type='button'
              onClick={handleGenerate}
              className={`p-2 rounded-sm cursor-pointer ${
                dialog.processing || !dialog.character || !dialog.videoFile
                  ? 'text-gray-500'
                  : 'text-gray-900'
              }`}
              disabled={dialog.processing || !dialog.character || !dialog.videoFile}
            >
              {dialog.processing ? <SpinnerIcon /> : <SparklesIcon />}
              <span className='sr-only'>Generar video</span>
            </button>
          </Tooltip>
          <Tooltip id={`download-tooltip-${dialog.index}`} content='Descargar Video'>
            <button type='button' onClick={handleDownload} className={`p-2 rounded-sm cursor-pointer ${!dialog.videoUrl ? 'text-gray-500' : 'text-blue-600'}`} disabled={!dialog.videoUrl}>
              <DownloadIcon />
              <span className='sr-only'>Descargar video</span>
            </button>
          </Tooltip>
        </div>
      </div>
      <div className='px-4 py-2 bg-white rounded-b-lg'>
        <div className='flex gap-4'>
          <Select
            label='Personaje'
            id={`character-${dialog.index}`}
            value={dialog.character}
            onChange={(e) => onUpdate('character', e.target.value)}
            options={[
              { value: '', label: 'Selecciona un personaje' },
              { value: 'formal', label: 'Personaje formal' },
              { value: 'smart_casual', label: 'Personaje semi formal' },
              { value: 'casual', label: 'Personaje casual' },
            ]}
            required
          />
        </div>
        {alertMessage && <Alert message={alertMessage} />}
        {dialog.error && <Alert message={dialog.error} />}
      </div>
      <input
        ref={fileInputRef}
        type='file'
        accept='video/mp4'
        onChange={onVideoChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default VideoDialog