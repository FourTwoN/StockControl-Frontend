export interface DashboardData {
  readonly totalStock: number
  readonly totalStockChange: number
  readonly totalSales: number
  readonly totalSalesChange: number
  readonly totalRevenue: number
  readonly totalRevenueChange: number
  readonly activeWarehouses: number
}

export interface StockHistoryPoint {
  readonly date: string
  readonly totalQuantity: number
  readonly activeQuantity: number
  readonly depletedQuantity: number
}

export interface SalesSummaryPoint {
  readonly period: string
  readonly totalSales: number
  readonly totalRevenue: number
  readonly averageOrderValue: number
}

export interface TopProduct {
  readonly productId: string
  readonly productName: string
  readonly totalQuantitySold: number
  readonly totalRevenue: number
  readonly percentage: number
}

export interface WarehouseOccupancy {
  readonly warehouseId: string
  readonly warehouseName: string
  readonly totalCapacity: number
  readonly usedCapacity: number
  readonly occupancyPercentage: number
}

export interface KPI {
  readonly id: string
  readonly label: string
  readonly value: number
  readonly previousValue: number
  readonly unit: string
  readonly trend: 'up' | 'down' | 'stable'
}
