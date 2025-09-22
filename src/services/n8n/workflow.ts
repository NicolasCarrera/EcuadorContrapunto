export type Character = "Narrador" | "Progresista" | "Conservador"

export interface NewsScript {
  title: string
  summary: string
  dialogs: Array<{
    index: number
    character: Character
    dialog: string
  }>
}

export interface DialogVideoData {
  character: Character
  video?: File
}

export interface VideoResponse {
  output: string
}

export const generateNewsScript = async (searchQuery?: string): Promise<NewsScript> => {
  const body = searchQuery ? JSON.stringify({ search_query: searchQuery }) : undefined
  const response = await fetch(`${import.meta.env.VITE_N8N_URL}/webhook/generate-news-script`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })
  if (!response.ok) {
    throw new Error('Failed to generate news script')
  }
  const data = await response.json()
  // Handle case where response is an array with a single object
  const scriptData: NewsScript = Array.isArray(data) ? data[0] : data
  return {
    title: scriptData.title || '',
    summary: scriptData.summary || '',
    dialogs: scriptData.dialogs || []
  }
}

export const generateVideos = async (data: DialogVideoData): Promise<VideoResponse> => {
  const formData = new FormData()
  formData.append('character', data.character)
  if (data.video) {
    formData.append('video', data.video)
  }

  const response = await fetch(`${import.meta.env.VITE_N8N_URL}/webhook/generate-video-runway`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to generate video')
  }

  const result = await response.json()
  // Handle if wrapped in array
  const videoData = Array.isArray(result) ? result[0] : result
  return {
    output: videoData.output || ''
  }
}