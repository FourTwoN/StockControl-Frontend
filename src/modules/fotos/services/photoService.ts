import { apiClient } from '@core/api/apiClient'
import type { PagedResponse } from '@core/api/types'
import type { PhotoSession, S3Image, ProcessingStatus } from '../types/Photo.ts'

interface CreateSessionData {
  readonly name: string
  readonly description?: string
}

export const photoService = {
  fetchSessions: (page: number, size: number) =>
    apiClient
      .get<PagedResponse<PhotoSession>>('/api/v1/photos/sessions', {
        params: { page, size },
      })
      .then((r) => r.data),

  fetchSession: (id: string) =>
    apiClient
      .get<PhotoSession>(`/api/v1/photos/sessions/${id}`)
      .then((r) => r.data),

  createSession: (data: CreateSessionData) =>
    apiClient
      .post<PhotoSession>('/api/v1/photos/sessions', data)
      .then((r) => r.data),

  fetchSessionImages: (sessionId: string) =>
    apiClient
      .get<S3Image[]>(`/api/v1/photos/sessions/${sessionId}/images`)
      .then((r) => r.data),

  uploadPhoto: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient
      .post<S3Image>('/api/v1/photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  fetchSessionStatus: (sessionId: string) =>
    apiClient
      .get<ProcessingStatus>(`/api/v1/photos/sessions/${sessionId}/status`)
      .then((r) => r.data),
}
