"use client"
import { useState } from "react"
import { Edit2, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { VideoPreviewDialog } from "@/components/video-uploader/video-preview-dialog"
import type { Reel } from "@/lib/types"

interface ReelTableProps {
  reels: Reel[] | null | undefined // Allow reels to be null or undefined
  isLoading: boolean
  onEdit: (reel: Reel) => void
  onDelete: (id: string) => void
  currentPage: number
  itemsPerPage: number
}

export function ReelTable({ reels, isLoading, onEdit, onDelete, currentPage, itemsPerPage }: ReelTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [previewReel, setPreviewReel] = useState<Reel | null>(null)

  // Use a default empty array if reels is not an array
  const validReels = Array.isArray(reels) ? reels : []
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReels = validReels.slice(startIndex, startIndex + itemsPerPage)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Reel</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReels.length > 0 ? (
              paginatedReels.map((reel) => (
                <TableRow key={reel._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={reel.thumbnailUrl || "/placeholder.svg"}
                        alt={reel.title}
                        className="h-16 w-24 rounded object-cover"
                      />
                      <div className="space-y-1">
                        <p className="font-medium">{reel.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{reel.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{reel.views || 0}</TableCell>
                  <TableCell>{reel.likes || 0}</TableCell>
                  <TableCell>{new Date(reel.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => setPreviewReel(reel)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onEdit(reel)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeleteId(reel._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No reels available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the reel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {previewReel && (
        <VideoPreviewDialog
          open={!!previewReel}
          onOpenChange={(open) => !open && setPreviewReel(null)}
          videoUrl={previewReel.videoUrl}
          title={previewReel.title}
        />
      )}
    </>
  )
}