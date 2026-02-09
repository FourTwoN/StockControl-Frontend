import { useCallback, useMemo } from 'react'
import { RotateCcw } from 'lucide-react'
import { Select } from '@core/components/ui/Select.tsx'
import { Button } from '@core/components/ui/Button.tsx'
import { SearchInput } from '@core/components/forms/SearchInput.tsx'
import type { PackagingType, PackagingMaterial, PackagingColor } from '../types/Packaging.ts'

interface PackagingFilters {
  readonly search: string
  readonly typeId: string
  readonly materialId: string
  readonly colorId: string
}

interface PackagingFilterBarProps {
  readonly filters: PackagingFilters
  readonly onFiltersChange: (filters: PackagingFilters) => void
  readonly types: readonly PackagingType[]
  readonly materials: readonly PackagingMaterial[]
  readonly colors: readonly PackagingColor[]
}

const EMPTY_FILTERS: PackagingFilters = {
  search: '',
  typeId: '',
  materialId: '',
  colorId: '',
}

export type { PackagingFilters }

export function PackagingFilterBar({
  filters,
  onFiltersChange,
  types,
  materials,
  colors,
}: PackagingFilterBarProps) {
  const typeOptions = useMemo(
    () => types.map((t) => ({ value: t.id, label: t.name })),
    [types],
  )

  const materialOptions = useMemo(
    () => materials.map((m) => ({ value: m.id, label: m.name })),
    [materials],
  )

  const colorOptions = useMemo(
    () => colors.map((c) => ({ value: c.id, label: c.name })),
    [colors],
  )

  const handleSearchChange = useCallback(
    (search: string) => {
      onFiltersChange({ ...filters, search })
    },
    [filters, onFiltersChange],
  )

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFiltersChange({ ...filters, typeId: e.target.value })
    },
    [filters, onFiltersChange],
  )

  const handleMaterialChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFiltersChange({ ...filters, materialId: e.target.value })
    },
    [filters, onFiltersChange],
  )

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFiltersChange({ ...filters, colorId: e.target.value })
    },
    [filters, onFiltersChange],
  )

  const handleReset = useCallback(() => {
    onFiltersChange(EMPTY_FILTERS)
  }, [onFiltersChange])

  const hasActiveFilters =
    filters.search !== '' ||
    filters.typeId !== '' ||
    filters.materialId !== '' ||
    filters.colorId !== ''

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex-1 sm:max-w-xs">
        <SearchInput
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search by name or SKU..."
        />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-4">
        <Select
          options={typeOptions}
          value={filters.typeId}
          onChange={handleTypeChange}
          placeholder="All types"
        />

        <Select
          options={materialOptions}
          value={filters.materialId}
          onChange={handleMaterialChange}
          placeholder="All materials"
        />

        <Select
          options={colorOptions}
          value={filters.colorId}
          onChange={handleColorChange}
          placeholder="All colors"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      )}
    </div>
  )
}
