import { useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import type { NavItem } from '@core/layout/types'

interface MobileNavProps {
  readonly items: readonly NavItem[]
}

const MAX_ITEMS = 5

export function MobileNav({ items }: MobileNavProps) {
  const location = useLocation()
  const visibleItems = items.slice(0, MAX_ITEMS)

  const isActive = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname]
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface md:hidden">
      <ul className="flex items-center justify-around">
        {visibleItems.map((item) => {
          const active = isActive(item.path)
          return (
            <li key={item.path} className="flex-1">
              <Link
                to={item.path}
                className={[
                  'flex flex-col items-center gap-0.5 px-2 py-2 text-xs font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted',
                ].join(' ')}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
