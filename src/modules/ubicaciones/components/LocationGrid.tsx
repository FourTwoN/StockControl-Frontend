import type { StorageLocation } from '../types/Location.ts'
import { LocationCard } from './LocationCard.tsx'

interface LocationGridProps {
  readonly locations: readonly StorageLocation[]
  readonly onLocationClick?: (location: StorageLocation) => void
}

export function LocationGrid({ locations, onLocationClick }: LocationGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} onClick={onLocationClick} />
      ))}
    </div>
  )
}
