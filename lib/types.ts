export interface Genre {
  _id: string
  title: string
  thumbnail: string
  user: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export interface Movie {
  _id: string
  title: string
  description: string
  releaseDate: string
  genre: string[]
  language: string
  duration: number
  cast: string[]
  directors: string[]
  thumbnailUrl: string
  trailerUrl: string
  videoUrl: string
  isPremium: boolean
  createdAt: string
  updatedAt: string
}

export interface Episode {
  _id?: string
  episodeNumber: number
  title: string
  description: string
  duration?: number
  videoUrl: string
  thumbnailUrl: string
  trailerUrl?: string
  releaseDate: string
}

export interface Season {
  _id?: string
  seasonNumber: number
  name?: string
  thumbnailUrl?: string
  trailerUrl?: string
  episodes: Episode[]
}

export interface Series {
  _id: string
  title: string
  description: string
  genre: string[] | Genre[]
  language: string
  releaseDate: string
  cast: string[]
  directors: string[]
  thumbnailUrl: string
  trailerUrl: string
  isPremium: boolean
  status?: string
  publishDate?: string
  seasons: Season[]
  createdAt: string
  updatedAt: string
}

export interface Reel {
  _id: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  views?: number
  likes?: number
  createdAt: string
  updatedAt: string
}

export interface UploadProgress {
  uploadId: string
  key: string
  progress: number
  status: "idle" | "uploading" | "processing" | "completed" | "error"
  playbackUrl?: string
  error?: string
}
