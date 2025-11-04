import { useState } from 'react'
import Select from './Select'
import Textarea from './Textarea'
import Tooltip from './Tooltip'
import Alert from './Alert'
import { SparklesIcon, DownloadIcon, SpinnerIcon, LetterCaseIcon } from './icons'
import type { Dialogo } from '../pages/Dashboard'

interface DialogProps {
  dialog: Dialogo
  onUpdate: (field: keyof Pick<Dialogo, 'character' | 'dialog' | 'background'>, value: string) => void
  onGenerate: () => Promise<void>
}

function Dialog({ dialog, onUpdate, onGenerate }: DialogProps) {
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!dialog.background) {
      setAlertMessage('Por favor selecciona un fondo')
      return
    }
    if (!dialog.character) {
      setAlertMessage('Por favor selecciona un personaje')
      return
    }
    if (!dialog.dialog) {
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
        <div className='flex items-center space-x-2'>
          <div className='inline-flex rounded-md shadow-xs' role='group'>
            <Tooltip id={`text-tooltip-${dialog.index}`} content='Generar video a partir de texto'>
              <button
                type='button'
                className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer flex items-center text-blue-700 bg-gray-100 border border-blue-700`}
              >
                <LetterCaseIcon />
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
                dialog.processing || !dialog.character || !dialog.dialog
                  ? 'text-gray-500'
                  : 'text-gray-900'
              }`}
              disabled={dialog.processing || !dialog.background || !dialog.character || !dialog.dialog}
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
              { value: 'Narrador', label: 'Narrador' },
              { value: 'Progresista', label: 'Progresista' },
              { value: 'Conservador', label: 'Conservador' },
            ]}
            required
          />
          <Select
            label='Escenario'
            id={`background-${dialog.index}`}
            value={dialog.background}
            onChange={(e) => onUpdate('background', e.target.value)}
            options={[
              { value: '', label: 'Selecciona un fondo' },
              { value: 'cityhall', label: 'Ayuntamiento' },
              { value: 'home', label: 'Casa' },
              { value: 'newscast', label: 'Noticiero' },
              { value: 'podcast', label: 'Podcast' },
              { value: 'street', label: 'Calle' },
              { value: 'university', label: 'Universidad' }
            ]}
            required
          />
        </div>
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
    </div>
  )
}

export default Dialog