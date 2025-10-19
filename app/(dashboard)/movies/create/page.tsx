"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MovieForm, type MovieFormData } from "@/components/movies/movie-form"
import { movieApi } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CreateMoviePage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: movieApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] })
      toast.success("Movie created successfully")
      router.push("/movies")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleSubmit = async (data: MovieFormData) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("releaseDate", data.releaseDate)
    formData.append("language", data.language)
    formData.append("duration", data.duration.toString())
    formData.append("videoUrl", data.videoUrl)
    formData.append("trailerUrl", data.trailerUrl)
    formData.append("isPremium", data.isPremium.toString())

    data.genre.forEach((g) => formData.append("genre[]", g))
    data.cast.forEach((c) => formData.append("cast[]", c))
    data.directors.forEach((d) => formData.append("directors[]", d))

    if (data.thumbnailUrl instanceof File) {
      formData.append("thumbnailUrl", data.thumbnailUrl)
    } else {
      formData.append("thumbnailUrl", data.thumbnailUrl)
    }

    await createMutation.mutateAsync(formData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Movie</h1>
          <p className="text-muted-foreground">Dashboard › Movie › Create Movie</p>
        </div>
      </div>

      <MovieForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
    </div>
  )
}
