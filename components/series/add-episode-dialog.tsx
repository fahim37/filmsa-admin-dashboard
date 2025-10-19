"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { VideoUploader } from "@/components/video-uploader/video-uploader"
import { ImageUploader } from "@/components/ui/image-uploader"

interface AddEpisodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => void
  seasonNumber: number
  nextEpisodeNumber: number
}

export function AddEpisodeDialog({
  open,
  onOpenChange,
  onSubmit,
  seasonNumber,
  nextEpisodeNumber,
}: AddEpisodeDialogProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [trailerUrl, setTrailerUrl] = useState<string>("")

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      episodeNumber: nextEpisodeNumber,
      title: "",
      description: "",
      releaseDate: "",
    },
  })

  const handleFormSubmit = (formValues: any) => {
    const formData = new FormData()
    formData.append("episodeNumber", String(formValues.episodeNumber))
    formData.append("title", formValues.title)
    formData.append("description", formValues.description)
    formData.append("releaseDate", formValues.releaseDate)

    if (thumbnailFile) {
      formData.append("thumbnailUrl", thumbnailFile)
    }
    if (videoUrl) {
      formData.append("videoUrl", videoUrl)
    }
    if (trailerUrl) {
      formData.append("trailerUrl", trailerUrl)
    }

    onSubmit(formData)
    reset()
    setThumbnailFile(null)
    setVideoUrl("")
    setTrailerUrl("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Episode to Season {seasonNumber}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="episodeNumber" className="cursor-pointer">
                Episode Number
              </Label>
              <Input id="episodeNumber" type="number" {...register("episodeNumber", { required: true })} />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="cursor-pointer">
              Episode Title
            </Label>
            <Input id="title" {...register("title", { required: true })} placeholder="Enter episode title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="cursor-pointer">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description", { required: true })}
              placeholder="Enter episode description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="cursor-pointer">Thumbnail</Label>
            <ImageUploader onFileSelect={setThumbnailFile} />
          </div>

          <div className="space-y-2">
            <Label className="cursor-pointer">Video File</Label>
            <VideoUploader onUploadComplete={(url) => setVideoUrl(url)} label="Upload episode video" />
          </div>

          <div className="space-y-2">
            <Label className="cursor-pointer">Trailer (Optional)</Label>
            <VideoUploader onUploadComplete={(url) => setTrailerUrl(url)} label="Upload episode trailer" />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer">
              Add Episode
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
