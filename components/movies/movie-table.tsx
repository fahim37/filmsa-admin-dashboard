"use client"

import { useState } from "react"
import { Edit2, Trash2, Eye, Globe } from "lucide-react"
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
import type { Movie } from "@/lib/types"

interface MovieTableProps {
  movies: Movie[]
  isLoading: boolean
  onEdit: (movie: Movie) => void
  onDelete: (id: string) => void
  currentPage: number
  itemsPerPage: number
}

export function MovieTable({ movies, isLoading, onEdit, onDelete, currentPage, itemsPerPage }: MovieTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null)

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMovies = movies.slice(startIndex, startIndex + itemsPerPage)

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
              <TableHead>Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMovies.map((movie) => (
              <TableRow key={movie._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={movie.thumbnailUrl || "/placeholder.svg"}
                      alt={movie.title}
                      className="h-16 w-24 rounded object-cover"
                    />
                    <div className="space-y-1">
                      <p className="font-medium">{movie.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{movie.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                  </div>
                </TableCell>
                <TableCell>Action</TableCell>
                <TableCell>{new Date(movie.releaseDate).toLocaleDateString()}</TableCell>
                <TableCell>45</TableCell>
                <TableCell>45</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setPreviewMovie(movie)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onEdit(movie)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeleteId(movie._id)}>
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
              This action cannot be undone. This will permanently delete the movie.
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

      {previewMovie && (
        <VideoPreviewDialog
          open={!!previewMovie}
          onOpenChange={(open) => !open && setPreviewMovie(null)}
          videoUrl={previewMovie.videoUrl}
          title={previewMovie.title}
        />
      )}
    </>
  )
}
