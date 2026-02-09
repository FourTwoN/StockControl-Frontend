import { useCallback } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@core/components/ui'

interface ExportButtonProps {
  readonly data: readonly Record<string, string | number | boolean>[]
  readonly filename: string
}

function toCsvString(
  rows: readonly Record<string, string | number | boolean>[],
): string {
  if (rows.length === 0) {
    return ''
  }

  const headers = Object.keys(rows[0])
  const headerRow = headers.join(',')

  const dataRows = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header]
        const stringValue = String(value ?? '')
        if (
          stringValue.includes(',') ||
          stringValue.includes('"') ||
          stringValue.includes('\n')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(','),
  )

  return [headerRow, ...dataRows].join('\n')
}

function downloadCsv(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function ExportButton({ data, filename }: ExportButtonProps) {
  const handleExport = useCallback(() => {
    const csvContent = toCsvString(data)
    downloadCsv(csvContent, filename)
  }, [data, filename])

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={data.length === 0}
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  )
}
