'use client'

import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import Select from './Select'
import Textarea from './Textarea'
import Tooltip from './Tooltip'
import Alert from './Alert'
import { FileUploadIcon, SparklesIcon, DownloadIcon, CheckIcon, SpinnerIcon, LetterCaseIcon } from './icons'
import type { Dialogo } from '../pages/Dashboard'

interface DialogProps {
  dialog: Dialogo
  onUpdate: (field: keyof Pick<Dialogo, 'character' | 'dialog'>, value: string) => void
  onUpdateGenerationType: (type: 'text' | 'video' | null) => void
  onVideoChange: (e: ChangeEvent<HTMLInputElement>) => void
  onGenerate: () => Promise<void>
}

function Dialog({ dialog, onUpdate, onUpdateGenerationType, onVideoChange, onGenerate }: DialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const handleSelectText = () => {
    onUpdateGenerationType('text')
  }

  const handleSelectVideo = () => {
    onUpdateGenerationType('video')
    fileInputRef.current?.click()
  }

  const handleGenerate = async () => {
    if (!dialog.character) {
      setAlertMessage('Por favor selecciona un personaje')
      return
    }
    if (!dialog.generationType) {
      setAlertMessage('Por favor selecciona un tipo de generación')
      return
    }
    if (dialog.generationType === 'video' && !dialog.video) {
      setAlertMessage('Por favor sube un video')
      return
    }
    if (dialog.generationType === 'text' && !dialog.dialog) {
      setAlertMessage('Por favor escribe un diálogo')
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
        <div className='inline-flex rounded-md shadow-xs' role='group'>
          <Tooltip id={`text-tooltip-${dialog.index}`} content='Generar video a partir de texto'>
            <button
              type='button'
              onClick={handleSelectText}
              className={`px-4 py-2 text-sm font-medium rounded-s-lg cursor-pointer flex items-center ${
                dialog.generationType === 'text'
                  ? 'text-blue-700 bg-gray-100 border border-blue-700'
                  : 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700'
              }`}
            >
              <LetterCaseIcon />
            </button>
          </Tooltip>
          <Tooltip id={`video-tooltip-${dialog.index}`} content='Generar video a partir de un video'>
            <button
              type='button'
              onClick={handleSelectVideo}
              className={`px-4 py-2 text-sm font-medium rounded-e-lg cursor-pointer flex items-center ${
                dialog.generationType === 'video'
                  ? 'text-blue-700 bg-gray-100 border border-blue-700'
                  : 'text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700'
              }`}
            >
              <FileUploadIcon />
              {dialog.video && <CheckIcon className='ml-1 w-4 h-4 text-green-500' />}
            </button>
          </Tooltip>
        </div>
        <div className='flex items-center space-x-1'>
          <Tooltip id={`generate-tooltip-${dialog.index}`} content='Generar Video'>
            <button
              type='button'
              onClick={handleGenerate}
              className={`p-2 rounded-sm cursor-pointer ${
                dialog.processing || !dialog.character || !dialog.generationType || (dialog.generationType === 'video' && !dialog.video) || (dialog.generationType === 'text' && !dialog.dialog)
                  ? 'text-gray-500'
                  : 'text-gray-900'
              }`}
              disabled={dialog.processing || !dialog.character || !dialog.generationType || (dialog.generationType === 'video' && !dialog.video) || (dialog.generationType === 'text' && !dialog.dialog)}
            >
              {dialog.processing ? <SpinnerIcon /> : <SparklesIcon />}
              <span className='sr-only'>Generar video</span>
            </button>
          </Tooltip>
          <Tooltip id={`download-tooltip-${dialog.index}`} content='Descargar Video'>
            <button type='button' onClick={handleDownload} className={`p-2 rounded-sm cursor-pointer ${!dialog.videoUrl ? 'text-gray-500' : 'text-gray-900'}`} disabled={!dialog.videoUrl}>
              <DownloadIcon />
              <span className='sr-only'>Descargar video</span>
            </button>
          </Tooltip>
        </div>
      </div>
      <div className='px-4 py-2 bg-white rounded-b-lg'>
        <Select
          label='Personaje'
          id={`character-${dialog.index}`}
          value={dialog.character}
          onChange={(e) => onUpdate('character', e.target.value)}
          options={[
            { value: '', label: 'Selecciona un personaje' },
            { value: 'Narrador', label: 'Narrador' },
            { value: 'Progresista', label: 'Progresista' },
            { value: 'Conservador', label: 'Conservador' },
          ]}
          required
        />
        <div className='mt-4'>
          <Textarea
            label='Diálogo'
            placeholder='Dialog'
            value={dialog.dialog}
            onChange={(e) => onUpdate('dialog', e.target.value)}
            rows={4}
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

export default Dialog