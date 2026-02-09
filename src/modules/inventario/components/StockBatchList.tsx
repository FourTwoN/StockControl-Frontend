import { useState, useCallback, useMemo } from 'react'
import { Eye } from 'lucide-react'
import { DataTable } from '@core/components/ui/DataTable'
import type { Column } from '@core/components/ui/DataTable'
import { Button } from '@core/components/ui/Button'
import { Select } from '@core/components/ui/Select'
import { SearchInput } from '@core/components/forms/SearchInput'
import { usePagination } from '@core/hooks/usePagination'
import { BatchStatus } from '@core/types/enums'
import { useStockBatches } from '../hooks/useStockBatches.ts'
import { BatchStatusBadge } from './BatchStatusBadge.tsx'
import type { StockBatch } from '../types/StockBatch.ts'

interface StockBatchListProps {
  readonly onView: (batch: StockBatch) => void
}

const STATUS_OPTIONS = [
  { value: BatchStatus.ACTIVE, label: 'Active' },
  { value: BatchStatus.DEPLETED, label: 'Depleted' },
  { value: BatchStatus.QUARANTINE, label: 'Quarantine' },
  { value: BatchStatus.ARCHIVED, label: 'Archived' },
] as const

export function StockBatchList({ onView }: StockBatchListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const pagination = usePagination(20)

  const { data, isLoading } = useStockBatches({
    page: pagination.page,
    size: pagination.size,
    productId: search || undefined,
    status: statusFilter || undefined,
  })

  if (data) {
    pagination.setTotal(data.totalPages, data.totalElements)
  }

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value)
      pagination.setPage(0)
    },
    [pagination],
  )

  const columns: readonly Column<StockBatch>[] = useMemo(
    () => [
      {
        key: 'productName' as const,
        header: 'Product',
        render: (_value, row) => (
          <div>
            <p className="font-medium text-primary">{row.productName}</p>
            <p className="text-xs text-muted">{row.productSku}</p>
          </div>
        ),
      },
      {
        key: 'locationName' as const,
        header: 'Location',
        render: (_value, row) => (
          <span className="text-sm text-primary">
            {row.locationName}
            {row.binName ? ` / ${row.binName}` : ''}
          </span>
        ),
      },
      {
        key: 'quantity' as const,
        header: 'Quantity',
        render: (_value, row) => (
          <span className="font-medium text-primary">
            {row.quantity} / {row.initialQuantity}
          </span>
        ),
      },
      {
        key: 'status' as const,
        header: 'Status',
        render: (_value, row) => <BatchStatusBadge status={row.status} />,
      },
      {
        key: 'entryDate' as const,
        header: 'Entry Date',
        render: (value) => (
          <span className="text-sm text-muted">
            {new Date(value as string).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: 'id' as const,
        header: 'Actions',
        render: (_value, row) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onView(row)
              }}
              aria-label={`View ${row.productName}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onView],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-xs">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by product..."
            />
          </div>
          <div className="w-full sm:w-40">
            <Select
              options={[...STATUS_OPTIONS]}
              value={statusFilter}
              onChange={handleStatusChange}
              placeholder="All statuses"
            />
          </div>
        </div>
      </div>

      <DataTable<StockBatch>
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        emptyMessage="No stock batches found"
        keyExtractor={(row) => row.id}
        onRowClick={onView}
        pagination={{
          page: pagination.page + 1,
          totalPages: pagination.totalPages,
          onPageChange: (p) => pagination.setPage(p - 1),
        }}
      />
    </div>
  )
}
