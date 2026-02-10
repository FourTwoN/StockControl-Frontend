import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { StockBatchList } from '../components/StockBatchList.tsx'
import type { StockBatch } from '../types/StockBatch.ts'

export function InventarioPage() {
  const navigate = useNavigate()

  const handleViewBatch = useCallback(
    (batch: StockBatch) => {
      void navigate(batch.id)
    },
    [navigate],
  )

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Inventory</h1>
        <p className="mt-1 text-sm text-muted">Manage stock batches and track inventory levels</p>
      </div>

      <StockBatchList onView={handleViewBatch} />
    </div>
  )
}
