import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { useTenant } from '@core/tenant/useTenant'

const CSS_VARIABLE_NAMES = [
  '--color-primary',
  '--color-secondary',
  '--color-accent',
  '--color-background',
  '--logo-url',
  '--app-name',
] as const

interface TenantThemeProps {
  readonly children: ReactNode
}

export function TenantTheme({ children }: TenantThemeProps) {
  const { tenantConfig } = useTenant()
  const { theme } = tenantConfig

  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-secondary', theme.secondary)
    root.style.setProperty('--color-accent', theme.accent)
    root.style.setProperty('--color-background', theme.background)
    root.style.setProperty(
      '--logo-url',
      theme.logoUrl ? `url(${theme.logoUrl})` : 'none'
    )
    root.style.setProperty('--app-name', `"${theme.appName}"`)

    return () => {
      for (const name of CSS_VARIABLE_NAMES) {
        root.style.removeProperty(name)
      }
    }
  }, [theme])

  return <>{children}</>
}
