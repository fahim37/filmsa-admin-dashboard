"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { ReelTable } from "@/components/reels/reel-table"
import { ReelFormDialog } from "@/components/reels/reel-form-dialog"
import { reelsApi } from "@/lib/api"
import { toast } from "sonner"
import type { Reel } from "@/lib/types"

export default function ReelsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingReel, setEditingReel] = useState<Reel | null>(null)
  const itemsPerPage = 10
  const queryClient = useQueryClient()

  // Fetch reels
  const { data: reelsData, isLoading: isLoadingReels } = useQuery({
    queryKey: ["reels"],
    queryFn: async () => {
      const response = await reelsApi.getAll()
      return response.data || []
    },
  })

  // Create reel mutation
  const createMutation = useMutation({
    mutationFn: reelsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reels"] })
      toast.success("Reel created successfully")
      setShowCreateDialog(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create reel")
    },
  })

  // Update reel mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => reelsApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reels"] })
      toast.success("Reel updated successfully")
      setEditingReel(null)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update reel")
    },
  })

  // Delete reel mutation
  const deleteMutation = useMutation({
    mutationFn: reelsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reels"] })
      toast.success("Reel deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete reel")
    },
  })

  const handleCreate = (formData: FormData) => {
    createMutation.mutate(formData)
  }

  const handleUpdate = (formData: FormData) => {
    if (editingReel) {
      updateMutation.mutate({ id: editingReel._id, formData })
    }
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const reels = reelsData || []
  const totalPages = Math.ceil(reels.length / itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reels</h1>
          <p className="text-muted-foreground">Dashboard › Reels</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Reel
        </Button>
      </div>

      <ReelTable
        reels={reels}
        isLoading={isLoadingReels}
        onEdit={setEditingReel}
        onDelete={handleDelete}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      <ReelFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {editingReel && (
        <ReelFormDialog
          open={!!editingReel}
          onOpenChange={(open) => !open && setEditingReel(null)}
          onSubmit={handleUpdate}
          reel={editingReel}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  )
}
