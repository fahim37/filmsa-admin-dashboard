"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieTable } from "@/components/movies/movie-table"
import { Pagination } from "@/components/ui/pagination"
import { movieApi } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Movie } from "@/lib/types"

export default function MoviesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const router = useRouter()

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: movieApi.getAll,
  })

  const movies = data?.data.movies || []
  const totalPages = Math.ceil(movies.length / itemsPerPage)

  const deleteMutation = useMutation({
    mutationFn: movieApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] })
      toast.success("Movie deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleEdit = (movie: Movie) => {
    router.push(`/movies/edit/${movie._id}`)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Movie</h1>
          <p className="text-muted-foreground">Dashboard › Movie</p>
        </div>
        <Button onClick={() => router.push("/movies/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Movie
        </Button>
      </div>

      <MovieTable
        movies={movies}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  )
}
