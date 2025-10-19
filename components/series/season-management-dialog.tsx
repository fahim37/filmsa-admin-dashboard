"use client"

import { useState } from "react"
import { Plus, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AddSeasonDialog } from "./add-season-dialog"
import { AddEpisodeDialog } from "./add-episode-dialog"
import type { Series } from "@/lib/types"

interface SeasonManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  series: Series
  onAddSeason: (formData: FormData) => void
  onAddEpisode: (seasonNumber: number, formData: FormData) => void
}

export function SeasonManagementDialog({
  open,
  onOpenChange,
  series,
  onAddSeason,
  onAddEpisode,
}: SeasonManagementDialogProps) {
  const [showAddSeason, setShowAddSeason] = useState(false)
  const [showAddEpisode, setShowAddEpisode] = useState<number | null>(null)
  const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(new Set())

  const toggleSeason = (seasonNumber: number) => {
    const newExpanded = new Set(expandedSeasons)
    if (newExpanded.has(seasonNumber)) {
      newExpanded.delete(seasonNumber)
    } else {
      newExpanded.add(seasonNumber)
    }
    setExpandedSeasons(newExpanded)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Seasons & Episodes - {series.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Button onClick={() => setShowAddSeason(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Season
            </Button>

            <div className="space-y-3">
              {series.seasons?.map((season) => (
                <div key={season._id || season.seasonNumber} className="border rounded-lg p-4">
                  <Collapsible open={expandedSeasons.has(season.seasonNumber)}>
                    <div className="flex items-center justify-between">
                      <CollapsibleTrigger
                        onClick={() => toggleSeason(season.seasonNumber)}
                        className="flex items-center gap-2 flex-1"
                      >
                        {expandedSeasons.has(season.seasonNumber) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <div className="text-left">
                          <h3 className="font-semibold">
                            Season {season.seasonNumber}
                            {season.name && ` - ${season.name}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">{season.episodes?.length || 0} episodes</p>
                        </div>
                      </CollapsibleTrigger>
                      <Button size="sm" onClick={() => setShowAddEpisode(season.seasonNumber)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Episode
                      </Button>
                    </div>

                    <CollapsibleContent className="mt-4">
                      <div className="space-y-2">
                        {season.episodes?.map((episode) => (
                          <div
                            key={episode._id || episode.episodeNumber}
                            className="flex items-center gap-3 p-3 bg-secondary/50 rounded"
                          >
                            <img
                              src={episode.thumbnailUrl || "/placeholder.svg"}
                              alt={episode.title}
                              className="h-12 w-20 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                Episode {episode.episodeNumber}: {episode.title}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{episode.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddSeasonDialog
        open={showAddSeason}
        onOpenChange={setShowAddSeason}
        onSubmit={(formData) => {
          onAddSeason(formData)
          setShowAddSeason(false)
        }}
        nextSeasonNumber={(series.seasons?.length || 0) + 1}
      />

      {showAddEpisode !== null && (
        <AddEpisodeDialog
          open={showAddEpisode !== null}
          onOpenChange={(open) => !open && setShowAddEpisode(null)}
          onSubmit={(formData) => {
            onAddEpisode(showAddEpisode, formData)
            setShowAddEpisode(null)
          }}
          seasonNumber={showAddEpisode}
          nextEpisodeNumber={
            (series.seasons?.find((s) => s.seasonNumber === showAddEpisode)?.episodes?.length || 0) + 1
          }
        />
      )}
    </>
  )
}
