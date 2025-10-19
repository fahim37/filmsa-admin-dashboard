"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { VideoUploader } from "@/components/video-uploader/video-uploader"
import { ImageUploader } from "@/components/ui/image-uploader"
import { genreApi } from "@/lib/api"
import type { Movie } from "@/lib/types"

interface MovieFormProps {
  onSubmit: (data: MovieFormData) => Promise<void>
  movie?: Movie | null
  isLoading?: boolean
}

export interface MovieFormData {
  title: string
  description: string
  releaseDate: string
  genre: string[]
  language: string
  duration: number
  cast: string[]
  directors: string[]
  thumbnailUrl: string | File
  trailerUrl: string
  videoUrl: string
  isPremium: boolean
  visibility: "private" | "public" | "schedule"
  scheduleDate?: string
  scheduleTime?: string
}

export function MovieForm({ onSubmit, movie, isLoading }: MovieFormProps) {
  const [formData, setFormData] = useState<MovieFormData>({
    title: movie?.title || "",
    description: movie?.description || "",
    releaseDate: movie?.releaseDate ? new Date(movie.releaseDate).toISOString().split("T")[0] : "",
    genre: movie?.genre || [],
    language: movie?.language || "English",
    duration: movie?.duration || 0,
    cast: movie?.cast || [],
    directors: movie?.directors || [],
    thumbnailUrl: movie?.thumbnailUrl || "",
    trailerUrl: movie?.trailerUrl || "",
    videoUrl: movie?.videoUrl || "",
    isPremium: movie?.isPremium || false,
    visibility: "public",
    scheduleDate: "",
    scheduleTime: "",
  })

  const [castInput, setCastInput] = useState("")
  const [directorInput, setDirectorInput] = useState("")

  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: genreApi.getAll,
  })

  const genres = genresData?.data || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addCast = () => {
    if (castInput.trim()) {
      setFormData((prev) => ({ ...prev, cast: [...prev.cast, castInput.trim()] }))
      setCastInput("")
    }
  }

  const removeCast = (index: number) => {
    setFormData((prev) => ({ ...prev, cast: prev.cast.filter((_, i) => i !== index) }))
  }

  const addDirector = () => {
    if (directorInput.trim()) {
      setFormData((prev) => ({ ...prev, directors: [...prev.directors, directorInput.trim()] }))
      setDirectorInput("")
    }
  }

  const removeDirector = (index: number) => {
    setFormData((prev) => ({ ...prev, directors: prev.directors.filter((_, i) => i !== index) }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Series Name</Label>
            <Input
              id="title"
              placeholder="Type series name here..."
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Video</Label>
            <VideoUploader
              onUploadComplete={(url) => setFormData((prev) => ({ ...prev, videoUrl: url }))}
              label="Upload your video"
            />
          </div>

          <div className="space-y-2">
            <Label>Trailer</Label>
            <VideoUploader
              onUploadComplete={(url) => setFormData((prev) => ({ ...prev, trailerUrl: url }))}
              label="Upload trailer video"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Type description here..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={6}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Save or publish</Label>
            <RadioGroup
              value={formData.visibility}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, visibility: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="font-normal">
                  Private
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="font-normal">
                  Public
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="schedule" id="schedule" />
                <Label htmlFor="schedule" className="font-normal">
                  Schedule
                </Label>
              </div>
            </RadioGroup>

            {formData.visibility === "schedule" && (
              <div className="flex gap-4 rounded-lg border border-border p-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="scheduleDate">Date</Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    value={formData.scheduleDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, scheduleDate: e.target.value }))}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="scheduleTime">Time</Label>
                  <Input
                    id="scheduleTime"
                    type="time"
                    value={formData.scheduleTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, scheduleTime: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="button" variant="outline">
                    Time zone
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="genre">Genres</Label>
            <Select
              value={formData.genre[0] || ""}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, genre: [value] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre: any) => (
                  <SelectItem key={genre._id} value={genre._id}>
                    {genre.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              placeholder="Type language here..."
              value={formData.language}
              onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="120"
              value={formData.duration || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="releaseDate">Release Date</Label>
            <Input
              id="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, releaseDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Cast</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add cast member"
                value={castInput}
                onChange={(e) => setCastInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCast())}
              />
              <Button type="button" onClick={addCast}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.cast.map((member, index) => (
                <div key={index} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                  {member}
                  <button type="button" onClick={() => removeCast(index)} className="ml-1 hover:text-destructive">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Directors</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add director"
                value={directorInput}
                onChange={(e) => setDirectorInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDirector())}
              />
              <Button type="button" onClick={addDirector}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.directors.map((director, index) => (
                <div key={index} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                  {director}
                  <button type="button" onClick={() => removeDirector(index)} className="ml-1 hover:text-destructive">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <ImageUploader
              onUploadComplete={(file) => setFormData((prev) => ({ ...prev, thumbnailUrl: file }))}
              defaultImage={typeof formData.thumbnailUrl === "string" ? formData.thumbnailUrl : undefined}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? "Saving..." : movie ? "Update Movie" : "Save Movie"}
        </Button>
      </div>
    </form>
  )
}
