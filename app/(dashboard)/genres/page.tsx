"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenreTable } from "@/components/genres/genre-table"
import { GenreFormDialog } from "@/components/genres/genre-form-dialog"
import { Pagination } from "@/components/ui/pagination"
import { genreApi } from "@/lib/api"
import { toast } from "sonner"
import type { Genre } from "@/lib/types"

export default function GenresPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: genreApi.getAll,
  })

  const genres = data?.data || []
  const totalPages = Math.ceil(genres.length / itemsPerPage)

  const createMutation = useMutation({
    mutationFn: genreApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] })
      toast.success("Genre created successfully")
      setDialogOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => genreApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] })
      toast.success("Genre updated successfully")
      setDialogOpen(false)
      setEditingGenre(null)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: genreApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] })
      toast.success("Genre deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = async (data: { title: string; thumbnail: File | null }) => {
    const formData = new FormData()
    formData.append("title", data.title)
    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail)
    }

    if (editingGenre) {
      await updateMutation.mutateAsync({ id: editingGenre._id, formData })
    } else {
      await createMutation.mutateAsync(formData)
    }
  }

  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Genres</h1>
          <p className="text-muted-foreground">Dashboard › Genres</p>
        </div>
        <Button
          onClick={() => {
            setEditingGenre(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Genres
        </Button>
      </div>

      <GenreTable
        genres={genres}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      <GenreFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingGenre(null)
        }}
        onSubmit={handleSubmit}
        genre={editingGenre}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
