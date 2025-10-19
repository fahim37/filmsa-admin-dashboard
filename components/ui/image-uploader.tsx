"use client"

import { useState, useRef, useEffect } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  onUploadComplete?: (file: File) => void
  onFileSelect?: (file: File) => void
  defaultImage?: string
  existingImage?: string
  className?: string
}

export function ImageUploader({
  onUploadComplete,
  onFileSelect,
  defaultImage,
  existingImage,
  className,
}: ImageUploaderProps) {
  const initialPreview = defaultImage || existingImage || ""
  const [preview, setPreview] = useState<string>(initialPreview)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(defaultImage || existingImage || "")
  }, [defaultImage, existingImage])

  const handleFileSelect = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    onUploadComplete?.(file)
    onFileSelect?.(file)
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
        preview ? "border-primary" : "border-border hover:border-primary/50",
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
        className="hidden"
      />
      {preview ? (
        <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-32 rounded-lg object-contain" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Drag and drop image here, or click add image</p>
        </div>
      )}
    </div>
  )
}
