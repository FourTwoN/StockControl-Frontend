import { useState, useRef, useEffect, useCallback } from 'react'
import { Menu, Bell, User, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '@core/auth/useAuth'
import { useTenant } from '@core/tenant/useTenant'
import { useThemeMode } from '@core/hooks/useThemeMode'

interface HeaderProps {
  readonly onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth()
  const { tenantConfig } = useTenant()
  const { mode, toggle } = useThemeMode()
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
    <header className="glass sticky top-0 z-30 flex h-14 items-center border-b border-border/50 px-4 shadow-[var(--shadow-xs)]">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="mr-3 rounded-lg p-2 text-muted transition-all duration-200 hover:bg-surface-hover hover:text-text-primary md:hidden"
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
          <span className="gradient-text text-lg font-bold">{tenantConfig.theme.appName}</span>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg p-2 text-muted transition-all duration-200 hover:bg-surface-hover hover:text-text-primary"
          aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="rounded-lg p-2 text-muted transition-all duration-200 hover:bg-primary/10 hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-medium text-white ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40 hover:shadow-[var(--shadow-glow-primary)]"
            aria-label="User menu"
            aria-expanded={isDropdownOpen}
          >
            {initials}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/50 bg-surface py-1 shadow-[var(--shadow-lg)] animate-scale-in">
              <div className="border-b border-border/50 px-4 py-3">
                <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeDropdown()
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-secondary transition-colors duration-200 hover:bg-surface-hover hover:text-text-primary"
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
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive transition-colors duration-200 hover:bg-destructive/10"
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
