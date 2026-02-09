import { useAuth0 } from '@auth0/auth0-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AuthUser } from '@core/auth/types'
import type { UserRole } from '@core/types/enums'

const CLAIMS_NAMESPACE = 'https://demeter.app'

interface UseAuthReturn {
  readonly user: AuthUser | null
  readonly token: string | null
  readonly isAuthenticated: boolean
  readonly isLoading: boolean
  readonly roles: readonly UserRole[]
  readonly login: () => void
  readonly logout: () => void
}

export function useAuth(): UseAuthReturn {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setToken(null)
      return
    }

    let cancelled = false

    const fetchToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently()
        if (!cancelled) {
          setToken(accessToken)
        }
      } catch {
        if (!cancelled) {
          setToken(null)
        }
      }
    }

    void fetchToken()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, getAccessTokenSilently])

  const roles: readonly UserRole[] = useMemo(() => {
    if (!auth0User) return []
    const claimRoles = auth0User[`${CLAIMS_NAMESPACE}/roles`] as
      | readonly UserRole[]
      | undefined
    return claimRoles ?? []
  }, [auth0User])

  const user: AuthUser | null = useMemo(() => {
    if (!auth0User || !isAuthenticated) return null

    const tenantId = auth0User[`${CLAIMS_NAMESPACE}/tenant_id`] as
      | string
      | undefined

    return {
      id: auth0User.sub ?? '',
      email: auth0User.email ?? '',
      name: auth0User.name ?? '',
      picture: auth0User.picture,
      tenantId: tenantId ?? '',
      roles,
    }
  }, [auth0User, isAuthenticated, roles])

  const login = useCallback(() => {
    void loginWithRedirect()
  }, [loginWithRedirect])

  const logout = useCallback(() => {
    void auth0Logout({
      logoutParams: { returnTo: window.location.origin },
    })
  }, [auth0Logout])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    roles,
    login,
    logout,
  }
}
