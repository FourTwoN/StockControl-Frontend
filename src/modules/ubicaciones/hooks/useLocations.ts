import { useQuery } from '@tanstack/react-query'
import { locationService } from '../services/locationService.ts'

export const locationKeys = {
  all: ['locations'] as const,
  filtered: (params: { readonly warehouseId?: string; readonly areaId?: string }) =>
    ['locations', params] as const,
} as const

export function useLocations(params: {
  readonly warehouseId?: string
  readonly areaId?: string
} = {}) {
  return useQuery({
    queryKey: locationKeys.filtered(params),
    queryFn: () => locationService.getLocations(params),
  })
}
