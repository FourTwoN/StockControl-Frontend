import { apiClient } from '@core/api/apiClient'
import type { PagedResponse } from '@core/api/types'
import type { Sale } from '../types/Sale.ts'
import type { SaleFormData } from '../types/schemas.ts'

interface SaleFilters {
  readonly status?: Sale['status']
  readonly from?: string
  readonly to?: string
}

export const saleService = {
  fetchSales: (page: number, size: number, filters?: SaleFilters) =>
    apiClient
      .get<PagedResponse<Sale>>('/api/v1/sales', {
        params: {
          page,
          size,
          ...(filters?.status ? { status: filters.status } : {}),
          ...(filters?.from ? { from: filters.from } : {}),
          ...(filters?.to ? { to: filters.to } : {}),
        },
      })
      .then((r) => r.data),

  fetchSale: (id: string) => apiClient.get<Sale>(`/api/v1/sales/${id}`).then((r) => r.data),

  createSale: (data: SaleFormData) =>
    apiClient.post<Sale>('/api/v1/sales', data).then((r) => r.data),

  updateSaleStatus: (id: string, status: Sale['status']) =>
    apiClient.put<Sale>(`/api/v1/sales/${id}/status`, { status }).then((r) => r.data),
}
