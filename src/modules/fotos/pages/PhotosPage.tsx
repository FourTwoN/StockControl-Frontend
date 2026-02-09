import { useState, useCallback, useRef } from 'react'
import { Camera, Plus, Upload } from 'lucide-react'
import { Button } from '@core/components/ui/Button'
import { Modal } from '@core/components/ui/Modal'
import { Input } from '@core/components/ui/Input'
import { Skeleton } from '@core/components/ui/Skeleton'
import { EmptyState } from '@core/components/ui/EmptyState'
import { useToast } from '@core/components/ui/Toast'
import { SessionCard } from '../components/SessionCard.tsx'
import { usePhotoSessions } from '../hooks/usePhotoSessions.ts'
import { useCreateSession } from '../hooks/useCreateSession.ts'
import { useUploadPhoto } from '../hooks/useUploadPhoto.ts'

const PAGE_SIZE = 20

export function PhotosPage() {
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [page, setPage] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [sessionName, setSessionName] = useState('')
  const [sessionDescription, setSessionDescription] = useState('')

  const { data, isLoading } = usePhotoSessions(page, PAGE_SIZE)
  const createSession = useCreateSession()
  const uploadPhoto = useUploadPhoto()

  const handleOpenCreate = useCallback(() => {
    setIsCreateOpen(true)
  }, [])

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false)
    setSessionName('')
    setSessionDescription('')
  }, [])

  const handleCreateSession = useCallback(() => {
    if (sessionName.trim().length === 0) return

    createSession.mutate(
      {
        name: sessionName.trim(),
        description: sessionDescription.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Session created successfully')
          setIsCreateOpen(false)
          setSessionName('')
          setSessionDescription('')
        },
        onError: () => {
          toast.error('Failed to create session')
        },
      },
    )
  }, [sessionName, sessionDescription, createSession, toast])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      uploadPhoto.mutate(file, {
        onSuccess: () => {
          toast.success('Photo uploaded successfully')
        },
        onError: () => {
          toast.error('Failed to upload photo')
        },
      })

      // Reset file input so the same file can be uploaded again
      e.target.value = ''
    },
    [uploadPhoto, toast],
  )

  const handlePreviousPage = useCallback(() => {
    setPage((prev) => Math.max(0, prev - 1))
  }, [])

  const handleNextPage = useCallback(() => {
    setPage((prev) => prev + 1)
  }, [])

  const sessions = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Photo Sessions</h1>
          <p className="mt-1 text-sm text-muted">
            Manage photo sessions and image detection analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleUploadClick} isLoading={uploadPhoto.isPending}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            New Session
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" variant="rectangle" />
          ))}
        </div>
      )}

      {!isLoading && sessions.length === 0 && (
        <EmptyState
          icon={<Camera className="h-8 w-8" />}
          title="No sessions yet"
          description="Create a new photo session to start uploading and analyzing images."
          action={
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              Create Session
            </Button>
          }
        />
      )}

      {!isLoading && sessions.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-muted">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
        title="New Photo Session"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Session Name"
            placeholder="e.g. Field Inspection - North Zone"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
          <Input
            label="Description"
            placeholder="Optional description"
            value={sessionDescription}
            onChange={(e) => setSessionDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseCreate}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSession}
              isLoading={createSession.isPending}
              disabled={sessionName.trim().length === 0}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
