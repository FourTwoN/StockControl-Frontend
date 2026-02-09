const KNOWN_ROUTES = new Set([
  'inventario',
  'productos',
  'ventas',
  'reportes',
  'configuracion',
  'usuarios',
  'dashboard',
  'lotes',
  'movimientos',
  'login',
  'callback',
  'logout',
])

function isLocalhost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '[::1]'
  )
}

function isIpAddress(hostname: string): boolean {
  const ipv4Regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  return ipv4Regex.test(hostname) || hostname.startsWith('[')
}

function resolveFromSubdomain(): string | null {
  const { hostname } = window.location

  if (isLocalhost(hostname) || isIpAddress(hostname)) {
    return null
  }

  const parts = hostname.split('.')
  if (parts.length < 3) {
    return null
  }

  const subdomain = parts[0]
  return subdomain ?? null
}

function resolveFromPath(): string | null {
  const { pathname } = window.location
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return null
  }

  const firstSegment = segments[0]
  if (!firstSegment || KNOWN_ROUTES.has(firstSegment)) {
    return null
  }

  return firstSegment
}

function resolveFromEnv(): string | null {
  return import.meta.env.VITE_DEFAULT_TENANT_ID ?? null
}

export function resolveTenantId(): string | null {
  return resolveFromSubdomain() ?? resolveFromPath() ?? resolveFromEnv()
}
