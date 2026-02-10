import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '@core/components/ui'
import type { KPI } from '../types/Analytics.ts'

interface KPICardProps {
  readonly kpi: KPI
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

function formatValue(value: number, unit: string): string {
  if (unit === '$') {
    return currencyFormatter.format(value)
  }
  if (unit === '%') {
    return `${numberFormatter.format(value)}%`
  }
  return `${numberFormatter.format(value)} ${unit}`
}

function computeChangePercentage(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return ((current - previous) / Math.abs(previous)) * 100
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
  },
  down: {
    icon: TrendingDown,
    colorClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
  },
  stable: {
    icon: Minus,
    colorClass: 'text-muted',
    bgClass: 'bg-muted/10',
  },
} as const

export function KPICard({ kpi }: KPICardProps) {
  const changePercent = computeChangePercentage(kpi.value, kpi.previousValue)
  const config = trendConfig[kpi.trend]
  const TrendIcon = config.icon

  return (
    <Card className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted">{kpi.label}</span>
      <span className="text-2xl font-bold text-primary">{formatValue(kpi.value, kpi.unit)}</span>
      <div className="flex items-center gap-1.5">
        <span
          className={[
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            config.bgClass,
            config.colorClass,
          ].join(' ')}
        >
          <TrendIcon className="h-3 w-3" />
          {numberFormatter.format(Math.abs(changePercent))}%
        </span>
        <span className="text-xs text-muted">vs previous</span>
      </div>
    </Card>
  )
}
