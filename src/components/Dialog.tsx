import React, { useRef, useState } from 'react'
import Select from './Select'
import Textarea from './Textarea'
import Tooltip from './Tooltip'
import Alert from './Alert'
import { FileUploadIcon, SparklesIcon, DownloadIcon, CheckIcon, SpinnerIcon } from './icons'
import type { Dialogo } from '../pages/Dashboard'

interface DialogProps {
  dialog: Dialogo
  onUpdate: (field: keyof Pick<Dialogo, 'character' | 'dialog'>, value: string) => void
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onGenerate: () => Promise<void>
}

const Dialog: React.FC<DialogProps> = ({ dialog, onUpdate, onVideoChange, onGenerate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleGenerate = async () => {
    if (!dialog.character || !dialog.video) {
      setAlertMessage('Por favor selecciona un personaje y sube un video')
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
    <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <div className="flex items-center">
          <Tooltip id={`upload-tooltip-${dialog.index}`} content="Upload Video">
            <button type="button" onClick={handleUploadClick} className="p-2 text-gray-900 rounded-sm cursor-pointer flex items-center">
              <FileUploadIcon />
              {dialog.video && <CheckIcon className="ml-1 w-4 h-4 text-green-500" />}
              <span className="sr-only">Upload file</span>
            </button>
          </Tooltip>
        </div>
        <div className="flex items-center space-x-1">
          <Tooltip id={`generate-tooltip-${dialog.index}`} content="Generate Video">
            <button type="button" onClick={handleGenerate} className={`p-2 rounded-sm cursor-pointer ${dialog.processing || !dialog.video ? 'text-gray-500' : 'text-gray-900'}`} disabled={dialog.processing || !dialog.video}>
              {dialog.processing ? <SpinnerIcon /> : <SparklesIcon />}
              <span className="sr-only">Generate video</span>
            </button>
          </Tooltip>
          <Tooltip id={`download-tooltip-${dialog.index}`} content="Download Video">
            <button type="button" onClick={handleDownload} className={`p-2 rounded-sm cursor-pointer ${!dialog.videoUrl ? 'text-gray-500' : 'text-gray-900'}`} disabled={!dialog.videoUrl}>
              <DownloadIcon />
              <span className="sr-only">Download video</span>
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="px-4 py-2 bg-white rounded-b-lg">
        <Select
          label="Personaje"
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
        <div className="mt-4">
          <Textarea
            label="Diálogo"
            placeholder="Dialog"
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
        type="file"
        accept="video/mp4"
        onChange={onVideoChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default Dialog