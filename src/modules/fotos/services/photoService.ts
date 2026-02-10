import { apiClient } from '@core/api/apiClient'
import type { PagedResponse } from '@core/api/types'
import type { PhotoSession, S3Image, ProcessingStatus } from '../types/Photo.ts'

const BASE_PATH = '/api/v1/photo-sessions'

interface CreateSessionData {
  readonly name: string
  readonly description?: string
}

export const photoService = {
  fetchSessions: (page: number, size: number) =>
    apiClient
      .get<PagedResponse<PhotoSession>>(BASE_PATH, {
        params: { page, size },
      })
      .then((r) => r.data),

  fetchSession: (id: string) =>
    apiClient.get<PhotoSession>(`${BASE_PATH}/${id}`).then((r) => r.data),

  createSession: (data: CreateSessionData) =>
    apiClient.post<PhotoSession>(BASE_PATH, data).then((r) => r.data),

  fetchSessionImages: (sessionId: string) =>
    apiClient.get<S3Image[]>(`${BASE_PATH}/${sessionId}/images`).then((r) => r.data),

  uploadPhoto: (sessionId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient
      .post<S3Image>(`${BASE_PATH}/${sessionId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  fetchSessionStatus: (sessionId: string) =>
    apiClient.get<ProcessingStatus>(`${BASE_PATH}/${sessionId}/status`).then((r) => r.data),
}
