import { apiClient } from '@core/api/apiClient.ts'
import type { Warehouse, StorageArea, StorageLocation, StorageBin } from '../types/Location.ts'
import type {
  WarehouseFormData,
  StorageAreaFormData,
  StorageLocationFormData,
  StorageBinFormData,
} from '../types/schemas.ts'

// --- Warehouses ---

async function getWarehouses(): Promise<readonly Warehouse[]> {
  const response = await apiClient.get<Warehouse[]>('/api/v1/warehouses')
  return response.data
}

async function getWarehouse(id: string): Promise<Warehouse> {
  const response = await apiClient.get<Warehouse>(`/api/v1/warehouses/${id}`)
  return response.data
}

async function createWarehouse(data: WarehouseFormData): Promise<Warehouse> {
  const response = await apiClient.post<Warehouse>('/api/v1/warehouses', data)
  return response.data
}

async function updateWarehouse(id: string, data: WarehouseFormData): Promise<Warehouse> {
  const response = await apiClient.put<Warehouse>(`/api/v1/warehouses/${id}`, data)
  return response.data
}

// --- Storage Areas ---

async function getAreas(warehouseId: string): Promise<readonly StorageArea[]> {
  const response = await apiClient.get<StorageArea[]>(`/api/v1/warehouses/${warehouseId}/areas`)
  return response.data
}

async function createArea(data: StorageAreaFormData): Promise<StorageArea> {
  const response = await apiClient.post<StorageArea>('/api/v1/areas', data)
  return response.data
}

// --- Storage Locations ---

async function getLocations(params: {
  readonly warehouseId?: string
  readonly areaId?: string
}): Promise<readonly StorageLocation[]> {
  const response = await apiClient.get<StorageLocation[]>('/api/v1/locations', {
    params,
  })
  return response.data
}

async function createLocation(data: StorageLocationFormData): Promise<StorageLocation> {
  const response = await apiClient.post<StorageLocation>('/api/v1/locations', data)
  return response.data
}

// --- Storage Bins ---

async function getBins(locationId: string): Promise<readonly StorageBin[]> {
  const response = await apiClient.get<StorageBin[]>('/api/v1/bins', {
    params: { locationId },
  })
  return response.data
}

async function createBin(data: StorageBinFormData): Promise<StorageBin> {
  const response = await apiClient.post<StorageBin>('/api/v1/bins', data)
  return response.data
}

export const locationService = {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  getAreas,
  createArea,
  getLocations,
  createLocation,
  getBins,
  createBin,
} as const
