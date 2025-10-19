"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VideoUploader } from "@/components/video-uploader/video-uploader"
import { ImageUploader } from "@/components/ui/image-uploader"

interface AddSeasonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => void
  nextSeasonNumber: number
}

export function AddSeasonDialog({ open, onOpenChange, onSubmit, nextSeasonNumber }: AddSeasonDialogProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [trailerUrl, setTrailerUrl] = useState<string>("")

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      seasonNumber: nextSeasonNumber,
      name: "",
    },
  })

  const handleFormSubmit = (formValues: any) => {
    const formData = new FormData()
    formData.append("seasonNumber", String(formValues.seasonNumber))
    formData.append("name", formValues.name)

    if (thumbnailFile) {
      formData.append("thumbnailUrl", thumbnailFile)
    }
    if (trailerUrl) {
      formData.append("trailerUrl", trailerUrl)
    }

    onSubmit(formData)
    reset()
    setThumbnailFile(null)
    setTrailerUrl("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Season</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seasonNumber" className="cursor-pointer">
                Season Number
              </Label>
              <Input id="seasonNumber" type="number" {...register("seasonNumber", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="cursor-pointer">
                Season Name (Optional)
              </Label>
              <Input id="name" {...register("name")} placeholder="e.g., The Beginning" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="cursor-pointer">Thumbnail (Optional)</Label>
            <ImageUploader onFileSelect={setThumbnailFile} />
          </div>

          <div className="space-y-2">
            <Label className="cursor-pointer">Trailer (Optional)</Label>
            <VideoUploader onUploadComplete={(url) => setTrailerUrl(url)} label="Upload season trailer" />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer">
              Add Season
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
