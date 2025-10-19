import axios from "axios"
import { getSession } from "next-auth/react"

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ""

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add token from NextAuth session
api.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    const token = session?.user?.accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "An error occurred"
    return Promise.reject(new Error(message))
  },
)

// Genre API functions
export const genreApi = {
  getAll: async () => {
    const { data } = await api.get("/genres")
    return data
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/genres/${id}`)
    return data
  },
  create: async (formData: FormData) => {
    const { data } = await api.post("/genres", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  update: async (id: string, formData: FormData) => {
    const { data } = await api.put(`/genres/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/genres/${id}`)
    return data
  },
}

// Movie API functions
export const movieApi = {
  getAll: async () => {
    const { data } = await api.get("/movies")
    return data
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/movies/${id}`)
    return data
  },
  create: async (formData: FormData) => {
    const { data } = await api.post("/movies", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  update: async (id: string, formData: FormData) => {
    const { data } = await api.put(`/movies/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/movies/${id}`)
    return data
  },
}

// Series API functions
export const seriesApi = {
  getAll: async () => {
    const { data } = await api.get("/series")
    return data
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/series/${id}`)
    return data
  },
  create: async (formData: FormData) => {
    const { data } = await api.post("/series", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  update: async (id: string, formData: FormData) => {
    const { data } = await api.patch(`/series/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/series/${id}`)
    return data
  },
  addSeason: async (seriesId: string, formData: FormData) => {
    const { data } = await api.post(`/series/${seriesId}/season`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  addEpisode: async (seriesId: string, seasonNumber: number, formData: FormData) => {
    const { data } = await api.post(`/series/${seriesId}/season/${seasonNumber}/episode`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
}

// Reels API functions
export const reelsApi = {
  getAll: async () => {
    const { data } = await api.get("/reels")
    return data
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/reels/${id}`)
    return data
  },
  create: async (formData: FormData) => {
    const { data } = await api.post("/reels", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  update: async (id: string, formData: FormData) => {
    const { data } = await api.patch(`/reels/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  delete: async (id: string) => {
    const { data } = await api.delete(`/reels/${id}`)
    return data
  },
}

// Video upload API functions
export const uploadApi = {
  initiateMultipart: async (fileName: string, fileType: string) => {
    const { data } = await api.post("/upload/initiate", { fileName, fileType })
    return data
  },
  getPartUrl: async (uploadId: string, partNumber: number, key: string, fileType: string) => {
    const { data } = await api.post("/upload/part-url", {
      uploadId,
      partNumber,
      key,
      fileType,
    })
    return data
  },
  completeMultipart: async (uploadId: string, key: string, parts: Array<{ ETag: string; PartNumber: number }>) => {
    const { data } = await api.post("/upload/complete", {
      uploadId,
      key,
      parts,
    })
    return data
  },
}
