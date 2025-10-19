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
import type { Reel } from "@/lib/types"

interface ReelFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormData) => void
  reel?: Reel | null
  isLoading?: boolean
}

export function ReelFormDialog({ open, onOpenChange, onSubmit, reel, isLoading }: ReelFormDialogProps) {
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>(reel?.videoUrl || "")

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: reel?.title || "",
      description: reel?.description || "",
    },
  })

  const handleFormSubmit = (formValues: any) => {
    const formData = new FormData()
    formData.append("title", formValues.title)
    formData.append("description", formValues.description)

    if (thumbnailFile) {
      formData.append("thumbnailUrl", thumbnailFile)
    }
    if (videoUrl) {
      formData.append("videoUrl", videoUrl)
    }

    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reel ? "Edit Reel" : "Create Reel"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="cursor-pointer">
              Title
            </Label>
            <Input id="title" {...register("title", { required: true })} placeholder="Enter reel title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="cursor-pointer">
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description", { required: true })}
              placeholder="Enter reel description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="cursor-pointer">Thumbnail</Label>
            <ImageUploader onFileSelect={setThumbnailFile} existingImage={reel?.thumbnailUrl} />
          </div>

          <div className="space-y-2">
            <Label className="cursor-pointer">Video</Label>
            <VideoUploader
              onUploadComplete={(url) => setVideoUrl(url)}
              existingVideoUrl={reel?.videoUrl}
              label="Upload reel video"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              {isLoading ? "Saving..." : reel ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
