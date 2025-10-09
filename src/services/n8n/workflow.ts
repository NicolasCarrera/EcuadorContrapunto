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

export interface HedraVideoData {
  character: Character
  dialog: string
}

export interface VideoResponse {
  id: string
  generatedVideo: string
}

export interface MergeVideoInput {
  id: string
  index: number
  video_url: string
}

export interface MergeVideoResponse {
  success: boolean
  videoUrl?: string
  error?: string
}

export interface PostVideoResponse {
  video_url: string
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

export const generateVideoRunway = async (data: DialogVideoData): Promise<VideoResponse> => {
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
    id: videoData.id,
    generatedVideo: videoData.url || ''
  }
}

export const generateVideoHedra = async (data: HedraVideoData): Promise<VideoResponse> => {
  const response = await fetch(`${import.meta.env.VITE_N8N_URL}/webhook/generate-video-hedra`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      character: data.character,
      dialog: data.dialog
    })
  })

  if (!response.ok) {
    throw new Error('Failed to generate video with Hedra')
  }

  const result = await response.json()
  // Handle if wrapped in array
  const videoData = Array.isArray(result) ? result[0] : result
  return {
    id: videoData.id,
    generatedVideo: videoData.url || ''
  }
}

export const mergeVideos = async (videos: MergeVideoInput[]): Promise<MergeVideoResponse> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_N8N_URL}/webhook/merge-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ videos })
    })

    if (!response.ok) {
      throw new Error('Failed to merge videos')
    }

    const result = await response.json()
    const base64Data = result.data
    if (!base64Data) {
      throw new Error('No video data received')
    }

    const videoUrl = `data:video/mp4;base64,${base64Data}`
    return {
      success: true,
      videoUrl
    }
  } catch (error) {
    console.error('Error merging videos:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export const postVideo = async (data: { title: string, summary: string, video: string }): Promise<PostVideoResponse> => {
  const response = await fetch(`${import.meta.env.VITE_N8N_URL}/webhook/post-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Failed to post video')
  }

  const result = await response.json()
  const videoData = Array.isArray(result) ? result[0] : result
  return {
    video_url: videoData.video_url
  }
}