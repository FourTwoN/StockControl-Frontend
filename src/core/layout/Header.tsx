import { useState, useRef, useEffect, useCallback } from 'react'
import { Menu, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '@core/auth/useAuth'
import { useTenant } from '@core/tenant/useTenant'

interface HeaderProps {
  readonly onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth()
  const { tenantConfig } = useTenant()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, closeDropdown])

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-surface px-4">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="mr-3 rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-primary md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        {tenantConfig.theme.logoUrl ? (
          <img
            src={tenantConfig.theme.logoUrl}
            alt={tenantConfig.theme.appName}
            className="h-8 w-auto"
          />
        ) : (
          <span className="text-lg font-bold text-primary">
            {tenantConfig.theme.appName}
          </span>
        )}
      </div>

      {/* Breadcrumbs placeholder */}
      <div className="mx-4 hidden flex-1 md:block">
        <div className="h-4 w-48 rounded bg-border/50" />
      </div>

      {/* Spacer for mobile */}
      <div className="flex-1 md:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-white transition-opacity hover:opacity-90"
            aria-label="User menu"
            aria-expanded={isDropdownOpen}
          >
            {initials}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-surface py-1 shadow-lg">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-medium text-primary">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeDropdown()
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted transition-colors hover:bg-background hover:text-primary"
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  closeDropdown()
                  logout()
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
