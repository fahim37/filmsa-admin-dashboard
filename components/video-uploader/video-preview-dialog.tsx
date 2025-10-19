"use client"

import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Hls from "hls.js"

interface VideoPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  videoUrl: string
  title?: string
}

export function VideoPreviewDialog({ open, onOpenChange, videoUrl, title = "Video Preview" }: VideoPreviewDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    if (!open || !videoRef.current) return

    const video = videoRef.current
    const isHLS = videoUrl.includes(".m3u8")

    if (isHLS) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        hls.loadSource(videoUrl)
        hls.attachMedia(video)
        hlsRef.current = hls

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {
            // Auto-play prevented
          })
        })

        return () => {
          hls.destroy()
          hlsRef.current = null
        }
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.src = videoUrl
        video.addEventListener("loadedmetadata", () => {
          video.play().catch(() => {
            // Auto-play prevented
          })
        })
      }
    } else {
      video.src = videoUrl
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [open, videoUrl])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <video ref={videoRef} controls className="h-full w-full" playsInline />
        </div>
      </DialogContent>
    </Dialog>
  )
}
