"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VideoUploader } from "@/components/video-uploader/video-uploader"
import { ImageUploader } from "@/components/ui/image-uploader"
import { Switch } from "@/components/ui/switch"
import type { Series, Genre } from "@/lib/types"

interface SeriesFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => void
  series?: Series | null
  genres: Genre[]
  isLoading?: boolean
}

export function SeriesFormDialog({ open, onOpenChange, onSubmit, series, genres, isLoading }: SeriesFormDialogProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [trailerUrl, setTrailerUrl] = useState<string>(series?.trailerUrl || "")
  const [castInput, setCastInput] = useState("")
  const [cast, setCast] = useState<string[]>(series?.cast || [])
  const [directorInput, setDirectorInput] = useState("")
  const [directors, setDirectors] = useState<string[]>(series?.directors || [])
  const [isPremium, setIsPremium] = useState(series?.isPremium || false)

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: series?.title || "",
      description: series?.description || "",
      genre: series?.genre?.[0] || "",
      language: series?.language || "English",
      releaseDate: series?.releaseDate ? new Date(series.releaseDate).toISOString().split("T")[0] : "",
    },
  })

  const handleFormSubmit = (formValues: any) => {
    const formData = new FormData()
    formData.append("title", formValues.title)
    formData.append("description", formValues.description)
    formData.append("genre", JSON.stringify([formValues.genre]))
    formData.append("language", formValues.language)
    formData.append("releaseDate", formValues.releaseDate)
    formData.append("cast", JSON.stringify(cast))
    formData.append("directors", JSON.stringify(directors))
    formData.append("isPremium", String(isPremium))

    if (thumbnailFile) {
      formData.append("thumbnailUrl", thumbnailFile)
    }
    if (trailerUrl) {
      formData.append("trailerUrl", trailerUrl)
    }

    onSubmit(formData)
  }

  const addCast = () => {
    if (castInput.trim()) {
      setCast([...cast, castInput.trim()])
      setCastInput("")
    }
  }

  const removeCast = (index: number) => {
    setCast(cast.filter((_, i) => i !== index))
  }

  const addDirector = () => {
    if (directorInput.trim()) {
      setDirectors([...directors, directorInput.trim()])
      setDirectorInput("")
    }
  }

  const removeDirector = (index: number) => {
    setDirectors(directors.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{series ? "Edit Series" : "Create Series"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="cursor-pointer">
                Title
              </Label>
              <Input id="title" {...register("title", { required: true })} placeholder="Enter series title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="cursor-pointer">
                Description
              </Label>
              <Textarea
                id="description"
                {...register("description", { required: true })}
                placeholder="Enter series description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre" className="cursor-pointer">
                  Genre
                </Label>
                <Select onValueChange={(value) => setValue("genre", value)} defaultValue={watch("genre")}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres?.map((genre) => (
                      <SelectItem key={genre._id} value={genre._id} className="cursor-pointer">
                        {genre.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="cursor-pointer">
                  Language
                </Label>
                <Input id="language" {...register("language")} placeholder="e.g., English" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate" className="cursor-pointer">
                Release Date
              </Label>
              <Input
                id="releaseDate"
                type="date"
                {...register("releaseDate", { required: true })}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <Label className="cursor-pointer">Cast Members</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={castInput}
                  onChange={(e) => setCastInput(e.target.value)}
                  placeholder="Add cast member"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCast())}
                />
                <Button type="button" onClick={addCast} className="cursor-pointer">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cast.map((member, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm">
                    {member}
                    <button
                      type="button"
                      onClick={() => removeCast(index)}
                      className="ml-1 cursor-pointer hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="cursor-pointer">Directors</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={directorInput}
                  onChange={(e) => setDirectorInput(e.target.value)}
                  placeholder="Add director"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDirector())}
                />
                <Button type="button" onClick={addDirector} className="cursor-pointer">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {directors.map((director, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm">
                    {director}
                    <button
                      type="button"
                      onClick={() => removeDirector(index)}
                      className="ml-1 cursor-pointer hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="cursor-pointer">Thumbnail</Label>
              <ImageUploader onFileSelect={setThumbnailFile} existingImage={series?.thumbnailUrl} />
            </div>

            <div className="space-y-2">
              <Label className="cursor-pointer">Trailer Video</Label>
              <VideoUploader
                onUploadComplete={(url) => setTrailerUrl(url)}
                existingVideoUrl={series?.trailerUrl}
                label="Upload trailer video"
              />
            </div>

            <div className="flex items-center justify-between space-y-2">
              <Label htmlFor="isPremium" className="cursor-pointer">
                Premium Content
              </Label>
              <Switch id="isPremium" checked={isPremium} onCheckedChange={setIsPremium} className="cursor-pointer" />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              {isLoading ? "Saving..." : series ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
