"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Upload, X, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { uploadApi } from "@/lib/api"
import { toast } from "sonner"
import { VideoPreviewDialog } from "./video-preview-dialog"

interface VideoUploaderProps {
  onUploadComplete?: (playbackUrl: string) => void
  onUploadError?: (error: string) => void
  onFileSelect?: (file: File | null) => void
  existingVideoUrl?: string
  label?: string
  accept?: string
  maxSizeMB?: number
  className?: string
}

const CHUNK_SIZE = 10 * 1024 * 1024 // 10MB chunks

export function VideoUploader({
  onUploadComplete,
  onUploadError,
  onFileSelect,
  existingVideoUrl,
  label = "Upload your video",
  accept = "video/*",
  maxSizeMB = 5000,
  className,
}: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(existingVideoUrl || null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File size exceeds ${maxSizeMB}MB limit`)
        return
      }

      if (!selectedFile.type.startsWith("video/")) {
        toast.error("Please select a valid video file")
        return
      }

      setFile(selectedFile)
      setProgress(0)
      setPlaybackUrl(null)

      onFileSelect?.(selectedFile)
    },
    [maxSizeMB, onFileSelect],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        handleFileSelect(droppedFile)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const uploadChunk = async (chunk: Blob, partNumber: number, uploadId: string, key: string, fileType: string) => {
    const { data } = await uploadApi.getPartUrl(uploadId, partNumber, key, fileType)
    const signedUrl = data.signedUrl

    const response = await fetch(signedUrl, {
      method: "PUT",
      body: chunk,
      signal: abortControllerRef.current?.signal,
    })

    const etag = response.headers.get("ETag")
    if (!etag) throw new Error("No ETag returned from S3")

    return { ETag: etag.replace(/"/g, ""), PartNumber: partNumber }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)
    abortControllerRef.current = new AbortController()

    try {
      // Step 1: Initiate multipart upload
      const { data: initiateData } = await uploadApi.initiateMultipart(file.name, file.type)
      const { uploadId, key } = initiateData

      // Step 2: Upload chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
      const uploadedParts: Array<{ ETag: string; PartNumber: number }> = []

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end)

        const part = await uploadChunk(chunk, i + 1, uploadId, key, file.type)
        uploadedParts.push(part)

        const currentProgress = Math.round(((i + 1) / totalChunks) * 90)
        setProgress(currentProgress)
      }

      // Step 3: Complete multipart upload
      setProgress(95)
      const { data: completeData } = await uploadApi.completeMultipart(uploadId, key, uploadedParts)

      const finalPlaybackUrl = completeData.mediaJobId?.playbackUrl || completeData.rawFileUrl
      setPlaybackUrl(finalPlaybackUrl)
      setProgress(100)

      toast.success("Video uploaded successfully!")
      onUploadComplete?.(finalPlaybackUrl)
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.info("Upload cancelled")
      } else {
        const errorMessage = error.message || "Upload failed"
        toast.error(errorMessage)
        onUploadError?.(errorMessage)
      }
      setProgress(0)
    } finally {
      setUploading(false)
      abortControllerRef.current = null
    }
  }

  const handleCancel = () => {
    abortControllerRef.current?.abort()
    setUploading(false)
    setProgress(0)
  }

  const handleRemove = () => {
    setFile(null)
    setProgress(0)
    setPlaybackUrl(existingVideoUrl || null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onFileSelect?.(null as any)
  }

  const hasVideo = file || existingVideoUrl

  return (
    <div className={cn("space-y-4", className)}>
      {!hasVideo ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 p-12 transition-colors hover:border-primary/50 hover:bg-muted/40"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => {
              const selectedFile = e.target.files?.[0]
              if (selectedFile) handleFileSelect(selectedFile)
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="mt-1 text-xs text-muted-foreground">Drag and drop or click to browse</p>
              <p className="mt-1 text-xs text-muted-foreground">Max size: {maxSizeMB}MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium truncate">{file?.name || "Existing video"}</p>
              {file && <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>}
            </div>
            <div className="flex items-center gap-2">
              {(playbackUrl || existingVideoUrl) && (
                <Button type="button" size="icon" variant="outline" onClick={() => setPreviewOpen(true)}>
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {!uploading && (
                <Button type="button" size="icon" variant="ghost" onClick={handleRemove}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {progress > 0 && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {progress < 95 ? `Uploading: ${progress}%` : "Processing video..."}
              </p>
            </div>
          )}

          {file && !uploading && progress === 0 && !onFileSelect && (
            <Button type="button" onClick={handleUpload} className="w-full">
              Start Upload
            </Button>
          )}

          {uploading && (
            <Button type="button" onClick={handleCancel} variant="destructive" className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cancel Upload
            </Button>
          )}
        </div>
      )}

      {(playbackUrl || existingVideoUrl) && (
        <VideoPreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          videoUrl={playbackUrl || existingVideoUrl || ""}
          title={file?.name || "Video Preview"}
        />
      )}
    </div>
  )
}
