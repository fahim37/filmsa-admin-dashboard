"use client"

import { useState } from "react"
import { Edit2, Trash2, Eye, Plus } from "lucide-react"
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
import type { Series } from "@/lib/types"

interface SeriesTableProps {
  series: Series[]
  isLoading: boolean
  onEdit: (series: Series) => void
  onDelete: (id: string) => void
  onManageSeasons: (series: Series) => void
  currentPage: number
  itemsPerPage: number
}

export function SeriesTable({
  series,
  isLoading,
  onEdit,
  onDelete,
  onManageSeasons,
  currentPage,
  itemsPerPage,
}: SeriesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [previewSeries, setPreviewSeries] = useState<Series | null>(null)

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSeries = series.slice(startIndex, startIndex + itemsPerPage)

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
              <TableHead>Series</TableHead>
              <TableHead>Seasons</TableHead>
              <TableHead>Episodes</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSeries.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnailUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="h-16 w-24 rounded object-cover"
                    />
                    <div className="space-y-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.seasons?.length || 0}</TableCell>
                <TableCell>
                  {item.seasons?.reduce((acc, season) => acc + (season.episodes?.length || 0), 0) || 0}
                </TableCell>
                <TableCell>{item.language}</TableCell>
                <TableCell>{new Date(item.releaseDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setPreviewSeries(item)} title="Preview Trailer">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onManageSeasons(item)} title="Manage Seasons">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onEdit(item)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeleteId(item._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the series and all its seasons and episodes.
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

      {previewSeries && (
        <VideoPreviewDialog
          open={!!previewSeries}
          onOpenChange={(open) => !open && setPreviewSeries(null)}
          videoUrl={previewSeries.trailerUrl}
          title={`${previewSeries.title} - Trailer`}
        />
      )}
    </>
  )
}
