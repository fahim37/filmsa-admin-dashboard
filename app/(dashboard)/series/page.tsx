"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { SeriesTable } from "@/components/series/series-table"
import { SeriesFormDialog } from "@/components/series/series-form-dialog"
import { SeasonManagementDialog } from "@/components/series/season-management-dialog"
import { seriesApi, genreApi } from "@/lib/api"
import { toast } from "sonner"
import type { Series } from "@/lib/types"

export default function SeriesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingSeries, setEditingSeries] = useState<Series | null>(null)
  const [managingSeries, setManagingSeries] = useState<Series | null>(null)
  const itemsPerPage = 10
  const queryClient = useQueryClient()

  // Fetch series
  const { data: seriesData, isLoading: isLoadingSeries } = useQuery({
    queryKey: ["series"],
    queryFn: async () => {
      const response = await seriesApi.getAll()
      return response.data.series || []
    },
  })

  // Fetch genres
  const { data: genresData } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await genreApi.getAll()
      return response.data || []
    },
  })

  // Create series mutation
  const createMutation = useMutation({
    mutationFn: seriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] })
      toast.success("Series created successfully")
      setShowCreateDialog(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create series")
    },
  })

  // Update series mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => seriesApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] })
      toast.success("Series updated successfully")
      setEditingSeries(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update series")
    },
  })

  // Delete series mutation
  const deleteMutation = useMutation({
    mutationFn: seriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] })
      toast.success("Series deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete series")
    },
  })

  // Add season mutation
  const addSeasonMutation = useMutation({
    mutationFn: ({ seriesId, formData }: { seriesId: string; formData: FormData }) =>
      seriesApi.addSeason(seriesId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] })
      toast.success("Season added successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add season")
    },
  })

  // Add episode mutation
  const addEpisodeMutation = useMutation({
    mutationFn: ({
      seriesId,
      seasonNumber,
      formData,
    }: { seriesId: string; seasonNumber: number; formData: FormData }) =>
      seriesApi.addEpisode(seriesId, seasonNumber, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] })
      toast.success("Episode added successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add episode")
    },
  })

  const handleCreate = (formData: FormData) => {
    createMutation.mutate(formData)
  }

  const handleUpdate = (formData: FormData) => {
    if (editingSeries) {
      updateMutation.mutate({ id: editingSeries._id, formData })
    }
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleAddSeason = (formData: FormData) => {
    if (managingSeries) {
      addSeasonMutation.mutate({ seriesId: managingSeries._id, formData })
    }
  }

  const handleAddEpisode = (seasonNumber: number, formData: FormData) => {
    if (managingSeries) {
      addEpisodeMutation.mutate({ seriesId: managingSeries._id, seasonNumber, formData })
    }
  }

  const series = seriesData || []
  const genres = genresData || []
  const totalPages = Math.ceil(series.length / itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Series</h1>
          <p className="text-muted-foreground">Dashboard › Series</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Series
        </Button>
      </div>

      <SeriesTable
        series={series}
        isLoading={isLoadingSeries}
        onEdit={setEditingSeries}
        onDelete={handleDelete}
        onManageSeasons={setManagingSeries}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      <SeriesFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        genres={genres}
        isLoading={createMutation.isPending}
      />

      {editingSeries && (
        <SeriesFormDialog
          open={!!editingSeries}
          onOpenChange={(open) => !open && setEditingSeries(null)}
          onSubmit={handleUpdate}
          series={editingSeries}
          genres={genres}
          isLoading={updateMutation.isPending}
        />
      )}

      {managingSeries && (
        <SeasonManagementDialog
          open={!!managingSeries}
          onOpenChange={(open) => !open && setManagingSeries(null)}
          series={managingSeries}
          onAddSeason={handleAddSeason}
          onAddEpisode={handleAddEpisode}
        />
      )}
    </div>
  )
}
