import { useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { NavItem } from '@core/layout/types'

interface SidebarProps {
  readonly items: readonly NavItem[]
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly isCollapsed: boolean
  readonly onToggleCollapse: () => void
}

export function Sidebar({
  items,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const location = useLocation()

  const isActive = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname]
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose()
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed top-14 left-0 z-50 flex h-[calc(100vh-3.5rem)] flex-col border-r border-border bg-surface transition-all duration-300',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: always visible, collapse toggle
          'md:translate-x-0',
          isCollapsed ? 'md:w-16' : 'md:w-60',
          // Mobile width
          'w-60',
        ].join(' ')}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-end p-2 md:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-background hover:text-primary"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active = isActive(item.path)
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    title={isCollapsed ? item.label : undefined}
                    className={[
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted hover:bg-background hover:text-primary',
                      isCollapsed ? 'md:justify-center md:px-2' : '',
                    ].join(' ')}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className={isCollapsed ? 'md:hidden' : ''}>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={[
                          'ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-white',
                          isCollapsed ? 'md:hidden' : '',
                        ].join(' ')}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden border-t border-border p-2 md:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-primary"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
