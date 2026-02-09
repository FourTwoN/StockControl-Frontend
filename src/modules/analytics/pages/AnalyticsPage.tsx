import { Dashboard } from '../components/Dashboard.tsx'

export function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Analytics</h1>
        <p className="mt-1 text-sm text-muted">
          Monitor stock levels, sales performance, and warehouse occupancy
        </p>
      </div>

      <Dashboard />
    </div>
  )
}
