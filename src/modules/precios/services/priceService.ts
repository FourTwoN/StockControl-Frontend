import { apiClient } from '@core/api/apiClient.ts'
import type { PagedResponse, ApiRequestConfig } from '@core/api/types.ts'
import type { PriceList, PriceItem } from '../types/Price.ts'
import type { PriceListFormData, PriceItemFormData } from '../types/schemas.ts'

const BASE_URL = '/api/v1/price-lists'

function buildPriceListUrl(id: string): string {
  return `${BASE_URL}/${id}`
}

function buildItemsUrl(listId: string): string {
  return `${BASE_URL}/${listId}/items`
}

function buildBulkUrl(listId: string): string {
  return `${BASE_URL}/${listId}/items/bulk`
}

function buildItemUrl(listId: string, itemId: string): string {
  return `${BASE_URL}/${listId}/items/${itemId}`
}

export async function fetchPriceLists(
  config: ApiRequestConfig = {},
): Promise<PagedResponse<PriceList>> {
  const { data } = await apiClient.get<PagedResponse<PriceList>>(BASE_URL, {
    params: {
      page: config.page ?? 0,
      size: config.size ?? 20,
      sort: config.sort,
      ...config.filters,
    },
  })
  return data
}

export async function fetchPriceList(id: string): Promise<PriceList> {
  const { data } = await apiClient.get<PriceList>(buildPriceListUrl(id))
  return data
}

export async function createPriceList(payload: PriceListFormData): Promise<PriceList> {
  const { data } = await apiClient.post<PriceList>(BASE_URL, payload)
  return data
}

export async function updatePriceList(id: string, payload: PriceListFormData): Promise<PriceList> {
  const { data } = await apiClient.put<PriceList>(buildPriceListUrl(id), payload)
  return data
}

export async function deletePriceList(id: string): Promise<void> {
  await apiClient.delete(buildPriceListUrl(id))
}

export async function fetchPriceItems(listId: string): Promise<PriceItem[]> {
  const { data } = await apiClient.get<PriceItem[]>(buildItemsUrl(listId))
  return data
}

export async function bulkUploadItems(listId: string, file: File): Promise<PriceItem[]> {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<PriceItem[]>(buildBulkUrl(listId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updatePriceItem(
  listId: string,
  itemId: string,
  payload: PriceItemFormData,
): Promise<PriceItem> {
  const { data } = await apiClient.put<PriceItem>(buildItemUrl(listId, itemId), payload)
  return data
}
