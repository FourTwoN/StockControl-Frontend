import { useMutation, useQueryClient } from '@tanstack/react-query'
import { photoService } from '../services/photoService.ts'

export function useUploadPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => photoService.uploadPhoto(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['photo-sessions'] })
    },
  })
}
